import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { euros, num, pct, setFormatLang } from './format'
import type { SalePhase } from './sale'
import type { ListingStatus } from './sim/engine'
import type { HomeSpec } from './sim/market'
import type { ContributionId, PriceTag } from './sim/valuation'

export type Lang = 'es' | 'en'
export const LANGS: { id: Lang; name: string }[] = [
  { id: 'es', name: 'Español' },
  { id: 'en', name: 'English' },
]

const es = {
  title: 'Simulador de valoración automática · idealista',
  brand: ['Valoración ', 'automática'],
  brandSub: 'Simulador · caso idealista',
  language: 'Idioma',
  languageHint: 'Elige el idioma del simulador.',
  close: 'Cerrar',
  market: 'Mercado',
  endSim: 'Fin de la simulación',
  pause: 'Pausar',
  resume: 'Reanudar',
  day: (d: number) => `Día ${d}`,
  marketEnd: 'Fin del mercado',
  dayOf: (n: number) => `de ${n} · 1 anuncio al día`,
  speed: 'Velocidad',
  model: 'Modelo',
  weight: 'Peso de la regresión',
  onlyComps: 'solo comparables',
  onlyReg: 'solo regresión',
  regShare: (w: number) => `${num(w * 100)} % regresión`,
  comps: 'Comparables',
  numComps: 'Número de comparables',
  maeShort: 'error medio (MAE)',
  reset: 'Reiniciar',

  zoneName: ['Zona A', 'Zona B', 'Zona C'],
  zoneDesc: ['Periferia', 'Ensanche', 'Centro histórico'],
  beds: 'dorm.',
  renovated: 'reformado',
  lift: 'ascensor',
  tag: { good: 'Buen precio', fair: 'Precio ajustado', high: 'Precio alto' } as Record<PriceTag, string>,
  status: { new: 'Nuevo', visits: 'Con visitas', reserved: 'Reservado', sold: 'Vendido' } as Record<ListingStatus, string>,

  phase: {
    published: 'Anuncio publicado',
    visits: 'Recibiendo visitas',
    offers: 'Negociando ofertas',
    sold: '¡Vivienda vendida!',
  } as Record<SalePhase, string>,
  step: { published: 'Publicado', visits: 'Visitas', offers: 'Ofertas' },
  yourListing: 'Tu anuncio',
  saleProgress: 'Progreso de la venta',
  soldIn: (d: number) => `Vendida en ${d} días`,
  listingDay: (d: number) => `Día ${d} del anuncio`,
  visits: (n: number) => `${n} visitas`,
  negotiated: (d: string) => `Precio de cierre: has negociado ${d} sobre lo anunciado.`,
  soldAtAsking: 'Vendida al precio anunciado.',
  askingNote: (tag: string) => `Precio anunciado · ${tag.toLowerCase()} según la valoración.`,
  autoValuation: 'Valoración automática',
  askVsValuation: 'Precio pedido frente a la valoración',
  weeklyVisits: 'Visitas por semana estimadas',
  valueAnother: 'Valorar otra vivienda',
  withdraw: 'Retirar anuncio',

  valueTitle: 'Valora tu vivienda',
  valueSub: 'Gratis y al instante, con viviendas parecidas de tu zona.',
  zone: 'Zona',
  mapTip: 'También puedes tocar la zona en el mapa',
  area: 'Superficie construida',
  bedrooms: 'Dormitorios',
  renovatedCap: 'Reformado',
  liftCap: 'Ascensor',
  estimate: 'Valoración estimada',
  range: (lo: number, hi: number) => `Entre ${euros(lo)} y ${euros(hi)}`,
  perM2: (v: number) => `${euros(v)}/m²`,
  regression: 'Regresión',
  atAvg: 'En la media de la zona',
  aboveAvg: 'Por encima de la media de la zona',
  belowAvg: 'Por debajo de la media de la zona',
  zoneNote: (zone: string, m2: number, mae: number) =>
    `El m² medio en ${zone} es de ${euros(m2)}. El rango usa el error medio del modelo con viviendas que no ha visto (${euros(mae)}).`,
  askQ: '¿A qué precio la anuncias?',
  valuation: 'Valoración',
  sellIn: (d: number) => `Se vendería en ~${num(d)} días`,
  publish: 'Publicar anuncio',
  priceNote: 'Estimación orientativa, no es una tasación oficial.',

  newListings: 'Nuevos anuncios',
  live: 'En directo',
  listed: 'Publicados',
  sold: 'Vendidos',
  meanError: 'Error medio',
  testMaeTitle: (mae: number) => `Con las 120 viviendas de prueba: ${euros(mae)}`,
  flat: 'Piso',
  feedValuation: (v: number, err: number) => `Valoración ${euros(v)} · error ${euros(err)}`,

  mapLabel: 'Mapa de precios por m² de la ciudad ficticia',
  zoneAria: (name: string, desc: string, m2: number) => `${name}, ${desc}: ${euros(m2)} el m²`,
  m2Range: (lo: number, hi: number) => `${euros(lo)} – ${euros(hi)} el m²`,
  yourHome: 'Tu vivienda',
  nComps: (n: number) => `${n} comparables`,

  algorithms: 'Algoritmos',
  howTitle: 'Cómo se calcula el precio',
  feature: ['m²', 'Dormitorio', 'Zona B', 'Zona C', 'Reformado', 'Ascensor'],
  contribution: {
    area: 'm²',
    beds: 'Dormitorios',
    zone: 'Zona',
    renovated: 'Reformado',
    lift: 'Ascensor',
    comparables: 'Comparables',
  } as Record<ContributionId, string>,
  regTitle: 'Regresión lineal',
  regQ: '¿Cuánto vale cada característica en todo el mercado?',
  gdAria: (i: number) => `Iteración ${i} del descenso de gradiente`,
  trainError: (mae: number) => `error en entrenamiento: ${euros(mae)}`,
  trainErrorAria: (mae: number) => `Error en entrenamiento ${euros(mae)}`,
  iteration: (i: number) => `Iteración ${i} de 300`,
  converged: ' · los pesos casi no cambian: ha convergido',
  correcting: ' · cada paso corrige los pesos contra el error',
  learnedWeight: 'Peso aprendido',
  trueValue: 'Valor real de la fórmula',
  intercept: 'Intercepto (mínimos cuadrados)',
  regPrice: 'Precio según la regresión',
  compTitle: 'Comparables',
  compQ: '¿A cuánto se han vendido las más parecidas de la zona?',
  compAria: (n: number, zone: string, mean: number) => `${n} comparables en ${zone}, media ${euros(mean)}`,
  homesIn: (zone: string) => `Viviendas de ${zone}`,
  thBeds: 'Dorm.',
  thExtras: 'Extras',
  thDistance: 'Distancia',
  thPrice: 'Precio',
  extraR: 'R',
  extraL: 'A',
  compMean: (n: number) => `Media de ${n} comparables`,
  distanceNote: 'Distancia = (Δm²/30)² + (Δdorm./2)² + 0,25 por cada diferencia de reforma (R) o ascensor (A).',
  blendTitle: 'Mezcla',
  blendQ: '¿Cuánto pesa cada método para equivocarse menos?',
  blendAria: (w: number, mae: number) => `Con peso ${num(w, 2)} el error medio es ${euros(mae)}`,
  unseenError: 'Error medio con 120 viviendas no vistas',
  best: (w: number) => `Óptimo en w = ${num(w, 2)}`,
  maeAtWeight: 'Error medio (MAE) con este peso',
  roundedValuation: 'Valoración (redondeada)',
  blendNote: 'Mueve «Peso de la regresión» arriba: la regresión generaliza, los comparables capturan lo local.',
  explainTitle: 'Explicabilidad',
  explainQ: '¿Por qué este precio y no otro?',
  average: 'Media',
  explainAria: (from: number, to: number) => `Desde la media ${euros(from)} hasta ${euros(to)}`,
  explainNote: (base: number, label: string, share: number) => [
    `Parte de la valoración media (${euros(base)}). Lo que más mueve tu precio: `,
    label.toLowerCase(),
    ` (${pct(share, 1)}). Cada barra es exacta: peso × coeficiente × (tu valor − media); los comparables aportan (1 − w) × (su media − la media).`,
  ],

  disclaimer:
    'Simulador didáctico con datos sintéticos (semilla 42). Reproduce los cálculos de la presentación y del notebook; no es el modelo de valoración ni los datos de idealista.',
}

