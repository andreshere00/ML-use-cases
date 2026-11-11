// Algoritmo 1 · Series temporales: media ponderada estacional + contexto + corrección en vivo.

/** Pesos de los últimos 4 viernes, del más antiguo al más reciente. */
export const WEIGHTS = [0.1, 0.2, 0.3, 0.4]

export interface Forecast {
  /** Solicitudes a esa hora en los últimos 4 viernes. */
  history: number[]
  /** Media ponderada del histórico. */
  base: number
  /** Multiplicador de contexto aplicado (1 si no llueve). */
  rainEffect: number
  withRain: number
  /** Desviación observada en vivo frente a lo esperado (0,11 = +11 %). */
  deviation: number
  /** Pronóstico final: se corrige la mitad de la desviación. */
  nowcast: number
}

export function weightedBase(history: number[], weights: number[] = WEIGHTS): number {
  return history.reduce((acc, v, i) => acc + v * weights[i], 0)
}

/** Desviación entre lo observado en 5 min y lo esperado (un tercio del pronóstico de 15 min). */
export function liveDeviation(observed5min: number, expected15min: number): number {
  return observed5min / (expected15min / 3) - 1
}

export function forecastDemand(history: number[], rainEffect: number, deviation: number): Forecast {
  const base = weightedBase(history)
  const withRain = base * rainEffect
  return { history, base, rainEffect, withRain, deviation, nowcast: withRain * (1 + deviation / 2) }
}
