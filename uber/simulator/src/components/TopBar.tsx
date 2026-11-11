import { num } from '../format'
import { TICK_MINUTES, clockLabel, type SimState } from '../sim/engine'
import { ZONE_BY_ID } from '../sim/world'
import { ConcertIcon, PauseIcon, PlayIcon, RainIcon, ResetIcon } from './Icons'

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
  const event = p.sim.events.find((e) => p.sim.tick >= e.fromTick && p.sim.tick < e.toTick)
  const eventHere = event?.zoneId === p.eventZoneId
  const minutesLeft = event ? (event.toTick - p.sim.tick) * TICK_MINUTES : 0
  const zoneName = ZONE_BY_ID[p.eventZoneId].name

  return (
    <header className="topbar">
      <div className="brand">
        <strong>Precio dinámico</strong>
        <span>Simulador · caso Uber</span>
      </div>

      <div className="tb-group" role="group" aria-label="Reproducción">
        <span className="tb-label">Reproducción</span>
        <div className="tb-row">
          <button
            className="icon-btn icon-btn-primary"
            onClick={p.onTogglePlay}
            disabled={p.finished}
            aria-label={p.finished ? 'Fin del día' : p.playing ? 'Pausar' : 'Reanudar'}
            title={p.finished ? 'Fin del día' : p.playing ? 'Pausar' : 'Reanudar'}
          >
            {p.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="clock">
            <span className="clock-time">{clockLabel(p.sim.tick)}</span>
            <span className="clock-day">{p.finished ? 'Fin del día' : 'Viernes'}</span>
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

      <div className="tb-group" role="group" aria-label="Escenario">
        <span className="tb-label">Escenario</span>
        <div className="tb-row">
          <button
            className={`chip ${p.sim.rain ? 'on' : ''}`}
            role="switch"
            aria-checked={p.sim.rain}
            onClick={() => p.onRain(!p.sim.rain)}
          >
            <RainIcon />
            Lluvia
            <span className="switch" aria-hidden="true" />
          </button>
          <button
            className={`chip ${eventHere ? 'live' : ''}`}
            onClick={p.onEvent}
            disabled={eventHere}
            title={event && !eventHere ? `Ya hay un concierto en ${ZONE_BY_ID[event.zoneId].name}` : undefined}
          >
            <ConcertIcon />
            {/* Mismo botón y ancho estable: el estado y la cuenta atrás van dentro, sin texto que empuje la barra. */}
            <span aria-live="polite">{eventHere ? `En curso · ${minutesLeft} min` : `Concierto en ${zoneName}`}</span>
          </button>
        </div>
      </div>

      <div className="tb-group" role="group" aria-label="Algoritmo">
        <label className="tb-label" htmlFor="eta">
          Reactividad del precio <span className="symbol">η</span>
        </label>
        <div className="tb-row slider">
          <input
            id="eta"
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={p.sim.eta}
            aria-valuetext={`${num(p.sim.eta, 1)}: ${p.sim.eta < 0.6 ? 'suave' : p.sim.eta > 1.6 ? 'brusca' : 'equilibrada'}`}
            onChange={(e) => p.onEta(Number(e.target.value))}
          />
          <output htmlFor="eta">{num(p.sim.eta, 1)}</output>
        </div>
      </div>

      <button className="btn btn-tertiary reset" onClick={p.onReset}>
        <ResetIcon />
        Reiniciar
      </button>
    </header>
  )
}
