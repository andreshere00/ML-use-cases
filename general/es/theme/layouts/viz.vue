<script setup>
import BrandFrame from '../components/BrandFrame.vue'
import labels from '../../labels.json'
defineProps({ step: Number, total: { type: Number, default: 4 }, subtitle: String, note: String })
</script>
<template>
  <BrandFrame class="solution-slide walk-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle"><b class="walk-badge">{{ labels.algorithm }} {{ step }}/{{ total }}</b> {{ subtitle }}</div>
    <div class="viz-full"><slot name="viz" /></div>
    <div class="walk-note viz-note">{{ note }}</div>
  </BrandFrame>
</template>
