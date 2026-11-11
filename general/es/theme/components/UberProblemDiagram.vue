<script setup>
// Overview of the problem. Every visible string comes from labels.json (`problem`),
// so the same component serves every language. "\n" in a label starts a new line.
const props = defineProps({ t: { type: Object, required: true } })
const L = k => String(props.t[k] ?? '').split('\n')
const chips = [
  { icon: 'clock', key: 'chipTime', y: 50 },
  { icon: 'cloud', key: 'chipWeather', y: 124 },
  { icon: 'star', key: 'chipEvents', y: 198 },
  { icon: 'car', key: 'chipTraffic', y: 272 }
]
</script>
<template>
  <div class="problem-diagram" role="img" :aria-label="t.aria">
    <svg viewBox="0 0 1136 420" width="1136" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="up-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#4D225D" /></marker>
      </defs>

      <!-- lane headers -->
      <g class="up-lane"><text x="0" y="18">{{ t.laneDrivers }}</text><text x="340" y="18">{{ t.laneZone }}</text><text x="730" y="18">{{ t.laneOutcome }}</text></g>

      <!-- 1 · demand drivers -->
      <g v-for="c in chips" :key="c.key">
        <rect x="0.75" :y="c.y + 0.75" width="248.5" height="60.5" class="up-chip" />
        <g :transform="`translate(18 ${c.y + 14})`" class="up-icon">
          <template v-if="c.icon === 'clock'"><circle cx="16" cy="16" r="14" /><path d="M16 8 V16 L22 20" /></template>
          <template v-else-if="c.icon === 'cloud'"><path d="M8 22 Q1 22 1 15 Q1 9 8 9 Q10 2 18 2 Q26 2 28 10 Q33 11 33 16 Q33 22 27 22 Z" /><path d="M10 27 L8 32 M18 27 L16 32 M26 27 L24 32" /></template>
          <template v-else-if="c.icon === 'star'"><path d="M16 2 L20 12 L31 12 L22 19 L25.500 30 L16 23.500 L6.500 30 L10 19 L1 12 L12 12 Z" /></template>
          <template v-else><path d="M2 20 L5 11 Q6 8 9 8 H23 Q26 8 27 11 L30 20 V26 H2 Z" /><circle cx="9" cy="26" r="3.500" class="up-fill" /><circle cx="23" cy="26" r="3.500" class="up-fill" /></template>
        </g>
        <text x="72" :y="c.y + 38" class="up-chip-text">{{ t[c.key] }}</text>
      </g>

      <!-- bus into the zone -->
      <path d="M250 80 H290 V210 M250 154 H290 M250 228 H290 M250 302 H290 V210 M290 210 H336" class="up-edge" marker-end="url(#up-arrow)" />

      <!-- 2 · the zone -->
      <rect x="340.750" y="50.750" width="338.500" height="284.500" class="up-zone" />
      <text x="510" y="86" text-anchor="middle" class="up-zone-title">{{ t.zoneTitle }}</text>
      <text x="510" y="108" text-anchor="middle" class="up-zone-sub">{{ t.zoneSub }}</text>
      <line x1="372" y1="310" x2="648" y2="310" class="up-axis" />
      <rect x="392" y="162" width="76" height="148" fill="#E64366" />
      <rect x="552" y="211" width="76" height="99" fill="#4D225D" />
      <text x="430" y="152" text-anchor="middle" class="up-val up-val-bad">{{ t.demandValue }}</text>
      <text x="590" y="201" text-anchor="middle" class="up-val">{{ t.supplyValue }}</text>
      <text x="430" y="330" text-anchor="middle" class="up-bar-label">{{ t.demand }}</text>
      <text x="590" y="330" text-anchor="middle" class="up-bar-label">{{ t.supply }}</text>
      <path d="M468 162 H640 M468 211 H640" class="up-gap" />
      <path d="M640 164 V209 M634 172 L640 164 L646 172 M634 201 L640 209 L646 201" class="up-gap" style="stroke-dasharray:none" />
      <text x="510" y="192" text-anchor="middle" class="up-gap-label">{{ t.gap }}</text>

      <!-- arrows to outcomes -->
      <path d="M680 210 H710 V115 H726 M710 210 V269 H726" class="up-edge" marker-end="url(#up-arrow)" />

      <!-- 3 · outcomes -->
      <g>
        <rect x="730.750" y="50.750" width="404.500" height="128.500" class="up-out up-out-bad" />
        <text x="750" y="86" class="up-out-title up-out-title-bad">{{ t.outA }}</text>
        <text x="750" y="114" class="up-out-note"><tspan v-for="(l, i) in L('outANote')" :key="i" x="750" :dy="i ? 22 : 0">{{ l }}</tspan></text>
        <text x="750" y="164" class="up-out-tag up-out-tag-bad">{{ t.outATag }}</text>
      </g>
      <g>
        <rect x="730.750" y="206.750" width="404.500" height="128.500" class="up-out" />
        <text x="750" y="242" class="up-out-title">{{ t.outB }}</text>
        <text x="750" y="270" class="up-out-note"><tspan v-for="(l, i) in L('outBNote')" :key="i" x="750" :dy="i ? 22 : 0">{{ l }}</tspan></text>
        <text x="750" y="320" class="up-out-tag">{{ t.outBTag }}</text>
      </g>

      <!-- the challenge -->
      <rect x="0" y="366" width="1136" height="52" fill="#4D225D" />
      <text x="568" y="400" text-anchor="middle" class="up-banner">{{ t.challenge }}</text>
    </svg>
  </div>
</template>
<style scoped>
.problem-diagram{position:absolute;top:100px;left:0;width:1136px;height:420px}
svg{display:block;overflow:visible;font-family:Urbane,Arial,sans-serif;fill:#4D225D}
.up-lane text{font-size:16px;font-weight:600;letter-spacing:.7px;fill:#73687A;text-transform:uppercase}
.up-chip{fill:#EDE9EF;stroke:#4D225D;stroke-width:1.5}
.up-chip-text{font-size:21px;font-weight:600}
.up-icon{fill:none;stroke:#4D225D;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.up-icon .up-fill{fill:#4D225D}
.up-edge{fill:none;stroke:#4D225D;stroke-width:2.2;stroke-linejoin:round}
.up-zone{fill:#fff;stroke:#4D225D;stroke-width:1.5}
.up-zone-title{font-size:22px;font-weight:600}.up-zone-sub{font-size:16px;font-weight:300;fill:#73687A}
.up-axis{stroke:#4D225D;stroke-width:1.5}
.up-val{font-size:26px;font-weight:600}.up-val-bad{fill:#E64366}
.up-bar-label{font-size:17px;font-weight:500}
.up-gap{fill:none;stroke:#E64366;stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round;stroke-linejoin:round}
.up-gap-label{font-size:18px;font-weight:600;fill:#E64366;paint-order:stroke;stroke:#fff;stroke-width:6px}
.up-out{fill:#EDE9EF;stroke:#4D225D;stroke-width:1.5}.up-out-bad{fill:#fff3f5;stroke:#E64366;stroke-width:2.5}
.up-out-title{font-size:21px;font-weight:600}.up-out-title-bad{fill:#E64366}
.up-out-note{font-size:17px;font-weight:300}
.up-out-tag{font-size:15px;font-weight:600;letter-spacing:.5px;fill:#73687A;text-transform:uppercase}.up-out-tag-bad{fill:#E64366}
.up-banner{font-size:22px;font-weight:600;fill:#fff}
</style>
