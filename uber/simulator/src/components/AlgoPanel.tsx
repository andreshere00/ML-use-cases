import { useEffect, useState } from 'react'
import { mult, num, pct } from '../format'
import { useI18n } from '../i18n'
import { DEMAND_SCALE, ELASTICITY, SUPPLY_SENSITIVITY, clockLabel, type Sample, type SimState } from '../sim/engine'
import { WEIGHTS } from '../sim/forecast'
import { M_MAX } from '../sim/pricing'
import { OBSERVATIONS, demandAt, supplyAt } from '../sim/regression'
import { CLUSTERS, KIND_BY_ZONE, KIND_OF_CLUSTER, ZONES, ZONE_BY_ID, type ZoneKind } from '../sim/world'

const KIND_COLOR: Record<ZoneKind, string> = {
  business: 'var(--accent)',
  residential: 'var(--positive)',
  nightlife: 'var(--purple)',
}

function Card(props: { step: number; title: string; question: string; children: React.ReactNode }) {
  return (
    <article className="card">
      <header>
        <span className="step">{props.step}</span>
        <div>
          <h3>{props.title}</h3>
          <p>{props.question}</p>
        </div>
      </header>
      {props.children}
    </article>
  )
}

const BAR_MAX = 64

function ForecastCard({ s, zoneId }: { s: Sample; zoneId: string }) {
  const { t } = useI18n()
  const tf = t.algo.forecast
  const f = s.forecast
  // Escala fija para toda la tarde: las barras crecen y encogen con la demanda real de cada hora.
  const h = (v: number) => `${Math.min(1, v / DEMAND_SCALE[zoneId]) * BAR_MAX}px`
  const bars = [
    ...f.history.map((v, i) => ({ v, label: tf.friday(4 - i), sub: num(WEIGHTS[i], 1), cls: 'bar', opacity: 0.35 + WEIGHTS[i] * 1.6 })),
    { v: f.nowcast, label: tf.predicted, sub: tf.today, cls: 'bar bar-forecast', opacity: 1 },
    { v: s.latent, label: tf.actual, sub: tf.today, cls: 'bar bar-actual', opacity: 1 },
  ]
  return (
    <Card step={1} title={tf.title} question={tf.question}>
      <div
        className="bars"
        role="img"
        aria-label={tf.aria(f.history.map((v) => Math.round(v)).join(', '), Math.round(f.nowcast), Math.round(s.latent))}
      >
        {bars.map((b, i) => (
          <div key={i} className={i === 4 ? 'bar-col bar-col-gap' : 'bar-col'}>
            <span className="bar-value">{Math.round(b.v)}</span>
            <div className={b.cls} style={{ height: h(b.v), opacity: b.opacity }} />
            <span className="bar-label">
              {b.label}
              <br />
              {b.sub}
            </span>
          </div>
        ))}
      </div>
      <dl className="calc">
        <div>
          <dt>{tf.weighted}</dt>
          <dd>{num(f.base, 1)}</dd>
        </div>
        <div>
          <dt>{tf.rain(num(f.rainEffect, 2))}</dt>
          <dd>{num(f.withRain, 1)}</dd>
        </div>
        <div>
          <dt>{tf.live(pct(f.deviation))}</dt>
          <dd>{num(f.nowcast, 1)}</dd>
        </div>
        <div className="total">
          <dt>{tf.result}</dt>
          <dd>{tf.requests(Math.round(f.nowcast))}</dd>
        </div>
      </dl>
      <p className="note">{tf.note(Math.round(s.latent), pct(f.nowcast / s.latent - 1))}</p>
    </Card>
  )
}

const STEP_MS = 1400
/** Fotogramas extra en los que se mantiene el resultado final antes de volver a empezar. */
const HOLD_FRAMES = 3

/** Recorre las iteraciones de k-means en bucle; con movimiento reducido se queda en la última. */
function useIteration(count: number): number {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setFrame((f) => (f + 1) % (count + HOLD_FRAMES)), STEP_MS)
    return () => clearInterval(id)
  }, [count, reduced])
  return reduced ? count - 1 : Math.min(frame, count - 1)
}

