<script setup>
import BrandFrame from '../components/BrandFrame.vue'
import ProblemDiagram from '../components/ProblemDiagram.vue'
defineProps({ labels: Object, subtitle: String, caption: String, sourceLabel: String, source: String })
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle with-company-mark">{{ subtitle }}</div>
    <div class="solution-company-mark"><img src="/assets/companies/spotify-logo-green.png" alt="Spotify" /></div>
    <ProblemDiagram :t="labels" />
    <div class="solution-caption problem-caption">{{ caption }}</div>
    <div class="solution-source problem-source">{{ labels.sourcePrefix }} <a :href="source" target="_blank" rel="noopener">{{ sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.solution-company-mark{position:absolute;right:0;top:54px;width:148px;height:36px;display:flex;align-items:center;justify-content:flex-end}.solution-company-mark img{max-width:148px;max-height:32px;width:auto;height:auto;object-fit:contain}.with-company-mark{right:180px}
.problem-caption{top:522px;font-size:19px;color:#4D225D;font-weight:500}
.problem-source{top:562px}
</style>