export type Dict = typeof es

const en: Dict = {
  title: 'Automated valuation simulator · idealista',
  brand: ['Automated ', 'valuation'],
  brandSub: 'Simulator · idealista case',
  language: 'Language',
  languageHint: 'Choose the simulator language.',
  close: 'Close',
  market: 'Market',
  endSim: 'End of simulation',
  pause: 'Pause',
  resume: 'Resume',
  day: (d) => `Day ${d}`,
  marketEnd: 'Market closed',
  dayOf: (n) => `of ${n} · 1 listing a day`,
  speed: 'Speed',
  model: 'Model',
  weight: 'Regression weight',
  onlyComps: 'comparables only',
  onlyReg: 'regression only',
  regShare: (w) => `${num(w * 100)}% regression`,
  comps: 'Comparables',
  numComps: 'Number of comparables',
  maeShort: 'mean error (MAE)',
  reset: 'Reset',

  zoneName: ['Zone A', 'Zone B', 'Zone C'],
  zoneDesc: ['Outskirts', 'Inner suburbs', 'Old town'],
  beds: 'bed',
  renovated: 'renovated',
  lift: 'lift',
  tag: { good: 'Good price', fair: 'Fair price', high: 'High price' },
  status: { new: 'New', visits: 'Viewings', reserved: 'Reserved', sold: 'Sold' },

  phase: {
    published: 'Listing published',
    visits: 'Getting viewings',
    offers: 'Negotiating offers',
    sold: 'Home sold!',
  },
  step: { published: 'Listed', visits: 'Viewings', offers: 'Offers' },
  yourListing: 'Your listing',
  saleProgress: 'Sale progress',
  soldIn: (d) => `Sold in ${d} days`,
  listingDay: (d) => `Day ${d} of the listing`,
  visits: (n) => `${n} viewings`,
  negotiated: (d) => `Closing price: you negotiated ${d} on the asking price.`,
  soldAtAsking: 'Sold at the asking price.',
  askingNote: (tag) => `Asking price · ${tag.toLowerCase()} according to the valuation.`,
  autoValuation: 'Automated valuation',
  askVsValuation: 'Asking price vs. valuation',
  weeklyVisits: 'Estimated viewings per week',
  valueAnother: 'Value another home',
  withdraw: 'Withdraw listing',

  valueTitle: 'Value your home',
  valueSub: 'Free and instant, using similar homes in your area.',
  zone: 'Zone',
  mapTip: 'You can also tap the zone on the map',
  area: 'Floor area',
  bedrooms: 'Bedrooms',
  renovatedCap: 'Renovated',
  liftCap: 'Lift',
  estimate: 'Estimated value',
  range: (lo, hi) => `Between ${euros(lo)} and ${euros(hi)}`,
  perM2: (v) => `${euros(v)}/m²`,
  regression: 'Regression',
  atAvg: 'In line with the zone average',
  aboveAvg: 'Above the zone average',
  belowAvg: 'Below the zone average',
  zoneNote: (zone, m2, mae) =>
    `The average price per m² in ${zone} is ${euros(m2)}. The range uses the model's mean error on homes it has not seen (${euros(mae)}).`,
  askQ: 'What price will you ask?',
  valuation: 'Valuation',
  sellIn: (d) => `Would sell in ~${num(d)} days`,
  publish: 'Publish listing',
  priceNote: 'An indicative estimate, not an official appraisal.',

  newListings: 'New listings',
  live: 'Live',
  listed: 'Listed',
  sold: 'Sold',
  meanError: 'Mean error',
  testMaeTitle: (mae) => `On the 120 test homes: ${euros(mae)}`,
  flat: 'Flat',
  feedValuation: (v, err) => `Valuation ${euros(v)} · error ${euros(err)}`,

  mapLabel: 'Map of prices per m² in the fictional city',
  zoneAria: (name, desc, m2) => `${name}, ${desc}: ${euros(m2)} per m²`,
  m2Range: (lo, hi) => `${euros(lo)} – ${euros(hi)} per m²`,
  yourHome: 'Your home',
  nComps: (n) => `${n} comparables`,

  algorithms: 'Algorithms',
  howTitle: 'How the price is worked out',
  feature: ['m²', 'Bedroom', 'Zone B', 'Zone C', 'Renovated', 'Lift'],
  contribution: {
    area: 'm²',
    beds: 'Bedrooms',
    zone: 'Zone',
    renovated: 'Renovated',
    lift: 'Lift',
    comparables: 'Comparables',
  },
  regTitle: 'Linear regression',
  regQ: 'What is each feature worth across the whole market?',
  gdAria: (i) => `Gradient descent iteration ${i}`,
  trainError: (mae) => `training error: ${euros(mae)}`,
  trainErrorAria: (mae) => `Training error ${euros(mae)}`,
  iteration: (i) => `Iteration ${i} of 300`,
  converged: ' · the weights barely change: it has converged',
  correcting: ' · each step corrects the weights against the error',
  learnedWeight: 'Learned weight',
  trueValue: 'True value in the formula',
  intercept: 'Intercept (least squares)',
  regPrice: 'Regression price',
  compTitle: 'Comparables',
  compQ: 'What did the most similar homes in the zone sell for?',
  compAria: (n, zone, mean) => `${n} comparables in ${zone}, mean ${euros(mean)}`,
  homesIn: (zone) => `Homes in ${zone}`,
  thBeds: 'Beds',
  thExtras: 'Extras',
  thDistance: 'Distance',
  thPrice: 'Price',
  extraR: 'R',
  extraL: 'L',
  compMean: (n) => `Mean of ${n} comparables`,
  distanceNote: 'Distance = (Δm²/30)² + (Δbeds/2)² + 0.25 for each difference in renovation (R) or lift (L).',
  blendTitle: 'Blend',
  blendQ: 'How much should each method weigh to make the smallest error?',
  blendAria: (w, mae) => `With weight ${num(w, 2)} the mean error is ${euros(mae)}`,
  unseenError: 'Mean error on 120 unseen homes',
  best: (w) => `Best at w = ${num(w, 2)}`,
  maeAtWeight: 'Mean error (MAE) at this weight',
  roundedValuation: 'Valuation (rounded)',
  blendNote: 'Move “Regression weight” above: regression generalises, comparables capture the local market.',
  explainTitle: 'Explainability',
  explainQ: 'Why this price and not another?',
  average: 'Average',
  explainAria: (from, to) => `From the average ${euros(from)} to ${euros(to)}`,
  explainNote: (base, label, share) => [
    `It starts from the average valuation (${euros(base)}). What moves your price most: `,
    label.toLowerCase(),
    ` (${pct(share, 1)}). Each bar is exact: weight × coefficient × (your value − mean); comparables add (1 − w) × (their mean − the average).`,
  ],

  disclaimer:
    'Teaching simulator with synthetic data (seed 42). It reproduces the calculations in the presentation and the notebook; it is not idealista’s valuation model or data.',
}

const DICT: Record<Lang, Dict> = { es, en }
const STORAGE_KEY = 'idealista-sim-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // Sin almacenamiento (modo privado): se queda en español.
  }
  return 'es'
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({ lang: 'es', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  // Antes que los hijos: los formateadores leen el idioma en este mismo render.
  setFormatLang(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = DICT[lang].title
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Ignorado: el idioma solo se recuerda si hay almacenamiento.
    }
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
export const useT = () => DICT[useLang().lang]

/** Resumen de una vivienda en una línea: 90 m² · 2 dorm. · Zona B · reformado. */
export const homeSummary = (t: Dict, s: HomeSpec) =>
  `${s.area} m² · ${s.beds} ${t.beds} · ${t.zoneName[s.zone]}${s.renovated ? ` · ${t.renovated}` : ''}${s.lift ? ` · ${t.lift}` : ''}`
