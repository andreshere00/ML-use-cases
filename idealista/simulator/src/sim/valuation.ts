// Mezcla regresión + comparables, error con datos no vistos y explicación aditiva del precio.
import { comparables, meanPrice, type Comparable } from './comparables'
import { TEST, type HomeSpec } from './market'
import { BASELINE, FEATURES, MEANS, MODEL, features, predict } from './regression'

export interface Valuation {
  regression: number
  comparables: Comparable[]
  comparablesPrice: number
  /** Peso de la regresión en la mezcla (0 = solo comparables, 1 = solo regresión). */
  w: number
  price: number
}

export function value(spec: HomeSpec, w: number, k: number): Valuation {
  const regression = predict(MODEL, features(spec))
  const comps = comparables(spec, k)
  const comparablesPrice = meanPrice(comps)
  return { regression, comparables: comps, comparablesPrice, w, price: w * regression + (1 - w) * comparablesPrice }
}

/** Precio redondeado a 1.000 €, como se muestra al usuario. */
export const rounded = (price: number) => Math.round(price / 1000) * 1000

const REG_TEST = TEST.map((h) => predict(MODEL, features(h)))
const compCache = new Map<number, number[]>()

/** Predicción por comparables de cada vivienda de prueba (se calcula una vez por k). */
export function compTest(k: number): number[] {
  let preds = compCache.get(k)
  if (!preds) {
    preds = TEST.map((h) => meanPrice(comparables(h, k)))
    compCache.set(k, preds)
  }
  return preds
}

export function testMAE(w: number, k: number): number {
  const comps = compTest(k)
  return TEST.reduce((acc, h, i) => acc + Math.abs(w * REG_TEST[i] + (1 - w) * comps[i] - h.price), 0) / TEST.length
}

export interface CurvePoint {
  w: number
  mae: number
}

/** MAE en prueba para cada peso de 0 a 1 en pasos de 0,01. */
export function maeCurve(k: number): CurvePoint[] {
  return Array.from({ length: 101 }, (_, i) => ({ w: i / 100, mae: testMAE(i / 100, k) }))
}

export interface Contribution {
  label: string
  value: number
}

/**
 * Cascada exacta sin SHAP: línea base + w·coef·(x − media) por variable (las dos zonas juntas)
 * + (1 − w)·(comparables − línea base). La suma reconstruye la valoración sin redondear.
 */
export function explain(spec: HomeSpec, v: Valuation): Contribution[] {
  const x = features(spec)
  const term = (j: number) => v.w * MODEL.coefs[j] * (x[j] - MEANS[j])
  return [
    { label: FEATURES[0], value: term(0) },
    { label: 'Dormitorios', value: term(1) },
    { label: 'Zona', value: term(2) + term(3) },
    { label: FEATURES[4], value: term(4) },
    { label: FEATURES[5], value: term(5) },
    { label: 'Comparables', value: (1 - v.w) * (v.comparablesPrice - BASELINE) },
  ]
}

export type PriceTag = 'good' | 'fair' | 'high'

export const TAG_LABEL: Record<PriceTag, string> = {
  good: 'Buen precio',
  fair: 'Precio ajustado',
  high: 'Precio alto',
}

/** Compara el precio pedido con la valoración: ±5 % se considera ajustado. */
export function priceTag(asking: number, estimate: number): PriceTag {
  const r = asking / estimate
  return r < 0.95 ? 'good' : r > 1.05 ? 'high' : 'fair'
}

/**
 * Días hasta venderse (modelo didáctico): unas dos semanas a precio de valoración y el doble por
 * cada ~12 % de sobreprecio. `jitter` en [0, 1) añade variedad entre anuncios.
 */
export function daysToSell(asking: number, estimate: number, jitter = 0.5): number {
  const days = 14 * Math.exp(6 * (asking / estimate - 1)) * (0.75 + 0.5 * jitter)
  return Math.round(Math.min(120, Math.max(3, days)))
}

/** Visitas por semana: suben si el precio está por debajo de la valoración. */
export const weeklyVisits = (asking: number, estimate: number) => Math.max(1, Math.round(18 * Math.exp(-5 * (asking / estimate - 1))))

/** Precio de cierre: por encima de un 3 % de sobreprecio se negocia parte de la diferencia. */
export function salePrice(asking: number, estimate: number): number {
  const over = asking / estimate - 1.03
  return over > 0 ? rounded(asking - over * estimate * 0.6) : asking
}
