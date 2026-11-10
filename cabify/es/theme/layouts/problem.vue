<script setup>
import BrandFrame from '../components/BrandFrame.vue'
import ProblemDiagram from '../components/ProblemDiagram.vue'
defineProps({ labels: Object, subtitle: String, caption: String, sourceLabel: String, source: String })
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle">{{ subtitle }}</div>
    <ProblemDiagram :t="labels" />
    <div class="solution-caption problem-caption">{{ caption }}</div>
    <div class="solution-source problem-source">{{ labels.sourcePrefix }} <a :href="source" target="_blank" rel="noopener">{{ sourceLabel }}</a></div>
  </BrandFrame>
</template>
<style scoped>
.problem-caption{top:522px;font-size:19px;color:#4D225D;font-weight:500}
.problem-source{top:562px}
</style>
