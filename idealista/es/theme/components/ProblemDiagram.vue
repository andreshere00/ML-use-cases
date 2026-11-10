<script setup>
import { computed } from 'vue'
// All visible text comes from the slide's `labels` front matter, so the same
// component serves every language. "\n" in a label starts a new line.
const props = defineProps({ t: { type: Object, required: true } })
const L = k => String(props.t[k] ?? '').split('\n')
const modelTitle = computed(() => L('model'))
const noteY = computed(() => 146 + (modelTitle.value.length - 1) * 26 + 30)
const dots = [[376, 292], [392, 283], [410, 285], [428, 272], [446, 273], [490, 262], [508, 255], [524, 257]]
const cells = computed(() => [
  { id: 'low', x: 600, kind: 'bad', icon: 'down', title: props.t.low, note: L('lowNote') },
  { id: 'ok', x: 783, kind: 'ok', icon: 'check', title: props.t.ok, note: L('okNote') },
  { id: 'high', x: 966, kind: 'bad', icon: 'up', title: props.t.high, note: L('highNote') }
])
</script>
<template>
  <div class="problem-diagram" role="img" :aria-label="t.aria">
    <svg viewBox="0 0 1136 420" width="1136" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="pd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#4D225D" /></marker>
        <path id="pd-house" d="M22 0 L0 15 H5 V30 H39 V15 H44 Z" />
        <clipPath id="pd-close-zone"><rect x="183" y="0" width="170" height="160" /></clipPath>
      </defs>

      <!-- lane headers -->
      <g class="pd-lane"><text x="0" y="18">{{ t.laneInputs }}</text><text x="330" y="18">{{ t.laneModel }}</text><text x="600" y="18">{{ t.laneOutcome }}</text></g>

      <!-- 1 · inputs -->
      <g>
        <rect x="0.75" y="58.75" width="268.5" height="158.5" class="pd-card" />
        <g fill="#4D225D"><path d="M44 80 L14 104 H22 V132 H66 V104 H74 Z" /><rect x="38" y="112" width="12" height="20" fill="#EDE9EF" /></g>
        <text x="92" y="98" class="pd-title">{{ t.subject }}</text>
        <text x="92" y="124" class="pd-note"><tspan v-for="(l, i) in L('subjectNote')" :key="i" x="92" :dy="i ? 20 : 0">{{ l }}</tspan></text>
        <rect x="20.75" y="166.75" width="64" height="34" rx="17" class="pd-tag-unknown" /><text x="52.75" y="190" text-anchor="middle" class="pd-tag-text">€ ?</text>
        <text x="98" y="189" class="pd-unknown">{{ t.unknown }}</text>
      </g>
      <g>
        <rect x="0.75" y="231.75" width="268.5" height="157.5" class="pd-card" />
        <text x="20" y="264" class="pd-title">{{ t.comps }}</text>
        <text x="20" y="290" class="pd-note"><tspan v-for="(l, i) in L('compsNote')" :key="i" x="20" :dy="i ? 20 : 0">{{ l }}</tspan></text>
        <g v-for="i in 4" :key="i" :transform="`translate(${20 + (i - 1) * 62} 326)`">
          <use href="#pd-house" fill="#4D225D" />
          <rect x="0.75" y="35.75" width="42.5" height="19" rx="9.5" class="pd-tag-known" /><text x="22" y="50" text-anchor="middle" class="pd-tag-mini">€</text>
        </g>
      </g>

      <!-- arrows into the model -->
      <path d="M270 138 H300 V200 H326" class="pd-edge" marker-end="url(#pd-arrow)" />
      <path d="M270 310 H300 V250 H326" class="pd-edge" marker-end="url(#pd-arrow)" />

      <!-- 2 · model -->
      <rect x="330" y="106" width="230" height="234" fill="#4D225D" />
      <text x="445" y="146" text-anchor="middle" class="pd-gate-title"><tspan v-for="(l, i) in modelTitle" :key="i" x="445" :dy="i ? 26 : 0">{{ l }}</tspan></text>
      <text x="445" :y="noteY" text-anchor="middle" class="pd-gate-note"><tspan v-for="(l, i) in L('modelNote')" :key="i" x="445" :dy="i ? 20 : 0">{{ l }}</tspan></text>
      <path d="M358 244 V298 H534" fill="none" stroke="#EDE9EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle v-for="(d, i) in dots" :key="i" :cx="d[0]" :cy="d[1]" r="3.4" fill="#EDE9EF" />
      <line x1="364" y1="290" x2="530" y2="250" stroke="#E64366" stroke-width="2.8" stroke-linecap="round" />
      <path d="M470 264.5 V298 M358 264.5 H470" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 4" />
      <circle cx="470" cy="264.5" r="6.5" fill="#fff" stroke="#E64366" stroke-width="2.6" />
      <text x="445" y="320" text-anchor="middle" class="pd-gate-small">{{ t.plot }}</text>

      <path d="M560 223 H592" class="pd-edge" marker-end="url(#pd-arrow)" />

      <!-- 3 · outcomes -->
      <g v-for="c in cells" :key="c.id" :transform="`translate(${c.x} 58)`">
        <rect x="0.75" y="0.75" width="168.5" height="158.5" :class="['pd-cell', 'pd-cell-' + c.kind]" />
        <circle cx="85" cy="38" r="18" :fill="c.kind === 'ok' ? '#4D225D' : '#E64366'" />
        <path v-if="c.icon === 'check'" d="M76 38 L83 45 L95 30" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />
        <path v-else-if="c.icon === 'down'" d="M85 28 V47 M77 40 L85 48 L93 40" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />
        <path v-else d="M85 48 V29 M77 36 L85 28 L93 36" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />
        <text x="85" y="86" text-anchor="middle" :class="['pd-cell-title', 'pd-cell-title-' + c.kind]">{{ c.title }}</text>
        <text x="85" y="112" text-anchor="middle" class="pd-cell-note"><tspan v-for="(l, i) in c.note" :key="i" x="85" :dy="i ? 20 : 0">{{ l }}</tspan></text>
      </g>

      <!-- error distribution -->
      <g transform="translate(600 231)">
        <rect x="0.75" y="0.75" width="534.5" height="157.5" class="pd-card" />
        <text x="20" y="34" class="pd-row">{{ t.errTitle }}</text>
        <path d="M20 118 C120 118 170 56 268 56 C366 56 416 118 516 118 Z" fill="rgba(230,67,102,.22)" />
        <path d="M20 118 C120 118 170 56 268 56 C366 56 416 118 516 118 Z" fill="rgba(77,34,93,.3)" clip-path="url(#pd-close-zone)" />
        <path d="M176.5 50 V118 M359.5 50 V118" stroke="#4D225D" stroke-width="1.4" stroke-dasharray="4 4" />
        <line x1="20" y1="118" x2="516" y2="118" stroke="#4D225D" stroke-width="2" stroke-linecap="round" />
        <text x="268" y="106" text-anchor="middle" class="pd-err-mid">{{ t.errMid }}</text>
        <text x="20" y="142" class="pd-err-axis">{{ t.errLow }}</text>
        <text x="268" y="142" text-anchor="middle" class="pd-err-axis pd-err-zero">0</text>
        <text x="516" y="142" text-anchor="end" class="pd-err-axis">{{ t.errHigh }}</text>
      </g>
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
.pd-tag-unknown{fill:#fff3f5;stroke:#E64366;stroke-width:2;stroke-dasharray:5 4}
.pd-tag-text{font-size:19px;font-weight:600;fill:#E64366}
.pd-unknown{font-size:17px;font-weight:600;fill:#E64366}
.pd-tag-known{fill:#fff;stroke:#4D225D;stroke-width:1.5}
.pd-tag-mini{font-size:14px;font-weight:600}
.pd-edge{fill:none;stroke:#4D225D;stroke-width:2.2;stroke-linejoin:round}
.pd-gate-title{font-size:23px;font-weight:600;fill:#fff}.pd-gate-note{font-size:17px;font-weight:300;fill:#EDE9EF}.pd-gate-small{font-size:14.5px;font-weight:300;fill:#EDE9EF}
.pd-row{font-size:18px;font-weight:600;fill:#73687A}
.pd-cell{fill:#EDE9EF;stroke:#4D225D;stroke-width:1.5}.pd-cell-bad{fill:#fff3f5;stroke:#E64366;stroke-width:2.5}
.pd-cell-title{font-size:20px;font-weight:600}.pd-cell-title-bad{fill:#E64366}
.pd-cell-note{font-size:17px;font-weight:300}
.pd-err-mid{font-size:15px;font-weight:600}.pd-err-axis{font-size:15px;font-weight:300}.pd-err-zero{font-size:17px;font-weight:600}
</style>
