<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import BrandFrame from '../components/BrandFrame.vue'
import SolutionDiagram from '../components/SolutionDiagram.vue'
import CabifyTrafficExplorer from '../components/CabifyTrafficExplorer.vue'
import diagrams from '../../diagrams.json'
const props = defineProps({ diagram: String })
const spec = computed(() => diagrams[props.diagram])
const isInteractive = computed(() => props.diagram === 'binary')
const nav = useNav()
const slideBoundary = direction => direction > 0 ? nav.nextSlide() : nav.prevSlide()
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle">{{ spec.subtitle }}</div>
    <template v-if="isInteractive">
      <div class="spotify-live" data-cabify-mount><CabifyTrafficExplorer :on-slide-boundary="slideBoundary" /></div>
      <div class="spotify-print"><SolutionDiagram :spec="spec" /></div>
    </template>
    <SolutionDiagram v-else :spec="spec" />
    <div class="solution-caption" :class="{'spotify-static-caption':isInteractive}">{{ spec.caption }}</div>
    <div class="solution-source" :class="{'spotify-interactive-source':isInteractive}">Source: <a :href="spec.source" target="_blank" rel="noopener">{{ spec.sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.spotify-live{position:absolute;top:100px;left:0;width:1136px;height:472px}.spotify-print{display:none}.spotify-static-caption{display:none}
.spotify-interactive-source{top:575px;font-size:13px}
@media print{.spotify-live{display:none!important}.spotify-print,.spotify-static-caption{display:block!important}.spotify-interactive-source{top:562px;font-size:17px}}
</style>
