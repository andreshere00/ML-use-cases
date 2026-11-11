import { useState } from 'react'
import { euros, num, pct } from '../format'
import type { MyListing, SaleProgress } from '../sale'
import { ZONES, ZONE_PRICE_M2, type HomeSpec } from '../sim/market'
import { TAG_LABEL, daysToSell, priceTag, rounded, salePrice, testMAE, weeklyVisits, type Valuation } from '../sim/valuation'
import { AreaIcon, BedIcon, CheckIcon, ClockIcon, EyeIcon, InfoIcon, LiftIcon, MapIcon, SparkIcon, TagIcon } from './Icons'

interface Props {
  spec: HomeSpec
  valuation: Valuation
  k: number
  listing: MyListing | null
  progress: SaleProgress | null
  onSpec: (spec: HomeSpec) => void
  onPublish: (listing: MyListing) => void
  onClear: () => void
}

const PHASE_TEXT = {
  published: 'Anuncio publicado',
  visits: 'Recibiendo visitas',
  offers: 'Negociando ofertas',
  sold: '¡Vivienda vendida!',
}

const STEPS = [
  { id: 'published', label: 'Publicado' },
  { id: 'visits', label: 'Visitas' },
  { id: 'offers', label: 'Ofertas' },
] as const

const ASK_OPTIONS = [-0.1, -0.05, 0, 0.05, 0.1, 0.2]

export const TAG_TONE = { good: 'positive', fair: 'neutral', high: 'negative' } as const

export const homeSummary = (s: HomeSpec) =>
  `${s.area} m² · ${s.beds} dorm. · ${ZONES[s.zone].name}${s.renovated ? ' · reformado' : ''}${s.lift ? ' · ascensor' : ''}`

