<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

defineProps({ dark: Boolean })
const { currentPage, total } = useNav()
const progress = computed(() => (total.value > 0 ? (currentPage.value / total.value) * 100 : 0))
</script>
<template>
  <div class="slidev-layout inno-layout" :class="{ 'inno-dark': dark }">
    <div class="inno-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(progress)">
      <div class="inno-progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <main class="inno-main"><slot /></main>
    <footer class="inno-footer">
      <span>InnoIT</span>
      <span>{{ $slidev.nav.currentPage }}</span>
      <img src="/assets/innoit-logo.png" alt="InnoIT" />
    </footer>
  </div>
</template>
