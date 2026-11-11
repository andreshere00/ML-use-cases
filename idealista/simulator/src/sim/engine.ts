// El mercado en marcha: cada tick es un día y se publica un anuncio nuevo de una vivienda de prueba
// (el modelo no la ha visto). El AVM la valora al instante y compara su precio con el pedido.
import { TEST, hash, type Home } from './market'
import { daysToSell, priceTag, value, type PriceTag } from './valuation'

export const LAST_DAY = TEST.length

export interface Listing {
  home: Home
  /** Día en que se publica (1 = primer anuncio). */
  day: number
  asking: number
  estimate: number
  tag: PriceTag
  sellDays: number
}

export type ListingStatus = 'new' | 'visits' | 'reserved' | 'sold'

export const STATUS_LABEL: Record<ListingStatus, string> = {
  new: 'Nuevo',
  visits: 'Con visitas',
  reserved: 'Reservado',
  sold: 'Vendido',
}

export function status(l: Listing, day: number): ListingStatus {
  const age = day - l.day
  if (age >= l.sellDays) return 'sold'
  if (age < 2) return 'new'
  return age < l.sellDays * 0.75 ? 'visits' : 'reserved'
}

/** Precio pedido por el vendedor: su precio de referencia con un margen entre −8 % y +14 %. */
export const askingPrice = (h: Home) => Math.round((h.price * (0.92 + 0.22 * hash(h.id, 1))) / 1000) * 1000

export function listingFor(h: Home, day: number, w: number, k: number): Listing {
  const estimate = value(h, w, k).price
  const asking = askingPrice(h)
  return { home: h, day, asking, estimate, tag: priceTag(asking, estimate), sellDays: daysToSell(asking, estimate, hash(h.id, 2)) }
}

/** Anuncios publicados hasta `day`, el más reciente primero, valorados con el modelo actual. */
export function listingsUpTo(day: number, w: number, k: number): Listing[] {
  return TEST.slice(0, day)
    .map((h, i) => listingFor(h, i + 1, w, k))
    .reverse()
}

/** Error medio del AVM frente al precio de referencia en los anuncios publicados hasta ahora. */
export const liveMAE = (listings: Listing[]) =>
  listings.length ? listings.reduce((acc, l) => acc + Math.abs(l.estimate - l.home.price), 0) / listings.length : 0
