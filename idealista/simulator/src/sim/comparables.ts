// Valoración por comparables: las k viviendas de entrenamiento más parecidas de la misma zona.
import { TRAIN, type Home, type HomeSpec } from './market'

export const DEFAULT_K = 6

export interface Comparable {
  home: Home
  distance: number
}

/** (Δ m² / 30)² + (Δ dormitorios / 2)² + 0,25 por cada diferencia de reforma o ascensor. */
export function distance(a: HomeSpec, b: HomeSpec): number {
  return (
    ((a.area - b.area) / 30) ** 2 +
    ((a.beds - b.beds) / 2) ** 2 +
    (a.renovated !== b.renovated ? 0.25 : 0) +
    (a.lift !== b.lift ? 0.25 : 0)
  )
}

/** Ordena por distancia y desempata por id, como el script original. */
export function comparables(spec: HomeSpec, k = DEFAULT_K, pool: Home[] = TRAIN): Comparable[] {
  return pool
    .filter((h) => h.zone === spec.zone)
    .map((home) => ({ home, distance: distance(spec, home) }))
    .sort((a, b) => a.distance - b.distance || a.home.id - b.home.id)
    .slice(0, k)
}

export const meanPrice = (list: Comparable[]) => list.reduce((acc, c) => acc + c.home.price, 0) / list.length
