<script setup>
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import BrandFrame from '../components/BrandFrame.vue'
import SolutionDiagram from '../components/SolutionDiagram.vue'
import IdealistaValuationExplorer from '../components/IdealistaValuationExplorer.vue'
import diagrams from '../../diagrams.json'
const props = defineProps({ diagram: String })
const spec = computed(() => diagrams[props.diagram])
const isInteractive = computed(() => props.diagram === 'regression')
const companyBrand = computed(() => ({regression:{src:'/assets/companies/idealista-data-logo.png',alt:'idealista/data'}}[props.diagram]))
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
    <div class="solution-subtitle" :class="{'with-company-mark':companyBrand}">{{ spec.subtitle }}</div>
    <div v-if="companyBrand" class="solution-company-mark"><img :src="companyBrand.src" :alt="companyBrand.alt" /></div>
    <template v-if="diagram === 'regression'">
      <template v-if="staged">
        <div v-for="n in 5" :key="n" v-click class="print-click" />
        <div v-if="slideClicks > 0" class="spotify-staged"><IdealistaValuationExplorer :print-stage="slideClicks - 1" /></div>
        <div v-else class="spotify-print-overview"><SolutionDiagram :spec="spec" /></div>
      </template>
      <template v-else>
        <div class="spotify-live" data-idealista-mount><IdealistaValuationExplorer :on-slide-boundary="slideBoundary" /></div>
        <div class="spotify-print"><SolutionDiagram :spec="spec" /></div>
      </template>
    </template>
    <SolutionDiagram v-else :spec="spec" />
    <div class="solution-caption" :class="{'spotify-static-caption':isInteractive,'staged-page':stagePage}">{{ spec.caption }}</div>
    <div class="solution-source" :class="{'spotify-interactive-source':isInteractive,'staged-page':stagePage}">Source: <a :href="spec.source" target="_blank" rel="noopener">{{ spec.sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.solution-company-mark{position:absolute;right:0;top:54px;width:148px;height:36px;display:flex;align-items:center;justify-content:flex-end}.solution-company-mark img{max-width:148px;max-height:32px;width:auto;height:auto;object-fit:contain}.with-company-mark{right:180px}
.spotify-live{position:absolute;top:100px;left:0;width:1136px;height:472px}.spotify-print{display:none}.spotify-static-caption{display:none}
.spotify-interactive-source{top:575px;font-size:13px}
@media print{.spotify-live{display:none!important}.spotify-print,.spotify-static-caption{display:block!important}.spotify-interactive-source{top:562px;font-size:17px}}
.spotify-staged{position:absolute;top:100px;left:0;width:1136px;height:472px}.print-click{display:none}
.solution-caption.staged-page{display:none!important}.solution-source.spotify-interactive-source.staged-page{top:575px;font-size:13px}
</style>
