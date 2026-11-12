// Textos de la interfaz en castellano e inglés, y el idioma elegido (guardado en este navegador).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { setFormatLocale } from './format'
import type { RideStatus } from './sim/riders'
import type { ZoneKind } from './sim/world'

export type Lang = 'es' | 'en'

/** Cada idioma con su nombre propio y, debajo, su nombre en el otro idioma. */
export const LANGUAGES: { id: Lang; name: string; other: string }[] = [
  { id: 'es', name: 'Español', other: 'Spanish' },
  { id: 'en', name: 'English', other: 'Inglés' },
]

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

const es = {
  title: 'Simulador de precio dinámico · Uber',
  disclaimer:
    'Simulador didáctico con datos sintéticos. Reproduce los cálculos de la presentación y del notebook; no es el sistema de precios de Uber.',
  kind: { business: 'Negocios', residential: 'Residencial', nightlife: 'Ocio nocturno' } as Record<ZoneKind, string>,
  product: {
    x: 'Viajes económicos del día a día',
    comfort: 'Coches nuevos con más espacio',
    black: 'Viajes prémium en coches de gama alta',
  } as Record<string, string>,

  language: {
    button: 'Idioma',
    title: 'Elige el idioma',
    description: 'Cambia el idioma de toda la interfaz. Se recuerda en este navegador.',
    close: 'Cerrar',
  },

  top: {
    brand: 'Precio dinámico',
    subtitle: 'Simulador · caso Uber',
    playback: 'Reproducción',
    pause: 'Pausar',
    resume: 'Reanudar',
    endOfDay: 'Fin del día',
    friday: 'Viernes',
    speed: 'Velocidad',
    scenario: 'Escenario',
    rain: 'Lluvia',
    concertElsewhere: (zone: string) => `Ya hay un concierto en ${zone}`,
    concertLive: (min: number) => `En curso · ${min} min`,
    concertIn: (zone: string) => `Concierto en ${zone}`,
    algorithm: 'Algoritmo',
    reactivity: 'Reactividad del precio',
    etaSoft: 'suave',
    etaHarsh: 'brusca',
    etaBalanced: 'equilibrada',
    reset: 'Reiniciar',
  },

  rider: {
    title: 'Pide un viaje',
    pickup: 'Recogida',
    dest: 'Destino',
    swap: 'Intercambiar recogida y destino',
    sameZone: 'La recogida y el destino son la misma zona. Elige otro destino.',
    route: (km: string, min: number) => `${km} km · ${min} min de trayecto`,
    mapTip: (pickup: boolean) => `Toca el mapa para elegir ${pickup ? 'la recogida' : 'el destino'}`,
    surgeTitle: 'Tarifas más altas por la demanda',
    normalTitle: 'Tarifa normal',
    surgeBody: (demand: number, drivers: number, zone: string) =>
      `Hay ${demand} solicitudes para ${drivers} conductores en ${zone}.`,
    risingBody: (zone: string) => `La demanda empieza a superar a los conductores en ${zone}.`,
    enoughBody: (zone: string) => `Hay conductores suficientes en ${zone}.`,
    chooseVehicle: 'Elige un vehículo',
    seats: (n: number) => `${n} plazas`,
    arrivesIn: (min: number) => `Llega en ${min} min`,
    noDrivers: 'Sin conductores libres',
    nearby: (n: number) =>
      n === 0 ? 'ninguno en la zona' : plural(n, '1 libre en la zona', `${n} libres en la zona`),
    withoutSurge: 'Sin recargo: ',
    confirm: (name: string) => `Confirmar ${name}`,
    priceNote: 'Pagas este precio aunque la tarifa cambie durante el viaje.',
    phase: {
      searching: 'Buscando un conductor cercano…',
      pickup: 'Tu conductor va de camino',
      ontrip: 'En viaje hacia tu destino',
      done: 'Has llegado',
    },
    steps: { searching: 'Buscando', pickup: 'Recogida', ontrip: 'En viaje' },
    tripInProgress: 'Viaje en curso',
    progress: 'Progreso del viaje',
    driverArrives: (min: number) => `Llega en ${min} min`,
    youArrive: (min: number) => `Llegas en ${min} min`,
    priceLocked: (m: string) => `Precio cerrado con ${m}. No cambia durante el viaje.`,
    multiplierNow: (zone: string) => `Multiplicador ahora en ${zone}`,
    waitAndTrip: 'Espera y trayecto estimados',
    another: 'Pedir otro viaje',
    cancel: 'Cancelar viaje',
  },

  others: {
    title: 'Otros pasajeros',
    live: 'En directo',
    fresh: 'Nuevas',
    active: 'Activas',
    accept: 'Aceptan',
    empty: 'Aún no hay más solicitudes.',
    status: {
      searching: 'Buscando',
      pickup: 'Recogida',
      ontrip: 'En viaje',
      declined: 'Rechaza el precio',
      unserved: 'Sin conductor',
    } as Record<RideStatus, string>,
    declined: (n: number) =>
      `${plural(n, 'Una persona ha', `${n} personas han`)} descartado el viaje por el precio: es la elasticidad del algoritmo 3 en acción.`,
  },

  map: {
    region: 'Mapa de la ciudad',
    zones: 'Nueve zonas de la ciudad',
    zoneLabel: (name: string, kind: string, m: string, role: 'pickup' | 'dest' | null) =>
      `${name}, ${kind}, multiplicador ${m}${role === 'pickup' ? ', recogida' : role === 'dest' ? ', destino' : ''}`,
    drivers: (n: number) => `≈ ${n} conductores`,
    fast: 'rápido',
    medium: 'medio',
    slow: 'lento',
    unmet: (n: number) => `≈ ${n} solicitudes sin conductor`,
    nearest: 'tu conductor más cercano',
    otherRider: 'otro pasajero esperando',
    orMore: '2,0× o más',
  },

  algo: {
    region: 'Algoritmos',
    title: 'Bajo el capó',
    subtitle: (zone: string, clock: string) => `${zone} · viernes ${clock}`,
    forecast: {
      title: 'Series temporales',
      question: '¿Cuántas solicitudes habrá en 15 min?',
      friday: (n: number) => `vie −${n}`,
      predicted: 'Previsto',
      actual: 'Real',
      today: 'hoy',
      aria: (history: string, predicted: number, actual: number) =>
        `Últimos cuatro viernes: ${history}. Previsto ${predicted}, real ${actual}`,
      weighted: 'Media ponderada',
      rain: (v: string) => `Contexto: lluvia × ${v}`,
      live: (v: string) => `En vivo: ${v} → se aplica la mitad`,
      result: 'Pronóstico',
      requests: (n: number) => `${n} solicitudes`,
      note: (actual: number, error: string) => `Demanda real en este tick: ${actual} (error ${error}).`,
    },
    cluster: {
      title: 'Clustering (k-means)',
      question: '¿Qué tipo de zona es?',
      aria: (zone: string, kind: string) => `${zone} pertenece al grupo ${kind}`,
      xAxis: '% en hora punta de mañana',
      yAxis: '% de madrugada',
      iteration: (i: number, n: number) => `Iteración ${i} de ${n}`,
      converged: ' · nadie cambia de grupo: ha convergido',
      initial: ' · centros iniciales en A, B e I',
      moving: ' · cada centro se mueve a la media de su grupo',
      note: (zone: string, id: string, n: number) =>
        `${zone} (${id}) comparte perfil horario con su grupo. Converge en ${n} iteraciones.`,
    },
    regression: {
      title: 'Regresión',
      question: '¿Qué precio equilibra demanda y oferta?',
      aria: (m: string, trips: number) => `Equilibrio en ${m} con ${trips} viajes`,
      demand: 'Demanda',
      drivers: 'Conductores',
      equilibrium: 'Equilibrio',
      elasticity: (r2: string) => `Elasticidad β (R² ${r2})`,
      eqLabel: 'Equilibrio m*',
      trips: (m: string, n: number) => `${m} · ${n} viajes`,
    },
    loop: {
      title: 'Bucle de precio',
      question: '¿Cómo se corrige cada 5 minutos?',
      aria: (m: string, next: string) => `Multiplicador actual ${m}, siguiente ${next}`,
      applied: 'Multiplicador aplicado',
      fromRegression: 'm* de la regresión',
      ratio: (demand: number, drivers: number) => `R = ${demand} solicitudes / ${drivers} conductores`,
      up: 'Faltan conductores: el precio sube.',
      down: 'Sobran conductores: el precio baja hasta 1,00×.',
    },
  },
}

