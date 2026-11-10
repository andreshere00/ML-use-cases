<script setup>
import { computed } from 'vue'
// All visible text comes from the slide's `labels` front matter, so the same
// component serves every language. "\n" in a label starts a new line.
const props = defineProps({ t: { type: Object, required: true } })
const L = k => String(props.t[k] ?? '').split('\n')
const gateTitle = computed(() => L('gate'))
const noteY = computed(() => 196 + (gateTitle.value.length - 1) * 26)
const cells = computed(() => [
  { id: 'ga', x: 716, y: 58, kind: 'ok', icon: 'check', title: props.t.gaTitle, note: L('gaNote') },
  { id: 'gb', x: 924, y: 58, kind: 'bad', icon: 'cross', title: props.t.gbTitle, note: L('gbNote') },
  { id: 'ba', x: 716, y: 230, kind: 'bad', icon: 'coin', title: props.t.baTitle, note: L('baNote') },
  { id: 'bb', x: 924, y: 230, kind: 'ok', icon: 'check', title: props.t.bbTitle, note: L('bbNote') }
])
</script>
<template>
  <div class="problem-diagram" role="img" :aria-label="t.aria">
    <svg viewBox="0 0 1136 420" width="1136" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="pd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#4D225D" /></marker>
        <linearGradient id="pd-risk" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#EDE9EF" /><stop offset="1" stop-color="#E64366" /></linearGradient>
      </defs>

      <!-- lane headers -->
      <g class="pd-lane"><text x="0" y="18">{{ t.laneRequests }}</text><text x="330" y="18">{{ t.laneDecision }}</text><text x="600" y="18">{{ t.laneOutcome }}</text></g>

      <!-- 1 · requests -->
      <g>
        <rect x="0.75" y="58.75" width="268.5" height="158.5" class="pd-card" />
        <circle cx="44" cy="92" r="14" fill="#4D225D" /><path d="M18 134 Q18 110 44 110 Q70 110 70 134 Z" fill="#4D225D" />
        <text x="92" y="98" class="pd-title"><tspan>{{ t.genuine }}</tspan></text>
        <text x="92" y="124" class="pd-note"><tspan v-for="(l, i) in L('genuineNote')" :key="i" x="92" :dy="i ? 20 : 0">{{ l }}</tspan></text>
        <g transform="translate(20 166)"><path d="M6 0 H40 Q46 0 46 6 V24 Q46 30 40 30 H18 L8 40 V30 H6 Q0 30 0 24 V6 Q0 0 6 0 Z" fill="#fff" stroke="#4D225D" stroke-width="1.8" /><circle cx="15" cy="15" r="2.6" fill="#4D225D" /><circle cx="23" cy="15" r="2.6" fill="#4D225D" /><circle cx="31" cy="15" r="2.6" fill="#4D225D" /></g>
        <text x="76" y="192" class="pd-count">× 1</text>
      </g>
      <g>
        <rect x="1" y="231" width="268" height="158" class="pd-card pd-card-bot" />
        <rect x="22" y="262" width="46" height="34" rx="8" fill="#E64366" /><circle cx="36" cy="278" r="4.5" fill="#fff" /><circle cx="54" cy="278" r="4.5" fill="#fff" /><line x1="45" y1="262" x2="45" y2="251" stroke="#E64366" stroke-width="2.5" /><circle cx="45" cy="249" r="3.5" fill="#E64366" /><rect x="30" y="299" width="30" height="7" rx="3" fill="#E64366" />
        <text x="84" y="278" class="pd-title pd-title-bot">{{ t.bot }}</text>
        <text x="84" y="302" class="pd-note"><tspan v-for="(l, i) in L('botNote')" :key="i" x="84" :dy="i ? 19 : 0">{{ l }}</tspan></text>
        <g v-for="i in 5" :key="i" :transform="`translate(${20 + (i - 1) * 30} 352)`"><path d="M4 0 H24 Q28 0 28 4 V15 Q28 19 24 19 H12 L6 25 V19 H4 Q0 19 0 15 V4 Q0 0 4 0 Z" fill="#E64366" /></g>
        <text x="182" y="372" class="pd-count pd-count-bot">× 100s</text>
      </g>

      <!-- arrows into the decision -->
      <path d="M270 138 H300 V200 H326" class="pd-edge" marker-end="url(#pd-arrow)" />
      <path d="M270 310 H300 V250 H326" class="pd-edge" marker-end="url(#pd-arrow)" />

      <!-- 2 · decision -->
      <rect x="330" y="128" width="230" height="194" fill="#4D225D" />
      <text x="445" y="168" text-anchor="middle" class="pd-gate-title"><tspan v-for="(l, i) in gateTitle" :key="i" x="445" :dy="i ? 26 : 0">{{ l }}</tspan></text>
      <text x="445" :y="noteY" text-anchor="middle" class="pd-gate-note"><tspan v-for="(l, i) in L('gateNote')" :key="i" x="445" :dy="i ? 20 : 0">{{ l }}</tspan></text>
      <rect x="356" y="268" width="178" height="12" rx="6" fill="url(#pd-risk)" />
      <line x1="466" y1="259" x2="466" y2="289" stroke="#fff" stroke-width="3.5" stroke-linecap="round" />
      <text x="356" y="308" class="pd-gate-small">{{ t.low }}</text><text x="534" y="308" text-anchor="end" class="pd-gate-small">{{ t.high }}</text>

      <path d="M560 225 H592" class="pd-edge" marker-end="url(#pd-arrow)" />

      <!-- 3 · outcomes -->
      <text x="816" y="46" text-anchor="middle" class="pd-col">{{ t.allow }}</text><text x="1024" y="46" text-anchor="middle" class="pd-col">{{ t.block }}</text>
      <text x="600" class="pd-row"><tspan v-for="(l, i) in L('rowGenuine')" :key="i" x="600" :y="132 + i * 22">{{ l }}</tspan></text>
      <text x="600" y="316" class="pd-row">{{ t.rowBot }}</text>
      <g v-for="c in cells" :key="c.id" :transform="`translate(${c.x} ${c.y})`">
        <rect x="0.75" y="0.75" width="198.5" height="158.5" :class="['pd-cell', 'pd-cell-' + c.kind]" />
        <template v-if="c.icon === 'check'"><circle cx="100" cy="38" r="18" fill="#4D225D" /><path d="M91 38 L98 45 L110 30" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" /></template>
        <template v-else-if="c.icon === 'cross'"><circle cx="100" cy="38" r="18" fill="#E64366" /><path d="M92 30 L108 46 M108 30 L92 46" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" /></template>
        <template v-else><circle cx="100" cy="38" r="18" fill="#E64366" /><circle cx="100" cy="38" r="13" fill="none" stroke="#fff" stroke-width="1.6" /><text x="100" y="45" text-anchor="middle" class="pd-coin">€</text></template>
        <text x="100" y="86" text-anchor="middle" :class="['pd-cell-title', 'pd-cell-title-' + c.kind]">{{ c.title }}</text>
        <text x="100" y="112" text-anchor="middle" class="pd-cell-note"><tspan v-for="(l, i) in c.note" :key="i" x="100" :dy="i ? 20 : 0">{{ l }}</tspan></text>
      </g>
    </svg>
  </div>
