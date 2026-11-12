import { useState } from 'react'
import { euros, pct } from '../format'
import { homeSummary, useT } from '../i18n'
import type { MyListing, SaleProgress } from '../sale'
import { ZONES, ZONE_PRICE_M2, type HomeSpec } from '../sim/market'
import { daysToSell, priceTag, rounded, salePrice, testMAE, weeklyVisits, type Valuation } from '../sim/valuation'
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

const STEPS = ['published', 'visits', 'offers'] as const

const ASK_OPTIONS = [-0.1, -0.05, 0, 0.05, 0.1, 0.2]

export const TAG_TONE = { good: 'positive', fair: 'neutral', high: 'negative' } as const

function SaleView({ listing, progress, onClear }: { listing: MyListing; progress: SaleProgress; onClear: () => void }) {
  const t = useT()
  const { phase } = progress
  const stepIndex = phase === 'sold' ? STEPS.length : STEPS.findIndex((s) => s === phase)
  const tag = priceTag(listing.asking, listing.estimate)
  const visits = Math.round((listing.visitsPerWeek * progress.day) / 7)
  const discount = listing.salePrice / listing.asking - 1

  return (
    <section className="panel rider" aria-label={t.yourListing}>
      <h2 aria-live="polite">{t.phase[phase]}</h2>
      <p className="muted">{homeSummary(t, listing.spec)}</p>

      <ol className="stepper" aria-label={t.saleProgress}>
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'
          return (
            <li key={s} className={`trip-step trip-step-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <div className="step-bar">
                <div style={{ width: `${(state === 'done' ? 1 : state === 'current' ? progress.progress : 0) * 100}%` }} />
              </div>
              <span>{t.step[s]}</span>
            </li>
          )
        })}
      </ol>

      <p className="eta-big">
        {phase === 'sold' ? <CheckIcon size={18} /> : <ClockIcon size={18} />}
        {phase === 'sold' ? t.soldIn(listing.sellDays) : t.listingDay(progress.day)}
        <span className="eta-side">
          <EyeIcon size={16} />
          {t.visits(visits)}
        </span>
      </p>

      <div className={`price-lock ${phase === 'sold' ? 'price-lock-sold' : ''}`}>
        <TagIcon size={18} />
        <div>
          <b>{euros(phase === 'sold' ? listing.salePrice : listing.asking)}</b>
          <span>
            {phase === 'sold'
              ? discount < 0
                ? t.negotiated(pct(discount, 1))
                : t.soldAtAsking
              : t.askingNote(t.tag[tag])}
          </span>
        </div>
      </div>

      <dl className="receipt">
        <div>
          <dt>{t.autoValuation}</dt>
          <dd>{euros(rounded(listing.estimate))}</dd>
        </div>
        <div>
          <dt>{t.askVsValuation}</dt>
          <dd>
            <span className={`badge badge-${TAG_TONE[tag]}`}>{pct(listing.asking / listing.estimate - 1, 1)}</span>
          </dd>
        </div>
        <div>
          <dt>{t.weeklyVisits}</dt>
          <dd>{listing.visitsPerWeek}</dd>
        </div>
      </dl>

      <button className={`btn btn-block btn-large ${phase === 'sold' ? 'btn-primary' : 'btn-secondary'}`} onClick={onClear}>
        {phase === 'sold' ? t.valueAnother : t.withdraw}
      </button>
    </section>
  )
}

export function ValuationPanel(p: Props) {
  const t = useT()
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
      <h2 id="val-title">{t.valueTitle}</h2>
      <p className="muted">{t.valueSub}</p>

      <fieldset className="form-block">
        <legend>{t.zone}</legend>
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
              <b>{t.zoneName[z.id]}</b>
              <span>{t.zoneDesc[z.id]}</span>
            </label>
          ))}
        </div>
        <p className="map-tip">
          <MapIcon size={14} />
          {t.mapTip}
        </p>
      </fieldset>

      <div className="form-block">
        <label className="form-label" htmlFor="area">
          <AreaIcon size={16} />
          {t.area}
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
          {t.bedrooms}
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
          {t.renovatedCap}
          <span className="switch" aria-hidden="true" />
        </button>
        <button className={`extra ${spec.lift ? 'on' : ''}`} role="switch" aria-checked={spec.lift} onClick={() => set({ lift: !spec.lift })}>
          <LiftIcon size={18} />
          {t.liftCap}
          <span className="switch" aria-hidden="true" />
        </button>
      </div>

      <div className="estimate" aria-live="polite">
        <span className="estimate-label">{t.estimate}</span>
        <b className="estimate-price">{euros(estimate)}</b>
        <span className="estimate-range">
          {t.range(rounded(v.price - mae), rounded(v.price + mae))}
        </span>
        <div className="estimate-meta">
          <span>{t.perM2(Math.round(perM2))}</span>
          <span>
            {t.regression} {euros(rounded(v.regression))}
          </span>
          <span>
            {t.comps} {euros(rounded(v.comparablesPrice))}
          </span>
        </div>
      </div>

      <div className="notice" role="status">
        <InfoIcon />
        <div>
          <b>
            {Math.abs(vsZone) < 0.03 ? t.atAvg : vsZone > 0 ? t.aboveAvg : t.belowAvg} ·{' '}
            {pct(vsZone)}
          </b>
          <span>{t.zoneNote(t.zoneName[spec.zone], Math.round(zoneM2), Math.round(mae))}</span>
        </div>
      </div>

      <fieldset className="form-block ask">
        <legend>{t.askQ}</legend>
        <div className="ask-options" role="group">
          {ASK_OPTIONS.map((a) => (
            <button key={a} className={a === askPct ? 'on' : ''} aria-pressed={a === askPct} onClick={() => setAskPct(a)}>
              {a === 0 ? t.valuation : pct(a)}
            </button>
          ))}
        </div>
        <p className="ask-meta">
          <span className={`badge badge-${TAG_TONE[tag]}`}>{t.tag[tag]}</span>
          <span>
            <ClockIcon size={14} /> {t.sellIn(days)}
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
          <span>{t.publish}</span>
          <span className="cta-price">{euros(asking)}</span>
        </button>
        <p id="price-note" className="price-note">
          <InfoIcon size={14} />
          {t.priceNote}
        </p>
      </div>
    </section>
  )
}
