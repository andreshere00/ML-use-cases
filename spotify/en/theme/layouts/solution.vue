<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import BrandFrame from '../components/BrandFrame.vue'
import SolutionDiagram from '../components/SolutionDiagram.vue'
import SpotifyClusteringExplorer from '../components/SpotifyClusteringExplorer.vue'
import diagrams from '../../diagrams.json'
const props = defineProps({ diagram: String })
const spec = computed(() => diagrams[props.diagram])
const isInteractive = computed(() => props.diagram === 'clustering')
const companyBrand = computed(() => ({clustering:{src:'/assets/companies/spotify-logo-green.png',alt:'Spotify'}}[props.diagram]))
const nav = useNav()
const slideBoundary = direction => direction > 0 ? nav.nextSlide() : nav.prevSlide()
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle" :class="{'with-company-mark':companyBrand}">{{ spec.subtitle }}</div>
    <div v-if="companyBrand" class="solution-company-mark"><img :src="companyBrand.src" :alt="companyBrand.alt" /></div>
    <template v-if="diagram === 'clustering'">
      <div class="spotify-live" data-spotify-mount><SpotifyClusteringExplorer :on-slide-boundary="slideBoundary" /></div>
      <div class="spotify-print"><SolutionDiagram :spec="spec" /></div>
    </template>
    <SolutionDiagram v-else :spec="spec" />
    <div class="solution-caption" :class="{'spotify-static-caption':isInteractive}">{{ spec.caption }}</div>
    <div class="solution-source" :class="{'spotify-interactive-source':isInteractive}">Source: <a :href="spec.source" target="_blank" rel="noopener">{{ spec.sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.solution-company-mark{position:absolute;right:0;top:54px;width:148px;height:36px;display:flex;align-items:center;justify-content:flex-end}.solution-company-mark img{max-width:148px;max-height:32px;width:auto;height:auto;object-fit:contain}.with-company-mark{right:180px}
.spotify-live{position:absolute;top:100px;left:0;width:1136px;height:472px}.spotify-print{display:none}.spotify-static-caption{display:none}
.spotify-interactive-source{top:575px;font-size:13px}
@media print{.spotify-live{display:none!important}.spotify-print,.spotify-static-caption{display:block!important}.spotify-interactive-source{top:562px;font-size:17px}}
</style>
