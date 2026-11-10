<script setup>
defineProps({ dark: Boolean })
</script>
<template>
  <div class="slidev-layout inno-layout" :class="{ 'inno-dark': dark }">
    <main class="inno-main"><slot /></main>
    <footer class="inno-footer">
      <span>InnoIT</span>
      <span>{{ $slidev.nav.currentPage }}</span>
      <img src="/assets/innoit-logo.png" alt="InnoIT" />
    </footer>
  </div>
</template>
