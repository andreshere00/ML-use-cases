<script setup>
import BrandFrame from '../components/BrandFrame.vue'
</script>
<template><BrandFrame><div class="inno-heading"><slot /></div><div class="inno-metrics-area"><slot name="metrics" /></div><div class="inno-note"><slot name="note" /></div></BrandFrame></template>
