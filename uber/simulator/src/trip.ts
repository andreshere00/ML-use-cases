import { useEffect, useState } from 'react'

export interface Trip {
  pickupId: string
  destId: string
  productName: string
  price: number
  m: number
  waitMinutes: number
  tripMinutes: number
  startedAt: number
}

export type TripPhase = 'searching' | 'pickup' | 'ontrip' | 'done'

const SEARCH_MS = 2000
const PICKUP_MS = 3500
const RIDE_MS = 6000

export interface TripProgress {
  phase: TripPhase
  /** Avance dentro de la fase actual, de 0 a 1. */
  progress: number
}

export function tripProgress(elapsed: number): TripProgress {
  if (elapsed < SEARCH_MS) return { phase: 'searching', progress: elapsed / SEARCH_MS }
  if (elapsed < SEARCH_MS + PICKUP_MS) return { phase: 'pickup', progress: (elapsed - SEARCH_MS) / PICKUP_MS }
  if (elapsed < SEARCH_MS + PICKUP_MS + RIDE_MS)
    return { phase: 'ontrip', progress: (elapsed - SEARCH_MS - PICKUP_MS) / RIDE_MS }
  return { phase: 'done', progress: 1 }
}

/** Devuelve el avance del viaje en curso, actualizado en cada fotograma. */
export function useTripProgress(trip: Trip | null): TripProgress | null {
  const [now, setNow] = useState(() => performance.now())
  useEffect(() => {
    if (!trip) return
    let frame = 0
    const loop = () => {
      const t = performance.now()
      setNow(t)
      if (tripProgress(t - trip.startedAt).phase !== 'done') frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [trip])
  return trip ? tripProgress(Math.max(0, now - trip.startedAt)) : null
}
