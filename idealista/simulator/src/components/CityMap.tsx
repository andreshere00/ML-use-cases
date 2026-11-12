import type { KeyboardEvent } from 'react'
import { euros, keur } from '../format'
import { useT } from '../i18n'
import type { Listing } from '../sim/engine'
import { TRAIN, ZONE_PRICE_M2, hash, type HomeSpec } from '../sim/market'
import { rounded, type PriceTag, type Valuation } from '../sim/valuation'

interface Props {
  spec: HomeSpec
  valuation: Valuation
  listings: Listing[]
  day: number
  /** Con un anuncio publicado no se cambia de zona desde el mapa. */
  locked: boolean
  onZone: (zone: number) => void
}

const SIZE = 660
type Pt = [number, number]

/** Ciudad ficticia: el centro histórico (C) dentro del ensanche (B), rodeado por la periferia (A). */
const POLY_C: Pt[] = [
  [250, 215], [330, 190], [405, 196], [462, 270], [440, 380], [352, 428], [262, 405], [214, 316],
]
const POLY_B: Pt[] = [
  [138, 108], [330, 82], [522, 96], [592, 250], [572, 452], [450, 540], [262, 552], [116, 448], [86, 270],
]
const RIVER: Pt[] = Array.from({ length: 34 }, (_, i) => {
  const x = (i / 33) * SIZE
  return [x, 606 + 22 * Math.sin(x / 120) - x * 0.03]
})
const PARK = { x: 470, y: 560, w: 120, h: 50 }

const path = (pts: Pt[]) => `M${pts.map((p) => p.join(',')).join('L')}Z`

