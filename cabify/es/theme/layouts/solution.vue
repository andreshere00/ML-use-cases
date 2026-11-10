<script setup>
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import BrandFrame from '../components/BrandFrame.vue'
import SolutionDiagram from '../components/SolutionDiagram.vue'
import CabifyTrafficExplorer from '../components/CabifyTrafficExplorer.vue'
import diagrams from '../../diagrams.json'
const props = defineProps({ diagram: String })
const spec = computed(() => diagrams[props.diagram])
const isInteractive = computed(() => props.diagram === 'binary')
const nav = useNav()
const { $clicks: slideClicks } = useSlideContext()
// PDF export with --with-clicks (print=clicks): click 0 = overview diagram, click n = n-th explorer stage
const staged = typeof location !== 'undefined' && new URLSearchParams(location.search).get('print') === 'clicks'
const stagePage = computed(() => staged && isInteractive.value && slideClicks.value > 0)
const slideBoundary = direction => direction > 0 ? nav.nextSlide() : nav.prevSlide()
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle">{{ spec.subtitle }}</div>
    <template v-if="isInteractive">
      <template v-if="staged">
        <div v-for="n in 5" :key="n" v-click class="print-click" />
        <div v-if="slideClicks > 0" class="spotify-staged"><CabifyTrafficExplorer :print-stage="slideClicks - 1" /></div>
        <div v-else class="spotify-print-overview"><SolutionDiagram :spec="spec" /></div>
      </template>
      <template v-else>
        <div class="spotify-live" data-cabify-mount><CabifyTrafficExplorer :on-slide-boundary="slideBoundary" /></div>
        <div class="spotify-print"><SolutionDiagram :spec="spec" /></div>
      </template>
    </template>
    <SolutionDiagram v-else :spec="spec" />
    <div class="solution-caption" :class="{'spotify-static-caption':isInteractive,'staged-page':stagePage}">{{ spec.caption }}</div>
    <div class="solution-source" :class="{'spotify-interactive-source':isInteractive,'staged-page':stagePage}">Fuente: <a :href="spec.source" target="_blank" rel="noopener">{{ spec.sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.spotify-live{position:absolute;top:100px;left:0;width:1136px;height:472px}.spotify-print{display:none}.spotify-static-caption{display:none}
.spotify-interactive-source{top:575px;font-size:13px}
@media print{.spotify-live{display:none!important}.spotify-print,.spotify-static-caption{display:block!important}.spotify-interactive-source{top:562px;font-size:17px}}
.spotify-staged{position:absolute;top:100px;left:0;width:1136px;height:472px}.print-click{display:none}
.solution-caption.staged-page{display:none!important}.solution-source.spotify-interactive-source.staged-page{top:575px;font-size:13px}
</style>
