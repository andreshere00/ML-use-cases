import { useEffect, useMemo, useState } from 'react'
import { AlgoPanel } from './components/AlgoPanel'
import { CityMap } from './components/CityMap'
import { MarketFeed } from './components/MarketFeed'
import { TopBar } from './components/TopBar'
import { ValuationPanel } from './components/ValuationPanel'
import { useT } from './i18n'
import { useSaleProgress, type MyListing } from './sale'
import { DEFAULT_K } from './sim/comparables'
import { LAST_DAY, listingsUpTo } from './sim/engine'
import type { HomeSpec } from './sim/market'
import { value } from './sim/valuation'

const TICK_MS = 1600
const START_DAY = 3
const DEFAULT_SPEC: HomeSpec = { area: 90, beds: 2, zone: 1, renovated: true, lift: false }

export function App() {
  const t = useT()
  const [day, setDay] = useState(START_DAY)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [w, setW] = useState(0.5)
  const [k, setK] = useState(DEFAULT_K)
  const [spec, setSpec] = useState<HomeSpec>(DEFAULT_SPEC)
  const [listing, setListing] = useState<MyListing | null>(null)
  const progress = useSaleProgress(listing)
  const finished = day >= LAST_DAY

  const valuation = useMemo(() => value(spec, w, k), [spec, w, k])
  const listings = useMemo(() => listingsUpTo(day, w, k), [day, w, k])

  useEffect(() => {
    if (!playing || finished) return
    const id = setInterval(() => setDay((d) => Math.min(LAST_DAY, d + 1)), TICK_MS / speed)
    return () => clearInterval(id)
  }, [playing, speed, finished])

  return (
    <div className="app">
      <TopBar
        day={day}
        playing={playing && !finished}
        finished={finished}
        speed={speed}
        w={w}
        k={k}
        onTogglePlay={() => setPlaying((p) => !p)}
        onSpeed={setSpeed}
        onWeight={setW}
        onK={setK}
        onReset={() => {
          setDay(START_DAY)
          setW(0.5)
          setK(DEFAULT_K)
          setSpec(DEFAULT_SPEC)
          setListing(null)
          setPlaying(true)
        }}
      />
      <main className="layout">
        <div className="side">
          <ValuationPanel
            spec={spec}
            valuation={valuation}
            k={k}
            listing={listing}
            progress={progress}
            onSpec={setSpec}
            onPublish={setListing}
            onClear={() => setListing(null)}
          />
          <MarketFeed listings={listings} day={day} w={w} k={k} />
        </div>
        <CityMap
          spec={spec}
          valuation={valuation}
          listings={listings}
          day={day}
          locked={listing !== null}
          onZone={(zone) => setSpec((s) => ({ ...s, zone }))}
        />
        <AlgoPanel spec={spec} valuation={valuation} k={k} />
      </main>
      <footer className="disclaimer">{t.disclaimer}</footer>
    </div>
  )
}
