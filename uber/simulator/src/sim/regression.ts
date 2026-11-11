// Algoritmo 3 · Regresión log-lineal de la demanda frente al precio y equilibrio por bisección.

/** Observaciones sintéticas: [multiplicador, % de la demanda base que se mantiene]. */
export const OBSERVATIONS: [number, number][] = [
  [1.0, 100],
  [1.2, 92],
  [1.5, 79],
  [1.8, 68],
  [2.0, 61],
  [2.5, 47],
]

export interface ElasticityFit {
  beta: number
  intercept: number
  r2: number
}

/** Mínimos cuadrados sobre ln(demanda) = a − β·(m − 1). */
export function fitElasticity(observations: [number, number][] = OBSERVATIONS): ElasticityFit {
  const xs = observations.map(([m]) => m - 1)
  const ys = observations.map(([, pct]) => Math.log(pct))
  const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length
  const mx = mean(xs)
  const my = mean(ys)
  const sxy = xs.reduce((acc, x, i) => acc + (x - mx) * (ys[i] - my), 0)
  const sxx = xs.reduce((acc, x) => acc + (x - mx) ** 2, 0)
  const slope = sxy / sxx
  const intercept = my - slope * mx
  const ssRes = ys.reduce((acc, y, i) => acc + (y - (intercept + slope * xs[i])) ** 2, 0)
  const ssTot = ys.reduce((acc, y) => acc + (y - my) ** 2, 0)
  return { beta: -slope, intercept, r2: 1 - ssRes / ssTot }
}

export const demandAt = (base: number, beta: number, m: number) => base * Math.exp(-beta * (m - 1))
export const supplyAt = (drivers: number, sensitivity: number, m: number) =>
  drivers * (1 + sensitivity * (m - 1))

/** Multiplicador m* donde demanda(m) = oferta(m). Si no hay escasez, precio normal. */
export function equilibrium(base: number, drivers: number, beta: number, sensitivity: number): number {
  let lo = 1
  let hi = 4
  if (demandAt(base, beta, lo) <= supplyAt(drivers, sensitivity, lo)) return 1
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (demandAt(base, beta, mid) > supplyAt(drivers, sensitivity, mid)) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}
