<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import data from '../../data/idealista-demo.json'
const props=defineProps({initialStage:{type:Number,default:0},onSlideBoundary:Function})
const root=ref(null),stage=ref(props.initialStage),playing=ref(false),details=ref(false)
const home=ref({area:80,beds:2,zone:1,renovated:1,lift:1})
const stages=['Ejemplo','Viviendas similares','Regresión','Estimación','Explicabilidad']
const money=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n)
const signed=n=>(n>=0?'+':'−')+money(Math.abs(n))
const vector=h=>[h.area,h.beds,Number(h.zone===1),Number(h.zone===2),Number(h.renovated),Number(h.lift)]
const regression=h=>data.intercept+vector(h).reduce((sum,v,j)=>sum+v*data.coefficients[j],0)
function similar(h){return data.rows.filter(r=>r.zone===Number(h.zone)).map(r=>({...r,distance:((r.area-h.area)/30)**2+((r.beds-h.beds)/2)**2+.25*(r.renovated!==Number(h.renovated))+.25*(r.lift!==Number(h.lift))})).sort((a,b)=>a.distance-b.distance||a.id-b.id).slice(0,data.comparableCount)}
const comparables=computed(()=>similar(home.value))
const comparablePrice=computed(()=>comparables.value.reduce((sum,r)=>sum+r.price,0)/data.comparableCount)
const modelPrice=computed(()=>regression(home.value))
const estimate=computed(()=>(modelPrice.value+comparablePrice.value)/2)
const displayPrice=computed(()=>Math.round(estimate.value/1000)*1000)
const adjustments=computed(()=>{
 const x=vector(home.value),c=x.map((v,j)=>(v-data.means[j])*data.coefficients[j]/2)
 return [{name:'Superficie',value:c[0]},{name:'Dormitorios',value:c[1]},{name:'Zona',value:c[2]+c[3]},{name:'Reforma',value:c[4]},{name:'Ascensor',value:c[5]},{name:'Evidencia de viviendas similares',value:(comparablePrice.value-data.baseline)/2}]
})
const maxAdjustment=computed(()=>Math.max(1,...adjustments.value.map(c=>Math.abs(c.value))))
const biggest=computed(()=>[...adjustments.value].sort((a,b)=>Math.abs(b.value)-Math.abs(a.value))[0])
const titles=['La vivienda de Ana que hay que valorar','Seis inmuebles de referencia similares','La regresión aprende una relación numérica','Una estimación continua del precio','¿Qué problema resuelve esto?']
const explanations=[
 'Ana quiere estimar el precio de su piso. Cambia sus atributos para seguir la misma vivienda en cada paso.',
 'Busca seis viviendas como la de Ana: la misma zona, tamaño y dormitorios similares. Sus precios de referencia ofrecen una primera comparación.',
 'Aprende de viviendas conocidas y luego predice el precio de Ana a partir de los atributos de su piso.',
 'Para la vivienda de Ana, combina la media de viviendas similares con la predicción de la regresión. Esta demo usa un promedio ilustrativo 50/50.',
 'Para Ana, explica cómo afectan el tamaño, la reforma y el ascensor a esta estimación.'
]
function go(i){stage.value=Math.max(0,Math.min(stages.length-1,i));playing.value=false}
function reset(){home.value={area:80,beds:2,zone:1,renovated:1,lift:1};stage.value=0;details.value=false;playing.value=false}
function togglePlay(){if(stage.value===stages.length-1)stage.value=0;playing.value=!playing.value}
function onKey(e){
 if(!root.value||root.value.getBoundingClientRect().width===0||e.altKey||e.metaKey||e.ctrlKey||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return
 if(e.key==='ArrowRight'&&stage.value<stages.length-1){e.preventDefault();e.stopImmediatePropagation();go(stage.value+1)}
 else if(e.key==='ArrowLeft'&&stage.value>0){e.preventDefault();e.stopImmediatePropagation();go(stage.value-1)}
 else if(props.onSlideBoundary&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();props.onSlideBoundary(e.key==='ArrowRight'?1:-1)}
}
let timer
onMounted(()=>{window.addEventListener('keydown',onKey,true);timer=setInterval(()=>{if(playing.value){if(stage.value<stages.length-1)stage.value++;else playing.value=false}},5500)})
onBeforeUnmount(()=>{clearInterval(timer);window.removeEventListener('keydown',onKey,true)})
watch(stage,()=>details.value=false)
defineExpose({go,reset,stage,home})
</script>

<template>
<section ref="root" class="idealista-explorer" :class="{'iv-playing':playing}" :data-stage="stage" aria-label="Recorrido interactivo de la valoración de idealista">
 <nav class="iv-steps" aria-label="Etapas de la valoración"><button v-for="(name,i) in stages" :key="name" :class="{active:stage===i,completed:stage>i}" :aria-current="stage===i?'step':undefined" @click="go(i)"><span>{{i+1}}</span>{{name}}</button></nav>
 <div class="iv-workspace">
  <div class="iv-visual" :style="{animationName:stage%2?'ivRevealOdd':'ivRevealEven'}">
   <div class="iv-plot-heading">{{['El inmueble objeto se convierte en un vector de variables','Evidencia comparable del conjunto de entrenamiento','Primero se aprende, después se predice','Una combinación transparente para esta demo','Un desglose aritmético de esta estimación'][stage]}}</div>
   <div v-if="stage===0" class="iv-property-view">
    <div class="iv-home-title">El piso de Ana <span>{{data.zones[home.zone]}} · mercado ficticio</span></div>
    <div class="iv-feature-row"><span>Superficie</span><b>{{home.area}} m²</b><span>Dormitorios</span><b>{{home.beds}}</b></div>
    <div class="iv-feature-row"><span>Reformado</span><b>{{home.renovated?'Sí':'No'}}</b><span>Ascensor</span><b>{{home.lift?'Sí':'No'}}</b></div>
    <svg class="iv-vector-flow" viewBox="0 0 700 110" role="img" aria-label="Los atributos del inmueble se convierten en una entrada numérica del modelo"><defs><marker id="iv-vector-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4D225D"/></marker></defs><path d="M350 5 V38" class="iv-arrow" marker-end="url(#iv-vector-arrow)"/><text x="350" y="73" text-anchor="middle" class="iv-svg-equation">x = [{{vector(home).join(', ')}}]</text><text x="350" y="103" text-anchor="middle" class="iv-svg-small">superficie, dorm., zona B, zona C, reformado, ascensor</text></svg>
    <div class="iv-chart-note">La zona A es la referencia. Las zonas B y C usan indicadores 0/1 independientes.</div>
   </div>
   <template v-else-if="stage===1">
    <div class="iv-table-note">Solo {{data.zones[home.zone]}} · {{home.area}} m² · {{home.beds}} dormitorios · seis coincidencias más cercanas</div>
    <table class="iv-comparables"><thead><tr><th>Inmueble</th><th>Superficie</th><th>Dorm.</th><th>Reformado</th><th>Ascensor</th><th>Precio de referencia</th></tr></thead><tbody><tr v-for="r in comparables" :key="r.id"><td>P{{String(r.id).padStart(3,'0')}}</td><td>{{r.area}} m²</td><td>{{r.beds}}</td><td>{{r.renovated?'Sí':'No'}}</td><td>{{r.lift?'Sí':'No'}}</td><td>{{money(r.price)}}</td></tr></tbody></table>
    <div class="iv-comparable-mean"><span>Media de estos seis precios</span><b>{{money(comparablePrice)}}</b></div>
    <div class="iv-chart-note">Todos los inmuebles y precios son sintéticos. Las reglas de coincidencia son didácticas.</div>
   </template>
   <template v-else-if="stage===2">
    <svg class="iv-training" viewBox="0 0 700 300" role="img" aria-label="Ajustar la regresión con precios de referencia conocidos y luego predecir el precio de esta vivienda"><defs><marker id="iv-model-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4D225D"/></marker></defs>
     <text x="10" y="25" class="iv-svg-label">ENTRENAMIENTO · se calcula una vez</text>
     <rect x="10" y="42" width="222" height="84" fill="#EDE9EF"/><text x="25" y="72" class="iv-svg-label">{{data.trainN}} ejemplos conocidos</text><text x="25" y="101" class="iv-svg-body">Variables X + precio y</text>
     <path d="M232 84 H280" class="iv-arrow" marker-end="url(#iv-model-arrow)"/>
     <rect x="287" y="42" width="190" height="84" fill="#4D225D"/><text x="302" y="73" class="iv-svg-label iv-white">Regresión lineal</text><text x="302" y="102" class="iv-svg-body iv-white">Aprende los pesos β</text>
     <path d="M477 84 H521" class="iv-arrow" marker-end="url(#iv-model-arrow)"/><text x="535" y="77" class="iv-svg-label">Ajuste MCO</text><text x="535" y="103" class="iv-svg-body">min Σ(y − ŷ)²</text>
     <line x1="10" y1="150" x2="690" y2="150" class="iv-axis"/>
     <text x="10" y="179" class="iv-svg-label">PREDICCIÓN · se actualiza con tus datos</text>
     <rect x="10" y="197" width="222" height="80" fill="#EDE9EF"/><text x="25" y="226" class="iv-svg-label">Variables de esta vivienda</text><text x="25" y="254" class="iv-svg-body">{{home.area}} m² · {{data.zones[home.zone]}}</text>
     <path d="M232 237 H280" class="iv-arrow" marker-end="url(#iv-model-arrow)"/>
     <rect x="287" y="197" width="190" height="80" fill="#4D225D"/><text x="302" y="227" class="iv-svg-label iv-white">Modelo ajustado fijo</text><text x="302" y="254" class="iv-svg-body iv-white">ŷ = β₀ + Σ βⱼxⱼ</text>
     <path d="M477 237 H521" class="iv-arrow" marker-end="url(#iv-model-arrow)"/><text x="535" y="231" class="iv-svg-label">Precio del modelo</text><text x="535" y="258" class="iv-svg-price">{{money(modelPrice)}}</text>
    </svg>
   </template>
   <template v-else-if="stage===3">
    <div class="iv-estimate-inputs"><div><span>Media de viviendas similares</span><b>{{money(comparablePrice)}}</b><small>50 % de la estimación de la demo</small></div><span class="iv-plus">+</span><div><span>Estimación de la regresión</span><b>{{money(modelPrice)}}</b><small>50 % de la estimación de la demo</small></div></div>
    <svg class="iv-blend-arrow" viewBox="0 0 700 45" aria-hidden="true"><path d="M160 0 V15 H350 V42 M540 0 V15 H350" class="iv-arrow"/><path d="M343 34 L350 42 L357 34" class="iv-arrow"/></svg>
    <div class="iv-final-price" :key="displayPrice"><span>Precio estimado ilustrativo</span><strong>{{money(displayPrice)}}</strong><small>Redondeado a los 1.000 € más cercanos</small></div>
    <div class="iv-chart-note">La combinación 50/50 es una elección didáctica. La ponderación de producción de idealista no es pública.</div>
   </template>
   <template v-else-if="stage===4">
    <svg class="iv-breakdown" viewBox="0 0 700 265" role="img" aria-label="Ajustes aditivos exactos desde la línea base de la demo hasta la estimación combinada"><line x1="420" y1="12" x2="420" y2="222" class="iv-axis"/><g v-for="(a,i) in adjustments" :key="a.name"><text x="10" :y="38+i*33" class="iv-svg-body">{{a.name}}</text><rect :x="a.value<0?420-Math.abs(a.value)/maxAdjustment*145:420" :y="21+i*33" :width="Math.max(1,Math.abs(a.value)/maxAdjustment*145)" height="23" :fill="a.value>=0?'#E64366':'#4D225D'"/><text :x="a.value<0?412-Math.abs(a.value)/maxAdjustment*145:428+Math.abs(a.value)/maxAdjustment*145" :y="38+i*33" :text-anchor="a.value<0?'end':'start'" class="iv-svg-small">{{signed(a.value)}}</text></g><text x="408" y="251" text-anchor="end" class="iv-svg-small">Reduce la estimación</text><text x="433" y="251" class="iv-svg-small">Aumenta la estimación</text></svg>
    <div class="iv-breakdown-total">Línea base {{money(data.baseline)}} + ajustes <b>= {{money(estimate)}}</b></div><div class="iv-chart-note">Aritmética exacta de la demo, antes de redondear. La línea base es la predicción media del modelo de entrenamiento.</div>
   </template>
  </div>
  <aside class="iv-explanation">
   <div class="iv-panel-top"><span>{{stage+1}} / {{stages.length}}</span><button @click="details=!details" :aria-expanded="details">{{details?'Cerrar detalles':'Detalles técnicos'}}</button></div>
   <template v-if="!details">
    <h3>{{titles[stage]}}</h3><p>{{explanations[stage]}}</p>
    <form v-if="stage===0" class="iv-inputs" @submit.prevent>
     <label>Superficie <span class="iv-range"><input v-model.number="home.area" type="range" min="45" max="140" step="5" aria-label="Superficie en metros cuadrados"/><b>{{home.area}} m²</b></span></label>
     <label>Dormitorios <select v-model.number="home.beds" aria-label="Número de dormitorios"><option v-for="i in 4" :key="i" :value="i">{{i}}</option></select></label>
     <label>Zona ficticia <select v-model.number="home.zone" aria-label="Zona del inmueble"><option v-for="(zone,i) in data.zones" :key="zone" :value="i">{{zone}}</option></select></label>
     <label>Reformado <input v-model="home.renovated" type="checkbox" :true-value="1" :false-value="0" aria-label="Inmueble reformado"/></label>
     <label>Ascensor <input v-model="home.lift" type="checkbox" :true-value="1" :false-value="0" aria-label="El edificio tiene ascensor"/></label>
    </form>
    <div v-if="stage===1" class="iv-readout"><b>¿Qué hace que haya coincidencia?</b><span>Misma zona, superficie y dormitorios similares, además de reforma y ascensor.</span><small>En esta comparación solo entran inmuebles de entrenamiento.</small></div>
    <div v-if="stage===2" class="iv-readout"><b>¿Qué aprende?</b><span>Por ejemplo, +10 m² suman {{money(data.coefficients[0]*10)}} a la predicción de este modelo, manteniendo fijas las demás entradas.</span><small>Es una asociación ajustada sobre datos sintéticos.</small></div>
    <div v-if="stage===3" class="iv-readout"><b>Error absoluto medio en datos reservados</b><span>{{money(data.metrics.blendMAE)}} en {{data.testN}} viviendas sintéticas.</span><small>Una evaluación de demostración, no la precisión de idealista ni un intervalo de predicción individual.</small></div>
    <template v-if="stage===4"><div class="iv-readout iv-meaning-readout"><b>Este piso</b><span>{{home.area}} m² frente a una media de entrenamiento de {{data.means[0].toFixed(0)}} m²: la superficie aporta {{signed(adjustments[0].value)}}.</span><b>Reforma y ascensor</b><span>{{home.renovated?'Reformado':'Sin reformar'}}: {{signed(adjustments[3].value)}}. {{home.lift?'Con ascensor':'Sin ascensor'}}: {{signed(adjustments[4].value)}}.</span></div><div class="iv-meaning-limit">Las barras explican este cálculo. No prueban causas ni garantizan un precio de venta.</div></template>
   </template>
   <div v-else class="iv-technical"><h3>Cálculo real de la demo</h3><p><b>Datos:</b> {{data.n}} viviendas sintéticas, {{data.trainN}} de entrenamiento y {{data.testN}} reservadas. Semilla {{data.seed}}. Todas las zonas y precios son ficticios.</p><p><b>Coincidencia:</b> misma zona. Ordena las filas de entrenamiento por (Δsuperficie/30)² + (Δdorm./2)² + 0,25 por cada discrepancia de reforma/ascensor. Toma las seis más cercanas, con el ID de fila como desempate.</p><p><b>Modelo:</b> mínimos cuadrados ordinarios con intercepto. Superficie, dormitorios, dos indicadores de zona, reformado y ascensor. Se ajusta una vez con las filas de entrenamiento.</p><p><b>Coeficientes aprendidos:</b><br>Intercepto {{money(data.intercept)}}<br><span v-for="(name,i) in ['Superficie por m²','Dormitorio','Zona B','Zona C','Reformado','Ascensor']" :key="name">{{name}}: {{signed(data.coefficients[i])}}<br></span></p><p><b>Combinación:</b> 0,5 × precio medio de comparables + 0,5 × predicción del modelo. Es nuestra elección ilustrativa, no la fórmula divulgada por idealista.</p><p><b>Desglose:</b> se parte de la predicción media del modelo. Cada ajuste del modelo es 0,5 × βⱼ × (xⱼ − media de entrenamientoⱼ). Se agregan los términos de zona. Se suma 0,5 × (media de comparables − línea base). La suma reconstruye exactamente la estimación.</p><p><b>Evaluación:</b> ningún inmueble reservado entra en el ajuste ni en la coincidencia. MAE de la combinación {{money(data.metrics.blendMAE)}}. MAE de la regresión {{money(data.metrics.regressionMAE)}}. MAE de comparables {{money(data.metrics.comparablesMAE)}}. Son resultados de prueba sintéticos.</p><p><b>Método publicado:</b> idealista combina comparables con machine learning hedónico. El modelo exacto, las variables y los pesos de combinación no son públicos.</p></div>
  </aside>
 </div>
 <div class="iv-controls"><div class="iv-control-group"><button :disabled="stage===0" aria-label="Etapa anterior" @click="go(stage-1)">← Atrás</button><button class="iv-primary" :disabled="stage===stages.length-1" aria-label="Etapa siguiente" @click="go(stage+1)">Siguiente →</button><button @click="togglePlay" :aria-pressed="playing">{{playing?'Pausa':'Reproducir'}}</button><button @click="reset">Reiniciar</button></div><button class="iv-edit" @click="go(0)">Editar vivienda</button><span class="iv-current-home">{{home.area}} m² · {{home.beds}} dorm. · {{data.zones[home.zone]}}</span><a class="iv-open" href="idealista-valuation.html" target="_blank" rel="noopener">Abrir explorador ↗</a></div>
 <div class="iv-provenance"><b>Demo calculada · viviendas y precios sintéticos</b><span>← / → pasos · línea base didáctica · sin datos ni modelo propietario de idealista</span></div>
</section>
</template>

<style scoped>
.idealista-explorer{width:1136px;height:472px;color:#4D225D;font:300 17px/1.35 Urbane,Arial,sans-serif;position:relative;text-align:left;--iv-rule:#d8d0dc}.idealista-explorer *{box-sizing:border-box}.idealista-explorer button,.idealista-explorer select{font:500 15px/1.25 Urbane,Arial,sans-serif;color:inherit}.idealista-explorer button,.iv-open{cursor:pointer;border:1px solid var(--iv-rule);background:white;padding:7px 10px}.idealista-explorer button:hover,.iv-open:hover{background:#EDE9EF}.idealista-explorer button:disabled{opacity:.35;cursor:default}.idealista-explorer button:focus-visible,.idealista-explorer input:focus-visible,.idealista-explorer select:focus-visible,.iv-open:focus-visible{outline:3px solid #E64366;outline-offset:2px}.idealista-explorer select{padding:5px;background:white;border:1px solid var(--iv-rule)}.iv-steps{display:flex;border-bottom:1px solid var(--iv-rule);height:40px;margin-bottom:13px}.iv-steps button{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;border:none;border-bottom:3px solid transparent;padding:4px 6px;font-size:17px}.iv-steps button span{font-size:13px;display:inline-flex;width:23px;height:23px;align-items:center;justify-content:center;background:#EDE9EF;border-radius:50%}.iv-steps button.active{border-color:#E64366;font-weight:600}.iv-steps button.active span{background:#4D225D;color:white}.iv-steps button.completed span{background:#e9dce7}.iv-workspace{display:grid;grid-template-columns:710px 402px;gap:24px;height:344px}.iv-visual{height:344px;min-width:0;overflow:hidden;animation-duration:350ms;animation-timing-function:ease}.iv-plot-heading{height:30px;font-size:16px;font-weight:500}.iv-explanation{border-left:1px solid var(--iv-rule);padding-left:20px;max-height:344px;overflow:auto;scrollbar-width:thin}.iv-panel-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:13px;color:#73687A}.iv-panel-top button{font-size:13px;padding:4px 7px}.iv-explanation h3{font:600 23px/1.2 Urbane,Arial,sans-serif;color:#4D225D;margin:0 0 10px}.iv-explanation p{font-size:18px!important;line-height:1.4!important;margin:0 0 13px!important}.iv-readout{display:flex;flex-direction:column;gap:8px;padding:12px;background:#f6f3f7;font-size:16px;line-height:1.4}.iv-readout b{color:#4D225D!important}.iv-readout small{font-size:13px;color:#73687A}.iv-inputs{display:flex;flex-direction:column;gap:7px}.iv-inputs label{display:flex;align-items:center;justify-content:space-between;font-size:16px;min-height:30px}.iv-range{display:flex;align-items:center;gap:10px}.iv-range input{width:140px;accent-color:#4D225D}.iv-range b{font-size:15px;width:58px;text-align:right}.iv-inputs select{width:110px;font-size:14px}.iv-inputs input[type=checkbox]{accent-color:#4D225D;width:20px;height:20px;margin:0}.iv-controls{height:42px;display:flex;align-items:center;gap:15px;margin-top:15px}.iv-control-group{display:flex;gap:6px}.iv-primary{background:#4D225D!important;color:white!important;border-color:#4D225D!important}.iv-edit{margin-left:auto}.iv-current-home{font-size:14px;color:#73687A}.iv-open{font-size:13px;color:#4D225D;text-decoration:none!important;white-space:nowrap}.iv-provenance{display:flex;justify-content:space-between;font-size:12px;color:#73687A;margin-top:4px}.iv-provenance b{font-weight:500;color:#73687A!important}.iv-home-title{font-size:29px;font-weight:600;margin:12px 0 14px;display:flex;justify-content:space-between;align-items:center}.iv-home-title span{font-weight:300;font-size:17px;color:#73687A}.iv-feature-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;padding:11px 0;border-bottom:1px solid var(--iv-rule);align-items:center;font-size:21px}.iv-feature-row b{font-size:24px}.iv-vector-flow{width:710px;height:100px;display:block}.iv-chart-note{font-size:13px;color:#73687A;line-height:1.35;margin-top:6px}.iv-svg-equation{font:500 27px Urbane,Arial,sans-serif;fill:#4D225D}.iv-svg-small{font:300 13px Urbane,Arial,sans-serif;fill:#73687A}.iv-svg-label{font:600 16px Urbane,Arial,sans-serif;fill:#4D225D}.iv-svg-body{font:300 17px Urbane,Arial,sans-serif;fill:#4D225D}.iv-svg-price{font:600 23px Urbane,Arial,sans-serif;fill:#E64366}.iv-white{fill:white}.iv-arrow{stroke:#4D225D;stroke-width:2;fill:none}.iv-axis{stroke:var(--iv-rule);stroke-width:1}.iv-table-note{font-size:14px;color:#73687A;margin:3px 0 10px}.iv-comparables{width:100%;border-collapse:collapse;table-layout:fixed;font-size:16px}.iv-comparables th{font-weight:500;background:#4D225D;color:white;font-size:13px;text-align:right;padding:7px 6px}.iv-comparables td{border-bottom:1px solid var(--iv-rule);padding:4px 6px;text-align:right}.iv-comparables th:first-child,.iv-comparables td:first-child{text-align:left}.iv-comparables th:last-child{width:145px}.iv-comparable-mean{display:flex;justify-content:space-between;margin-top:10px;font-size:18px}.iv-comparable-mean b{color:#E64366!important}.iv-training{width:710px;height:300px}.iv-estimate-inputs{display:flex;align-items:center;justify-content:space-around;margin-top:12px}.iv-estimate-inputs>div{display:flex;flex-direction:column;gap:6px;width:275px;text-align:center}.iv-estimate-inputs b{font-size:30px;color:#4D225D!important}.iv-estimate-inputs small{font-size:13px;color:#73687A}.iv-plus{font-size:28px}.iv-blend-arrow{width:710px;height:45px;margin-top:5px}.iv-final-price{display:flex;flex-direction:column;align-items:center;gap:3px;margin-top:3px;animation:ivPrice 400ms ease}.iv-final-price>span{font-size:20px}.iv-final-price strong{font-size:52px;line-height:1.2;font-weight:600;color:#E64366}.iv-final-price small{font-size:13px;color:#73687A}.iv-breakdown{width:710px;height:260px}.iv-breakdown rect{transition:width 350ms ease,x 350ms ease}.iv-breakdown-total{font-size:16px;display:flex;justify-content:space-between}.iv-meaning-readout{gap:6px}.iv-meaning-limit{font-size:14px;line-height:1.4;color:#73687A;margin-top:12px}.iv-technical p{font-size:15px!important;line-height:1.4!important;margin-bottom:12px!important}.iv-technical h3{font-size:21px}.iv-technical b{color:#4D225D!important}
@keyframes ivRevealOdd{from{opacity:.15}to{opacity:1}}@keyframes ivRevealEven{from{opacity:.15}to{opacity:1}}@keyframes ivPrice{from{opacity:.35;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes ivFlow{to{stroke-dashoffset:-20}}.iv-playing .iv-arrow{stroke-dasharray:6 4;animation:ivFlow 1s linear infinite}@media(prefers-reduced-motion:reduce){.iv-visual,.iv-final-price,.iv-arrow{animation:none!important}.iv-breakdown rect{transition:none}}@media print{.idealista-explorer{display:none!important}}
</style>
