<script setup>
import { computed } from 'vue'
const props = defineProps({data:{type:Array,default:()=>[{label:'Categoría A',value:30},{label:'Categoría B',value:55},{label:'Categoría C',value:70}]},max:{type:Number,default:100},unit:{type:String,default:'%'}})
const rows=computed(()=>props.data.map((d,i)=>({...d,y:40+i*(250/Math.max(props.data.length-1,1))})))
</script>
<template>
 <svg viewBox="0 0 1100 380" class="inno-chart" role="img" aria-label="Gráfico de barras">
  <g v-for="d in rows" :key="d.label">
   <text x="0" :y="d.y+23" class="chart-label">{{ d.label }}</text>
   <rect x="230" :y="d.y" :width="760*Math.max(0,Math.min(d.value/max,1))" height="34" fill="#E64366" />
   <text :x="245+760*Math.max(0,Math.min(d.value/max,1))" :y="d.y+24" class="chart-value">{{d.value}}{{unit}}</text>
  </g>
 </svg>
</template>
