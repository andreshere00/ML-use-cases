<script setup>
import BrandFrame from '../components/BrandFrame.vue'
import labels from '../../labels.json'
defineProps({ step: Number, total: { type: Number, default: 4 }, subtitle: String, note: String })
</script>
<template>
  <BrandFrame class="solution-slide walk-slide">
    <div class="solution-title"><slot /></div>
    <div class="solution-subtitle"><b class="walk-badge">{{ labels.algorithm }} {{ step }}/{{ total }}</b> {{ subtitle }}</div>
    <div class="walk-steps"><slot name="steps" /></div>
    <div class="walk-viz"><slot name="viz" /></div>
    <div class="walk-note">{{ note }}</div>
  </BrandFrame>
</template>
