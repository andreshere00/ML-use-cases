// Mercado sintético del caso (semilla 42): 360 viviendas de entrenamiento y 120 de prueba.
// Lo exporta tools/generate-market.py con el mismo código que el notebook 01.
import data from '../data/market.json'

export interface Home {
  id: number
  area: number
  beds: number
  /** 0 = Zona A, 1 = Zona B, 2 = Zona C. */
  zone: number
  renovated: boolean
  lift: boolean
  /** Precio de referencia sintético. */
  price: number
}

/** Lo que el usuario describe de su vivienda: todo menos el precio, que es lo que queremos estimar. */
export type HomeSpec = Omit<Home, 'id' | 'price'>

const toHome = ([id, area, beds, zone, renovated, lift, price]: number[]): Home => ({
  id,
  area,
  beds,
  zone,
  renovated: renovated === 1,
  lift: lift === 1,
  price,
})

export const TRAIN: Home[] = data.train.map(toHome)
export const TEST: Home[] = data.test.map(toHome)

export interface Zone {
  id: number
  code: string
  name: string
  description: string
}

/** Zonas ficticias: no se corresponden con barrios reales. */
export const ZONES: Zone[] = [
  { id: 0, code: 'A', name: 'Zona A', description: 'Periferia' },
  { id: 1, code: 'B', name: 'Zona B', description: 'Ensanche' },
  { id: 2, code: 'C', name: 'Zona C', description: 'Centro histórico' },
]

/** Fórmula con la que se generó el mercado. El modelo no la conoce: tiene que descubrirla. */
export const TRUE_COEFS = { intercept: 20000, area: 2000, beds: 12000, zoneB: 60000, zoneC: 120000, renovated: 25000, lift: 15000 }

/** Precio medio por m² de cada zona en los datos de entrenamiento. */
export const ZONE_PRICE_M2 = ZONES.map((z) => {
  const rows = TRAIN.filter((h) => h.zone === z.id)
  return rows.reduce((acc, h) => acc + h.price / h.area, 0) / rows.length
})

/** Pseudoaleatorio determinista en [0, 1): mismas posiciones y anuncios en cada carga. */
export function hash(a: number, b = 0): number {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35)
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d)
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
