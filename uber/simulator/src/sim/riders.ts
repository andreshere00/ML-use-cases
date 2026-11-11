// Otros pasajeros: solicitudes aleatorias (pero reproducibles) que compiten con la nuestra en cada tick.
// Cada uno decide con la misma elasticidad del algoritmo 3 si acepta el multiplicador, y encuentra
// conductor con más o menos suerte según el ratio demanda/oferta de su zona.
import { ELASTICITY, TICK_MINUTES, type Sample, type SimState } from './engine'
import { PRODUCTS, baseFare, pickupMinutes, tripKm, tripMinutes } from './fare'
import { ZONES, ZONE_BY_ID, ZONE_INDEX, hash } from './world'

export type RideStatus = 'searching' | 'pickup' | 'ontrip' | 'declined' | 'unserved'

export interface OtherRide {
  id: string
  name: string
  pickupId: string
  destId: string
  productName: string
  /** Tick en que pidió el viaje. */
  createdTick: number
  m: number
  price: number
  status: RideStatus
  /** Número aleatorio estable para colocar al pasajero en el mapa. */
  spot: number
}

const NAMES = [
  'Lucía', 'Mateo', 'Sofía', 'Hugo', 'Martina', 'Leo', 'Valeria', 'Daniel', 'Paula', 'Álvaro',
  'Carmen', 'Pablo', 'Elena', 'Javier', 'Irene', 'Marcos', 'Noa', 'Diego', 'Julia', 'Adrián',
]

/** Solicitudes por tick: una por cada ~260 de demanda latente en toda la ciudad. */
const DEMAND_PER_REQUEST = 260
/** Ticks que alguien espera conductor antes de cancelar. */
const MAX_SEARCH = 3
/** Ticks que se muestra un viaje rechazado o sin conductor antes de quitarlo. */
const LINGER = 1
/** Ticks hacia atrás que pueden seguir vivos (búsqueda + recogida + trayecto más largo). */
const HORIZON = 16

const sampleAt = (sim: SimState, zoneId: string, tick: number): Sample | undefined => sim.zones[zoneId][tick]

/** Probabilidad de aceptar un precio: la misma curva log-lineal que la regresión, exp(−β·(m − 1)). */
export const acceptChance = (m: number) => Math.exp(-ELASTICITY.beta * (m - 1))

/** Estado de una solicitud en el tick actual a partir de lo ocurrido en cada tick desde que se pidió. */
function statusAt(sim: SimState, ride: Omit<OtherRide, 'status'>, i: number): RideStatus | null {
  const t = ride.createdTick
  const age = sim.tick - t
  const accepted = hash(t, i, 61) < acceptChance(ride.m)
  if (!accepted) return age <= LINGER ? 'declined' : null

  // Cada tick buscando hay una oportunidad de encontrar conductor: peor cuanto más escasean (R > 1).
  let matchedAt = -1
  for (let a = 0; a < MAX_SEARCH && t + a < sim.tick; a++) {
    const s = sampleAt(sim, ride.pickupId, t + a)
    if (s && hash(t, i, a, 63) < 0.85 / Math.max(1, s.ratio)) {
      matchedAt = t + a + 1
      break
    }
  }
  if (matchedAt < 0) {
    if (age < MAX_SEARCH) return 'searching'
    return age <= MAX_SEARCH + LINGER - 1 ? 'unserved' : null
  }

  const s = sampleAt(sim, ride.pickupId, matchedAt)!
  const product = PRODUCTS.find((p) => p.name === ride.productName)!
  const pickupTicks = Math.min(3, Math.max(1, Math.round(pickupMinutes(s.ratio, sim.rain, product) / TICK_MINUTES)))
  const km = tripKm(ZONE_BY_ID[ride.pickupId], ZONE_BY_ID[ride.destId])
  const rideTicks = Math.max(1, Math.round(tripMinutes(km, sim.rain) / TICK_MINUTES))
  if (sim.tick < matchedAt) return 'searching'
  if (sim.tick < matchedAt + pickupTicks) return 'pickup'
  if (sim.tick < matchedAt + pickupTicks + rideTicks) return 'ontrip'
  return null
}

/** Solicitudes nuevas en el tick `t`: más cuanta más demanda, y en las zonas con más demanda. */
function requestsAt(sim: SimState, t: number): Omit<OtherRide, 'status'>[] {
  const samples = ZONES.map((z) => sampleAt(sim, z.id, t)!)
  const total = samples.reduce((acc, s) => acc + s.latent, 0)
  const count = Math.floor(total / DEMAND_PER_REQUEST + hash(t, 50))
  return Array.from({ length: count }, (_, i) => {
    // Zona de recogida ponderada por la demanda; destino cualquier otra zona.
    let r = hash(t, i, 51) * total
    let zi = 0
    while (zi < ZONES.length - 1 && r > samples[zi].latent) r -= samples[zi++].latent
    const pickup = ZONES[zi]
    const others = ZONES.filter((z) => z.id !== pickup.id)
    const dest = others[Math.floor(hash(t, i, 52) * others.length)]
    const p = hash(t, i, 53)
    const product = PRODUCTS[p < 0.7 ? 0 : p < 0.9 ? 1 : 2]
    const km = tripKm(pickup, dest)
    const m = samples[ZONE_INDEX[pickup.id]].m
    return {
      id: `${t}-${i}`,
      name: NAMES[Math.floor(hash(t, i, 54) * NAMES.length)],
      pickupId: pickup.id,
      destId: dest.id,
      productName: product.name,
      createdTick: t,
      m,
      price: baseFare(product, km, tripMinutes(km, sim.rain)) * m,
      spot: hash(t, i, 55),
    }
  })
}

/** Viajes de otros pasajeros que siguen activos (o acaban de terminar mal) en el tick actual, del más nuevo al más antiguo. */
export function otherRides(sim: SimState): OtherRide[] {
  const rides: OtherRide[] = []
  for (let t = sim.tick; t >= Math.max(0, sim.tick - HORIZON); t--) {
    requestsAt(sim, t).forEach((ride, i) => {
      const status = statusAt(sim, ride, i)
      if (status) rides.push({ ...ride, status })
    })
  }
  return rides
}
