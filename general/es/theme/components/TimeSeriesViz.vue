<script setup>
// Algorithm 1 · time series. Numbers are computed here from the raw inputs so the
// chart and the slide text cannot drift apart. Text comes from labels.json (`ts`).
import { computed } from 'vue'
import labels from '../../labels.json'
const t = { ...labels.ts, decimal: labels.decimal }
const n = (x, d = 1) => x.toFixed(d).replace('.', t.decimal)
const fridays = [120, 132, 128, 140]
const weights = [0.1, 0.2, 0.3, 0.4]
const RAIN = 1.18
const observed = 58
const base = fridays.reduce((s, v, i) => s + v * weights[i], 0)          // 132.8
const withRain = base * RAIN                                              // 156.7
const expected5 = withRain / 3                                            // 52.2
const gain = (observed / expected5 - 1)                                   // +11 %
const nowcast = withRain * (1 + gain / 2)                                 // 165.4
const BASE_Y = 330, K = 1.35
const bar = v => ({ y: BASE_Y - v * K, h: v * K })
const left = fridays.map((v, i) => ({ v, w: weights[i], x: 14 + i * 58, ...bar(v), lab: t.fridayLabels[i] }))
const meanY = BASE_Y - base * K
const wf = computed(() => [
  { x: 322, lab: t.base, calc: t.baseCalc, v: base, from: 0, to: base, fill: '#4D225D', top: n(base), id: 'b' },
  { x: 400, lab: t.rain, calc: `×${n(RAIN, 2)}`, v: withRain - base, from: base, to: withRain, fill: '#E64366', top: `+${n(withRain - base, 0)}`, id: 'r' },
  { x: 478, lab: t.live, calc: `${observed} vs ${n(expected5, 0)}`, v: nowcast - withRain, from: withRain, to: nowcast, fill: '#E64366', top: `+${n(nowcast - withRain, 0)}`, id: 'l' },
  { x: 556, lab: t.forecast, calc: '', v: nowcast, from: 0, to: nowcast, fill: '#2A9D8F', top: n(nowcast, 0), id: 'f' }
].map(b => ({ ...b, y: BASE_Y - b.to * K, h: (b.to - b.from) * K })))
</script>
<template>
  <svg class="ts-viz" viewBox="0 0 636 440" width="636" height="440" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="t.aria">
    <defs><marker id="ts-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#4D225D" /></marker></defs>
    <text x="0" y="18" class="ts-head">{{ t.headA }}</text>
    <text x="316" y="18" class="ts-head">{{ t.headB }}</text>

    <!-- A · last four Fridays -->
    <line x1="0" :y1="BASE_Y" x2="250" :y2="BASE_Y" class="ts-axis" />
    <g v-for="b in left" :key="b.x">
      <rect :x="b.x" :y="b.y" width="46" :height="b.h" fill="#C9BFD0" />
      <text :x="b.x + 23" :y="b.y + 28" text-anchor="middle" class="ts-val-in">{{ b.v }}</text>
      <text :x="b.x + 23" :y="BASE_Y + 22" text-anchor="middle" class="ts-lab">{{ b.lab }}</text>
      <text :x="b.x + 23" :y="BASE_Y + 46" text-anchor="middle" class="ts-weight">×{{ n(b.w, 1) }}</text>
    </g>
    <line x1="0" :y1="meanY" x2="262" :y2="meanY" class="ts-mean" />
    <text x="0" :y="meanY - 26" class="ts-mean-lab">{{ t.mean }} {{ n(base) }}</text>
    <text x="0" :y="BASE_Y + 72" class="ts-cap">{{ t.capA }}</text>
    <path :d="`M254 ${meanY} H314`" class="ts-edge" marker-end="url(#ts-arrow)" />

    <!-- B · waterfall -->
    <line x1="316" :y1="BASE_Y" x2="636" :y2="BASE_Y" class="ts-axis" />
    <g v-for="b in wf" :key="b.id">
      <rect :x="b.x" :y="b.y" width="60" :height="b.h" :fill="b.fill" />
      <text :x="b.x + 30" :y="b.y - 8" text-anchor="middle" class="ts-val" :style="{ fill: b.id === 'f' ? '#2A9D8F' : b.id === 'b' ? '#4D225D' : '#E64366' }">{{ b.top }}</text>
      <text :x="b.x + 30" :y="BASE_Y + 22" text-anchor="middle" class="ts-lab">{{ b.lab }}</text>
      <text :x="b.x + 30" :y="BASE_Y + 46" text-anchor="middle" class="ts-weight">{{ b.calc }}</text>
    </g>
    <text x="316" :y="BASE_Y + 72" class="ts-cap">{{ t.capB }}</text>
    <text x="316" :y="BASE_Y + 94" class="ts-cap">{{ t.capB2 }}</text>
  </svg>
</template>
<style scoped>
.ts-viz{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.ts-head{font-size:19px;font-weight:600;letter-spacing:.7px;fill:#73687A;text-transform:uppercase}
.ts-axis{stroke:#4D225D;stroke-width:1.5}
.ts-val{font-size:25px;font-weight:600}
.ts-lab{font-size:17px;font-weight:500}
.ts-val-in{font-size:21px;font-weight:600;fill:#4D225D}
.ts-weight{font-size:19px;font-weight:300;fill:#73687A}
.ts-mean{stroke:#E64366;stroke-width:2;stroke-dasharray:6 4}
.ts-mean-lab{font-size:20px;font-weight:600;fill:#E64366;paint-order:stroke;stroke:#fff;stroke-width:6px}
.ts-edge{fill:none;stroke:#4D225D;stroke-width:2.2}
.ts-cap{font-size:18px;font-weight:300;fill:#73687A}
</style>