function ClusterCard({ zoneId }: { zoneId: string }) {
  const { t } = useI18n()
  const tc = t.algo.cluster
  const W = 300
  const H = 130
  const sx = (v: number) => 28 + (v / 62) * (W - 38)
  const sy = (v: number) => H - 22 - (v / 55) * (H - 32)
  const kind = KIND_BY_ZONE[zoneId]
  const it = useIteration(CLUSTERS.history.length)
  const step = CLUSTERS.history[it]
  const converged = it === CLUSTERS.history.length - 1
  return (
    <Card step={2} title={tc.title} question={tc.question}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={tc.aria(ZONE_BY_ID[zoneId].name, t.kind[kind])}>
        <line x1={28} y1={H - 22} x2={W - 6} y2={H - 22} className="axis" />
        <line x1={28} y1={6} x2={28} y2={H - 22} className="axis" />
        <text x={W - 6} y={H - 6} className="axis-label" textAnchor="end">
          {tc.xAxis}
        </text>
        <text x={32} y={12} className="axis-label">
          {tc.yAxis}
        </text>
        {/* Rastro de cada centroide desde su posición inicial hasta la iteración actual. */}
        {step.centers.map((_, k) => (
          <polyline
            key={`t${k}`}
            className="centroid-trail"
            stroke={KIND_COLOR[KIND_OF_CLUSTER[k]]}
            points={CLUSTERS.history
              .slice(0, it + 1)
              .map((h) => `${sx(h.centers[k][0])},${sy(h.centers[k][1])}`)
              .join(' ')}
          />
        ))}
        {ZONES.map((z, i) => (
          <g key={z.id} transform={`translate(${sx(z.morningPct)}, ${sy(z.nightPct)})`}>
            {z.id === zoneId && <circle r={11} fill="none" stroke="var(--content)" strokeWidth={2} />}
            <circle r={7.5} className="cluster-point" fill={KIND_COLOR[KIND_OF_CLUSTER[step.assignments[i]]]} />
            <text className="point-label" y={3}>
              {z.id}
            </text>
          </g>
        ))}
        {step.centers.map((c, k) => (
          <g key={k} className="centroid" style={{ transform: `translate(${sx(c[0])}px, ${sy(c[1])}px)` }}>
            <g stroke={KIND_COLOR[KIND_OF_CLUSTER[k]]} strokeWidth={2.5}>
              <line x1={-6} y1={-6} x2={6} y2={6} />
              <line x1={-6} y1={6} x2={6} y2={-6} />
            </g>
          </g>
        ))}
      </svg>
      <p className="iteration" aria-live="off">
        <b>
          {tc.iteration(it + 1, CLUSTERS.history.length)}
        </b>
        {converged
          ? tc.converged
          : it === 0
            ? tc.initial
            : tc.moving}
      </p>
      <div className="legend-row">
        {(['business', 'residential', 'nightlife'] as ZoneKind[]).map((k) => (
          <span key={k} className={k === kind ? 'current' : ''}>
            <i style={{ background: KIND_COLOR[k] }} /> {t.kind[k]}
          </span>
        ))}
      </div>
      <p className="note">
        {tc.note(ZONE_BY_ID[zoneId].name, zoneId, CLUSTERS.iterations)}
      </p>
    </Card>
  )
}

function RegressionCard({ s, zoneId }: { s: Sample; zoneId: string }) {
  const { t } = useI18n()
  const tr = t.algo.regression
  const W = 300
  const H = 130
  const drivers = ZONE_BY_ID[zoneId].baseDrivers
  const base = s.forecast.nowcast
  const top = Math.max(base, supplyAt(drivers, SUPPLY_SENSITIVITY, M_MAX)) * 1.08
  const sx = (m: number) => 28 + ((m - 1) / (M_MAX - 1)) * (W - 38)
  const sy = (v: number) => H - 22 - (v / top) * (H - 30)
  const ms = Array.from({ length: 41 }, (_, i) => 1 + (i / 40) * (M_MAX - 1))
  const path = (fn: (m: number) => number) => ms.map((m, i) => `${i ? 'L' : 'M'}${sx(m).toFixed(1)},${sy(fn(m)).toFixed(1)}`).join(' ')
  const eq = demandAt(base, ELASTICITY.beta, s.mStar)
  return (
    <Card step={3} title={tr.title} question={tr.question}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={tr.aria(mult(s.mStar), Math.round(eq))}>
        <line x1={28} y1={H - 22} x2={W - 6} y2={H - 22} className="axis" />
        <line x1={28} y1={6} x2={28} y2={H - 22} className="axis" />
        {[1, 1.5, 2, 2.5, 3].map((m) => (
          <text key={m} x={sx(m)} y={H - 8} className="axis-label" textAnchor="middle">
            {num(m, 1)}×
          </text>
        ))}
        <path d={path((m) => supplyAt(drivers, SUPPLY_SENSITIVITY, m))} className="line line-supply" />
        <path d={path((m) => demandAt(base, ELASTICITY.beta, m))} className="line line-demand" />
        {OBSERVATIONS.map(([m, p]) => (
          <circle key={m} cx={sx(m)} cy={sy((base * p) / 100)} r={3} className="obs" />
        ))}
        <line x1={sx(s.mStar)} y1={sy(eq)} x2={sx(s.mStar)} y2={H - 22} className="guide" />
        <circle cx={sx(s.mStar)} cy={sy(eq)} r={5.5} className="eq" />
      </svg>
      <div className="legend-row">
        <span>
          <i style={{ background: 'var(--content)' }} /> {tr.demand}
        </span>
        <span>
          <i style={{ background: 'var(--positive)' }} /> {tr.drivers}
        </span>
        <span>
          <i style={{ background: 'var(--accent)' }} /> {tr.equilibrium}
        </span>
      </div>
      <dl className="calc">
        <div>
          <dt>
            {tr.elasticity(num(ELASTICITY.r2, 3))}
          </dt>
          <dd>{num(ELASTICITY.beta, 3)}</dd>
        </div>
        <div className="total">
          <dt>{tr.eqLabel}</dt>
          <dd>
            {tr.trips(mult(s.mStar), Math.round(eq))}
          </dd>
        </div>
      </dl>
    </Card>
  )
}