function inside([x, y]: Pt, poly: Pt[]): boolean {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

function zoneAt(p: Pt): number {
  if (inside(p, POLY_C)) return 2
  return inside(p, POLY_B) ? 1 : 0
}

const nearRiver = ([x, y]: Pt) => RIVER.some(([rx, ry]) => Math.hypot(rx - x, ry - y) < 20)
const inPark = ([x, y]: Pt) => x > PARK.x - 8 && x < PARK.x + PARK.w + 8 && y > PARK.y - 8 && y < PARK.y + PARK.h + 8

/** Coloca cada vivienda en un punto fijo de su zona (lejos de bordes, río y parque). */
function place(id: number, zone: number): Pt {
  for (let t = 0; t < 400; t++) {
    const p: Pt = [18 + hash(id, 10 + t) * (SIZE - 36), 18 + hash(id, 500 + t) * (SIZE - 36)]
    if (zoneAt(p) !== zone || nearRiver(p) || inPark(p)) continue
    const edge = zone === 0 ? POLY_B : zone === 1 ? [...POLY_B, ...POLY_C] : POLY_C
    if (edge.some(([ex, ey]) => Math.hypot(ex - p[0], ey - p[1]) < 10)) continue
    return p
  }
  return ANCHOR[zone]
}

/** Dónde se dibuja "tu vivienda" en cada zona, junto a la etiqueta. */
const ANCHOR: Pt[] = [
  [96, 520],
  [470, 170],
  [338, 318],
]
const LABEL: Pt[] = [
  [24, 40],
  [150, 150],
  [262, 248],
]

const POS = new Map<number, Pt>()
const pos = (id: number, zone: number) => {
  let p = POS.get(id)
  if (!p) POS.set(id, (p = place(id, zone)))
  return p
}

const M2 = TRAIN.map((h) => h.price / h.area)
const M2_MIN = Math.min(...M2)
const M2_MAX = Math.max(...M2)
const HEAT = ['#fff1c2', '#f7b25c', '#d4522a', '#8f1d1d']

/** Color secuencial del precio por m², de amarillo claro (barato) a granate (caro). */
function heat(m2: number): string {
  const t = Math.min(1, Math.max(0, (m2 - M2_MIN) / (M2_MAX - M2_MIN))) * (HEAT.length - 1)
  const i = Math.min(HEAT.length - 2, Math.floor(t))
  const a = HEAT[i].match(/\w\w/g)!.map((h) => parseInt(h, 16))
  const b = HEAT[i + 1].match(/\w\w/g)!.map((h) => parseInt(h, 16))
  const f = t - i
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * f)).join(',')})`
}

const TAG_COLOR: Record<PriceTag, string> = {
  good: 'var(--positive)',
  fair: 'var(--content-secondary)',
  high: 'var(--negative)',
}

const ZONE_FILL = ['#eef0e6', '#e6eadb', '#dde3cc']
const STREETS = [66, 132, 198, 264, 330, 396, 462, 528, 594]
const RECENT = 8

export function CityMap(p: Props) {
  const t = useT()
  const anchor = ANCHOR[p.spec.zone]
  const comps = new Set(p.valuation.comparables.map((c) => c.home.id))
  const recent = p.listings.filter((l) => p.day - l.day < RECENT)

  const zoneProps = (zone: number) => ({
    className: `zone ${zone === p.spec.zone ? 'zone-selected' : ''}`,
    role: 'button',
    tabIndex: p.locked ? -1 : 0,
    'aria-pressed': zone === p.spec.zone,
    'aria-label': t.zoneAria(t.zoneName[zone], t.zoneDesc[zone], Math.round(ZONE_PRICE_M2[zone])),
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      if (!p.locked) p.onZone(zone)
    },
    onKeyDown: (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !p.locked) {
        e.preventDefault()
        p.onZone(zone)
      }
    },
  })

  return (
    <div className="map-wrap">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="map" role="group" aria-label={t.mapLabel}>
        <defs>
          <clipPath id="clip-b">
            <path d={path(POLY_B)} />
          </clipPath>
          <clipPath id="clip-c">
            <path d={path(POLY_C)} />
          </clipPath>
        </defs>

        <g {...zoneProps(0)}>
          <rect width={SIZE} height={SIZE} fill={ZONE_FILL[0]} className="zone-fill" />
        </g>
        <g className="street" aria-hidden="true">
          {STREETS.map((s) => (
            <g key={s}>
              <line x1={0} y1={s} x2={SIZE} y2={s} />
              <line x1={s} y1={0} x2={s} y2={SIZE} />
            </g>
          ))}
        </g>
        <g {...zoneProps(1)}>
          <path d={path(POLY_B)} fill={ZONE_FILL[1]} className="zone-fill" />
          <g className="street street-b" clipPath="url(#clip-b)" aria-hidden="true">
            {STREETS.map((s) => (
              <g key={s}>
                <line x1={0} y1={s + 33} x2={SIZE} y2={s + 33} />
                <line x1={s + 33} y1={0} x2={s + 33} y2={SIZE} />
              </g>
            ))}
          </g>
          <path d={path(POLY_B)} className="zone-border" />
        </g>
        <g {...zoneProps(2)}>
          <path d={path(POLY_C)} fill={ZONE_FILL[2]} className="zone-fill" />
          <g className="street street-c" clipPath="url(#clip-c)" aria-hidden="true">
            <path d="M210,250 L470,360 M240,420 L420,180 M330,180 L320,430" />
          </g>
          <path d={path(POLY_C)} className="zone-border" />
        </g>

        <path
          d={`M${RIVER.map((r) => r.join(',')).join('L')}`}
          className="river"
          aria-hidden="true"
        />
        <rect x={PARK.x} y={PARK.y} width={PARK.w} height={PARK.h} rx={18} className="park" aria-hidden="true" />

        {[0, 1, 2].map((z) => (
          <g key={z} className="zone-label" transform={`translate(${LABEL[z][0]}, ${LABEL[z][1]})`} aria-hidden="true">
            {/* Grupo interior sin `transform`: en móvil el `scale` de CSS lo amplía sin desplazarlo. */}
            <g className="map-tag">
              <text className="zone-name">{t.zoneName[z]}</text>
              <text className="zone-kind" y={16}>
                {t.zoneDesc[z]} · {t.perM2(Math.round(ZONE_PRICE_M2[z]))}
              </text>
            </g>
          </g>
        ))}

        <g className="homes" aria-hidden="true">
          {TRAIN.map((h) => {
            const [x, y] = pos(h.id, h.zone)
            const other = h.zone !== p.spec.zone
            return (
              <circle
                key={h.id}
                cx={x}
                cy={y}
                r={comps.has(h.id) ? 5 : 3.4}
                fill={heat(h.price / h.area)}
                className={`home ${other ? 'home-dim' : ''}`}
              >
                <title>
                  {h.area} m² · {h.beds} {t.beds} · {euros(h.price)} ({t.perM2(Math.round(h.price / h.area))})
                </title>
              </circle>
            )
          })}
        </g>

        <g className="comp-links" aria-hidden="true">
          {p.valuation.comparables.map(({ home }) => {
            const [x, y] = pos(home.id, home.zone)
            return (
              <g key={home.id} className="comp">
                <line x1={anchor[0]} y1={anchor[1]} x2={x} y2={y} />
                <circle cx={x} cy={y} r={8} />
              </g>
            )
          })}
        </g>

        <g className="listings" aria-hidden="true">
          {recent.map((l) => {
            const [x, y] = pos(l.home.id, l.home.zone)
            const fresh = l.day === p.day
            return (
              <g key={l.home.id} transform={`translate(${x}, ${y})`} className="listing-pin" style={{ opacity: 1 - (p.day - l.day) / RECENT }}>
                {fresh && <circle r={7} className="listing-pulse" style={{ stroke: TAG_COLOR[l.tag] }} />}
                <rect x={-6} y={-6} width={12} height={12} rx={3} transform="rotate(45)" fill={TAG_COLOR[l.tag]} className="listing-body" />
                {fresh && (
                  <g transform="translate(0, -24)" className="listing-label">
                    <g className="map-tag map-tag-center">
                      <rect x={-34} y={-11} width={68} height={22} rx={11} />
                      <text y={4}>{keur(l.asking)}</text>
                    </g>
                  </g>
                )}
              </g>
            )
          })}
        </g>

        <g className="my-home" transform={`translate(${anchor[0]}, ${anchor[1]})`}>
          {/* En móvil el pin crece desde la punta, que sigue marcando la vivienda. */}
          <g className="map-tag map-tag-tip">
            <path d="M0,0 C-4,-8 -14,-14 -14,-26 A14,14 0 1 1 14,-26 C14,-14 4,-8 0,0Z" className="pin" />
            <path d="M-6,-25 L0,-31 L6,-25 V-19 H-6Z" className="pin-house" />
            <g transform="translate(0, -52)">
              <rect x={-44} y={-13} width={88} height={26} rx={13} className="pin-label" />
              <text y={5} className="pin-text">
                {keur(rounded(p.valuation.price))}
              </text>
            </g>
          </g>
        </g>
      </svg>

      <div className="legend" aria-hidden="true">
        <span>
          <i className="lg-gradient" style={{ background: `linear-gradient(90deg, ${HEAT.join(', ')})` }} />
          {t.m2Range(Math.round(M2_MIN / 100) * 100, Math.round(M2_MAX / 100) * 100)}
        </span>
        <span>
          <i className="lg lg-pin" /> {t.yourHome}
        </span>
        <span>
          <i className="lg lg-comp" /> {t.nComps(p.valuation.comparables.length)}
        </span>
        {(['good', 'fair', 'high'] as PriceTag[]).map((tag) => (
          <span key={tag}>
            <i className="lg lg-listing" style={{ background: TAG_COLOR[tag] }} /> {t.tag[tag]}
          </span>
        ))}
      </div>
    </div>
  )
}
