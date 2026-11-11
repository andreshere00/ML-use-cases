// Ciudad sintética: nueve zonas (A–I) con los mismos perfiles que las diapositivas y el notebook.
import { kmeans, type Point } from './kmeans'

export type ZoneKind = 'business' | 'residential' | 'nightlife'

export interface Zone {
  id: string
  name: string
  /** Posición en la cuadrícula 3×3 del mapa. */
  col: number
  row: number
  /** % de la demanda en la hora punta de la mañana. */
  morningPct: number
  /** % de la demanda de madrugada. */
  nightPct: number
  /** Media histórica de solicitudes en 15 min en el pico de su perfil. */
  baseDemand: number
  /** Conductores habituales a precio normal. */
  baseDrivers: number
}

export const ZONES: Zone[] = [
  { id: 'A', name: 'Centro', col: 1, row: 1, morningPct: 48, nightPct: 4, baseDemand: 130, baseDrivers: 110 },
  { id: 'B', name: 'Distrito Financiero', col: 1, row: 0, morningPct: 55, nightPct: 6, baseDemand: 105, baseDrivers: 92 },
  { id: 'C', name: 'Parque Empresarial', col: 1, row: 2, morningPct: 52, nightPct: 3, baseDemand: 80, baseDrivers: 72 },
  { id: 'D', name: 'Barrio Norte', col: 0, row: 0, morningPct: 30, nightPct: 12, baseDemand: 72, baseDrivers: 68 },
  { id: 'E', name: 'Las Huertas', col: 0, row: 1, morningPct: 26, nightPct: 16, baseDemand: 64, baseDrivers: 60 },
  { id: 'F', name: 'Ribera', col: 0, row: 2, morningPct: 34, nightPct: 10, baseDemand: 76, baseDrivers: 70 },
  { id: 'G', name: 'Casco Antiguo', col: 2, row: 0, morningPct: 8, nightPct: 42, baseDemand: 88, baseDrivers: 66 },
  { id: 'H', name: 'El Puerto', col: 2, row: 1, morningPct: 12, nightPct: 48, baseDemand: 98, baseDrivers: 70 },
  { id: 'I', name: 'Mercado', col: 2, row: 2, morningPct: 10, nightPct: 38, baseDemand: 70, baseDrivers: 56 },
]

export const ZONE_BY_ID: Record<string, Zone> = Object.fromEntries(ZONES.map((z) => [z.id, z]))
export const ZONE_INDEX: Record<string, number> = Object.fromEntries(ZONES.map((z, i) => [z.id, i]))

// k-means con los centros iniciales de la diapositiva (A, B e I), mal puestos a propósito.
const POINTS: Point[] = ZONES.map((z) => [z.morningPct, z.nightPct])
export const CLUSTERS = kmeans(POINTS, [POINTS[0], POINTS[1], POINTS[8]])

// El algoritmo solo devuelve grupos numerados; ponerles nombre es una decisión humana:
// el centro con más madrugada es ocio nocturno, el de más hora punta es negocios.
const order = CLUSTERS.centers.map((_, k) => k)
const nightlifeK = [...order].sort((a, b) => CLUSTERS.centers[b][1] - CLUSTERS.centers[a][1])[0]
const businessK = [...order].sort((a, b) => CLUSTERS.centers[b][0] - CLUSTERS.centers[a][0])[0]
export const KIND_OF_CLUSTER: ZoneKind[] = order.map((k) =>
  k === nightlifeK ? 'nightlife' : k === businessK ? 'business' : 'residential',
)
export const KIND_BY_ZONE: Record<string, ZoneKind> = Object.fromEntries(
  ZONES.map((z, i) => [z.id, KIND_OF_CLUSTER[CLUSTERS.assignments[i]]]),
)

export const KIND_LABEL: Record<ZoneKind, string> = {
  business: 'Negocios',
  residential: 'Residencial',
  nightlife: 'Ocio nocturno',
}

// Perfil de demanda de un viernes por tipo de zona: [hora, factor]. Las horas > 24 son de madrugada.
const PROFILES: Record<ZoneKind, [number, number][]> = {
  business: [[16, 0.55], [17, 0.7], [17.75, 0.92], [18, 1], [18.42, 1], [18.75, 0.62], [20, 0.5], [22, 0.36], [24, 0.25], [26, 0.15]],
  residential: [[16, 0.5], [18, 0.7], [19.5, 1], [21, 0.82], [23, 0.45], [26, 0.2]],
  nightlife: [[16, 0.2], [19, 0.35], [21, 0.7], [23, 1], [25, 1.1], [26, 0.9]],
}

export function profile(kind: ZoneKind, hour: number): number {
  const pts = PROFILES[kind]
  if (hour <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    if (hour <= pts[i][0]) {
      const [h0, v0] = pts[i - 1]
      const [h1, v1] = pts[i]
      return v0 + ((v1 - v0) * (hour - h0)) / (h1 - h0)
    }
  }
  return pts[pts.length - 1][1]
}

/** Ruido determinista en [0, 1) a partir de enteros, para que la simulación sea reproducible. */
export function hash(...values: number[]): number {
  let h = 2166136261
  for (const v of values) {
    h ^= Math.round(v * 1000)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 13
  h = Math.imul(h, 0x5bd1e995)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}
