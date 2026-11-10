<script setup>
// Algorithm 3 · regression + equilibrium. Everything is computed here (log-linear least
// squares on six synthetic observations, then a bisection for demand(m) = supply(m)).
// Text comes from labels.json (`reg`).
import labels from '../../labels.json'
const t = { ...labels.reg, decimal: labels.decimal }
const n = (x, d = 1) => x.toFixed(d).replace('.', t.decimal)
const BASE = 165                 // demand forecast from algorithm 1 (requests / 15 min)
const SUPPLY0 = 110, SUPPLY_SLOPE = 0.6
const obsM = [1.0, 1.2, 1.5, 1.8, 2.0, 2.5]
const obsPct = [100, 92, 79, 68, 61, 47]
// least squares on ln(pct) = a - beta * (m - 1)
const xs = obsM.map(m => m - 1), ys = obsPct.map(Math.log)
const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length
const slope = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0)
const beta = -slope
const demand = m => BASE * Math.exp(-beta * (m - 1))
const supply = m => SUPPLY0 * (1 + SUPPLY_SLOPE * (m - 1))
let lo = 1, hi = 4
for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (demand(mid) > supply(mid)) lo = mid; else hi = mid }
const mStar = (lo + hi) / 2, vStar = demand(mStar)

const L = 62, R = 600, T = 26, B = 326, MMIN = 1, MMAX = 2.6, VMAX = 220
const px = m => L + (m - MMIN) / (MMAX - MMIN) * (R - L)
const py = v => B - v / VMAX * (B - T)
const curve = (f) => Array.from({ length: 33 }, (_, i) => { const m = MMIN + i * (MMAX - MMIN) / 32; return `${i ? 'L' : 'M'}${px(m).toFixed(1)},${py(f(m)).toFixed(1)}` }).join(' ')
const points = obsM.map((m, i) => ({ m, v: BASE * obsPct[i] / 100 }))
</script>
<template>
  <svg class="rg-viz" viewBox="0 0 636 440" width="636" height="440" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="t.aria">
    <!-- grid + axes -->
    <g class="rg-grid"><line v-for="v in [50, 100, 150, 200]" :key="v" :x1="L" :y1="py(v)" :x2="R" :y2="py(v)" /></g>
    <line :x1="L" :y1="B" :x2="R" :y2="B" class="rg-axis" /><line :x1="L" :y1="T" :x2="L" :y2="B" class="rg-axis" />
    <text v-for="v in [0, 50, 100, 150, 200]" :key="'y' + v" :x="L - 8" :y="py(v) + 5" text-anchor="end" class="rg-tick">{{ v }}</text>
    <text v-for="m in [1, 1.5, 2, 2.5]" :key="'x' + m" :x="px(m)" :y="B + 22" text-anchor="middle" class="rg-tick">{{ n(m, 1) }}×</text>
    <text :x="(L + R) / 2" :y="B + 46" text-anchor="middle" class="rg-axis-lab">{{ t.xAxis }}</text>
    <text :x="L" y="12" class="rg-axis-lab">{{ t.yAxis }}</text>

    <!-- curves -->
    <path :d="curve(demand)" class="rg-demand" />
    <path :d="curve(supply)" class="rg-supply" />
    <circle v-for="p in points" :key="p.m" :cx="px(p.m)" :cy="py(p.v)" r="6.500" class="rg-obs" />

    <!-- gap at normal price -->
    <path :d="`M${px(1) + 14} ${py(165)} V${py(110)}`" class="rg-gap" />
    <text :x="px(1) + 22" :y="(py(165) + py(110)) / 2 + 5" class="rg-gap-lab">−{{ n(165 - 110, 0) }}</text>

    <!-- equilibrium -->
    <line :x1="px(mStar)" :y1="py(vStar)" :x2="px(mStar)" :y2="B" class="rg-guide" />
    <line :x1="L" :y1="py(vStar)" :x2="px(mStar)" :y2="py(vStar)" class="rg-guide" />
    <circle :cx="px(mStar)" :cy="py(vStar)" r="10" class="rg-eq" />
    <text :x="px(mStar) + 12" :y="py(vStar) + 56" class="rg-eq-lab">m* = {{ n(mStar, 2) }}×</text>
    <text :x="px(mStar) + 12" :y="py(vStar) + 78" class="rg-eq-sub">≈ {{ n(vStar, 0) }}</text>

    <!-- legend -->
    <g transform="translate(372 254)">
      <line x1="0" y1="0" x2="26" y2="0" class="rg-demand" /><text x="34" y="5" class="rg-leg">{{ t.legDemand }}</text>
      <circle cx="13" cy="26" r="6.500" class="rg-obs" /><text x="34" y="31" class="rg-leg">{{ t.legObs }}</text>
      <line x1="0" y1="52" x2="26" y2="52" class="rg-supply" /><text x="34" y="57" class="rg-leg">{{ t.legSupply }}</text>
    </g>
    <text :x="L" :y="B + 74" class="rg-formula">{{ t.fDemand.replace('{b}', n(beta, 2)) }}</text>
    <text :x="L" :y="B + 98" class="rg-formula">{{ t.fSupply }}</text>
  </svg>
</template>
<style scoped>
.rg-viz{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.rg-grid line{stroke:#EDE9EF;stroke-width:1.2}
.rg-axis{stroke:#4D225D;stroke-width:1.5}
.rg-tick{font-size:17px;font-weight:300;fill:#73687A}
.rg-axis-lab{font-size:19px;font-weight:500}
.rg-demand{fill:none;stroke:#E64366;stroke-width:3.2;stroke-linecap:round}
.rg-supply{fill:none;stroke:#4D225D;stroke-width:3.2;stroke-dasharray:8 5;stroke-linecap:round}
.rg-obs{fill:#fff;stroke:#E64366;stroke-width:2.6}
.rg-gap{stroke:#4D225D;stroke-width:2;stroke-dasharray:2 3;fill:none}
.rg-gap-lab{font-size:18px;font-weight:600;fill:#4D225D;paint-order:stroke;stroke:#fff;stroke-width:5px}
.rg-guide{stroke:#4D225D;stroke-width:1.4;stroke-dasharray:4 4}
.rg-eq{fill:#2A9D8F;stroke:#fff;stroke-width:3}
.rg-eq-lab{font-size:23px;font-weight:600;fill:#2A9D8F;paint-order:stroke;stroke:#fff;stroke-width:6px}
.rg-eq-sub{font-size:19px;font-weight:500;fill:#2A9D8F;paint-order:stroke;stroke:#fff;stroke-width:6px}
.rg-leg{font-size:19px;font-weight:300}
.rg-formula{font-size:19px;font-weight:500;fill:#4D225D}
</style>
