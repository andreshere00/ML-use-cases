import { useEffect, useReducer, useState } from 'react'
import { AlgoPanel } from './components/AlgoPanel'
import { CityMap } from './components/CityMap'
import { RiderPanel } from './components/RiderPanel'
import { TopBar } from './components/TopBar'
import { EVENT_TICKS, LAST_TICK, initSim, refreshSim, stepSim, type SimState } from './sim/engine'
import { useTripProgress, type Trip } from './trip'

type Action =
  | { type: 'tick' }
  | { type: 'reset' }
  | { type: 'rain'; value: boolean }
  | { type: 'eta'; value: number }
  | { type: 'event'; zoneId: string }

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case 'tick':
      return stepSim(state)
    case 'reset':
      return initSim(state.rain, state.eta)
    case 'rain':
      return refreshSim(state, { rain: action.value })
    case 'eta':
      return refreshSim(state, { eta: action.value })
    case 'event':
      return refreshSim(state, {
        events: [...state.events, { zoneId: action.zoneId, fromTick: state.tick, toTick: state.tick + EVENT_TICKS }],
      })
  }
}

const TICK_MS = 1600

export function App() {
  const [sim, dispatch] = useReducer(reducer, undefined, () => initSim())
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [pickupId, setPickupId] = useState('A')
  const [destId, setDestId] = useState('H')
  const [activeField, setActiveField] = useState<'pickup' | 'dest'>('pickup')
  const [trip, setTrip] = useState<Trip | null>(null)
  const progress = useTripProgress(trip)
  const finished = sim.tick >= LAST_TICK

  useEffect(() => {
    if (!playing || finished) return
    const id = setInterval(() => dispatch({ type: 'tick' }), TICK_MS / speed)
    return () => clearInterval(id)
  }, [playing, speed, finished])

  const selectZone = (zoneId: string) => {
    if (trip) return
    if (activeField === 'pickup') {
      setPickupId(zoneId)
      setActiveField('dest')
    } else {
      setDestId(zoneId)
      setActiveField('pickup')
    }
  }

  return (
    <div className="app">
      <TopBar
        sim={sim}
        playing={playing && !finished}
        finished={finished}
        speed={speed}
        eventZoneId={pickupId}
        onTogglePlay={() => setPlaying((p) => !p)}
        onSpeed={setSpeed}
        onRain={(value) => dispatch({ type: 'rain', value })}
        onEta={(value) => dispatch({ type: 'eta', value })}
        onEvent={() => dispatch({ type: 'event', zoneId: pickupId })}
        onReset={() => {
          dispatch({ type: 'reset' })
          setTrip(null)
          setPlaying(true)
        }}
      />
      <main className="layout">
        <RiderPanel
          sim={sim}
          pickupId={pickupId}
          destId={destId}
          activeField={activeField}
          trip={trip}
          progress={progress}
          onPickup={setPickupId}
          onDest={setDestId}
          onActiveField={setActiveField}
          onRequest={setTrip}
          onClear={() => setTrip(null)}
        />
        <CityMap
          sim={sim}
          pickupId={pickupId}
          destId={destId}
          activeField={activeField}
          trip={trip}
          progress={progress}
          tickMs={TICK_MS / speed}
          onSelect={selectZone}
        />
        <AlgoPanel sim={sim} zoneId={pickupId} />
      </main>
      <footer className="disclaimer">
        Simulador didáctico con datos sintéticos. Reproduce los cálculos de la presentación y del notebook; no es el
        sistema de precios de Uber.
      </footer>
    </div>
  )
}
