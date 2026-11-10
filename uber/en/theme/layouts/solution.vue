<script setup>
import { computed } from 'vue'
import BrandFrame from '../components/BrandFrame.vue'
import SolutionDiagram from '../components/SolutionDiagram.vue'
import diagrams from '../../diagrams.json'
import labels from '../../labels.json'
const props = defineProps({ diagram: String })
const spec = computed(() => diagrams[props.diagram])
</script>
<template>
  <BrandFrame class="solution-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle">{{ spec.subtitle }}</div>
    <SolutionDiagram :spec="spec" />
    <div class="solution-caption">{{ spec.caption }}</div>
    <div class="solution-source">{{ labels.sourcePrefix }} <a :href="spec.source" target="_blank" rel="noopener">{{ spec.sourceLabel }}</a></div>
  </BrandFrame>
</template>
