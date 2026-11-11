import { mult } from '../format'
import { current, type SimState } from '../sim/engine'
import { KIND_BY_ZONE, KIND_LABEL, ZONES, ZONE_BY_ID, ZONE_INDEX, hash, type Zone } from '../sim/world'
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
  onSelect: (zoneId: string) => void
}

const Z = 220
const SIZE = Z * 3
const STREETS = [55, 110, 165]
const PER_DOT = 9

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

const isHorizontal = (zone: Zone, i: number) => hash(ZONE_INDEX[zone.id], i, 1) < 0.5

/** Tramo de calle que recorre un coche dentro de su zona y distancia que avanza en cada tick. */
const LANE = Z - 28
const STEP = 24

/** Cada coche circula por su calle a velocidad constante y, al llegar al borde, vuelve a entrar por el otro lado. */
function carState(zone: Zone, i: number, tick: number) {
  const zi = ZONE_INDEX[zone.id]
  const street = STREETS[Math.floor(hash(zi, i, 2) * STREETS.length)]
  const dir = hash(zi, i, 4) < 0.5 ? 1 : -1
  const travelled = hash(zi, i, 3) * LANE + tick * STEP
  const lap = Math.floor(travelled / LANE)
  const offset = travelled - lap * LANE
  const along = 14 + (dir === 1 ? offset : LANE - offset)
  const horizontal = isHorizontal(zone, i)
  const pos: [number, number] = [
    zone.col * Z + (horizontal ? along : street),
    zone.row * Z + (horizontal ? street : along),
  ]
  const angle = horizontal ? (dir === 1 ? 0 : 180) : dir === 1 ? 90 : -90
  return { pos, lap, angle }
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
 * Recorrido en L por las calles: primero en horizontal y luego en vertical.
 * Devuelve la posición y el ángulo del coche (0 = hacia la derecha, 90 = hacia abajo).
 */
function alongRoute(from: [number, number], to: [number, number], t: number): { pos: [number, number]; angle: number } {
  const corner: [number, number] = [to[0], from[1]]
  const first = Math.abs(to[0] - from[0])
  const total = first + Math.abs(to[1] - from[1])
  const hAngle = to[0] >= from[0] ? 0 : 180
  const vAngle = to[1] >= from[1] ? 90 : -90
  if (total === 0) return { pos: from, angle: 0 }
  const d = Math.min(1, Math.max(0, t)) * total
  // En la esquina exacta el coche ya mira hacia el segundo tramo.
  if (d < first || first === total) return { pos: lerp(from, corner, first ? d / first : 0), angle: hAngle }
  return { pos: lerp(corner, to, (d - first) / (total - first)), angle: vAngle }
}

/** El conductor sale de un cruce cercano (una manzana a la izquierda y otra abajo) y llega por las calles. */
const PICKUP_OFFSET: [number, number] = [-55, 55]

export function CityMap(p: Props) {
  const routeFrom = center(ZONE_BY_ID[p.trip?.pickupId ?? p.pickupId])
  const routeTo = center(ZONE_BY_ID[p.trip?.destId ?? p.destId])
  const hasRoute = routeFrom[0] !== routeTo[0] || routeFrom[1] !== routeTo[1]

  let tripCar: { pos: [number, number]; angle: number } | null = null
  if (p.trip && p.progress) {
    const { phase, progress } = p.progress
    const start: [number, number] = [routeFrom[0] + PICKUP_OFFSET[0], routeFrom[1] + PICKUP_OFFSET[1]]
    if (phase === 'pickup') tripCar = alongRoute(start, routeFrom, progress)
    else if (phase === 'ontrip') tripCar = alongRoute(routeFrom, routeTo, progress)
    else if (phase === 'done') tripCar = alongRoute(routeFrom, routeTo, 1)
  }

  return (
    <section className="map-wrap" aria-label="Mapa de la ciudad">
      <svg className="map" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="Nueve zonas de la ciudad">
        {ZONES.map((zone) => {
          const s = current(p.sim, zone.id)
          const x = zone.col * Z
          const y = zone.row * Z
          const role = zone.id === p.pickupId ? 'recogida' : zone.id === p.destId ? 'destino' : null
          return (
            <g
              key={zone.id}
              className="zone"
              role="button"
              tabIndex={0}
              aria-label={`${zone.name}, ${KIND_LABEL[KIND_BY_ZONE[zone.id]]}, multiplicador ${mult(s.m)}${role ? `, ${role}` : ''}`}
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
            return Array.from({ length: Math.round(s.drivers / PER_DOT) }, (_, i) => {
              const { pos, lap, angle } = carState(zone, i, p.sim.tick)
              // La vuelta forma parte de la clave: al reaparecer por el otro lado no se anima el salto.
              return (
                <g
                  key={`c-${zone.id}-${i}-${lap}`}
                  className="car"
                  style={{ transform: `translate(${pos[0]}px, ${pos[1]}px)`, transitionDuration: `${p.tickMs}ms` }}
                >
                  <g transform={angle ? `rotate(${angle})` : undefined}>
                    <rect x={-10} y={-5} width={20} height={10} rx={3.5} className="car-body" />
                    <rect x={-1} y={-3.6} width={5.5} height={7.2} rx={1.5} className="car-glass" />
                    <rect x={-6.5} y={-3.2} width={3} height={6.4} rx={1} className="car-glass" />
                  </g>
                </g>
              )
            })
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
                  {KIND_LABEL[KIND_BY_ZONE[zone.id]]}
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
          <i className="lg lg-car" /> ≈ {PER_DOT} conductores
        </span>
        <span>
          <i className="lg lg-rider" /> ≈ {PER_DOT} solicitudes sin conductor
        </span>
        <span className="lg-scale">
          1,0× <i className="lg-gradient" /> 2,0× o más
        </span>
      </div>
    </section>
  )
}
