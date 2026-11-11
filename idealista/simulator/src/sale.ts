import { useEffect, useState } from 'react'
import type { HomeSpec } from './sim/market'

/** Anuncio que publica el usuario con su vivienda y el precio que elige. */
export interface MyListing {
  spec: HomeSpec
  estimate: number
  asking: number
  sellDays: number
  visitsPerWeek: number
  salePrice: number
  startedAt: number
}

export type SalePhase = 'published' | 'visits' | 'offers' | 'sold'

/** Cada día del anuncio dura 140 ms en pantalla, entre 4 y 14 segundos en total. */
export const saleDuration = (days: number) => Math.min(14000, Math.max(4000, days * 140))

const SHARE = { published: 0.15, visits: 0.55, offers: 0.3 }

export interface SaleProgress {
  phase: SalePhase
  /** Avance dentro de la fase actual, de 0 a 1. */
  progress: number
  /** Día del anuncio que se está mostrando. */
  day: number
}

export function saleProgress(elapsed: number, l: MyListing): SaleProgress {
  const total = saleDuration(l.sellDays)
  const day = Math.min(l.sellDays, Math.floor((elapsed / total) * l.sellDays))
  let t = elapsed / total
  for (const phase of ['published', 'visits', 'offers'] as const) {
    if (t < SHARE[phase]) return { phase, progress: t / SHARE[phase], day }
    t -= SHARE[phase]
  }
  return { phase: 'sold', progress: 1, day: l.sellDays }
}

/** Devuelve el avance de la venta en curso, actualizado en cada fotograma. */
export function useSaleProgress(listing: MyListing | null): SaleProgress | null {
  const [now, setNow] = useState(() => performance.now())
  useEffect(() => {
    if (!listing) return
    let frame = 0
    const loop = () => {
      const t = performance.now()
      setNow(t)
      if (saleProgress(t - listing.startedAt, listing).phase !== 'sold') frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [listing])
  return listing ? saleProgress(Math.max(0, now - listing.startedAt), listing) : null
}
