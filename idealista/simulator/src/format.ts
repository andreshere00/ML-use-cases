import type { Lang } from './i18n'

// Agrupa siempre los miles (es-ES no agrupa los números de cuatro cifras por defecto): 9.915 €.
const GROUPING = { useGrouping: 'always' } as unknown as Intl.NumberFormatOptions
const LOCALE: Record<Lang, string> = { es: 'es-ES', en: 'en-GB' }

/** Idioma de formato actual. Lo fija LangProvider en cada render, antes que a sus hijos. */
let lang: Lang = 'es'
export const setFormatLang = (next: Lang) => {
  lang = next
}

export const num = (value: number, digits = 0) =>
  value.toLocaleString(LOCALE[lang], { ...GROUPING, minimumFractionDigits: digits, maximumFractionDigits: digits })

/** Euros sin decimales: 312.000 € / €312,000. */
export const euros = (value: number) => (lang === 'es' ? `${num(value)} €` : `€${num(value)}`)
/** Miles de euros compactos para ejes y etiquetas del mapa: 312 k€ / €312k. */
export const keur = (value: number, digits = 0) =>
  lang === 'es' ? `${num(value / 1000, digits)} k€` : `€${num(value / 1000, digits)}k`
export const pct = (value: number, digits = 0) =>
  `${value >= 0 ? '+' : '−'}${num(Math.abs(value) * 100, digits)}${lang === 'es' ? ' %' : '%'}`
