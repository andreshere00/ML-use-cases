// Algoritmo 4 · Bucle de realimentación: el multiplicador se corrige cada 5 minutos.
import { demandAt, supplyAt } from './regression'

export const M_MIN = 1
export const M_MAX = 3

export interface LoopInput {
  /** Multiplicador vigente en este tick. */
  m: number
  /** Conductores disponibles en la zona. */
  drivers: number
  /** Demanda a precio normal (sin multiplicador). */
  baseDemand: number
  /** Conductores habituales de la zona a precio normal. */
  baseDrivers: number
  beta: number
  /** Ganancia del controlador (η). */
  eta: number
  supplySensitivity: number
  /** Fracción de la distancia al objetivo de oferta que se recorre por tick. */
  driverSpeed: number
}

export interface LoopOutput {
  demand: number
  /** R = demanda / conductores. */
  ratio: number
  nextM: number
  nextDrivers: number
}

export function loopStep(i: LoopInput): LoopOutput {
  const demand = demandAt(i.baseDemand, i.beta, i.m)
  const ratio = demand / i.drivers
  const nextM = Math.min(M_MAX, Math.max(M_MIN, i.m + i.eta * (ratio - 1)))
  const target = supplyAt(i.baseDrivers, i.supplySensitivity, nextM)
  return { demand, ratio, nextM, nextDrivers: i.drivers + i.driverSpeed * (target - i.drivers) }
}