function SaleView({ listing, progress, onClear }: { listing: MyListing; progress: SaleProgress; onClear: () => void }) {
  const { phase } = progress
  const stepIndex = phase === 'sold' ? STEPS.length : STEPS.findIndex((s) => s.id === phase)
  const tag = priceTag(listing.asking, listing.estimate)
  const visits = Math.round((listing.visitsPerWeek * progress.day) / 7)
  const discount = listing.salePrice / listing.asking - 1

  return (
    <section className="panel rider" aria-label="Tu anuncio">
      <h2 aria-live="polite">{PHASE_TEXT[phase]}</h2>
      <p className="muted">{homeSummary(listing.spec)}</p>

      <ol className="stepper" aria-label="Progreso de la venta">
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'
          return (
            <li key={s.id} className={`trip-step trip-step-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <div className="step-bar">
                <div style={{ width: `${(state === 'done' ? 1 : state === 'current' ? progress.progress : 0) * 100}%` }} />
              </div>
              <span>{s.label}</span>
            </li>
          )
        })}
      </ol>

      <p className="eta-big">
        {phase === 'sold' ? <CheckIcon size={18} /> : <ClockIcon size={18} />}
        {phase === 'sold' ? `Vendida en ${listing.sellDays} días` : `Día ${progress.day} del anuncio`}
        <span className="eta-side">
          <EyeIcon size={16} />
          {visits} visitas
        </span>
      </p>

      <div className={`price-lock ${phase === 'sold' ? 'price-lock-sold' : ''}`}>
        <TagIcon size={18} />
        <div>
          <b>{euros(phase === 'sold' ? listing.salePrice : listing.asking)}</b>
          <span>
            {phase === 'sold'
              ? discount < 0
                ? `Precio de cierre: has negociado ${pct(discount, 1)} sobre lo anunciado.`
                : 'Vendida al precio anunciado.'
              : `Precio anunciado · ${TAG_LABEL[tag].toLowerCase()} según la valoración.`}
          </span>
        </div>
      </div>

      <dl className="receipt">
        <div>
          <dt>Valoración automática</dt>
          <dd>{euros(rounded(listing.estimate))}</dd>
        </div>
        <div>
          <dt>Precio pedido frente a la valoración</dt>
          <dd>
            <span className={`badge badge-${TAG_TONE[tag]}`}>{pct(listing.asking / listing.estimate - 1, 1)}</span>
          </dd>
        </div>
        <div>
          <dt>Visitas por semana estimadas</dt>
          <dd>{listing.visitsPerWeek}</dd>
        </div>
      </dl>

      <button className={`btn btn-block btn-large ${phase === 'sold' ? 'btn-primary' : 'btn-secondary'}`} onClick={onClear}>
        {phase === 'sold' ? 'Valorar otra vivienda' : 'Retirar anuncio'}
      </button>
    </section>
  )
}

export function ValuationPanel(p: Props) {
  const [askPct, setAskPct] = useState(0)

  if (p.listing && p.progress) return <SaleView listing={p.listing} progress={p.progress} onClear={p.onClear} />

  const { spec, valuation: v } = p
  const set = (patch: Partial<HomeSpec>) => p.onSpec({ ...spec, ...patch })
  const estimate = rounded(v.price)
  const mae = testMAE(v.w, p.k)
  const perM2 = v.price / spec.area
  const zoneM2 = ZONE_PRICE_M2[spec.zone]
  const vsZone = perM2 / zoneM2 - 1
  const asking = rounded(v.price * (1 + askPct))
  const tag = priceTag(asking, v.price)
  const days = daysToSell(asking, v.price)

  return (
    <section className="panel rider" aria-labelledby="val-title">
      <h2 id="val-title">Valora tu vivienda</h2>
      <p className="muted">Gratis y al instante, con viviendas parecidas de tu zona.</p>

      <fieldset className="form-block">
        <legend>Zona</legend>
        <div className="zone-picker">
          {ZONES.map((z) => (
            <label key={z.id} className={`zone-option ${z.id === spec.zone ? 'selected' : ''}`}>
              <input
                type="radio"
                name="zone"
                className="visually-hidden"
                checked={z.id === spec.zone}
                onChange={() => set({ zone: z.id })}
              />
              <b>{z.name}</b>
              <span>{z.description}</span>
            </label>
          ))}
        </div>
        <p className="map-tip">
          <MapIcon size={14} />
          También puedes tocar la zona en el mapa
        </p>
      </fieldset>

      <div className="form-block">
        <label className="form-label" htmlFor="area">
          <AreaIcon size={16} />
          Superficie construida
          <output htmlFor="area">{spec.area} m²</output>
        </label>
        <input
          id="area"
          className="range"
          type="range"
          min={45}
          max={140}
          value={spec.area}
          onChange={(e) => set({ area: Number(e.target.value) })}
        />
      </div>

      <fieldset className="form-block">
        <legend className="form-label">
          <BedIcon size={16} />
          Dormitorios
        </legend>
        <div className="seg-light" role="group">
          {[1, 2, 3, 4].map((b) => (
            <button key={b} className={b === spec.beds ? 'on' : ''} aria-pressed={b === spec.beds} onClick={() => set({ beds: b })}>
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="extras">
        <button className={`extra ${spec.renovated ? 'on' : ''}`} role="switch" aria-checked={spec.renovated} onClick={() => set({ renovated: !spec.renovated })}>
          <SparkIcon size={18} />
          Reformado
          <span className="switch" aria-hidden="true" />
        </button>
        <button className={`extra ${spec.lift ? 'on' : ''}`} role="switch" aria-checked={spec.lift} onClick={() => set({ lift: !spec.lift })}>
          <LiftIcon size={18} />
          Ascensor
          <span className="switch" aria-hidden="true" />
        </button>
      </div>

      <div className="estimate" aria-live="polite">
        <span className="estimate-label">Valoración estimada</span>
        <b className="estimate-price">{euros(estimate)}</b>
        <span className="estimate-range">
          Entre {euros(rounded(v.price - mae))} y {euros(rounded(v.price + mae))}
        </span>
        <div className="estimate-meta">
          <span>{euros(Math.round(perM2))}/m²</span>
          <span>Regresión {euros(rounded(v.regression))}</span>
          <span>Comparables {euros(rounded(v.comparablesPrice))}</span>
        </div>
      </div>

      <div className="notice" role="status">
        <InfoIcon />
        <div>
          <b>
            {Math.abs(vsZone) < 0.03 ? 'En la media de la zona' : vsZone > 0 ? 'Por encima de la media de la zona' : 'Por debajo de la media de la zona'} ·{' '}
            {pct(vsZone)}
          </b>
          <span>
            El m² medio en {ZONES[spec.zone].name} es de {euros(Math.round(zoneM2))}. El rango usa el error medio del modelo con viviendas
            que no ha visto ({euros(Math.round(mae))}).
          </span>
        </div>
      </div>

      <fieldset className="form-block ask">
        <legend>¿A qué precio la anuncias?</legend>
        <div className="ask-options" role="group">
          {ASK_OPTIONS.map((a) => (
            <button key={a} className={a === askPct ? 'on' : ''} aria-pressed={a === askPct} onClick={() => setAskPct(a)}>
              {a === 0 ? 'Valoración' : pct(a)}
            </button>
          ))}
        </div>
        <p className="ask-meta">
          <span className={`badge badge-${TAG_TONE[tag]}`}>{TAG_LABEL[tag]}</span>
          <span>
            <ClockIcon size={14} /> Se vendería en ~{num(days)} días
          </span>
        </p>
      </fieldset>

      <div className="cta">
        <button
          className="btn btn-primary btn-block btn-large"
          aria-describedby="price-note"
          onClick={() =>
            p.onPublish({
              spec,
              estimate: v.price,
              asking,
              sellDays: days,
              visitsPerWeek: weeklyVisits(asking, v.price),
              salePrice: salePrice(asking, v.price),
              startedAt: performance.now(),
            })
          }
        >
          <span>Publicar anuncio</span>
          <span className="cta-price">{euros(asking)}</span>
        </button>
        <p id="price-note" className="price-note">
          <InfoIcon size={14} />
          Estimación orientativa, no es una tasación oficial.
        </p>
      </div>
    </section>
  )
}
