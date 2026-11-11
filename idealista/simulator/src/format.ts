// Agrupa siempre los miles (es-ES no agrupa los números de cuatro cifras por defecto): 9.915 €.
const GROUPING = { useGrouping: 'always' } as unknown as Intl.NumberFormatOptions

export const num = (value: number, digits = 0) =>
  value.toLocaleString('es-ES', { ...GROUPING, minimumFractionDigits: digits, maximumFractionDigits: digits })

/** Euros sin decimales: 312.000 €. */
export const euros = (value: number) => `${num(value)} €`
/** Miles de euros compactos para ejes y etiquetas del mapa: 312 k€. */
export const keur = (value: number) => `${num(value / 1000)} k€`
export const pct = (value: number, digits = 0) => `${value >= 0 ? '+' : '−'}${num(Math.abs(value) * 100, digits)} %`
