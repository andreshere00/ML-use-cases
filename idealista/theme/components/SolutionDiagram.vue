<script setup>
import { computed } from 'vue'
const props=defineProps({spec:Object})
const port=(n,side)=>side==='top'?[n.x+n.w/2,n.y]:side==='bottom'?[n.x+n.w/2,n.y+n.h]:side==='left'?[n.x,n.y+n.h/2]:[n.x+n.w,n.y+n.h/2]
const paths=computed(()=>props.spec.edges.map((e,i)=>{
 const a=props.spec.nodes.find(n=>n.id===e.a),b=props.spec.nodes.find(n=>n.id===e.b)
 const start=port(a,e.start),end=port(b,e.end)
 let raw=[start,...(e.via||[]),end], pts=[start]
 for(let k=1;k<raw.length;k++){
  const a=pts[pts.length-1],b=raw[k]
  if(a[0]!==b[0]&&a[1]!==b[1]){
   const verticalEntry=k===raw.length-1&&['top','bottom'].includes(e.end)
   pts.push(verticalEntry?[b[0],a[1]]:[a[0],b[1]])
  }
  pts.push(b)
 }
 // Route implicit diagonal edges with an orthogonal elbow.
 if(!e.via&&start[0]!==end[0]&&start[1]!==end[1]){const mx=(start[0]+end[0])/2;pts=[start,[mx,start[1]],[mx,end[1]],end]}
 const segments=pts.slice(1).map((p,j)=>({a:pts[j],b:p,len:Math.hypot(p[0]-pts[j][0],p[1]-pts[j][1])})).filter(s=>s.a[1]===s.b[1])
 const s=segments.sort((a,b)=>b.len-a.len)[0]
 const show=e.label&&s&&s.len>Math.max(110,e.label.length*10.3+22)
 return {id:i,d:'M '+pts.map(p=>p.join(',')).join(' L '),label:show?e.label:'',lx:s?(s.a[0]+s.b[0])/2:0,ly:s?(s.a[1]>=175&&s.a[1]<=215?s.a[1]+20:s.a[1]-9):0}
}))
</script>
<template>
  <div class="solution-diagram" :aria-label="spec.title + ': solution flow'" role="group">
    <svg class="solution-connectors" viewBox="0 0 1136 400" aria-hidden="true">
      <defs><marker :id="'arrow-'+spec.id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="#4D225D" /></marker></defs>
      <path v-for="e in paths" :key="'line-'+e.id" :d="e.d" class="solution-edge" :marker-end="'url(#arrow-'+spec.id+')'" />
      <text v-for="e in paths.filter(e=>e.label)" :key="'label-'+e.id" :x="e.lx" :y="e.ly" class="solution-edge-label" text-anchor="middle">{{ e.label }}</text>
    </svg>
    <div v-for="lane in spec.lanes" :key="lane[2]" class="solution-lane" :style="{left:lane[0]+'px',top:lane[1]+'px'}">{{ lane[2] }}</div>
    <div v-for="n in spec.nodes" :key="n.id" class="solution-node" :class="['node-'+n.kind,{'node-example':n.example}]" :data-node="n.id" :style="{left:n.x+'px',top:n.y+'px',width:n.w+'px',height:n.h+'px'}">
      <div class="solution-node-title">{{ n.title }}</div>
      <div class="solution-node-body">{{ n.body }}</div>
    </div>
  </div>
</template>
