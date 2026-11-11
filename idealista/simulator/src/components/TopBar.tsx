import { euros, num } from '../format'
import { LAST_DAY } from '../sim/engine'
import { testMAE } from '../sim/valuation'
import { PauseIcon, PlayIcon, ResetIcon } from './Icons'

interface Props {
  day: number
  playing: boolean
  finished: boolean
  speed: number
  w: number
  k: number
  onTogglePlay: () => void
  onSpeed: (speed: number) => void
  onWeight: (w: number) => void
  onK: (k: number) => void
  onReset: () => void
}

const K_OPTIONS = [3, 6, 12]

export function TopBar(p: Props) {
  const mae = testMAE(p.w, p.k)
  const mix = p.w === 0 ? 'solo comparables' : p.w === 1 ? 'solo regresión' : `${num(p.w * 100)} % regresión`

  return (
    <header className="topbar">
      <div className="brand">
        <strong>
          Valoración <span className="brand-mark">automática</span>
        </strong>
        <span>Simulador · caso idealista</span>
      </div>

      <div className="tb-group" role="group" aria-label="Mercado">
        <span className="tb-label">Mercado</span>
        <div className="tb-row">
          <button
            className="icon-btn icon-btn-primary"
            onClick={p.onTogglePlay}
            disabled={p.finished}
            aria-label={p.finished ? 'Fin de la simulación' : p.playing ? 'Pausar' : 'Reanudar'}
            title={p.finished ? 'Fin de la simulación' : p.playing ? 'Pausar' : 'Reanudar'}
          >
            {p.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="clock">
            <span className="clock-time">Día {p.day}</span>
            <span className="clock-day">{p.finished ? 'Fin del mercado' : `de ${LAST_DAY} · 1 anuncio al día`}</span>
          </div>
          <div className="segmented" role="group" aria-label="Velocidad">
            {[1, 2, 4].map((s) => (
              <button key={s} className={s === p.speed ? 'on' : ''} aria-pressed={s === p.speed} onClick={() => p.onSpeed(s)}>
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-group" role="group" aria-label="Modelo">
        <label className="tb-label" htmlFor="weight">
          Peso de la regresión <span className="symbol">w</span>
        </label>
        <div className="tb-row slider">
          <input
            id="weight"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={p.w}
            aria-valuetext={mix}
            onChange={(e) => p.onWeight(Number(e.target.value))}
          />
          <output htmlFor="weight">{num(p.w, 2)}</output>
        </div>
      </div>

      <div className="tb-group" role="group" aria-label="Comparables">
        <span className="tb-label">
          Comparables <span className="symbol">k</span>
        </span>
        <div className="tb-row">
          <div className="segmented" role="group" aria-label="Número de comparables">
            {K_OPTIONS.map((k) => (
              <button key={k} className={k === p.k ? 'on' : ''} aria-pressed={k === p.k} onClick={() => p.onK(k)}>
                {k}
              </button>
            ))}
          </div>
          <div className="tb-metric" aria-live="polite">
            <b>{euros(Math.round(mae))}</b>
            <span>error medio (MAE)</span>
          </div>
        </div>
      </div>

      <button className="btn btn-tertiary reset" onClick={p.onReset}>
        <ResetIcon />
        Reiniciar
      </button>
    </header>
  )
}
