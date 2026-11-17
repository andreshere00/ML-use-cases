<script setup>
// QR de cierre. Los SVG los genera deploy/make-qr.mjs en public/qr/.
//   src      QR a mostrar (por defecto, el simulador publicado con ngrok)
//   variant  "first" (derecha), "second" (a su izquierda), "big" (QR grande, diapositiva propia)
//            o "row" (en flujo normal, dentro de un contenedor .inno-end-qrs centrado)
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
.inno-qr--row{position:static;display:flex;flex-direction:column;width:232px;padding:14px 14px 12px;border-radius:20px}
.inno-qr--row img{width:160px;height:160px;margin:0 auto}
.inno-qr--row figcaption{flex:1;min-height:80px;display:flex;flex-direction:column;justify-content:flex-start}
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
/* Diapositiva de cierre centrada: título, web, QR en fila y perfil, todo en una columna. */
.inno-end:has(.inno-end-qrs){height:100%;padding-top:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.inno-end:has(.inno-end-qrs) h1{margin-bottom:8px;max-width:none}
.inno-end:has(.inno-end-qrs) p{margin:0;max-width:none}
.inno-end-qrs{display:flex;gap:28px;justify-content:center;align-items:stretch;margin:24px 0 22px}
.inno-end-profile{display:flex;align-items:center;gap:22px;text-align:left;font-size:20px;line-height:1.4;font-weight:300}
.inno-end-profile img{width:96px;height:96px;border-radius:50%;object-fit:cover;object-position:center 25%;border:3px solid var(--inno-coral);flex:none}
</style>
