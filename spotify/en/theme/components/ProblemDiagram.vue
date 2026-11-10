<script setup>
import { computed } from 'vue'
// All visible text comes from the slide's `labels` front matter, so the same
// component serves every language. "\n" in a label starts a new line.
const props = defineProps({ t: { type: Object, required: true } })
const L = k => String(props.t[k] ?? '').split('\n')

// Deterministic pseudo-random numbers so the dots never move between renders.
const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

// Unlabeled listeners: one grey cloud with no visible structure.
const crowd = computed(() => { const r = rng(7); return Array.from({ length: 38 }, () => ({ x: 30 + r() * 214, y: 158 + r() * 168 })) })
// Discovered groups: the same kind of points, now in three dense groups plus noise.
const groups = computed(() => {
  const r = rng(21)
  const centers = [{ x: 62, y: 56, c: '#4D225D' }, { x: 158, y: 48, c: '#E64366' }, { x: 112, y: 112, c: '#1ED760' }]
  const dots = centers.flatMap(g => Array.from({ length: 9 }, () => { const a = r() * 6.283, d = Math.sqrt(r()) * 30; return { x: g.x + Math.cos(a) * d, y: g.y + Math.sin(a) * d * 0.8, c: g.c } }))
  const noise = [{ x: 26, y: 134 }, { x: 206, y: 124 }, { x: 214, y: 30 }, { x: 24, y: 22 }, { x: 170, y: 144 }].map(p => ({ ...p, c: '#A8A8A8' }))
  return [...dots, ...noise]
})
const bars = [{ k: 'f1', v: 1 }, { k: 'f2', v: 0.74 }, { k: 'f3', v: 0.5 }, { k: 'f4', v: 0.26 }]
</script>
<template>
  <div class="problem-diagram" role="img" :aria-label="t.aria">
    <svg viewBox="0 0 1136 420" width="1136" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="pd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#4D225D" /></marker>
      </defs>

      <!-- lane headers -->
      <g class="pd-lane"><text x="0" y="18">{{ t.laneProblem }}</text><text x="330" y="18">{{ t.laneMethod }}</text><text x="620" y="18">{{ t.laneResult }}</text></g>

      <!-- 1 · the problem: listeners nobody has grouped yet -->
      <rect x="0.75" y="44.75" width="268.5" height="354.5" class="pd-card" />
      <text x="22" y="82" class="pd-title"><tspan v-for="(l, i) in L('listeners')" :key="i" x="22" :dy="i ? 26 : 0">{{ l }}</tspan></text>
      <text x="22" y="136" class="pd-note"><tspan v-for="(l, i) in L('listenersNote')" :key="i" x="22" :dy="i ? 20 : 0">{{ l }}</tspan></text>
      <circle v-for="(d, i) in crowd" :key="'c' + i" :cx="d.x" :cy="d.y" r="5.5" fill="#A8A8A8" />
      <text x="22" y="376" class="pd-ask">{{ t.ask }}</text>

      <!-- arrows -->
      <path d="M270 125 H326" class="pd-edge" marker-end="url(#pd-arrow)" />
      <path d="M270 319 H326" class="pd-edge" marker-end="url(#pd-arrow)" />
      <path d="M445 206 V234" class="pd-edge" marker-end="url(#pd-arrow)" />
      <text x="457" y="226" class="pd-small">{{ t.groupIds }}</text>
      <path d="M560 125 H616" class="pd-edge" marker-end="url(#pd-arrow)" />
      <path d="M560 319 H616" class="pd-edge" marker-end="url(#pd-arrow)" />

      <!-- 2 · the method -->
      <rect x="330" y="44" width="230" height="162" fill="#4D225D" />
      <text x="445" y="86" text-anchor="middle" class="pd-gate-title">{{ t.step1 }}</text>
      <text x="445" y="120" text-anchor="middle" class="pd-gate-note"><tspan v-for="(l, i) in L('step1Note')" :key="i" x="445" :dy="i ? 22 : 0">{{ l }}</tspan></text>
      <rect x="330" y="238" width="230" height="162" fill="#4D225D" />
      <text x="445" y="280" text-anchor="middle" class="pd-gate-title">{{ t.step2 }}</text>
      <text x="445" y="314" text-anchor="middle" class="pd-gate-note"><tspan v-for="(l, i) in L('step2Note')" :key="i" x="445" :dy="i ? 22 : 0">{{ l }}</tspan></text>

      <!-- 3 · the result -->
      <rect x="620.75" y="44.75" width="514.5" height="161.5" class="pd-card" />
      <g transform="translate(622 44)"><circle v-for="(d, i) in groups" :key="'g' + i" :cx="d.x" :cy="d.y" r="5.5" :fill="d.c" /></g>
      <text x="866" y="92" class="pd-title">{{ t.found }}</text>
      <text x="866" y="120" class="pd-note"><tspan v-for="(l, i) in L('foundNote')" :key="i" x="866" :dy="i ? 20 : 0">{{ l }}</tspan></text>

      <rect x="620.75" y="238.75" width="514.5" height="161.5" class="pd-card" />
      <g v-for="(b, i) in bars" :key="b.k" :transform="`translate(640 ${262 + i * 32})`">
        <text x="0" y="14" class="pd-bar-label">{{ t[b.k] }}</text>
        <rect x="140" y="2" width="80" height="16" rx="3" fill="#d8d0dc" />
        <rect x="140" y="2" :width="80 * b.v" height="16" rx="3" fill="#E64366" />
      </g>
      <text x="866" y="276" class="pd-title">{{ t.explained }}</text>
      <text x="866" y="304" class="pd-note"><tspan v-for="(l, i) in L('explainedNote')" :key="i" x="866" :dy="i ? 20 : 0">{{ l }}</tspan></text>
    </svg>
  </div>
</template>
<style scoped>
.problem-diagram{position:absolute;top:100px;left:0;width:1136px;height:420px}
svg{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.pd-lane text{font-size:16px;font-weight:600;letter-spacing:.7px;fill:#73687A;text-transform:uppercase}
.pd-card{fill:#EDE9EF;stroke:#4D225D;stroke-width:1.5}
.pd-title{font-size:22px;font-weight:600}
.pd-note{font-size:15.5px;font-weight:300}
.pd-ask{font-size:21px;font-weight:600;fill:#E64366}
.pd-small{font-size:14px;font-weight:300;fill:#73687A}
.pd-edge{fill:none;stroke:#4D225D;stroke-width:2.2;stroke-linejoin:round}
.pd-gate-title{font-size:23px;font-weight:600;fill:#fff}.pd-gate-note{font-size:17px;font-weight:300;fill:#EDE9EF}
.pd-bar-label{font-size:15px;font-weight:300}
</style>
