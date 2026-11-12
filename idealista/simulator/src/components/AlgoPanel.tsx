import { useEffect, useMemo, useState } from 'react'
import { euros, keur, num } from '../format'
import { useT } from '../i18n'
import { TRAIN, TRUE_COEFS, type HomeSpec } from '../sim/market'
import { BASELINE, GD_HISTORY, MODEL } from '../sim/regression'
import { explain, maeCurve, rounded, testMAE, type Valuation } from '../sim/valuation'

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

const STEP_MS = 220
/** Fotogramas extra en los que se mantiene el resultado final antes de volver a empezar. */
const HOLD_FRAMES = 14

/** Recorre las iteraciones en bucle; con movimiento reducido se queda en la última. */
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

const REAL = [TRUE_COEFS.area, TRUE_COEFS.beds, TRUE_COEFS.zoneB, TRUE_COEFS.zoneC, TRUE_COEFS.renovated, TRUE_COEFS.lift]

function RegressionCard({ v }: { v: Valuation }) {
  const t = useT()
  const it = useIteration(GD_HISTORY.length)
  const step = GD_HISTORY[it]
  const W = 300
  const H = 54
  const maxMae = GD_HISTORY[0].mae
  const sx = (i: number) => 4 + (i / (GD_HISTORY.length - 1)) * (W - 8)
  const sy = (m: number) => H - 6 - (m / maxMae) * (H - 14)
  const line = GD_HISTORY.map((h, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(h.mae).toFixed(1)}`).join(' ')
  return (
    <Card step={1} title={t.regTitle} question={t.regQ}>
      <ul className="coefs" aria-label={t.gdAria(step.iteration)}>
        {t.feature.map((f, j) => {
          const ratio = step.coefs[j] / REAL[j]
          return (
            <li key={f}>
              <span className="coef-name">{f}</span>
              <span className="coef-track">
                <span className="coef-bar" style={{ width: `${Math.min(1.15, Math.max(0, ratio)) * 80}%` }} />
                <span className="coef-real" style={{ left: '80%' }} />
              </span>
              <span className="coef-value">
                {j === 0 ? t.perM2(Math.round(step.coefs[j])) : euros(Math.round(step.coefs[j]))}
              </span>
            </li>
          )
        })}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={t.trainErrorAria(Math.round(step.mae))}>
        <line x1={4} y1={H - 6} x2={W - 4} y2={H - 6} className="axis" />
        <path d={line} className="line line-muted" />
        <circle cx={sx(it)} cy={sy(step.mae)} r={4.5} className="now" />
        <text x={W - 4} y={10} className="axis-label" textAnchor="end">
          {t.trainError(Math.round(step.mae))}
        </text>
      </svg>
      <p className="iteration">
        <b>{t.iteration(step.iteration)}</b>
        {it === GD_HISTORY.length - 1 ? t.converged : t.correcting}
      </p>
      <div className="legend-row">
        <span>
          <i style={{ background: 'var(--content)' }} /> {t.learnedWeight}
        </span>
        <span>
          <i className="tick" /> {t.trueValue}
        </span>
      </div>
      <dl className="calc">
        <div>
          <dt>{t.intercept}</dt>
          <dd>{euros(Math.round(MODEL.intercept))}</dd>
        </div>
        <div className="total">
          <dt>{t.regPrice}</dt>
          <dd>{euros(Math.round(v.regression))}</dd>
        </div>
      </dl>
    </Card>
  )
}

function ComparablesCard({ spec, v }: { spec: HomeSpec; v: Valuation }) {
  const t = useT()
  const zone = t.zoneName[spec.zone]
  const W = 300
  const H = 140
  const zoneRows = useMemo(() => TRAIN.filter((h) => h.zone === spec.zone), [spec.zone])
  const ids = new Set(v.comparables.map((c) => c.home.id))
  const sx = (a: number) => 30 + ((a - 45) / 95) * (W - 40)
  const sy = (pr: number) => H - 20 - ((pr - 100000) / 420000) * (H - 30)
  return (
    <Card step={2} title={t.compTitle} question={t.compQ}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={t.compAria(v.comparables.length, zone, Math.round(v.comparablesPrice))}>
        <line x1={30} y1={H - 20} x2={W - 6} y2={H - 20} className="axis" />
        <line x1={30} y1={6} x2={30} y2={H - 20} className="axis" />
        {[50, 80, 110, 140].map((a) => (
          <text key={a} x={sx(a)} y={H - 8} className="axis-label" textAnchor="middle">
            {a} m²
          </text>
        ))}
        {[200000, 300000, 400000, 500000].map((pr) => (
          <text key={pr} x={26} y={sy(pr) + 3} className="axis-label" textAnchor="end">
            {pr / 1000}k
          </text>
        ))}
        {zoneRows.map((h) => (
          <circle key={h.id} cx={sx(h.area)} cy={sy(h.price)} r={ids.has(h.id) ? 4 : 2.4} className={ids.has(h.id) ? 'comp-point' : 'obs-point'} />
        ))}
        <line x1={sx(spec.area)} y1={6} x2={sx(spec.area)} y2={H - 20} className="guide" />
        <path
          transform={`translate(${sx(spec.area)}, ${sy(v.price)})`}
          d="M0,-8 L2.4,-2.5 8,-2.5 3.5,1 5,7 0,3.6 -5,7 -3.5,1 -8,-2.5 -2.4,-2.5Z"
          className="star"
        />
      </svg>
      <div className="legend-row">
        <span>
          <i style={{ background: 'var(--border-strong)' }} /> {t.homesIn(zone)}
        </span>
        <span>
          <i style={{ background: 'var(--accent)' }} /> {t.comps}
        </span>
        <span>
          <i style={{ background: 'var(--brand-strong)' }} /> {t.yourHome}
        </span>
      </div>
      <table className="comp-table">
        <thead>
          <tr>
            <th>m²</th>
            <th>{t.thBeds}</th>
            <th>{t.thExtras}</th>
            <th>{t.thDistance}</th>
            <th>{t.thPrice}</th>
          </tr>
        </thead>
        <tbody>
          {v.comparables.map(({ home: h, distance }) => (
            <tr key={h.id}>
              <td>{h.area}</td>
              <td>{h.beds}</td>
              <td>
                {h.renovated ? t.extraR : '·'}
                {h.lift ? t.extraL : '·'}
              </td>
              <td>{num(distance, 2)}</td>
              <td>{keur(h.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="calc">
        <div className="total">
          <dt>{t.compMean(v.comparables.length)}</dt>
          <dd>{euros(Math.round(v.comparablesPrice))}</dd>
        </div>
      </dl>
      <p className="note">{t.distanceNote}</p>
    </Card>
  )
}

function BlendCard({ v, k }: { v: Valuation; k: number }) {
  const t = useT()
  const W = 300
  const H = 120
  const curve = useMemo(() => maeCurve(k), [k])
  const best = curve.reduce((a, b) => (b.mae < a.mae ? b : a))
  const lo = Math.min(...curve.map((c) => c.mae)) * 0.96
  const hi = Math.max(...curve.map((c) => c.mae)) * 1.02
  const sx = (w: number) => 34 + w * (W - 44)
  const sy = (m: number) => H - 20 - ((m - lo) / (hi - lo)) * (H - 30)
  const line = curve.map((c, i) => `${i ? 'L' : 'M'}${sx(c.w).toFixed(1)},${sy(c.mae).toFixed(1)}`).join(' ')
  const mae = testMAE(v.w, k)
  return (
    <Card step={3} title={t.blendTitle} question={t.blendQ}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={t.blendAria(v.w, Math.round(mae))}>
        <line x1={34} y1={H - 20} x2={W - 6} y2={H - 20} className="axis" />
        <line x1={34} y1={6} x2={34} y2={H - 20} className="axis" />
        <text x={sx(0)} y={H - 6} className="axis-label" textAnchor="start">
          {t.onlyComps}
        </text>
        <text x={sx(1)} y={H - 6} className="axis-label" textAnchor="end">
          {t.onlyReg}
        </text>
        {[lo, hi].map((m) => (
          <text key={m} x={30} y={sy(m) + 3} className="axis-label" textAnchor="end">
            {num(m / 1000, 1)}k
          </text>
        ))}
        <line x1={sx(best.w)} y1={6} x2={sx(best.w)} y2={H - 20} className="guide guide-muted" />
        <path d={line} className="line line-accent" />
        <circle cx={sx(v.w)} cy={sy(mae)} r={5.5} className="eq" />
      </svg>
      <div className="legend-row">
        <span>
          <i style={{ background: 'var(--accent)' }} /> {t.unseenError}
        </span>
        <span>
          <i className="dashed" /> {t.best(best.w)}
        </span>
      </div>
      <dl className="calc">
        <div>
          <dt>
            {num(v.w, 2)} × {keur(v.regression)} + {num(1 - v.w, 2)} × {keur(v.comparablesPrice)}
          </dt>
          <dd>{euros(Math.round(v.price))}</dd>
        </div>
        <div>
          <dt>{t.maeAtWeight}</dt>
          <dd>{euros(Math.round(mae))}</dd>
        </div>
        <div className="total">
          <dt>{t.roundedValuation}</dt>
          <dd>{euros(rounded(v.price))}</dd>
        </div>
      </dl>
      <p className="note">{t.blendNote}</p>
    </Card>
  )
}

function ExplainCard({ spec, v }: { spec: HomeSpec; v: Valuation }) {
  const t = useT()
  const parts = explain(spec, v)
  const W = 300
  const ROW = 20
  const H = (parts.length + 2) * ROW + 6
  const steps: { label: string; from: number; to: number; kind: 'base' | 'up' | 'down' | 'total' }[] = []
  let acc = BASELINE
  steps.push({ label: t.average, from: 0, to: BASELINE, kind: 'base' })
  for (const p of parts) {
    steps.push({ label: t.contribution[p.id], from: acc, to: acc + p.value, kind: p.value >= 0 ? 'up' : 'down' })
    acc += p.value
  }
  steps.push({ label: t.yourHome, from: 0, to: acc, kind: 'total' })
  const values = steps.flatMap((s) => (s.kind === 'base' || s.kind === 'total' ? [s.to] : [s.from, s.to]))
  const lo = Math.min(...values) - 25000
  const hi = Math.max(...values) + 15000
  const sx = (x: number) => 86 + ((x - lo) / (hi - lo)) * (W - 150)
  const top = parts.reduce((a, b) => (Math.abs(b.value) > Math.abs(a.value) ? b : a))
  const note = t.explainNote(Math.round(BASELINE), t.contribution[top.id], top.value / BASELINE)
  return (
    <Card step={4} title={t.explainTitle} question={t.explainQ}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={t.explainAria(Math.round(BASELINE), Math.round(acc))}>
        {steps.map((s, i) => {
          const y = 4 + i * ROW
          const x0 = s.kind === 'base' || s.kind === 'total' ? sx(lo) : sx(Math.min(s.from, s.to))
          const x1 = sx(Math.max(s.from, s.to))
          const delta = s.to - s.from
          return (
            <g key={s.label}>
              <text x={80} y={y + 13} className="wf-label" textAnchor="end">
                {s.label}
              </text>
              <rect x={x0} y={y + 3} width={Math.max(1.5, x1 - x0)} height={ROW - 6} rx={2} className={`wf wf-${s.kind}`} />
              <text x={x1 + 4} y={y + 13} className="wf-value">
                {s.kind === 'base' || s.kind === 'total' ? keur(s.to) : `${delta >= 0 ? '+' : '−'}${num(Math.abs(delta) / 1000, 1)}k`}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="note">
        {note[0]}
        <b>{note[1]}</b>
        {note[2]}
      </p>
    </Card>
  )
}

export function AlgoPanel({ spec, valuation, k }: { spec: HomeSpec; valuation: Valuation; k: number }) {
  const t = useT()
  return (
    <section className="panel algo" aria-label={t.algorithms}>
      <h2>{t.howTitle}</h2>
      <p className="muted">
        {spec.area} m² · {spec.beds} {t.beds} · {t.zoneName[spec.zone]}
      </p>
      <RegressionCard v={valuation} />
      <ComparablesCard spec={spec} v={valuation} />
      <BlendCard v={valuation} k={k} />
      <ExplainCard spec={spec} v={valuation} />
    </section>
  )
}
