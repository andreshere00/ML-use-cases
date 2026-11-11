// Motor de simulación: encadena los cuatro algoritmos en cada tick de 5 minutos.
import { forecastDemand, weightedBase, type Forecast } from './forecast'
import { loopStep } from './pricing'
import { equilibrium, fitElasticity } from './regression'
import { KIND_BY_ZONE, ZONES, ZONE_INDEX, hash, profile, type Zone } from './world'

export const TICK_MINUTES = 5
/** La simulación empieza un viernes a las 17:30 y termina a las 02:00. */
export const START_MINUTE = 17 * 60 + 30
export const LAST_TICK = (26 * 60 - START_MINUTE) / TICK_MINUTES

/** Últimos 4 viernes respecto a la media histórica (120, 132, 128 y 140 sobre 130). */
export const WEEK_FACTORS = [120, 132, 128, 140].map((v) => v / 130)
/** Este viernes hay un 13 % más de demanda de lo habitual: el histórico no lo sabe. */
const THIS_WEEK = 1.134
export const RAIN_EFFECT = 1.18
export const EVENT_EFFECT = 1.7
export const EVENT_TICKS = 6
export const SUPPLY_SENSITIVITY = 0.6
export const DRIVER_SPEED = 0.5
export const DEFAULT_ETA = 0.8

export const ELASTICITY = fitElasticity()

export interface SimEvent {
  zoneId: string
  fromTick: number
  toTick: number
}

export interface Sample {
  tick: number
  /** Multiplicador vigente. */
  m: number
  drivers: number
  /** Demanda real a precio normal (lo que el pronóstico intenta acertar). */
  latent: number
  /** Demanda tras el efecto del precio. */
  demand: number
  ratio: number
  forecast: Forecast
  /** Multiplicador de equilibrio estimado por la regresión. */
  mStar: number
  nextM: number
  nextDrivers: number
}

export interface SimState {
  tick: number
  rain: boolean
  eta: number
  events: SimEvent[]
  /** Historial de muestras por zona; la última es el estado actual. */
  zones: Record<string, Sample[]>
}

export const hourOf = (tick: number) => (START_MINUTE + tick * TICK_MINUTES) / 60

