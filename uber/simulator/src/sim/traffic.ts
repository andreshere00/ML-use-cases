// Tráfico del mapa: dónde está cada coche en cada tick y qué conductor libre está más cerca de un pasajero.
import { current, type SimState } from './engine'
import { PRODUCTS, type Product } from './fare'
import { ZONES, ZONE_INDEX, hash, type Zone } from './world'

/** Lado de una zona en unidades del mapa (una zona son 2,4 km, como en `tripKm`). */
export const Z = 220
export const STREETS = [55, 110, 165]
/** Cada coche del mapa representa unos 9 conductores. */
export const PER_DOT = 9
const KM_PER_UNIT = 2.4 / Z

/** Desplazamiento lateral del carril: se circula por la derecha, así los sentidos opuestos no se cruzan. */
const LANE_OFFSET = 5.5

export type CarSpeed = 'fast' | 'medium' | 'slow'

export interface CarState {
  key: string
  /** Identidad del coche entre ticks (la `key` cambia al dar la vuelta). */
  id: string
  /** Semilla numérica del coche para sorteos reproducibles. */
  seed: number
  pos: [number, number]
  angle: number
  speed: CarSpeed
  horizontal: boolean
  /** Producto que ofrece el conductor: UberX, Comfort o Black. */
  productId: string
  /** Ha dado la vuelta en este tick: entra deslizándose desde el borde en vez de aparecer de golpe. */
  enter?: number
  /** Copia que sale por el borde y se desvanece mientras la nueva entra por el otro lado. */
  exit?: boolean
}

/** Huecos de espera: el centro de cada manzana, lejos de los cruces. */
export const SLOTS = [27.5, 82.5, 137.5, 192.5]
export const BLOCK = 55

interface Lane {
  street: number
  horizontal: boolean
  dir: 1 | -1
  speed: CarSpeed
}

/** Manzanas que avanza cada velocidad por cada fase verde: 2, 1 o 1 de cada 2. */
const advance = (speed: CarSpeed, greens: number) =>
  speed === 'fast' ? 2 * greens : speed === 'medium' ? greens : Math.floor(greens / 2)

/**
 * Velocidad de una calle entera (todas las zonas de esa fila o columna comparten carril),
 * así los coches que cruzan de una zona a otra nunca alcanzan a los de la zona vecina.
 */
function laneSpeed(line: number, street: number, horizontal: boolean, dir: number): CarSpeed {
  const r = hash(line, street, horizontal ? 1 : 2, dir, 8)
  return r < 0.3 ? 'fast' : r < 0.7 ? 'medium' : 'slow'
}

/** Los 12 carriles de una zona (3 calles × 2 orientaciones × 2 sentidos), en un orden propio de cada zona. */
const ZONE_LANES: Lane[][] = ZONES.map((zone, zi) => {
  const lanes: Lane[] = []
  for (const street of STREETS)
    for (const horizontal of [true, false])
      for (const dir of [1, -1] as const)
        lanes.push({ street, horizontal, dir, speed: laneSpeed(horizontal ? zone.row : zone.col, street, horizontal, dir) })
  return lanes
    .map((lane, k) => ({ lane, order: hash(zi, k, 6) }))
    .sort((a, b) => a.order - b.order)
    .map((x) => x.lane)
})

/** Mezcla de la flota: 70 % UberX, 20 % Comfort y 10 % Black, fija para cada coche. */
function carProduct(zi: number, laneIndex: number, k: number): string {
  const r = hash(k, laneIndex, zi, 19)
  return r < 0.7 ? 'x' : r < 0.9 ? 'comfort' : 'black'
}

/** Fases verdes acumuladas: las calles horizontales avanzan en los ticks impares y las verticales en los pares. */
const greens = (horizontal: boolean, tick: number) => (horizontal ? Math.floor((tick + 1) / 2) : Math.floor(tick / 2))

/**
 * Coloca los `count` coches de una zona con un ciclo de semáforo: mientras una orientación avanza, la otra
 * espera en mitad de la manzana, fuera del cruce. Cada carril tiene su velocidad (rápida: 2 manzanas por
 * verde; media: 1; lenta: 1 de cada 2 verdes) y sus coches avanzan juntos, así que no se alcanzan.
 */
