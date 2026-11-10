import { createApp } from 'vue'
import Explorer from '../theme/components/IdealistaValuationExplorer.vue'
for (const element of document.querySelectorAll('[data-idealista-mount]')) {
  element.innerHTML=''
  const stage=Math.max(0,Math.min(4,Number(new URLSearchParams(location.search).get('stage'))||0))
  const onSlideBoundary=element.closest('.portable-sheet')
    ? direction => document.getElementById(direction>0?'next':'prev')?.click()
    : undefined
  const app=createApp(Explorer,{initialStage:stage,onSlideBoundary})
  window.idealistaExplorer=app.mount(element)
}