</template>
<style scoped>
.problem-diagram{position:absolute;top:100px;left:0;width:1136px;height:420px}
svg{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.pd-lane text{font-size:16px;font-weight:600;letter-spacing:.7px;fill:#73687A;text-transform:uppercase}
.pd-card{fill:#EDE9EF;stroke:#4D225D;stroke-width:1.5}.pd-card-bot{fill:#fff3f5;stroke:#E64366;stroke-width:2}
.pd-title{font-size:22px;font-weight:600}.pd-title-bot{fill:#E64366}
.pd-note{font-size:15.5px;font-weight:300}
.pd-count{font-size:22px;font-weight:600}.pd-count-bot{fill:#E64366}
.pd-edge{fill:none;stroke:#4D225D;stroke-width:2.2;stroke-linejoin:round}
.pd-gate-title{font-size:23px;font-weight:600;fill:#fff}.pd-gate-note{font-size:17px;font-weight:300;fill:#EDE9EF}.pd-gate-small{font-size:15px;font-weight:300;fill:#EDE9EF}
.pd-col{font-size:20px;font-weight:600}.pd-row{font-size:18px;font-weight:600;fill:#73687A}
.pd-cell{fill:#EDE9EF;stroke:#4D225D;stroke-width:1.5}.pd-cell-bad{fill:#fff3f5;stroke:#E64366;stroke-width:2.5}
.pd-cell-title{font-size:20px;font-weight:600}.pd-cell-title-bad{fill:#E64366}
.pd-cell-note{font-size:17px;font-weight:300}
.pd-coin{font-size:19px;font-weight:600;fill:#fff}
</style>
