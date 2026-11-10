<script setup>
// Algorithm 2 · k-means on zone profiles. The three snapshots below are the real
// iterations of k-means (k = 3) on nine synthetic zones; centroids start badly placed on purpose.
// Text comes from labels.json (`km`).
import labels from '../../labels.json'
const t = { ...labels.km, decimal: labels.decimal }
const n = (x, d = 1) => x.toFixed(d).replace('.', t.decimal)
// zone: [x = % of demand in the morning rush, y = % of demand at night]
const zones = { A: [48, 4], B: [55, 6], C: [52, 3], D: [30, 12], E: [26, 16], F: [34, 10], G: [8, 42], H: [12, 48], I: [10, 38] }
const COLORS = ['#2A9D8F', '#4D225D', '#E64366']          // 0 residential, 1 business, 2 nightlife
const panels = [
  { x0: 0, title: t.p1, cap: t.c1, assign: { A: 0, B: 1, C: 0, D: 0, E: 0, F: 0, G: 2, H: 2, I: 2 }, from: null,
    cent: [[48, 4], [55, 6], [10, 38]] },
  { x0: 388, title: t.p2, cap: t.c2, assign: { A: 1, B: 1, C: 1, D: 0, E: 0, F: 0, G: 2, H: 2, I: 2 }, from: [[48, 4], [55, 6], [10, 38]],
    cent: [[38, 9], [55, 6], [10, 42.67]] },
  { x0: 776, title: t.p3, cap: t.c3, assign: { A: 1, B: 1, C: 1, D: 0, E: 0, F: 0, G: 2, H: 2, I: 2 }, from: [[38, 9], [55, 6], [10, 42.67]],
    cent: [[30, 12.67], [51.67, 4.33], [10, 42.67]], final: true }
]
const W = 360, PL = 40, PW = 308, PT = 58, PB = 318, XMAX = 62, YMAX = 55
const px = v => PL + (v / XMAX) * PW
const py = v => PB - (v / YMAX) * (PB - PT)
</script>
<template>
  <svg class="km-viz" viewBox="0 0 1136 420" width="1136" height="420" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="t.aria">
    <defs><marker id="km-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.500" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3.500 L0,7 Z" fill="#4D225D" /></marker></defs>
    <g v-for="(p, pi) in panels" :key="pi" :transform="`translate(${p.x0} 0)`">
      <text x="0" y="18" class="km-title">{{ p.title }}</text>
      <rect :x="PL" :y="PT" :width="PW" :height="PB - PT" class="km-plot" />
      <!-- axes -->
      <text :x="PL + PW / 2" :y="PB + 24" text-anchor="middle" class="km-axis">{{ t.xAxis }}</text>
      <text :transform="`translate(12 ${(PT + PB) / 2}) rotate(-90)`" text-anchor="middle" class="km-axis">{{ t.yAxis }}</text>
      <!-- movement of centroids -->
      <g v-if="p.from">
        <line v-for="(c, i) in p.cent" :key="'m' + i" :x1="px(p.from[i][0])" :y1="py(p.from[i][1])" :x2="px(c[0])" :y2="py(c[1])" class="km-move" marker-end="url(#km-arrow)" />
        <g v-for="(c, i) in p.from" :key="'o' + i" :transform="`translate(${px(c[0])} ${py(c[1])})`"><rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" fill="#fff" :stroke="COLORS[i]" stroke-width="2" stroke-dasharray="3 2" /></g>
      </g>
      <!-- zones -->
      <g v-for="(xy, k) in zones" :key="k" :transform="`translate(${px(xy[0])} ${py(xy[1])})`">
        <circle r="13" :fill="COLORS[p.assign[k]]" stroke="#fff" stroke-width="2" />
        <text y="5.500" text-anchor="middle" class="km-pt">{{ k }}</text>
      </g>
      <!-- centroids -->
      <g v-for="(c, i) in p.cent" :key="'c' + i" :transform="`translate(${px(c[0])} ${py(c[1])})`">
        <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" :fill="COLORS[i]" stroke="#000" stroke-width="2.200" />
      </g>
      <!-- group names on the last panel -->
      <template v-if="p.final">
        <text :x="px(p.cent[0][0]) + 10" :y="py(p.cent[0][1]) - 44" text-anchor="middle" class="km-name" fill="#2A9D8F">{{ t.g0 }}</text>
        <text :x="px(p.cent[1][0]) - 12" :y="py(p.cent[1][1]) - 32" text-anchor="middle" class="km-name" fill="#4D225D">{{ t.g1 }}</text>
        <text :x="px(p.cent[2][0]) + 36" :y="py(p.cent[2][1]) + 54" text-anchor="middle" class="km-name" fill="#E64366">{{ t.g2 }}</text>
      </template>
      <text x="0" y="362" class="km-cap"><tspan v-for="(l, i) in String(p.cap).split('\n')" :key="i" x="0" :dy="i ? 20 : 0">{{ l }}</tspan></text>
    </g>
  </svg>
</template>
<style scoped>
.km-viz{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.km-title{font-size:22px;font-weight:600}
.km-plot{fill:#F7F5F8;stroke:#4D225D;stroke-width:1.2}
.km-axis{font-size:17px;font-weight:300;fill:#73687A}
.km-pt{font-size:18px;font-weight:600;fill:#fff}
.km-move{stroke:#4D225D;stroke-width:1.8;stroke-dasharray:4 3}
.km-name{font-size:20px;font-weight:600;paint-order:stroke;stroke:#F7F5F8;stroke-width:5px}
.km-cap{font-size:18px;font-weight:300;fill:#4D225D}
</style>
