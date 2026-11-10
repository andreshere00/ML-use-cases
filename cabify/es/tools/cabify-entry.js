import { createApp } from 'vue'
import Explorer from '../theme/components/CabifyTrafficExplorer.vue'
for (const element of document.querySelectorAll('[data-cabify-mount]')) {
  element.innerHTML=''
  const stage=Math.max(0,Math.min(4,Number(new URLSearchParams(location.search).get('stage'))||0))
  const onSlideBoundary=element.closest('.portable-sheet')
    ? direction => document.getElementById(direction>0?'next':'prev')?.click()
    : undefined
  const app=createApp(Explorer,{initialStage:stage,onSlideBoundary})
  window.cabifyExplorer=app.mount(element)
}