export type Dict = typeof es

const en: Dict = {
  title: 'Dynamic pricing simulator · Uber',
  disclaimer:
    'Teaching simulator with synthetic data. It reproduces the calculations from the presentation and the notebook; it is not Uber’s pricing system.',
  kind: { business: 'Business', residential: 'Residential', nightlife: 'Nightlife' },
  product: {
    x: 'Affordable everyday rides',
    comfort: 'Newer cars with extra legroom',
    black: 'Premium rides in high-end cars',
  },

  language: {
    button: 'Language',
    title: 'Choose a language',
    description: 'Changes the language of the whole interface. It is remembered in this browser.',
    close: 'Close',
  },

  top: {
    brand: 'Dynamic pricing',
    subtitle: 'Simulator · Uber case',
    playback: 'Playback',
    pause: 'Pause',
    resume: 'Resume',
    endOfDay: 'End of day',
    friday: 'Friday',
    speed: 'Speed',
    scenario: 'Scenario',
    rain: 'Rain',
    concertElsewhere: (zone) => `There is already a concert in ${zone}`,
    concertLive: (min) => `Live · ${min} min`,
    concertIn: (zone) => `Concert in ${zone}`,
    algorithm: 'Algorithm',
    reactivity: 'Price reactivity',
    etaSoft: 'gentle',
    etaHarsh: 'sharp',
    etaBalanced: 'balanced',
    reset: 'Restart',
  },

  rider: {
    title: 'Request a ride',
    pickup: 'Pickup',
    dest: 'Destination',
    swap: 'Swap pickup and destination',
    sameZone: 'Pickup and destination are the same zone. Choose another destination.',
    route: (km, min) => `${km} km · ${min} min ride`,
    mapTip: (pickup) => `Tap the map to choose the ${pickup ? 'pickup' : 'destination'}`,
    surgeTitle: 'Higher fares due to demand',
    normalTitle: 'Standard fare',
    surgeBody: (demand, drivers, zone) => `There are ${demand} requests for ${drivers} drivers in ${zone}.`,
    risingBody: (zone) => `Demand is starting to outpace drivers in ${zone}.`,
    enoughBody: (zone) => `There are enough drivers in ${zone}.`,
    chooseVehicle: 'Choose a vehicle',
    seats: (n) => `${n} seats`,
    arrivesIn: (min) => `Arrives in ${min} min`,
    noDrivers: 'No drivers available',
    nearby: (n) => (n === 0 ? 'none in this zone' : `${n} available in this zone`),
    withoutSurge: 'Without surge: ',
    confirm: (name) => `Confirm ${name}`,
    priceNote: 'You pay this price even if the fare changes during the ride.',
    phase: {
      searching: 'Finding a nearby driver…',
      pickup: 'Your driver is on the way',
      ontrip: 'Heading to your destination',
      done: 'You have arrived',
    },
    steps: { searching: 'Searching', pickup: 'Pickup', ontrip: 'On trip' },
    tripInProgress: 'Ride in progress',
    progress: 'Ride progress',
    driverArrives: (min) => `Arrives in ${min} min`,
    youArrive: (min) => `You arrive in ${min} min`,
    priceLocked: (m) => `Price locked at ${m}. It won’t change during the ride.`,
    multiplierNow: (zone) => `Multiplier now in ${zone}`,
    waitAndTrip: 'Estimated wait and ride',
    another: 'Request another ride',
    cancel: 'Cancel ride',
  },

  others: {
    title: 'Other riders',
    live: 'Live',
    fresh: 'New',
    active: 'Active',
    accept: 'Accept',
    empty: 'No other requests yet.',
    status: {
      searching: 'Searching',
      pickup: 'Pickup',
      ontrip: 'On trip',
      declined: 'Declines price',
      unserved: 'No driver',
    },
    declined: (n) =>
      `${plural(n, 'One person has', `${n} people have`)} dropped the ride because of the price: that is algorithm 3’s elasticity at work.`,
  },

  map: {
    region: 'City map',
    zones: 'Nine city zones',
    zoneLabel: (name, kind, m, role) =>
      `${name}, ${kind}, multiplier ${m}${role === 'pickup' ? ', pickup' : role === 'dest' ? ', destination' : ''}`,
    drivers: (n) => `≈ ${n} drivers`,
    fast: 'fast',
    medium: 'medium',
    slow: 'slow',
    unmet: (n) => `≈ ${n} requests without a driver`,
    nearest: 'your nearest driver',
    otherRider: 'another rider waiting',
    orMore: '2.0× or more',
  },

  algo: {
    region: 'Algorithms',
    title: 'Under the hood',
    subtitle: (zone, clock) => `${zone} · Friday ${clock}`,
    forecast: {
      title: 'Time series',
      question: 'How many requests in the next 15 min?',
      friday: (n) => `Fri −${n}`,
      predicted: 'Forecast',
      actual: 'Actual',
      today: 'today',
      aria: (history, predicted, actual) => `Last four Fridays: ${history}. Forecast ${predicted}, actual ${actual}`,
      weighted: 'Weighted average',
      rain: (v) => `Context: rain × ${v}`,
      live: (v) => `Live: ${v} → half is applied`,
      result: 'Forecast',
      requests: (n) => `${n} requests`,
      note: (actual, error) => `Actual demand this tick: ${actual} (error ${error}).`,
    },
    cluster: {
      title: 'Clustering (k-means)',
      question: 'What kind of zone is it?',
      aria: (zone, kind) => `${zone} belongs to the ${kind} group`,
      xAxis: '% in morning rush hour',
      yAxis: '% late at night',
      iteration: (i, n) => `Iteration ${i} of ${n}`,
      converged: ' · no zone changes group: it has converged',
      initial: ' · initial centres at A, B and I',
      moving: ' · each centre moves to its group’s mean',
      note: (zone, id, n) => `${zone} (${id}) shares its hourly profile with its group. It converges in ${n} iterations.`,
    },
    regression: {
      title: 'Regression',
      question: 'Which price balances demand and supply?',
      aria: (m, trips) => `Equilibrium at ${m} with ${trips} rides`,
      demand: 'Demand',
      drivers: 'Drivers',
      equilibrium: 'Equilibrium',
      elasticity: (r2) => `Elasticity β (R² ${r2})`,
      eqLabel: 'Equilibrium m*',
      trips: (m, n) => `${m} · ${n} rides`,
    },
    loop: {
      title: 'Pricing loop',
      question: 'How is it corrected every 5 minutes?',
      aria: (m, next) => `Current multiplier ${m}, next ${next}`,
      applied: 'Applied multiplier',
      fromRegression: 'm* from the regression',
      ratio: (demand, drivers) => `R = ${demand} requests / ${drivers} drivers`,
      up: 'Not enough drivers: the price goes up.',
      down: 'Spare drivers: the price drops towards 1.00×.',
    },
  },
}

const DICTS: Record<Lang, Dict> = { es, en }
const STORAGE_KEY = 'uber-simulator-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // Sin almacenamiento (ventana privada, vista previa): se usa el idioma del navegador.
  }
  return typeof navigator !== 'undefined' && !navigator.language.toLowerCase().startsWith('es') ? 'en' : 'es'
}

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dict
}

const I18nContext = createContext<I18n | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  // Los formatos de número y moneda siguen al idioma; se fija antes de pintar a los hijos.
  setFormatLocale(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = DICTS[lang].title
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Si no se puede guardar, el cambio dura hasta recargar la página.
    }
  }

  return <I18nContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de <LanguageProvider>')
  return ctx
}