function LoopCard({ history, eta }: { history: Sample[]; eta: number }) {
  const { t } = useI18n()
  const tl = t.algo.loop
  const W = 300
  const H = 120
  const window = history.slice(-36)
  const s = window[window.length - 1]
  const top = Math.max(1.6, ...window.map((h) => Math.max(h.m, h.mStar))) + 0.1
  const sx = (i: number) => 28 + (i / Math.max(35, window.length - 1)) * (W - 38)
  const sy = (m: number) => H - 20 - ((m - 0.9) / (top - 0.9)) * (H - 28)
  const path = (get: (h: Sample) => number) => window.map((h, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(get(h)).toFixed(1)}`).join(' ')
  const delta = eta * (s.ratio - 1)
  return (
    <Card step={4} title={tl.title} question={tl.question}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={tl.aria(mult(s.m), mult(s.nextM))}>
        <line x1={28} y1={sy(1)} x2={W - 6} y2={sy(1)} className="axis" />
        <text x={24} y={sy(1) + 3} className="axis-label" textAnchor="end">
          {num(1, 1)}
        </text>
        <text x={24} y={sy(top - 0.1) + 3} className="axis-label" textAnchor="end">
          {num(top - 0.1, 1)}
        </text>
        <text x={28} y={H - 4} className="axis-label">
          {clockLabel(window[0].tick)}
        </text>
        <text x={sx(window.length - 1)} y={H - 4} className="axis-label" textAnchor="middle">
          {clockLabel(s.tick)}
        </text>
        <path d={path((h) => h.mStar)} className="line line-eq" />
        <path d={path((h) => h.m)} className="line line-demand" />
        <circle cx={sx(window.length - 1)} cy={sy(s.m)} r={4.5} className="now" />
      </svg>
      <div className="legend-row">
        <span>
          <i style={{ background: 'var(--content)' }} /> {tl.applied}
        </span>
        <span>
          <i className="dashed" /> {tl.fromRegression}
        </span>
      </div>
      <dl className="calc">
        <div>
          <dt>
            {tl.ratio(Math.round(s.demand), Math.round(s.drivers))}
          </dt>
          <dd className={s.ratio > 1 ? 'warn' : 'ok'}>{num(s.ratio, 2)}</dd>
        </div>
        <div className="total">
          <dt>
            m ← {num(s.m, 2)} {delta >= 0 ? '+' : '−'} {num(eta, 1)} · {num(Math.abs(s.ratio - 1), 2)}
          </dt>
          <dd>{mult(s.nextM)}</dd>
        </div>
      </dl>
      <p className="note">{s.ratio > 1 ? tl.up : tl.down}</p>
    </Card>
  )
}

export function AlgoPanel({ sim, zoneId }: { sim: SimState; zoneId: string }) {
  const { t } = useI18n()
  const history = sim.zones[zoneId]
  const s = history[history.length - 1]
  return (
    <section className="panel algo" aria-label={t.algo.region}>
      <h2>{t.algo.title}</h2>
      <p className="muted">
        {t.algo.subtitle(ZONE_BY_ID[zoneId].name, clockLabel(sim.tick))}
      </p>
      <ForecastCard s={s} zoneId={zoneId} />
      <ClusterCard zoneId={zoneId} />
      <RegressionCard s={s} zoneId={zoneId} />
      <LoopCard history={history} eta={sim.eta} />
    </section>
  )
}