export function clockLabel(tick: number): string {
  const total = (START_MINUTE + tick * TICK_MINUTES) % (24 * 60)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const hasEvent = (events: SimEvent[], zoneId: string, tick: number) =>
  events.some((e) => e.zoneId === zoneId && tick >= e.fromTick && tick < e.toTick)

/** Ticks de 17:55 y 18:00: sin volatilidad extra para reproducir el ejemplo de la diapositiva. */
const ANCHOR_TICKS = [5, 6]
const HISTORY_VOLATILITY = 0.24
const LIVE_VOLATILITY = 0.2
const SPIKE_CHANCE = 0.1
const SPIKE_SIZE = 0.3

/** Ruido determinista en [−amp/2, amp/2], con una parte lenta (tendencia de varios ticks) y otra rápida. */
function wobble(amp: number, ...seed: number[]): number {
  const tick = seed[1]
  const slow = (a: number) => hash(seed[0], Math.floor(a / 4), ...seed.slice(2), 31) - 0.5
  const t = (tick % 4) / 4
  const trend = slow(tick) * (1 - t) + slow(tick + 4) * t
  return amp * (0.6 * trend + 0.4 * (hash(...seed, 37) - 0.5))
}

const historyAt = (zone: Zone, tick: number) => {
  const level = zone.baseDemand * profile(KIND_BY_ZONE[zone.id], hourOf(tick))
  const zi = ZONE_INDEX[zone.id]
  const calm = ANCHOR_TICKS.includes(tick)
  return WEEK_FACTORS.map((f, w) => level * f * (calm ? 1 : 1 + wobble(HISTORY_VOLATILITY, zi, tick, w)))
}

/** Escala fija de demanda por zona (pico de toda la tarde con lluvia) para que las gráficas comparen entre ticks. */
export const DEMAND_SCALE: Record<string, number> = Object.fromEntries(
  ZONES.map((z) => {
    let peak = 1
    for (let t = 0; t <= LAST_TICK; t++) peak = Math.max(peak, ...historyAt(z, t))
    return [z.id, peak * RAIN_EFFECT * 1.25]
  }),
)

function latentAt(zone: Zone, tick: number, rain: boolean, events: SimEvent[]): number {
  const zi = ZONE_INDEX[zone.id]
  // Demanda en vivo: oscilaciones y algún pico suelto que el histórico no puede prever.
  const spike = hash(zi, tick, 41) < SPIKE_CHANCE ? 1 + SPIKE_SIZE * hash(zi, tick, 43) : 1
  const noise = ANCHOR_TICKS.includes(tick)
    ? 1 + (hash(zi, tick) - 0.5) * 0.04
    : (1 + wobble(LIVE_VOLATILITY, zi, tick, 9)) * spike
  return (
    zone.baseDemand *
    profile(KIND_BY_ZONE[zone.id], hourOf(tick)) *
    THIS_WEEK *
    (rain ? RAIN_EFFECT : 1) *
    (hasEvent(events, zone.id, tick) ? EVENT_EFFECT : 1) *
    noise
  )
}

function sample(zone: Zone, state: Omit<SimState, 'zones'>, m: number, drivers: number): Sample {
  const { tick, rain, events, eta } = state
  const rainEffect = rain ? RAIN_EFFECT : 1
  // 1 · Series temporales: histórico ponderado, lluvia y corrección con lo visto en los últimos 5 min.
  const expectedBefore = weightedBase(historyAt(zone, tick - 1)) * rainEffect
  const deviation = latentAt(zone, tick - 1, rain, events) / expectedBefore - 1
  const forecast = forecastDemand(historyAt(zone, tick), rainEffect, deviation)
  // 3 · Regresión: multiplicador de equilibrio para la demanda pronosticada.
  const mStar = equilibrium(forecast.nowcast, zone.baseDrivers, ELASTICITY.beta, SUPPLY_SENSITIVITY)
  // 4 · Bucle: lo que ocurre de verdad corrige el precio para el siguiente tick.
  const latent = latentAt(zone, tick, rain, events)
  const loop = loopStep({
    m,
    drivers,
    baseDemand: latent,
    baseDrivers: zone.baseDrivers,
    beta: ELASTICITY.beta,
    eta,
    supplySensitivity: SUPPLY_SENSITIVITY,
    driverSpeed: DRIVER_SPEED,
  })
  return { tick, m, drivers, latent, forecast, mStar, ...loop }
}

export function initSim(rain = true, eta = DEFAULT_ETA): SimState {
  const base = { tick: 0, rain, eta, events: [] as SimEvent[] }
  return {
    ...base,
    zones: Object.fromEntries(ZONES.map((z) => [z.id, [sample(z, base, 1, z.baseDrivers)]])),
  }
}

export function stepSim(state: SimState): SimState {
  if (state.tick >= LAST_TICK) return state
  const base = { tick: state.tick + 1, rain: state.rain, eta: state.eta, events: state.events }
  return {
    ...base,
    zones: Object.fromEntries(
      ZONES.map((z) => {
        const history = state.zones[z.id]
        const last = history[history.length - 1]
        return [z.id, [...history, sample(z, base, last.nextM, last.nextDrivers)]]
      }),
    ),
  }
}

/** Recalcula el tick actual cuando cambian la lluvia, η o los eventos, sin avanzar el reloj. */
export function refreshSim(state: SimState, patch: Partial<Pick<SimState, 'rain' | 'eta' | 'events'>>): SimState {
  const base = { tick: state.tick, rain: state.rain, eta: state.eta, events: state.events, ...patch }
  return {
    ...base,
    zones: Object.fromEntries(
      ZONES.map((z) => {
        const history = state.zones[z.id]
        const last = history[history.length - 1]
        return [z.id, [...history.slice(0, -1), sample(z, base, last.m, last.drivers)]]
      }),
    ),
  }
}

export const current = (state: SimState, zoneId: string): Sample => {
  const history = state.zones[zoneId]
  return history[history.length - 1]
}
