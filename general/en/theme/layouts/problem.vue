<script setup>
import BrandFrame from '../components/BrandFrame.vue'
import UberProblemDiagram from '../components/UberProblemDiagram.vue'
import labels from '../../labels.json'
defineProps({ subtitle: String, caption: String, sourceLabel: String, source: String })
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle">{{ subtitle }}</div>
    <UberProblemDiagram :t="labels.problem" />
    <div class="solution-caption problem-caption">{{ caption }}</div>
    <div class="solution-source problem-source">{{ labels.sourcePrefix }} <a :href="source" target="_blank" rel="noopener">{{ sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.problem-caption{top:522px;font-size:19px;color:#4D225D;font-weight:500}
.problem-source{top:562px}
</style>
