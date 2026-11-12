// Comprueba que los algoritmos reproducen los números de las diapositivas y del notebook.
import { describe, expect, it } from 'vitest'
import { current, initSim, stepSim } from './engine'
import { forecastDemand, liveDeviation, weightedBase } from './forecast'
import { loopStep } from './pricing'
import { equilibrium, demandAt, fitElasticity } from './regression'
import { acceptChance, otherRides } from './riders'
import { pickupEstimates } from './traffic'
import { CLUSTERS, KIND_BY_ZONE, ZONES } from './world'

describe('series temporales', () => {
  it('pronostica 165 solicitudes para Centro, viernes 18:00 con lluvia', () => {
    const history = [120, 132, 128, 140]
    expect(weightedBase(history)).toBeCloseTo(132.8, 1)
    const withRain = 132.8 * 1.18
    const f = forecastDemand(history, 1.18, liveDeviation(58, withRain))
    expect(f.withRain).toBeCloseTo(156.7, 1)
    expect(f.deviation).toBeCloseTo(0.11, 2)
    expect(f.nowcast).toBeCloseTo(165.4, 1)
  })
})

describe('k-means', () => {
  it('converge en 3 iteraciones a negocios, residencial y ocio nocturno', () => {
    expect(CLUSTERS.iterations).toBe(3)
    const group = (kind: string) => Object.keys(KIND_BY_ZONE).filter((z) => KIND_BY_ZONE[z] === kind).join('')
    expect(group('business')).toBe('ABC')
    expect(group('residential')).toBe('DEF')
    expect(group('nightlife')).toBe('GHI')
  })
})

describe('regresión', () => {
  it('ajusta β = 0,507 y encuentra el equilibrio en 1,39×', () => {
    const fit = fitElasticity()
    expect(fit.beta).toBeCloseTo(0.507, 3)
    expect(fit.r2).toBeGreaterThan(0.998)
    const m = equilibrium(165, 110, fit.beta, 0.6)
    expect(m).toBeCloseTo(1.387, 2)
    expect(demandAt(165, fit.beta, m)).toBeCloseTo(135.6, 0)
  })
})

describe('bucle de precio', () => {
  it('reproduce la secuencia de multiplicadores de la diapositiva', () => {
    const bases = [165, 165, 165, 165, 165, 165, 130, 110, 100, 100]
    const beta = fitElasticity().beta
    let m = 1
    let drivers = 110
    const ms: number[] = []
    const rs: number[] = []
    for (const baseDemand of bases) {
      const out = loopStep({ m, drivers, baseDemand, baseDrivers: 110, beta, eta: 0.8, supplySensitivity: 0.6, driverSpeed: 0.5 })
      ms.push(m)
      rs.push(out.ratio)
      m = out.nextM
      drivers = out.nextDrivers
    }
    const expectedM = [1.0, 1.4, 1.47, 1.46, 1.43, 1.4, 1.39, 1.22, 1.02, 1.0]
    const expectedR = [1.5, 1.09, 0.98, 0.96, 0.97, 0.98, 0.78, 0.76, 0.82, 0.87]
    ms.forEach((v, i) => expect(v).toBeCloseTo(expectedM[i], 1))
    rs.forEach((v, i) => expect(Math.abs(v - expectedR[i])).toBeLessThan(0.011))
  })
})

describe('motor', () => {
  it('a las 18:00 con lluvia el pronóstico de Centro ronda las 165 solicitudes', () => {
    let state = initSim(true)
    for (let i = 0; i < 6; i++) state = stepSim(state)
    const centro = current(state, 'A')
    expect(centro.forecast.base).toBeCloseTo(132.8, 1)
    expect(Math.abs(centro.forecast.nowcast - 165)).toBeLessThan(3)
    expect(centro.m).toBeGreaterThan(1.2)
  })
})

describe('otros pasajeros', () => {
  it('piden viajes a lo largo de la tarde y menos aceptan cuanto más sube el precio', () => {
    let state = initSim(true)
    const seen = new Set<string>()
    for (let i = 0; i < 40; i++) {
      state = stepSim(state)
      otherRides(state).forEach((r) => seen.add(r.id))
    }
    expect(seen.size).toBeGreaterThan(40)
    expect(otherRides(state)).toEqual(otherRides(state))
    expect(acceptChance(1)).toBe(1)
    expect(acceptChance(2)).toBeLessThan(acceptChance(1.5))
  })
})

describe('espera hasta la recogida', () => {
  it('depende del conductor libre más cercano: cambia con el tiempo y es mayor para Black', () => {
    let state = initSim(false)
    const waits: Record<string, number[]> = { x: [], comfort: [], black: [] }
    for (let i = 0; i < 40; i++) {
      state = stepSim(state)
      for (const zone of ZONES)
        for (const e of pickupEstimates(state, zone)) {
          waits[e.product.id].push(e.minutes)
          expect(e.minutes).toBeGreaterThanOrEqual(1)
          expect(e.minutes).toBeLessThanOrEqual(25)
        }
    }
    const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length
    expect(new Set(waits.x).size).toBeGreaterThan(3)
    expect(mean(waits.black)).toBeGreaterThan(mean(waits.x))
    expect(pickupEstimates(state, ZONES[0])).toEqual(pickupEstimates(state, ZONES[0]))
  })
})
