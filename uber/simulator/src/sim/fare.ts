// Tarifas ficticias: tarifa base por distancia y tiempo, multiplicada por el precio dinámico.
import type { Zone } from './world'

export interface Product {
  id: string
  name: string
  description: string
  seats: number
  factor: number
}

export const PRODUCTS: Product[] = [
  { id: 'x', name: 'UberX', description: 'Viajes económicos del día a día', seats: 4, factor: 1 },
  { id: 'comfort', name: 'Comfort', description: 'Coches nuevos con más espacio', seats: 4, factor: 1.3 },
  { id: 'black', name: 'Black', description: 'Viajes prémium en coches de gama alta', seats: 4, factor: 1.9 },
]

export function tripKm(from: Zone, to: Zone): number {
  return 1.6 + 2.4 * (Math.abs(from.col - to.col) + Math.abs(from.row - to.row))
}

export function tripMinutes(km: number, rain: boolean): number {
  return Math.round(km * 2.6 * (rain ? 1.2 : 1))
}

export function baseFare(product: Product, km: number, minutes: number): number {
  return Math.max(5, 2.5 + 1.25 * km + 0.2 * minutes) * product.factor
}

/** Espera estimada: crece cuando faltan conductores (R > 1). */
export function pickupMinutes(ratio: number, rain: boolean, product: Product): number {
  const scarcity = Math.max(1, ratio) ** 2
  return Math.min(25, Math.round(3 * scarcity + (rain ? 1 : 0) + (product.factor - 1) * 3))
}
