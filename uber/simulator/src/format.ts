export const num = (value: number, digits = 0) =>
  value.toLocaleString('es-ES', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const euros = (value: number) => `${num(value, 2)} €`
export const mult = (value: number) => `${num(value, 2)}×`
export const pct = (value: number, digits = 1) => `${value >= 0 ? '+' : '−'}${num(Math.abs(value) * 100, digits)} %`
