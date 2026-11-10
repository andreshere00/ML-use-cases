<script setup>
import BrandFrame from '../components/BrandFrame.vue'
defineProps({image:{type:String,default:'/assets/vlcsnap-2023-06-03-14h02m53s787-1024x576.png'},alt:{type:String,default:'Equipo de trabajo'}})
</script>
<template><BrandFrame><div class="inno-image-copy"><slot /></div><img class="inno-image" :src="image" :alt="alt" /></BrandFrame></template>
