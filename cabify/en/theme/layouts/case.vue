<script setup>
import BrandFrame from '../components/BrandFrame.vue'
defineProps({ company: String, status: String, takeaway: String, detail: String, sourceLabel: String, source: String })
</script>
<template>
  <BrandFrame>
    <div class="case-heading"><slot /></div>
    <div class="case-company">{{ company }}</div>
    <div class="case-status">{{ status }}</div>
    <div class="inno-columns case-columns"><div><slot name="left" /></div><div><slot name="right" /></div></div>
    <div class="case-detail">{{ detail }}</div>
    <div class="case-takeaway">{{ takeaway }}</div>
    <div class="case-source">Source: <a :href="source" target="_blank" rel="noopener">{{ sourceLabel }}</a></div>
  </BrandFrame>
</template>
