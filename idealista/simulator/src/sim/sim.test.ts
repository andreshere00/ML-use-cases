// Comprueba que los algoritmos reproducen los números de las diapositivas y del notebook 01.
import { describe, expect, it } from 'vitest'
import { comparables, meanPrice } from './comparables'
import { LAST_DAY, listingsUpTo, status } from './engine'
import { TEST, TRAIN } from './market'
import { BASELINE, GD_HISTORY, MODEL } from './regression'
import { explain, maeCurve, testMAE, value } from './valuation'

describe('datos', () => {
  it('separa 360 viviendas de entrenamiento y 120 de prueba', () => {
    expect(TRAIN).toHaveLength(360)
    expect(TEST).toHaveLength(120)
    expect(LAST_DAY).toBe(120)
  })
})

describe('regresión', () => {
  it('aprende los mismos coeficientes que scikit-learn', () => {
    expect(MODEL.intercept).toBeCloseTo(17248.4, 0)
    const expected = [1980.2, 12666.8, 62239, 120603, 27302, 15248]
    MODEL.coefs.forEach((c, i) => expect(Math.abs(c - expected[i])).toBeLessThan(1))
    expect(BASELINE).toBeCloseTo(316603.9, 0)
  })

  it('el descenso de gradiente reduce el error y se acerca a la solución exacta', () => {
    const first = GD_HISTORY[0]
    const last = GD_HISTORY[GD_HISTORY.length - 1]
    expect(GD_HISTORY).toHaveLength(61)
    expect(last.mae).toBeLessThan(first.mae / 3)
    expect(Math.abs(last.coefs[0] - MODEL.coefs[0]) / MODEL.coefs[0]).toBeLessThan(0.05)
  })
})

describe('comparables', () => {
  it('encuentra los 6 comparables del ejemplo del notebook (vivienda de prueba 74)', () => {
    const home = TEST[0]
    expect(home.id).toBe(74)
    const ids = comparables(home).map((c) => c.home.id)
    expect(ids).toEqual([45, 152, 329, 230, 439, 72])
    expect(meanPrice(comparables(home))).toBeCloseTo((188380 + 225035 + 152530 + 211547 + 203174 + 160490) / 6, 3)
  })
})

describe('mezcla', () => {
  it('reproduce el MAE de prueba: 9.915 € regresión, 13.855 € comparables, 10.577 € mezcla', () => {
    expect(testMAE(1, 6)).toBeCloseTo(9915.4, 0)
    expect(testMAE(0, 6)).toBeCloseTo(13854.6, 0)
    expect(testMAE(0.5, 6)).toBeCloseTo(10577.5, 0)
    expect(maeCurve(6)).toHaveLength(101)
  })

  it('la cascada reconstruye la valoración exacta', () => {
    const spec = { area: 90, beds: 2, zone: 1, renovated: true, lift: false }
    for (const w of [0, 0.3, 0.5, 1]) {
      const v = value(spec, w, 6)
      const sum = explain(spec, v).reduce((acc, c) => acc + c.value, BASELINE)
      expect(sum).toBeCloseTo(v.price, 6)
    }
  })
})

describe('mercado', () => {
  it('publica un anuncio al día y acaba vendiendo los primeros', () => {
    const listings = listingsUpTo(LAST_DAY, 0.5, 6)
    expect(listings).toHaveLength(120)
    expect(listings[0].day).toBe(120)
    expect(status(listings[listings.length - 1], LAST_DAY)).toBe('sold')
  })
})
