import type { CSSProperties } from 'react'
import { mult, num } from '../format'
import { useI18n } from '../i18n'
import { current, type SimState } from '../sim/engine'
import { KIND_BY_ZONE, ZONES, ZONE_BY_ID, ZONE_INDEX, hash, type Zone } from '../sim/world'
import type { OtherRide } from '../sim/riders'
import { PER_DOT, SLOTS, STREETS, Z, zoneCars, type Driver } from '../sim/traffic'
import type { Trip, TripProgress } from '../trip'

interface Props {
  sim: SimState
  pickupId: string
  destId: string
  activeField: 'pickup' | 'dest'
  trip: Trip | null
  progress: TripProgress | null
  /** Duración real de un tick: los coches tardan eso en recorrer su tramo. */
  tickMs: number
  /** Solicitudes de otros pasajeros en este tick. */
  others: OtherRide[]
  /** Conductor libre más cercano del vehículo elegido, antes de confirmar el viaje. */
  driver: Driver | null
  onSelect: (zoneId: string) => void
}

const SIZE = Z * 3

/** Gotas fijas (posición, largo y ritmo) para que la lluvia no cambie en cada render. */
const DROPS = Array.from({ length: 110 }, (_, i) => ({
  x: hash(i, 11) * (SIZE + 40),
  len: 10 + hash(i, 12) * 12,
  dur: 0.55 + hash(i, 13) * 0.5,
  delay: hash(i, 14) * 1.5,
  opacity: 0.35 + hash(i, 15) * 0.4,
}))

const center = (z: Zone): [number, number] => [z.col * Z + Z / 2, z.row * Z + Z / 2]

/** Color de la zona según el multiplicador: gris neutro a 1,0× y naranja a partir de 2,0×. */
function heat(m: number): string {
  const t = Math.min(1, Math.max(0, m - 1))
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t)
  return `rgb(${mix(236, 255)}, ${mix(236, 138)}, ${mix(236, 84)})`
}

function riderPosition(zone: Zone, i: number, tick: number): [number, number] {
  const zi = ZONE_INDEX[zone.id]
  // Los pasajeros esperan en las manzanas, no en la calzada.
  const block = (v: number) => 14 + Math.floor(v * 4) * 55 + 8 + ((v * 97) % 1) * 20
  return [zone.col * Z + block(hash(zi, i, tick, 5)), zone.row * Z + block(hash(zi, i, tick, 7))]
}

function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/**
 * Recorrido en L por las calles: primero en horizontal y luego en vertical (o al revés con `verticalFirst`,
 * para un coche que está en una calle vertical). Devuelve la posición y el ángulo del coche
 * (0 = hacia la derecha, 90 = hacia abajo).
 */
function alongRoute(
  from: [number, number],
  to: [number, number],
  t: number,
  verticalFirst = false,
): { pos: [number, number]; angle: number } {
  const corner: [number, number] = verticalFirst ? [from[0], to[1]] : [to[0], from[1]]
  const dx = Math.abs(to[0] - from[0])
  const dy = Math.abs(to[1] - from[1])
  const first = verticalFirst ? dy : dx
  const total = dx + dy
  const hAngle = to[0] >= from[0] ? 0 : 180
  const vAngle = to[1] >= from[1] ? 90 : -90
  const [angle1, angle2] = verticalFirst ? [vAngle, hAngle] : [hAngle, vAngle]
  if (total === 0) return { pos: from, angle: 0 }
  const d = Math.min(1, Math.max(0, t)) * total
  // En la esquina exacta el coche ya mira hacia el segundo tramo.
  if (d < first || first === total) return { pos: lerp(from, corner, first ? d / first : 0), angle: angle1 }
  return { pos: lerp(corner, to, (d - first) / (total - first)), angle: angle2 }
}

/**
 * Aceras donde esperan otros pasajeros: a mitad de manzana y lo bastante lejos del carril para no pisar
 * coches. Se descartan las esquinas que ocupan el nombre de la zona y la píldora del multiplicador.
 */
const CURB = 19
const SPOTS: [number, number][] = STREETS.flatMap((street) =>
  SLOTS.flatMap((along) =>
    [-CURB, CURB].flatMap((side): [number, number][] => [
      [along, street + side],
      [street + side, along],
    ]),
  ),
).filter(([x, y]) => !(x < 150 && y < 52) && !(x < 90 && y > 168))

function otherSpots(rides: OtherRide[]): Map<string, [number, number]> {
  const taken = new Set<string>()
  const result = new Map<string, [number, number]>()
  for (const r of rides) {
    // Si el hueco ya está ocupado en esa zona, se prueba el siguiente.
    let k = Math.floor(r.spot * SPOTS.length)
    while (taken.has(`${r.pickupId}-${k}`) && taken.size < SPOTS.length * ZONES.length) k = (k + 1) % SPOTS.length
    taken.add(`${r.pickupId}-${k}`)
    const zone = ZONE_BY_ID[r.pickupId]
    result.set(r.id, [zone.col * Z + SPOTS[k][0], zone.row * Z + SPOTS[k][1]])
  }
  return result
}

