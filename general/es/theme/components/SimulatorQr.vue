<script setup>
// QR del simulador publicado con ngrok (deploy/make-qr.mjs genera public/qr/simulator.svg).
defineProps({
  label: { type: String, required: true },
  hint: { type: String, default: '' },
})
</script>
<template>
  <figure class="inno-qr">
    <img src="/qr/simulator.svg" :alt="label" />
    <figcaption>
      <b>{{ label }}</b>
      <span v-if="hint">{{ hint }}</span>
    </figcaption>
  </figure>
</template>
<style scoped>
.inno-qr{position:absolute;right:72px;bottom:118px;width:228px;margin:0;padding:16px 16px 14px;background:#fff;border-radius:22px;color:var(--inno-purple);text-align:center}
.inno-qr img{display:block;width:196px;height:196px}
.inno-qr figcaption{margin-top:10px;line-height:1.25}
.inno-qr b{display:block;font-size:18px;font-weight:600;color:var(--inno-coral)}
.inno-qr span{display:block;font-size:14px;margin-top:2px}
</style>
<style>
/* Deja sitio al QR en la diapositiva de cierre. */
.inno-end:has(.inno-qr) > p, .inno-end:has(.inno-qr) > div { max-width: 830px; }
</style>