export function zoneCars(zone: Zone, count: number, tick: number): CarState[] {
  const zi = ZONE_INDEX[zone.id]
  const lanes = ZONE_LANES[zi]
  const n = Math.min(count, lanes.length * SLOTS.length)
  const cars: CarState[] = []

  for (let i = 0; i < n; i++) {
    const laneIndex = i % lanes.length
    const lane = lanes[laneIndex]
    const k = Math.floor(i / lanes.length)
    // Coches del mismo carril en huecos consecutivos, con un desfase propio del carril.
    // Al aparecer o desaparecer un coche, los demás no se recolocan.
    const start = Math.floor(hash(zi, laneIndex, 7) * SLOTS.length) + k
    const step = start + advance(lane.speed, greens(lane.horizontal, tick))
    const prev = start + advance(lane.speed, greens(lane.horizontal, tick - 1))
    const lap = Math.floor(step / SLOTS.length)
    const prevLap = Math.floor(prev / SLOTS.length)

    // `index` puede salirse de 0..3: es un hueco virtual en la zona vecina (para entrar o salir por el borde).
    const place = (index: number) => {
      const along = lane.dir === 1 ? SLOTS[0] + index * BLOCK : Z - SLOTS[0] - index * BLOCK
      // Se circula por la derecha: hacia la derecha → carril de abajo; hacia abajo → carril de la izquierda.
      const side = lane.horizontal ? lane.dir * LANE_OFFSET : -lane.dir * LANE_OFFSET
      const pos: [number, number] = lane.horizontal
        ? [zone.col * Z + along, zone.row * Z + lane.street + side]
        : [zone.col * Z + lane.street + side, zone.row * Z + along]
      return pos
    }
    const angle = lane.horizontal ? (lane.dir === 1 ? 0 : 180) : lane.dir === 1 ? 90 : -90
    const id = `c-${zone.id}-${laneIndex}-${k}`
    const wrapped = lap > prevLap
    const common = { id, seed: zi * 1000 + laneIndex * 10 + k, angle, speed: lane.speed, horizontal: lane.horizontal, productId: carProduct(zi, laneIndex, k) }

    cars.push({
      ...common,
      key: `${id}-${lap}`,
      pos: place(step - lap * SLOTS.length),
      enter: wrapped ? (step - prev) * BLOCK : undefined,
    })
    // El coche que acaba de dar la vuelta sigue recto hasta salir por el borde y se desvanece.
    if (wrapped) cars.push({ ...common, key: `${id}-${prevLap}`, pos: place(step - prevLap * SLOTS.length), exit: true })
  }
  return cars
}

/** Todos los coches de la ciudad en este tick, con la zona en la que circulan. */
export function cityCars(sim: SimState): (CarState & { zoneId: string })[] {
  return ZONES.flatMap((zone) =>
    zoneCars(zone, Math.round(current(sim, zone.id).drivers / PER_DOT), sim.tick).map((car) => ({ ...car, zoneId: zone.id })),
  )
}

/** Punto de recogida: el cruce central de la zona. */
export const pickupPoint = (zone: Zone): [number, number] => [zone.col * Z + Z / 2, zone.row * Z + Z / 2]

/** Parte de la flota libre cuando sobran conductores: el resto ya lleva a alguien o vuelve de un viaje. */
const FREE_SHARE = 0.55
/** En hora punta se circula a unos 15 km/h por el centro: 4 minutos por kilómetro. */
const MIN_PER_KM = 4

/**
 * ¿Está libre este conductor ahora? Cuando hay más solicitudes que conductores (R > 1), parte de ellos ya
 * lleva a otro pasajero: solo queda libre una fracción 1/R, que se sortea en cada tick.
 */
function isFree(car: CarState, ratio: number, tick: number): boolean {
  return hash(car.seed, tick, 10) < Math.min(FREE_SHARE, FREE_SHARE / ratio)
}

export interface Driver {
  /** Coche del mapa que acude a la recogida. */
  car: CarState & { zoneId: string }
  /** Distancia por calle hasta la recogida. */
  km: number
  minutes: number
}

export interface PickupEstimate {
  product: Product
  /** Conductor libre más cercano de ese producto, o `null` si no hay ninguno en la ciudad. */
  driver: Driver | null
  /** Espera en minutos (25 si no hay conductor libre). */
  minutes: number
  /** Conductores libres de ese producto en la zona de recogida. */
  nearby: number
}

/** Multiplica el tiempo de recorrido: los coches de calles rápidas llegan antes que los de calles lentas. */
const SPEED_FACTOR: Record<CarSpeed, number> = { fast: 0.75, medium: 1, slow: 1.35 }
const MAX_WAIT = 25

/**
 * Espera de cada producto: el conductor libre más cercano recorre por las calles la distancia hasta la
 * recogida a la velocidad de su calle (más lento con lluvia). Por eso la espera cambia en cada tick, sube
 * cuando faltan conductores y es mayor para Black, que tiene menos coches.
 */
export function pickupEstimates(sim: SimState, zone: Zone, cars = cityCars(sim)): PickupEstimate[] {
  const target = pickupPoint(zone)
  const free = cars.filter((car) => !car.exit && isFree(car, current(sim, car.zoneId).ratio, sim.tick))
  return PRODUCTS.map((product) => {
    const own = free.filter((car) => car.productId === product.id)
    let driver: Driver | null = null
    for (const car of own) {
      // Las calles forman una cuadrícula: la distancia por calle es la Manhattan.
      const km = (Math.abs(car.pos[0] - target[0]) + Math.abs(car.pos[1] - target[1])) * KM_PER_UNIT
      const minutes = 1 + km * MIN_PER_KM * (sim.rain ? 1.2 : 1) * SPEED_FACTOR[car.speed]
      if (!driver || minutes < driver.minutes) driver = { car, km, minutes }
    }
    return {
      product,
      driver,
      minutes: driver ? Math.min(MAX_WAIT, Math.max(1, Math.round(driver.minutes))) : MAX_WAIT,
      nearby: own.filter((car) => car.zoneId === zone.id).length,
    }
  })
}
