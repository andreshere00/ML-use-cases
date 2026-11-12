import { useState } from 'react'
import { euros, num } from '../format'
import { useLang, useT } from '../i18n'
import { LAST_DAY } from '../sim/engine'
import { testMAE } from '../sim/valuation'
import { GlobeIcon, PauseIcon, PlayIcon, ResetIcon } from './Icons'
import { LanguageDialog } from './LanguageDialog'

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
  const t = useT()
  const { lang } = useLang()
  const [langOpen, setLangOpen] = useState(false)
  const mae = testMAE(p.w, p.k)
  const mix = p.w === 0 ? t.onlyComps : p.w === 1 ? t.onlyReg : t.regShare(p.w)
  const playLabel = p.finished ? t.endSim : p.playing ? t.pause : t.resume

  return (
    <header className="topbar">
      <div className="brand">
        <strong>
          {t.brand[0]}
          <span className="brand-mark">{t.brand[1]}</span>
        </strong>
        <span>{t.brandSub}</span>
      </div>

      <div className="tb-group" role="group" aria-label={t.market}>
        <span className="tb-label">{t.market}</span>
        <div className="tb-row">
          <button
            className="icon-btn icon-btn-primary"
            onClick={p.onTogglePlay}
            disabled={p.finished}
            aria-label={playLabel}
            title={playLabel}
          >
            {p.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="clock">
            <span className="clock-time">{t.day(p.day)}</span>
            <span className="clock-day">{p.finished ? t.marketEnd : t.dayOf(LAST_DAY)}</span>
          </div>
          <div className="segmented" role="group" aria-label={t.speed}>
            {[1, 2, 4].map((s) => (
              <button key={s} className={s === p.speed ? 'on' : ''} aria-pressed={s === p.speed} onClick={() => p.onSpeed(s)}>
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-group" role="group" aria-label={t.model}>
        <label className="tb-label" htmlFor="weight">
          {t.weight} <span className="symbol">w</span>
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

      <div className="tb-group" role="group" aria-label={t.comps}>
        <span className="tb-label">
          {t.comps} <span className="symbol">k</span>
        </span>
        <div className="tb-row">
          <div className="segmented" role="group" aria-label={t.numComps}>
            {K_OPTIONS.map((k) => (
              <button key={k} className={k === p.k ? 'on' : ''} aria-pressed={k === p.k} onClick={() => p.onK(k)}>
                {k}
              </button>
            ))}
          </div>
          <div className="tb-metric" aria-live="polite">
            <b>{euros(Math.round(mae))}</b>
            <span>{t.maeShort}</span>
          </div>
        </div>
      </div>

      <div className="tb-actions">
        <button className="btn btn-tertiary reset" onClick={p.onReset}>
          <ResetIcon />
          {t.reset}
        </button>
        <button
          className="btn btn-tertiary reset lang-btn"
          onClick={() => setLangOpen(true)}
          aria-haspopup="dialog"
          aria-label={`${t.language}: ${lang === 'es' ? 'Español' : 'English'}`}
          title={t.language}
        >
          <GlobeIcon />
          {lang.toUpperCase()}
        </button>
      </div>
      <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </header>
  )
}
