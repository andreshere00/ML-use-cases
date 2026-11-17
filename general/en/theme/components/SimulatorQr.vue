<script setup>
// QR de cierre. Los SVG los genera deploy/make-qr.mjs en public/qr/.
//   src      QR a mostrar (por defecto, el simulador publicado con ngrok)
//   variant  "first" (derecha), "second" (a su izquierda) o "big" (QR grande, diapositiva propia)
defineProps({
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  src: { type: String, default: '/qr/simulator.svg' },
  variant: { type: String, default: 'first' },
})
</script>
<template>
  <figure class="inno-qr" :class="`inno-qr--${variant}`">
    <img :src="src" :alt="label" />
    <figcaption>
      <b>{{ label }}</b>
      <span v-if="hint">{{ hint }}</span>
    </figcaption>
  </figure>
</template>
<style scoped>
.inno-qr{position:absolute;right:72px;bottom:118px;width:228px;margin:0;padding:16px 16px 14px;background:#fff;border-radius:22px;color:var(--inno-purple);text-align:center}
.inno-qr img{display:block;width:196px;height:196px}
.inno-qr figcaption{margin-top:10px;line-height:1.25;min-height:100px}
.inno-qr b{display:block;font-size:18px;font-weight:600;color:var(--inno-coral)}
.inno-qr span{display:block;font-size:14px;margin-top:2px}
.inno-qr--second{right:324px}
.inno-qr--big{right:96px;bottom:auto;top:150px;width:380px;padding:22px 22px 18px;border-radius:28px}
.inno-qr--big figcaption{min-height:0}
.inno-qr--big img{width:336px;height:336px}
.inno-qr--big b{font-size:24px}
.inno-qr--big span{font-size:18px}
</style>
<style>
/* Deja sitio a los QR en la diapositiva de cierre. */
.inno-end:has(.inno-qr--first) > p, .inno-end:has(.inno-qr--first) > div { max-width: 830px; }
.inno-end:has(.inno-qr--second) > p, .inno-end:has(.inno-qr--second) > div { max-width: 580px; }
.inno-end:has(.inno-qr--big) > p, .inno-end:has(.inno-qr--big) > div, .inno-end:has(.inno-qr--big) > h1 { max-width: 620px; }
</style>