export function CityMap(p: Props) {
  const { t } = useI18n()
  const routeFrom = center(ZONE_BY_ID[p.trip?.pickupId ?? p.pickupId])
  const routeTo = center(ZONE_BY_ID[p.trip?.destId ?? p.destId])
  const hasRoute = routeFrom[0] !== routeTo[0] || routeFrom[1] !== routeTo[1]
  // Solo esperan en la acera quienes aún no se han subido al coche.
  const spots = otherSpots(p.others.filter((r) => r.status !== 'ontrip'))

  let tripCar: { pos: [number, number]; angle: number } | null = null
  if (p.trip && p.progress) {
    const { phase, progress } = p.progress
    // El conductor sale desde donde estaba su coche al confirmar y llega por las calles.
    const { from, horizontal } = p.trip.driver
    if (phase === 'searching') tripCar = alongRoute(from, routeFrom, 0, !horizontal)
    else if (phase === 'pickup') tripCar = alongRoute(from, routeFrom, progress, !horizontal)
    else if (phase === 'ontrip') tripCar = alongRoute(routeFrom, routeTo, progress)
    else if (phase === 'done') tripCar = alongRoute(routeFrom, routeTo, 1)
  }

  return (
    <section className="map-wrap" aria-label={t.map.region}>
      <svg className="map" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label={t.map.zones}>
        {ZONES.map((zone) => {
          const s = current(p.sim, zone.id)
          const x = zone.col * Z
          const y = zone.row * Z
          const role = zone.id === p.pickupId ? 'pickup' : zone.id === p.destId ? 'dest' : null
          return (
            <g
              key={zone.id}
              className="zone"
              role="button"
              tabIndex={0}
              aria-label={t.map.zoneLabel(zone.name, t.kind[KIND_BY_ZONE[zone.id]], mult(s.m), role)}
              onClick={() => p.onSelect(zone.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  p.onSelect(zone.id)
                }
              }}
            >
              <rect x={x} y={y} width={Z} height={Z} fill={heat(s.m)} className="zone-fill" />
              {STREETS.map((o) => (
                <g key={o} className="street">
                  <line x1={x} y1={y + o} x2={x + Z} y2={y + o} />
                  <line x1={x + o} y1={y} x2={x + o} y2={y + Z} />
                </g>
              ))}
              <rect x={x} y={y} width={Z} height={Z} className="zone-border" />
            </g>
          )
        })}

        {hasRoute && (
          <polyline
            className={p.trip ? 'route-line active' : 'route-line'}
            points={`${routeFrom.join(',')} ${routeTo[0]},${routeFrom[1]} ${routeTo.join(',')}`}
          />
        )}

        {/* Trayectos de otros pasajeros ya recogidos, por debajo de los coches. */}
        <g className="others-routes" aria-hidden="true">
          {p.others
            .filter((r) => r.status === 'ontrip')
            .map((r) => {
              const a = center(ZONE_BY_ID[r.pickupId])
              const b = center(ZONE_BY_ID[r.destId])
              return (
                <polyline
                  key={r.id}
                  className="other-route"
                  points={`${a.join(',')} ${b[0]},${a[1]} ${b.join(',')}`}
                />
              )
            })}
        </g>

        <g className="dots" aria-hidden="true">
          {ZONES.flatMap((zone) => {
            const s = current(p.sim, zone.id)
            const waiting = Math.round(Math.max(0, s.demand - s.drivers) / PER_DOT)
            return Array.from({ length: waiting }, (_, i) => {
              const [cx, cy] = riderPosition(zone, i, p.sim.tick)
              return <circle key={`r-${zone.id}-${i}-${p.sim.tick}`} className="rider-dot" cx={cx} cy={cy} r={4} />
            })
          })}
          {ZONES.flatMap((zone) => {
            const s = current(p.sim, zone.id)
            return zoneCars(zone, Math.round(s.drivers / PER_DOT), p.sim.tick)
              // El coche que hace nuestro viaje se dibuja aparte mientras dure.
              .filter((car) => car.id !== p.trip?.driver.id)
              .map(({ key, pos, angle, speed, enter, exit }) => (
                <g
                  key={key}
                  className={`car car-${speed}${exit ? ' car-exit' : ''}`}
                  style={{
                    transform: `translate(${pos[0]}px, ${pos[1]}px)`,
                    transitionDuration: `${p.tickMs}ms`,
                    animationDuration: `${p.tickMs}ms`,
                  }}
                >
                  <g transform={angle ? `rotate(${angle})` : undefined}>
                    <g
                      className={enter ? 'car-enter' : undefined}
                      style={enter ? ({ '--enter': `${-enter}px`, animationDuration: `${p.tickMs}ms` } as CSSProperties) : undefined}
                    >
                      {speed === 'fast' && <path d="M-13 -3H-19M-13 0H-22M-13 3H-19" className="car-streak" />}
                      <rect x={-10} y={-5} width={20} height={10} rx={3.5} className="car-body" />
                      <rect x={-1} y={-3.6} width={5.5} height={7.2} rx={1.5} className="car-glass" />
                      <rect x={-6.5} y={-3.2} width={3} height={6.4} rx={1} className="car-glass" />
                    </g>
                  </g>
                </g>
              ))
          })}
          {p.driver && !p.trip && (
            <g
              key={p.driver.car.key}
              className="driver-ring"
              style={{ transform: `translate(${p.driver.car.pos[0]}px, ${p.driver.car.pos[1]}px)`, transitionDuration: `${p.tickMs}ms` }}
            >
              <circle r={15} />
            </g>
          )}
        </g>

        <g className="others-pins" aria-hidden="true">
          {[...spots].map(([id, [x, y]]) => {
            const r = p.others.find((o) => o.id === id)!
            const lost = r.status === 'declined' || r.status === 'unserved'
            return (
              <g key={id} className={`other-pin other-${r.status}`} transform={`translate(${x},${y})`}>
                {r.status === 'searching' && <circle r={7} className="other-pulse" />}
                <circle r={7} className="other-body" />
                {lost ? (
                  <path d="M-2.5 -2.5L2.5 2.5M2.5 -2.5L-2.5 2.5" className="other-x" />
                ) : (
                  <>
                    <circle cy={-2.2} r={1.9} className="other-glyph" />
                    <path d="M-3.4 4a3.4 3 0 0 1 6.8 0z" className="other-glyph" />
                  </>
                )}
              </g>
            )
          })}
        </g>

        {p.sim.rain && (
          <g aria-hidden="true" className="rain">
            <rect width={SIZE} height={SIZE} className="rain-tint" />
            {DROPS.map((d, i) => (
              <line
                key={i}
                x1={d.x}
                y1={0}
                x2={d.x - 3}
                y2={d.len}
                className="drop"
                style={{ animationDuration: `${d.dur}s`, animationDelay: `-${d.delay}s`, opacity: d.opacity }}
              />
            ))}
          </g>
        )}

        {/* Rótulos por encima de coches y lluvia para que siempre se lean. */}
        <g aria-hidden="true" className="labels">
          {ZONES.map((zone) => {
            const m = current(p.sim, zone.id).m
            const surge = m > 1.045
            const x = zone.col * Z
            const y = zone.row * Z
            return (
              <g key={zone.id}>
                <text x={x + 16} y={y + 28} className="zone-name">
                  {zone.name}
                </text>
                <text x={x + 16} y={y + 44} className="zone-kind">
                  {t.kind[KIND_BY_ZONE[zone.id]]}
                </text>
                <g transform={`translate(${x + 16}, ${y + Z - 42})`}>
                  <rect width={62} height={26} rx={13} className={surge ? 'pill pill-surge' : 'pill'} />
                  <text x={31} y={17.5} className={surge ? 'pill-text pill-text-surge' : 'pill-text'}>
                    {mult(m)}
                  </text>
                </g>
              </g>
            )
          })}
        </g>

        <g aria-hidden="true" className="markers">
          <g transform={`translate(${routeFrom.join(',')})`}>
            <circle r={12} className="marker" />
            <circle r={4} className="marker-inner" />
          </g>
          {hasRoute && (
            <g transform={`translate(${routeTo.join(',')})`}>
              <rect x={-11} y={-11} width={22} height={22} className="marker" />
              <rect x={-3.5} y={-3.5} width={7} height={7} className="marker-inner" />
            </g>
          )}
          {tripCar && (
            <g transform={`translate(${tripCar.pos.join(',')}) rotate(${tripCar.angle})`}>
              <rect x={-21} y={-14} width={42} height={28} rx={14} className="trip-car-halo" />
              <rect x={-14} y={-7.5} width={28} height={15} rx={5} className="trip-car" />
              <rect x={-1} y={-5.4} width={8} height={10.8} rx={2} className="car-glass" />
              <rect x={-9} y={-4.8} width={4} height={9.6} rx={1.5} className="car-glass" />
            </g>
          )}
        </g>
      </svg>

      <div className="legend">
        <span>
          <i className="lg lg-car" /> {t.map.drivers(PER_DOT)}
        </span>
        <span>
          <i className="lg lg-car lg-car-fast" /> {t.map.fast} · <i className="lg lg-car" /> {t.map.medium} ·{' '}
          <i className="lg lg-car lg-car-slow" /> {t.map.slow}
        </span>
        <span>
          <i className="lg lg-rider" /> {t.map.unmet(PER_DOT)}
        </span>
        <span>
          <i className="lg lg-driver" /> {t.map.nearest}
        </span>
        <span>
          <i className="lg lg-other" /> {t.map.otherRider}
        </span>
        <span className="lg-scale">
          {num(1, 1)}× <i className="lg-gradient" /> {t.map.orMore}
        </span>
      </div>
    </section>
  )
}
