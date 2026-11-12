// Formatos de número, moneda y porcentaje del idioma activo (lo fija `LanguageProvider`).
let locale: 'es' | 'en' = 'es'

export function setFormatLocale(lang: 'es' | 'en') {
  locale = lang
}

export const num = (value: number, digits = 0) =>
  value.toLocaleString(locale === 'es' ? 'es-ES' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const euros = (value: number) => (locale === 'es' ? `${num(value, 2)} €` : `€${num(value, 2)}`)
export const mult = (value: number) => `${num(value, 2)}×`
/** Proporción de 0 a 1 como porcentaje sin signo: «98 %» o «98%». */
export const share = (value: number) => `${num(value * 100)}${locale === 'es' ? ' %' : '%'}`
export const pct = (value: number, digits = 1) => {
  const sign = value >= 0 ? '+' : '−'
  return locale === 'es' ? `${sign}${num(Math.abs(value) * 100, digits)} %` : `${sign}${num(Math.abs(value) * 100, digits)}%`
}
