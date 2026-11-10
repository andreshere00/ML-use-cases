<script setup>
import BrandFrame from '../components/BrandFrame.vue'
</script>
<template><BrandFrame><div class="inno-heading"><slot /></div><div class="inno-columns"><div><slot name="left" /></div><div><slot name="right" /></div></div></BrandFrame></template>
