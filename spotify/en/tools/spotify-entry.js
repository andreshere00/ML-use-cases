import { createApp } from 'vue'
import Explorer from '../theme/components/SpotifyClusteringExplorer.vue'
// The same Vue component runs in Slidev and in either offline HTML deliverable.
for (const element of document.querySelectorAll('[data-spotify-mount]')) {
  element.innerHTML=''
  const params=new URLSearchParams(location.search)
  const stage=Math.max(-1,Math.min(7,params.has('stage')?Number(params.get('stage')):-1))
  const onSlideBoundary=element.closest('.portable-sheet')
    ? direction => document.getElementById(direction>0?'next':'prev')?.click()
    : undefined
  const app=createApp(Explorer,{initialStage:stage,onSlideBoundary})
  const instance=app.mount(element)
  window.spotifyExplorer=instance
}
