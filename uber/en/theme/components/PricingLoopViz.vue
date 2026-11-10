<script setup>
// Algorithm 4 · feedback loop. The ten ticks are simulated here, with the same
// demand/supply functions used by the regression slide. Text comes from labels.json (`loop`).
import labels from '../../labels.json'
const t = { ...labels.loop, decimal: labels.decimal }
const n = (x, d = 1) => x.toFixed(d).replace('.', t.decimal)
const BETA = 0.507, ETA = 0.8
const demand = (base, m) => base * Math.exp(-BETA * (m - 1))
const supplyTarget = m => 110 * (1 + 0.6 * (m - 1))
const bases = [165, 165, 165, 165, 165, 165, 130, 110, 100, 100]
let m = 1, s = 110
const ticks = bases.map((b, i) => {
  const d = demand(b, m), r = d / s, row = { i, m, r, label: `18:${String(i * 5).padStart(2, '0')}` }
  const mNew = Math.max(1, Math.min(3, m + ETA * (r - 1)))
  s = s + 0.5 * (supplyTarget(mNew) - s); m = mNew
  return row
})
const L = 56, R = 624, W = (R - L) / ticks.length
const cx = i => L + W * (i + 0.5)
// top chart: multiplier
const T1 = 30, B1 = 196, MMIN = 0.95, MMAX = 1.55
const my = v => B1 - (v - MMIN) / (MMAX - MMIN) * (B1 - T1)
const line = ticks.map((k, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)},${my(k.m).toFixed(1)}`).join(' ')
// bottom chart: demand / supply ratio, bars from 1.0
const T2 = 262, B2 = 372, RMIN = 0.6, RMAX = 1.6
const ry = v => B2 - (v - RMIN) / (RMAX - RMIN) * (B2 - T2)
</script>
<template>
  <svg class="lp-viz" viewBox="0 0 636 440" width="636" height="440" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="t.aria">
    <text x="0" y="12" class="lp-head">{{ t.headM }}</text>
    <g class="lp-grid"><line v-for="v in [1.0, 1.2, 1.4]" :key="v" :x1="L" :y1="my(v)" :x2="R" :y2="my(v)" /></g>
    <text v-for="v in [1.0, 1.2, 1.4]" :key="'t' + v" :x="L - 8" :y="my(v) + 5" text-anchor="end" class="lp-tick">{{ n(v, 1) }}×</text>
    <path :d="line" class="lp-line" />
    <g v-for="k in ticks" :key="k.i">
      <circle :cx="cx(k.i)" :cy="my(k.m)" r="5.500" class="lp-dot" />
      <text :x="cx(k.i)" :y="my(k.m) - 12" text-anchor="middle" class="lp-val">{{ n(k.m, 2) }}</text>
    </g>

    <text x="0" y="242" class="lp-head">{{ t.headR }}</text>
    <line :x1="L" :y1="ry(1)" :x2="R" :y2="ry(1)" class="lp-one" />
    <text :x="L - 8" :y="ry(1) + 5" text-anchor="end" class="lp-tick">{{ n(1, 1) }}</text>
    <g v-for="k in ticks" :key="'b' + k.i">
      <rect :x="cx(k.i) - 17" :y="k.r >= 1 ? ry(k.r) : ry(1)" width="34" :height="Math.abs(ry(k.r) - ry(1))" :fill="k.r >= 1 ? '#E64366' : '#4D225D'" />
      <text :x="cx(k.i)" :y="k.r >= 1 ? ry(k.r) - 7 : ry(k.r) + 18" text-anchor="middle" class="lp-val">{{ n(k.r, 2) }}</text>
      <text :x="cx(k.i)" :y="B2 + 30" text-anchor="middle" class="lp-x">{{ k.label }}</text>
    </g>
    <g transform="translate(56 424)">
      <rect x="0" y="-11" width="14" height="14" fill="#E64366" /><text x="22" y="1" class="lp-leg">{{ t.legShort }}</text>
      <rect x="250" y="-11" width="14" height="14" fill="#4D225D" /><text x="272" y="1" class="lp-leg">{{ t.legSurplus }}</text>
    </g>
  </svg>
</template>
<style scoped>
.lp-viz{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.lp-head{font-size:19px;font-weight:600;letter-spacing:.7px;fill:#73687A;text-transform:uppercase}
.lp-grid line{stroke:#EDE9EF;stroke-width:1.2}
.lp-tick{font-size:17px;font-weight:300;fill:#73687A}
.lp-line{fill:none;stroke:#4D225D;stroke-width:3;stroke-linejoin:round}
.lp-dot{fill:#fff;stroke:#4D225D;stroke-width:2.600}
.lp-val{font-size:17px;font-weight:600}
.lp-one{stroke:#4D225D;stroke-width:1.6}
.lp-x{font-size:16px;font-weight:300;fill:#73687A}
.lp-leg{font-size:18px;font-weight:300}
</style>
