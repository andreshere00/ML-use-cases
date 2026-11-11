// Regresión lineal por mínimos cuadrados (igual que LinearRegression de scikit-learn) y,
// para enseñar cómo aprende, la misma regresión entrenada con descenso de gradiente.
import { TRAIN, type HomeSpec } from './market'

export const FEATURES = ['m²', 'Dormitorio', 'Zona B', 'Zona C', 'Reformado', 'Ascensor'] as const

export const features = (h: HomeSpec): number[] => [
  h.area,
  h.beds,
  h.zone === 1 ? 1 : 0,
  h.zone === 2 ? 1 : 0,
  h.renovated ? 1 : 0,
  h.lift ? 1 : 0,
]

export interface LinearModel {
  intercept: number
  coefs: number[]
}

export const predict = (model: LinearModel, x: number[]) => x.reduce((acc, v, i) => acc + v * model.coefs[i], model.intercept)

/** Resuelve las ecuaciones normales (XᵀX)·β = Xᵀy por eliminación de Gauss con pivote parcial. */
export function fitOLS(X: number[][], y: number[]): LinearModel {
  const rows = X.map((x) => [1, ...x])
  const p = rows[0].length
  const A = Array.from({ length: p }, (_, i) => [
    ...Array.from({ length: p }, (_, j) => rows.reduce((acc, r) => acc + r[i] * r[j], 0)),
    rows.reduce((acc, r, k) => acc + r[i] * y[k], 0),
  ])
  for (let c = 0; c < p; c++) {
    let pivot = c
    for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[pivot][c])) pivot = r
    ;[A[c], A[pivot]] = [A[pivot], A[c]]
    for (let r = 0; r < p; r++) {
      if (r === c) continue
      const f = A[r][c] / A[c][c]
      for (let k = c; k <= p; k++) A[r][k] -= f * A[c][k]
    }
  }
  const beta = A.map((row, i) => row[p] / row[i])
  return { intercept: beta[0], coefs: beta.slice(1) }
}

const X_TRAIN = TRAIN.map(features)
const Y_TRAIN = TRAIN.map((h) => h.price)

export const MODEL = fitOLS(X_TRAIN, Y_TRAIN)

/** Media de cada variable en entrenamiento: el punto de partida de la explicación. */
export const MEANS = FEATURES.map((_, j) => X_TRAIN.reduce((acc, x) => acc + x[j], 0) / X_TRAIN.length)

/** Predicción media del modelo en entrenamiento (= intercepto + Σ coef·media). */
export const BASELINE = predict(MODEL, MEANS)

export interface GDStep {
  iteration: number
  coefs: number[]
  intercept: number
  mae: number
}

/**
 * Descenso de gradiente sobre variables estandarizadas (tasa 0,02, 300 iteraciones), guardando
 * una foto cada 5 iteraciones con los coeficientes ya devueltos a euros. Es el mismo bucle del notebook.
 */
export function gradientDescent(iterations = 300, lr = 0.02, every = 5): GDStep[] {
  const n = X_TRAIN.length
  const mu = MEANS
  const sd = FEATURES.map((_, j) => Math.sqrt(X_TRAIN.reduce((acc, x) => acc + (x[j] - mu[j]) ** 2, 0) / n))
  const Xs = X_TRAIN.map((x) => x.map((v, j) => (v - mu[j]) / sd[j]))
  const w = FEATURES.map(() => 0)
  let b = Y_TRAIN.reduce((a, v) => a + v, 0) / n
  const history: GDStep[] = []
  for (let it = 0; it <= iterations; it++) {
    const err = Xs.map((x, i) => x.reduce((acc, v, j) => acc + v * w[j], b) - Y_TRAIN[i])
    if (it % every === 0) {
      const coefs = w.map((v, j) => v / sd[j])
      history.push({
        iteration: it,
        coefs,
        intercept: b - coefs.reduce((acc, c, j) => acc + c * mu[j], 0),
        mae: err.reduce((acc, e) => acc + Math.abs(e), 0) / n,
      })
    }
    for (let j = 0; j < w.length; j++) w[j] -= (lr * Xs.reduce((acc, x, i) => acc + x[j] * err[i], 0)) / n
    b -= (lr * err.reduce((a, e) => a + e, 0)) / n
  }
  return history
}

export const GD_HISTORY = gradientDescent()
