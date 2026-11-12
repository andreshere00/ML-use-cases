import { useState } from 'react'
import { num } from '../format'
import { useI18n } from '../i18n'
import { TICK_MINUTES, clockLabel, type SimState } from '../sim/engine'
import { ZONE_BY_ID } from '../sim/world'
import { ConcertIcon, GlobeIcon, PauseIcon, PlayIcon, RainIcon, ResetIcon } from './Icons'
import { LanguageDialog } from './LanguageDialog'

interface Props {
  sim: SimState
  playing: boolean
  finished: boolean
  speed: number
  eventZoneId: string
  onTogglePlay: () => void
  onSpeed: (speed: number) => void
  onRain: (value: boolean) => void
  onEta: (value: number) => void
  onEvent: () => void
  onReset: () => void
}

export function TopBar(p: Props) {
  const { lang, t } = useI18n()
  const [langOpen, setLangOpen] = useState(false)
  const event = p.sim.events.find((e) => p.sim.tick >= e.fromTick && p.sim.tick < e.toTick)
  const eventHere = event?.zoneId === p.eventZoneId
  const minutesLeft = event ? (event.toTick - p.sim.tick) * TICK_MINUTES : 0
  const zoneName = ZONE_BY_ID[p.eventZoneId].name

  return (
    <header className="topbar">
      <div className="brand">
        <strong>{t.top.brand}</strong>
        <span>{t.top.subtitle}</span>
      </div>

      <div className="tb-group" role="group" aria-label={t.top.playback}>
        <span className="tb-label">{t.top.playback}</span>
        <div className="tb-row">
          <button
            className="icon-btn icon-btn-primary"
            onClick={p.onTogglePlay}
            disabled={p.finished}
            aria-label={p.finished ? t.top.endOfDay : p.playing ? t.top.pause : t.top.resume}
            title={p.finished ? t.top.endOfDay : p.playing ? t.top.pause : t.top.resume}
          >
            {p.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="clock">
            <span className="clock-time">{clockLabel(p.sim.tick)}</span>
            <span className="clock-day">{p.finished ? t.top.endOfDay : t.top.friday}</span>
          </div>
          <div className="segmented" role="group" aria-label={t.top.speed}>
            {[1, 2, 4].map((s) => (
              <button key={s} className={s === p.speed ? 'on' : ''} aria-pressed={s === p.speed} onClick={() => p.onSpeed(s)}>
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-group" role="group" aria-label={t.top.scenario}>
        <span className="tb-label">{t.top.scenario}</span>
        <div className="tb-row">
          <button
            className={`chip ${p.sim.rain ? 'on' : ''}`}
            role="switch"
            aria-checked={p.sim.rain}
            onClick={() => p.onRain(!p.sim.rain)}
          >
            <RainIcon />
            {t.top.rain}
            <span className="switch" aria-hidden="true" />
          </button>
          <button
            className={`chip ${eventHere ? 'live' : ''}`}
            onClick={p.onEvent}
            disabled={eventHere}
            title={event && !eventHere ? t.top.concertElsewhere(ZONE_BY_ID[event.zoneId].name) : undefined}
          >
            <ConcertIcon />
            {/* Mismo botón y ancho estable: el estado y la cuenta atrás van dentro, sin texto que empuje la barra. */}
            <span aria-live="polite">{eventHere ? t.top.concertLive(minutesLeft) : t.top.concertIn(zoneName)}</span>
          </button>
        </div>
      </div>

      <div className="tb-group" role="group" aria-label={t.top.algorithm}>
        <label className="tb-label" htmlFor="eta">
          {t.top.reactivity} <span className="symbol">η</span>
        </label>
        <div className="tb-row slider">
          <input
            id="eta"
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={p.sim.eta}
            aria-valuetext={`${num(p.sim.eta, 1)}: ${p.sim.eta < 0.6 ? t.top.etaSoft : p.sim.eta > 1.6 ? t.top.etaHarsh : t.top.etaBalanced}`}
            onChange={(e) => p.onEta(Number(e.target.value))}
          />
          <output htmlFor="eta">{num(p.sim.eta, 1)}</output>
        </div>
      </div>

      <div className="tb-actions">
        <button
          className="btn btn-tertiary reset"
          onClick={() => setLangOpen(true)}
          aria-haspopup="dialog"
          aria-label={`${t.language.button}: ${lang === 'es' ? 'Español' : 'English'}`}
          title={t.language.button}
        >
          <GlobeIcon />
          {lang.toUpperCase()}
        </button>
        <button className="btn btn-tertiary reset" onClick={p.onReset}>
          <ResetIcon />
          {t.top.reset}
        </button>
      </div>
      <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </header>
  )
}
