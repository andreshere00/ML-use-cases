<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import data from '../../data/spotify-demo.json'

const props=defineProps({ initialStage:{type:Number,default:-1}, initialPreset:{type:String,default:'balanced'}, onSlideBoundary:Function,printStage:{type:Number,default:null}})
const root=ref(null),stage=ref(props.initialStage),presetId=ref(props.initialPreset),contextId=ref('root')
const cluster=ref(0),observation=ref(0),details=ref(false),playing=ref(false),shapMode=ref('local')
const stages=['Features','UMAP','HDBSCAN','Re-embed','Hierarchy','XGBoost','SHAP','Explainability']
const colours=['#4D225D','#E64366','#237C82','#A16A16','#466DB4','#8F5195','#6B7933','#C65D36','#395E59','#88566B']
const preset=computed(()=>data.presets.find(p=>p.id===presetId.value)||data.presets[1])
const node=computed(()=>preset.value.nodes[contextId.value]||preset.value.nodes.root)
const selected=computed(()=>node.value.clusters.find(c=>c.label===cluster.value)||node.value.clusters[0])
const child=computed(()=>selected.value?.child?preset.value.nodes[selected.value.child]:null)
const model=computed(()=>node.value.models[String(selected.value?.label)])
const localIndex=computed(()=>Math.max(0,node.value.ids.indexOf(observation.value)))
const rowIds=computed(()=>[observation.value,...node.value.ids.filter(id=>id!==observation.value).slice(0,3)])
const score=computed(()=>model.value?.probabilities[localIndex.value]||0)
const original=computed(()=>data.values[observation.value])
const rawShap=computed(()=>model.value?.shap[localIndex.value]||Array(6).fill(0))
const chartValues=computed(()=>shapMode.value==='local'?rawShap.value:model.value?.meanAbs||Array(6).fill(0))
const maxShap=computed(()=>Math.max(.01,...chartValues.value.map(Math.abs)))
const rawMargin=computed(()=>(model.value?.base||0)+rawShap.value.reduce((a,b)=>a+b,0))
const globalDrivers=computed(()=>(model.value?.meanAbs||[]).map((value,index)=>({value,index})).sort((a,b)=>b.value-a.value).slice(0,2))
const localDriver=computed(()=>rawShap.value.map((value,index)=>({value,index})).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value))[0])
const isTest=computed(()=>model.value?.testIds.includes(observation.value))
const counts=computed(()=>`${node.value.clusters.length} clusters · ${node.value.noise} noise · ${node.value.ids.length} listeners`)
const pointFill=(label)=>label<0?'#A8A8A8':colours[label%colours.length]
const pointX=(p,w=660,x=20)=>x+p[0]*w
const pointY=(p,h=260,y=35)=>y+p[1]*h
const fmt=(value,j)=>j>1?Math.round(value*100)+'%':value.toFixed(j===0?0:1)
const pct=(x)=>(100*x).toFixed(1)+'%'
function go(s){stage.value=Math.max(-1,Math.min(node.value.clusters.length?stages.length-1:2,s));playing.value=false}
function choose(label){cluster.value=Number(label);const c=node.value.clusters.find(c=>c.label===cluster.value);if(c&&!c.memberIds.includes(observation.value))observation.value=c.memberIds[0]}
function enter(id){if(!preset.value.nodes[id])return;contextId.value=id;stage.value=2;playing.value=false}
function reset(){playing.value=false;presetId.value=props.initialPreset;contextId.value='root';choose(node.value.clusters[0]?.label??0);stage.value=-1;details.value=false;shapMode.value='local'}
function pickObservation(id){if(node.value.ids.includes(Number(id)))observation.value=Number(id)}
function togglePlay(){if(stage.value===stages.length-1)stage.value=-1;playing.value=!playing.value}
watch([presetId,contextId],()=>{
  if(!preset.value.nodes[contextId.value])contextId.value='root'
  cluster.value=node.value.clusters[0]?.label??0
  observation.value=node.value.clusters[0]?.memberIds[0]??node.value.ids[0]
},{flush:'sync'})
watch(presetId,()=>{contextId.value='root';playing.value=false})
watch(stage,()=>{details.value=false})
let timer
function onKey(e){
  if(props.printStage!=null||!root.value||root.value.getBoundingClientRect().width===0||e.altKey||e.metaKey||e.ctrlKey)return
  if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return
  if(e.key==='ArrowRight'&&stage.value<(node.value.clusters.length?stages.length-1:2)){e.preventDefault();e.stopImmediatePropagation();go(stage.value+1)}
  else if(e.key==='ArrowLeft'&&stage.value>-1){e.preventDefault();e.stopImmediatePropagation();go(stage.value-1)}
  else if(props.onSlideBoundary&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();props.onSlideBoundary(e.key==='ArrowRight'?1:-1)}
}
onMounted(()=>{
  choose(node.value.clusters[0]?.label??0)
  window.addEventListener('keydown',onKey,true)
  timer=setInterval(()=>{if(playing.value){if(stage.value<(node.value.clusters.length?stages.length-1:2))stage.value++;else playing.value=false}},5500)
})
onBeforeUnmount(()=>{clearInterval(timer);window.removeEventListener('keydown',onKey,true)})
watch(()=>props.printStage,v=>{if(v!=null)stage.value=Math.max(-1,Math.min(stages.length-1,v))},{immediate:true})
defineExpose({go,reset,enter,stage,presetId,contextId})

const titles=['An original feature vector for every listener','UMAP makes neighbourhoods visible','HDBSCAN discovers density-based groups','Recursion starts from the original feature rows','The hierarchy records each discovery step','A supervised model learns discovered membership','SHAP explains the membership predictor','What the results mean']
const explanations=[
  'Ana’s listening becomes a numeric row. Here we compute six behaviour features. Artist counts would be extra inputs.',
  'With suitable artist features, Ana and Luis could appear nearby because they share artists. UMAP displays similarity, not a genre label.',
  'A dense group could contain Ana and Luis, while Marta falls elsewhere. The colours show discovered groups. Our chart uses synthetic behaviour data.',
  'Analyse Ana’s group again using its original rows. This could reveal finer habits within her broader group.',
  'Ana’s broad group could split into subgroups. The tree records which users enter each new fit. Click a branch to inspect its computed population.',
  'XGBoost learns to predict Ana’s group versus everyone else, using the original features and discovered labels.',
  'SHAP explains a listener’s group score. Indie listening could matter with artist inputs. These bars explain behaviour.',
  'Translate the model explanation into a description of the group, then validate that description with listeners.'
]
</script>

<template>
  <section ref="root" class="spotify-explorer" :class="{'sp-playing':playing,'sp-print-stage':printStage!=null}" :data-stage="stage" :data-context="contextId" aria-label="Interactive Spotify clustering walkthrough">
    <nav class="sp-steps" aria-label="Walkthrough stages">
      <button v-for="(name,i) in ['Example',...stages]" :key="name" :disabled="!node.clusters.length&&i>3" :class="{active:stage===i-1,completed:stage>i-1}" :aria-current="stage===i-1?'step':undefined" @click="go(i-1)"><span>{{ i+1 }}</span>{{ name }}</button>
    </nav>
    <div class="sp-workspace">
      <div class="sp-visual" :style="{animationName:stage%2?'spRevealOdd':'spRevealEven'}">
        <div class="sp-plot-heading">
          <span>{{ stage===-1?'The people behind the use case':stage===0?'Original features':stage===3?'A new fit, not a magnified plot':stage===4?'Computed cluster hierarchy':stage===5?'One-versus-rest training':stage===6?'Calculated TreeSHAP contributions':stage===7?'Why interpretation is needed':'Computed UMAP coordinates' }}</span>
          <span v-if="stage===1||stage===2" class="sp-light">{{ counts }}</span>
        </div>

        <div v-if="stage===-1" class="sp-meaning">
          <div class="sp-meaning-step"><span>People</span><p>Ana and Luis play Izal and Vetusta Morla. Marta plays Charlotte de Witte.</p></div>
          <div class="sp-meaning-step"><span>Group</span><p>Artist-play counts could group Ana and Luis together, apart from Marta.</p></div>
          <div class="sp-meaning-step"><span>Why</span><p>An explanation could identify Spanish indie listening as the group’s main signal.</p></div>
          <div class="sp-meaning-result"><b>Possible use</b><span>Suggest Love of Lesbian to Ana if Luis listens to them.</span></div>
          <div class="sp-chart-note">Illustrative artist example. The computed demo uses behaviour, not artist counts.</div>
        </div>
        <div v-else-if="stage>=2&&!node.clusters.length" class="sp-empty"><h3>No dense groups meet these settings</h3><p>HDBSCAN assigned all {{ node.ids.length }} listeners to noise. A recursive fit can legitimately reveal no further groups.</p><button class="sp-primary" @click="enter('root')">Return to the full population</button></div>
        <div v-else-if="stage===0" class="sp-matrix-view">
          <div class="sp-matrix-equation"><span class="sp-matrix-formula">X ∈ ℝ<sup>{{ node.ids.length }} × {{ data.d }}</sup></span><span>Unlabelled observations</span></div>
          <table class="sp-matrix"><thead><tr><th>Listener</th><th v-for="f in data.features" :key="f.short">{{ f.short }}</th></tr></thead>
            <tbody><tr v-for="(id,i) in rowIds" :key="id" :class="{chosen:i===0}" @click="pickObservation(id)"><td>L{{ String(id+1).padStart(3,'0') }}</td><td v-for="(v,j) in data.values[id]" :key="j">{{ fmt(v,j) }}</td></tr></tbody>
          </table>
          <div class="sp-matrix-foot"><span>Numeric features, no prescribed segment labels</span><span>{{ node.ids.length }} rows × 6 features</span></div>
          <div class="sp-transform"><b>StandardScaler</b><code>zᵢⱼ = (xᵢⱼ − μⱼ) / σⱼ</code><span>Fit once on the full demo population</span></div>
        </div>

        <template v-else-if="stage===1||stage===2">
          <svg class="sp-scatter" viewBox="0 0 700 290" role="img" :aria-label="stage===1?'Uncoloured UMAP embedding':'HDBSCAN assignments on the UMAP embedding'">
            <line x1="30" y1="270" x2="680" y2="270" class="sp-axis"/><line x1="30" y1="20" x2="30" y2="270" class="sp-axis"/>
            <circle v-for="(p,i) in node.positions" :key="node.ids[i]" :cx="pointX(p,620,40)" :cy="pointY(p,235,20)" :r="node.ids[i]===observation?6:3.1" :fill="stage===1?'#73687A':pointFill(node.labels[i])" :opacity="stage===2&&selected&&node.labels[i]!==selected.label?0.28:0.85" :stroke="node.ids[i]===observation?'#17101c':'none'" stroke-width="2" class="sp-point" @click="pickObservation(node.ids[i]);stage===2&&node.labels[i]>=0&&choose(node.labels[i])"><title>L{{ node.ids[i]+1 }} · {{ node.labels[i]<0?'Noise':'C'+(node.labels[i]+1) }}{{ '\n'+data.features.map((f,j)=>f.name+': '+fmt(data.values[node.ids[i]][j],j)).join('\n') }}{{ '\nMembership strength: '+node.strength[i].toFixed(3) }}</title></circle>
            <text x="665" y="287" text-anchor="end" class="sp-svg-small">UMAP 1</text><text x="8" y="18" class="sp-svg-small">UMAP 2</text>
          </svg>
          <div class="sp-legend" v-if="stage===2"><button v-for="c in node.clusters" :key="c.label" :class="{chosen:c.label===selected?.label}" @click="choose(c.label)"><i :style="{background:pointFill(c.label)}"/>{{ c.name }} <small>{{ c.n }}</small></button><span><i style="background:#A8A8A8"/>Noise {{ node.noise }}</span></div>
          <div v-else class="sp-chart-note">Display transition only. Point movement does not reproduce the optimizer’s iterations.</div>
        </template>

        <template v-else-if="stage===3">
          <svg class="sp-recursion" viewBox="0 0 700 280" role="img" aria-label="Selected parent cluster, original feature rows and newly fitted child embedding">
            <defs><marker id="sp-recursion-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4D225D"/></marker></defs>
            <text x="18" y="25" class="sp-svg-label">1. Select {{ selected?.name }}</text>
            <circle v-for="(p,i) in node.positions" :key="node.ids[i]" :cx="pointX(p,210,5)" :cy="pointY(p,175,45)" r="2.1" :fill="pointFill(node.labels[i])" :opacity="node.labels[i]===selected?.label?0.95:0.12"/>
            <path d="M225 140 H265" class="sp-arrow" marker-end="url(#sp-recursion-arrow)"/>
            <text x="275" y="25" class="sp-svg-label">2. Original X rows</text>
            <rect x="278" y="68" width="125" height="150" fill="#EDE9EF"/>
            <g v-for="(id,i) in (selected?.memberIds||[]).slice(0,6)" :key="id"><text x="286" :y="89+i*22" class="sp-svg-small">L{{ id+1 }}</text><rect v-for="j in 6" :key="j" :x="332+(j-1)*10" :y="78+i*22" width="7" height="12" :fill="pointFill(selected.label)" :opacity=".15+data.values[id][j-1]/(j<3?280:1)*.7"/></g>
            <text x="279" y="243" class="sp-svg-small">{{ selected?.n }} × 6 features</text>
            <path d="M414 140 H454" class="sp-arrow" marker-end="url(#sp-recursion-arrow)"/>
            <text x="468" y="25" class="sp-svg-label">3. Refit both models</text>
            <template v-if="child"><circle v-for="(p,i) in child.positions" :key="child.ids[i]" :cx="pointX(p,218,462)" :cy="pointY(p,175,45)" r="2.6" :fill="pointFill(child.labels[i])"/><text x="470" y="243" class="sp-svg-small">{{ child.clusters.length }} groups · {{ child.noise }} noise</text></template>
            <template v-else><text x="470" y="125" class="sp-svg-label">Depth limit reached</text><text x="470" y="151" class="sp-svg-small">One recursive fit in this demo</text></template>
          </svg>
          <div class="sp-chart-note">New coordinates come from a new UMAP fit on the selected original rows.</div>
        </template>

        <div v-else-if="stage===4" class="sp-tree">
          <button class="sp-tree-root" @click="enter('root')">Full population <b>{{ data.n }}</b></button>
          <div class="sp-tree-branches"><div v-for="c in preset.nodes.root.clusters" :key="c.label" class="sp-tree-branch">
            <button :style="{borderTopColor:pointFill(c.label)}" @click="contextId='root';choose(c.label);stage=3">{{ c.name }} <b>{{ c.n }} listeners</b></button>
            <template v-if="c.child"><button v-for="sub in preset.nodes[c.child].clusters" :key="sub.label" class="sp-tree-child" @click="enter(c.child);choose(sub.label)"><i :style="{background:pointFill(sub.label)}"/>{{ c.name }}.{{ sub.label+1 }} <b>{{ sub.n }}</b></button><small>{{ preset.nodes[c.child].noise }} noise in child fit</small></template>
            <small v-else>No recursive fit</small>
          </div></div>
          <div class="sp-chart-note">Noise stays unassigned. Child counts can sum to less than their parent.</div>
        </div>

        <template v-else-if="stage===5">
          <svg class="sp-model-flow" viewBox="0 0 700 300" role="img" aria-label="Original features and discovered membership labels train an XGBoost surrogate">
            <defs><marker id="sp-model-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4D225D"/></marker></defs>
            <rect x="15" y="30" width="195" height="88" fill="#EDE9EF"/><text x="30" y="58" class="sp-svg-label">Original features X</text><text x="30" y="87" class="sp-svg-body">{{ node.ids.length }} rows × 6</text>
            <rect x="15" y="151" width="195" height="105" fill="#fff3f5" stroke="#E64366"/><text x="30" y="180" class="sp-svg-label">Discovered labels</text><text x="30" y="209" class="sp-svg-body">y = 1 for {{ selected?.name }}</text><text x="30" y="236" class="sp-svg-body">y = 0 otherwise</text>
            <path d="M210 75 H240 V136 H270 M210 202 H240 V136" class="sp-arrow" marker-end="url(#sp-model-arrow)"/>
            <rect x="274" y="83" width="192" height="112" fill="#4D225D"/><text x="291" y="116" class="sp-svg-label sp-white">Binary XGBoost</text><text x="291" y="147" class="sp-svg-body sp-white">90 trees · depth 3</text><text x="291" y="176" class="sp-svg-body sp-white">75% training rows</text>
            <path d="M466 138 H501" class="sp-arrow" marker-end="url(#sp-model-arrow)"/>
            <rect x="507" y="83" width="180" height="112" fill="#fff3f5" stroke="#E64366"/><text x="522" y="115" class="sp-svg-label">Held-out fidelity</text><text x="522" y="146" class="sp-svg-body">F1 {{ model?.metrics.f1.toFixed(3) }}</text><text x="522" y="175" class="sp-svg-body">AUC {{ model?.metrics.auc.toFixed(3) }}</text>
            <text x="275" y="249" class="sp-svg-small">One model per cluster. Embedding coordinates are excluded.</text>
          </svg>
        </template>

        <template v-else-if="stage===6">
          <div class="sp-shap-switch"><button :class="{chosen:shapMode==='local'}" @click="shapMode='local'">This listener</button><button :class="{chosen:shapMode==='global'}" @click="shapMode='global'">Mean |SHAP|</button><span>{{ shapMode==='local'?'Signed contribution to membership log-odds':'Average magnitude across this node' }}</span></div>
          <svg class="sp-shap" viewBox="0 0 700 250" role="img" aria-label="Computed original-feature SHAP contributions">
            <line x1="410" y1="16" x2="410" y2="216" class="sp-axis"/>
            <g v-for="(v,j) in chartValues" :key="j"><text x="15" :y="42+j*31" class="sp-svg-body">{{ data.features[j].name }}</text><rect :x="v<0?410-Math.abs(v)/maxShap*150:410" :y="25+j*31" :width="Math.max(1,Math.abs(v)/maxShap*150)" height="22" :fill="v>=0?'#E64366':'#4D225D'"/><text :x="v<0?403-Math.abs(v)/maxShap*150:418+Math.abs(v)/maxShap*150" :y="42+j*31" :text-anchor="v<0?'end':'start'" class="sp-svg-small">{{ v>0&&shapMode==='local'?'+':'' }}{{ v.toFixed(2) }}</text></g>
            <text x="405" y="242" text-anchor="end" class="sp-svg-small">{{ shapMode==='local'?'Against membership':'0' }}</text><text x="424" y="242" class="sp-svg-small">{{ shapMode==='local'?'Toward membership':'Greater average contribution magnitude' }}</text>
          </svg>
          <div class="sp-shap-equation" v-if="shapMode==='local'">Base {{ model?.base.toFixed(2) }} + Σ SHAP {{ rawShap.reduce((a,b)=>a+b,0).toFixed(2) }} = log-odds {{ rawMargin.toFixed(2) }} <b>P({{ selected?.name }}) = {{ pct(score) }}</b></div>
          <div class="sp-chart-note" v-else>Magnitude measures model reliance, not direction or causality.</div>
        </template>
        <div v-else-if="stage===7" class="sp-meaning">
          <div class="sp-meaning-step"><span>People</span><p>Ana and Luis play Izal and Vetusta Morla. Marta plays Charlotte de Witte.</p></div>
          <div class="sp-meaning-step"><span>Group</span><p>Artist-play counts could group Ana and Luis together, apart from Marta.</p></div>
          <div class="sp-meaning-step"><span>Why</span><p>An explanation could identify Spanish indie listening as the group’s main signal.</p></div>
          <div class="sp-meaning-result"><b>Possible use</b><span>Suggest Love of Lesbian to Ana if Luis listens to them.</span></div>
          <div class="sp-chart-note">Illustrative artist example. The computed demo uses behaviour, not artist counts.</div>
        </div>
      </div>

      <aside class="sp-explanation" :class="{'sp-details-open':details}">
        <div class="sp-panel-top"><span>{{ stage+2 }} / {{ stages.length+1 }}</span><button @click="details=!details" :aria-expanded="details">{{ details?'Close details':'Technical details' }}</button></div>
        <template v-if="!details&&stage===-1"><h3>A concrete listening example</h3><p>Ana and Luis share artists. Can we discover their group and explain what makes it different?</p><div class="sp-readout"><b>Follow the same people</b><span>Each next step explains what the algorithm would mean for Ana, Luis and Marta.</span><small>Illustrative story. The calculated charts use synthetic behaviour features, without artist counts or named users.</small></div></template>
        <template v-else-if="!details&&stage===7">
          <h3>What the results mean</h3>
          <div class="sp-readout sp-meaning-controls"><label>Group <select aria-label="Select interpretation model" :value="selected?.label" @change="choose($event.target.value)"><option v-for="c in node.clusters" :key="c.label" :value="c.label">{{ c.name }}</option></select></label><label>Listener <select aria-label="Select interpretation listener" :value="observation" @change="pickObservation($event.target.value)"><option v-for="id in node.ids" :key="id" :value="id">L{{ String(id+1).padStart(3,'0') }}</option></select></label></div>
          <p class="sp-interpretation"><b>Across listeners</b><br>{{ globalDrivers.map(d=>data.features[d.index].name).join(' and ') }} have the largest average effects.</p>
          <p class="sp-interpretation"><b>This listener</b><br>{{ data.features[localDriver.index].name }} = {{ fmt(original[localDriver.index],localDriver.index) }} is the strongest push {{ localDriver.value>=0?'toward':'away from' }} {{ selected?.name }}.</p>
          <div class="sp-meaning-limit">Model explanations do not prove causes or validate segments.</div>
        </template>
        <template v-else-if="!details">
          <h3>{{ titles[stage] }}</h3><p>{{ explanations[stage] }}</p>
          <div v-if="stage===0" class="sp-readout"><b>Listener L{{ String(observation+1).padStart(3,'0') }}</b><div class="sp-feature-readout"><span v-for="(f,j) in data.features" :key="f.name">{{ f.short }} <b>{{ fmt(original[j],j) }}</b></span></div></div>
          <div v-if="stage===1" class="sp-readout"><b>{{ node.ids.length }} × 6 → {{ node.ids.length }} × 2</b><span>10-neighbour trustworthiness: {{ node.trustworthiness.toFixed(3) }}</span><small>Local-neighbourhood diagnostic, not segment validity.</small></div>
          <div v-if="stage===2&&node.clusters.length" class="sp-readout"><label>Inspect group <select aria-label="Select cluster" :value="selected?.label" @change="choose($event.target.value)"><option v-for="c in node.clusters" :key="c.label" :value="c.label">{{ c.name }} · {{ c.n }} listeners</option></select></label><b>{{ pct((selected?.n||0)/node.ids.length) }} of this node</b><span>Noise: {{ node.noise }} / {{ node.ids.length }}</span></div>
          <div v-if="stage===2&&!node.clusters.length" class="sp-readout"><b>No membership target exists</b><span>All {{ node.ids.length }} rows are unassigned. Recursion can stop without producing a finer partition.</span></div>
          <div v-if="stage===3" class="sp-readout"><label>Parent cluster <select aria-label="Select recursive parent" :value="selected?.label" @change="choose($event.target.value)"><option v-for="c in node.clusters" :key="c.label" :value="c.label">{{ c.name }} · {{ c.n }} rows</option></select></label><button v-if="child" class="sp-primary" @click="enter(child.id)">Inspect {{ selected.name }} child fit</button><span v-else>Demo depth limit: return to the full population to explore another branch.</span></div>
          <div v-if="stage===4" class="sp-readout"><b>{{ Object.keys(preset.nodes).length }} computed fits</b><span>Each child has its own UMAP coordinates and HDBSCAN assignments.</span></div>
          <div v-if="stage===5" class="sp-readout"><label>Membership model <select aria-label="Select XGBoost model" :value="selected?.label" @change="choose($event.target.value)"><option v-for="c in node.clusters" :key="c.label" :value="c.label">{{ c.name }} versus rest</option></select></label><span>{{ model?.metrics.trainN }} training / {{ model?.metrics.testN }} held-out</span><small>The split tests label reproduction, not new-user cluster discovery.</small></div>
          <div v-if="stage===6" class="sp-readout"><label>Explain membership in <select aria-label="Select SHAP model" :value="selected?.label" @change="choose($event.target.value)"><option v-for="c in node.clusters" :key="c.label" :value="c.label">{{ c.name }}</option></select></label><label>Listener <select aria-label="Select listener" :value="observation" @change="pickObservation($event.target.value)"><option v-for="id in node.ids" :key="id" :value="id">L{{ String(id+1).padStart(3,'0') }}{{ model?.testIds.includes(id)?' · held-out':'' }}</option></select></label><small>{{ isTest?'Held-out listener':'Training listener' }}. Independent binary scores need not sum to 1.</small></div>
        </template>
        <div v-else class="sp-technical">
          <h3>Actual demo configuration</h3>
          <p v-if="stage===0"><b>Input:</b> one observation per row. Percentages remain fractions in X. Standardization uses the full population mean and standard deviation. No planted generator labels enter clustering.</p>
          <p v-if="stage===1"><b>UMAP operation:</b> build a neighbour graph in standardized feature space, assign fuzzy edge weights, then optimize a low-dimensional layout. The animation interpolates final views only.</p>
          <p v-if="stage===2"><b>HDBSCAN operation:</b> mutual-reachability distance = max(coreₖ(a), coreₖ(b), d(a,b)). Build the density hierarchy, condense small branches, then select clusters by excess of mass. This demo clusters the 2D embedding.</p>
          <p v-if="stage===3"><b>Refit:</b> X_child = X[parent row IDs]. Use the original six columns with the global scaler. Recompute neighbours and both models. The old 2D coordinates are excluded.</p>
          <p v-if="stage===4"><b>Tree meaning:</b> this is the recursive analysis tree, not HDBSCAN’s internal condensed density tree. A child may yield no groups. Noise remains unassigned at each fit.</p>
          <p v-if="stage===5"><b>Target:</b> yᶜᵢ = 1[labelᵢ = c]. Each model receives original X and a binary target. Noise is negative for every cluster model. A held-out split measures reproduction of fixed discovered labels.</p>
          <p v-if="stage===6"><b>Additivity:</b> f_c(x) = E[f_c(X)] + Σⱼ φⱼ. Here f_c is the raw log-odds. P(c) = 1/(1 + exp(−f_c(x))). Mean |φ| averages over this node, rather than only its positive members.</p>
          <p v-if="stage===7"><b>Interpretation:</b> global drivers rank mean absolute SHAP over all rows in this node. The local statement uses the largest absolute signed SHAP contribution for the selected listener and membership model. Positive pushes toward membership, negative pushes away. Feature values come from the original input row.</p>
          <p><b>Data:</b> {{ data.n }} synthetic rows, 6 features. Global standardization. Seed {{ data.seed }}.</p>
          <p><b>UMAP:</b> n_neighbors={{ node.parameters.n_neighbors }}, min_dist={{ node.parameters.min_dist }}, Euclidean metric, 2 dimensions.</p>
          <p><b>HDBSCAN:</b> min_cluster_size={{ node.parameters.min_cluster_size }}, min_samples={{ node.parameters.min_samples }}, EOM selection. Noise label −1.</p>
          <p><b>Recursion:</b> subset original rows, retain global scaling, refit UMAP, refit HDBSCAN. Depth limit: 1 recursive fit.</p>
          <p><b>XGBoost:</b> binary logistic, 90 trees, depth 3, learning rate 0.08. Stratified 75/25 split.</p>
          <p><b>TreeSHAP:</b> exact XGBoost contributions in raw log-odds. Base + Σ contributions reconstructs the model margin.</p>
          <p><b>Limits:</b> SHAP describes the surrogate. Embedding and clustering choices affect results. Validate stability and business meaning separately.</p>
        </div>
      </aside>
    </div>
    <div class="sp-controls">
      <div class="sp-control-group"><button aria-label="Previous stage" :disabled="stage===-1" @click="go(stage-1)">← Back</button><button class="sp-primary" aria-label="Next stage" :disabled="stage>=(node.clusters.length?stages.length-1:2)" @click="go(stage+1)">Next →</button><button @click="togglePlay" :aria-pressed="playing">{{ playing?'Pause':'Play' }}</button><button @click="reset">Reset</button></div>
      <div class="sp-control-group sp-context"><button @click="enter('root')" :class="{chosen:contextId==='root'}">All listeners</button><span v-if="contextId!=='root'">/ {{ 'C'+(Number(contextId.split('/')[1])+1) }}</span></div>
      <label class="sp-preset">Computed preset <select v-model="presetId" aria-label="Computed parameter preset"><option v-for="p in data.presets" :key="p.id" :value="p.id">{{ p.name }} · mcs {{ p.nodes.root.parameters.min_cluster_size }}</option></select></label>
      <a href="spotify-clustering.html" target="_blank" rel="noopener" class="sp-open">Open explorer ↗</a>
    </div>
    <div class="sp-provenance"><b>Computed demo · synthetic listeners</b><span>← / → steps · colours identify local groups · no Spotify data or internal parameters</span></div>
  </section>
</template>

<style scoped>
.spotify-explorer{width:1136px;height:472px;color:#4D225D;font:300 17px/1.35 Urbane,Arial,sans-serif;position:relative;text-align:left;--sp-rule:#d8d0dc}
.spotify-explorer *{box-sizing:border-box}.spotify-explorer button,.spotify-explorer select{font:500 15px/1.25 Urbane,Arial,sans-serif;color:inherit}.spotify-explorer button,.sp-open{cursor:pointer;border:1px solid var(--sp-rule);background:white;padding:7px 10px}.spotify-explorer button:hover,.sp-open:hover{background:#EDE9EF}.spotify-explorer button:focus-visible,.spotify-explorer select:focus-visible,.spotify-explorer a:focus-visible{outline:3px solid #E64366;outline-offset:2px}.spotify-explorer button:disabled{opacity:.35;cursor:default}.spotify-explorer select{max-width:100%;padding:5px;background:white;border:1px solid var(--sp-rule)}
.sp-steps{display:flex;border-bottom:1px solid var(--sp-rule);height:40px;gap:0;margin-bottom:13px}.sp-steps button{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:3px;border:none;border-bottom:3px solid transparent;padding:4px 2px;font-size:15px;white-space:nowrap}.sp-steps button:last-child{flex:1.6}.sp-steps button span{font-size:13px;display:inline-flex;width:23px;height:23px;align-items:center;justify-content:center;background:#EDE9EF;border-radius:50%}.sp-steps button.active{border-color:#E64366;font-weight:600}.sp-steps button.active span{background:#4D225D;color:white}.sp-steps button.completed span{background:#e9dce7}
.sp-workspace{display:grid;grid-template-columns:710px 402px;gap:24px;height:344px}.sp-visual{position:relative;height:344px;min-width:0;overflow:hidden}.sp-plot-heading{height:30px;display:flex;justify-content:space-between;align-items:flex-start;font-weight:500;font-size:16px}.sp-light{font-size:13px;font-weight:300;color:#73687A}.sp-explanation{border-left:1px solid var(--sp-rule);padding-left:20px;max-height:344px;overflow:auto;scrollbar-width:thin}.sp-panel-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:13px;color:#73687A}.sp-panel-top button{font-size:13px;padding:4px 7px}.sp-explanation h3{font:600 23px/1.2 Urbane,Arial,sans-serif;margin:0 0 10px;color:#4D225D}.sp-explanation p{font-size:18px!important;line-height:1.4!important;margin:0 0 13px!important}.sp-readout{background:#f6f3f7;padding:10px;display:flex;flex-direction:column;gap:5px;font-size:15px}.sp-readout label{display:flex;justify-content:space-between;align-items:center;gap:8px}.sp-readout select{font-size:14px;max-width:165px;min-width:60px;flex:1}.sp-readout b{color:#4D225D!important}.sp-readout small{font-size:12px;line-height:1.35;color:#73687A}.sp-feature-readout{display:grid;grid-template-columns:1fr 1fr;gap:7px 14px;font-size:14px}.sp-feature-readout span{display:flex;justify-content:space-between}
.sp-controls{height:42px;display:flex;align-items:center;gap:15px;margin-top:15px}.sp-control-group{display:flex;align-items:center;gap:6px}.sp-primary{background:#4D225D!important;color:white!important;border-color:#4D225D!important}.sp-context{margin-left:auto}.sp-preset{font-size:12px;color:#73687A;display:flex;align-items:center;gap:7px}.sp-preset select{font-size:13px}.sp-open{font-size:13px;color:#4D225D;text-decoration:none!important;white-space:nowrap}.sp-provenance{display:flex;justify-content:space-between;font-size:12px;color:#73687A;margin-top:4px}.sp-provenance b{font-weight:500;color:#73687A!important}.chosen{background:#EDE9EF!important}.sp-point{cursor:pointer;transition:cx 650ms ease,cy 650ms ease,fill 400ms ease,opacity 300ms ease,r 180ms ease}.sp-scatter{width:710px;height:273px;display:block}.sp-axis{stroke:#d8d0dc;stroke-width:1}.sp-svg-small{font:300 13px Urbane,Arial,sans-serif;fill:#73687A}.sp-svg-label{font:600 16px Urbane,Arial,sans-serif;fill:#4D225D}.sp-svg-body{font:300 17px Urbane,Arial,sans-serif;fill:#4D225D}.sp-white{fill:white}.sp-arrow{stroke:#4D225D;stroke-width:2;fill:none}.sp-chart-note{font-size:13px;color:#73687A;margin-top:5px;line-height:1.35}.sp-legend{height:32px;display:flex;align-items:center;gap:7px;overflow:auto;white-space:nowrap}.sp-legend button{font-size:13px;padding:4px 7px;display:flex;align-items:center;gap:5px}.sp-legend span{font-size:13px;display:flex;align-items:center;gap:5px}.sp-legend small{font-size:11px}.sp-legend i,.sp-tree-child i{display:inline-block;width:9px;height:9px;border-radius:50%;flex:none}
.sp-matrix-equation{font-size:25px;display:flex;align-items:center;justify-content:space-between;margin:8px 0 16px}.sp-matrix-equation>span:last-child{font-size:15px;color:#73687A}.sp-matrix-formula{font-size:25px}.sp-matrix-formula sup{font-size:14px}.sp-matrix{width:100%;border-collapse:collapse;font-size:16px;table-layout:fixed}.sp-matrix th{background:#4D225D;color:white;padding:9px 5px;font-size:13px;font-weight:500;text-align:right}.sp-matrix th:first-child{text-align:left;width:90px}.sp-matrix td{padding:7px 5px;text-align:right;border-bottom:1px solid #EDE9EF}.sp-matrix td:first-child{text-align:left;font-weight:500}.sp-matrix tbody tr{cursor:pointer}.sp-matrix-foot{display:flex;justify-content:space-between;font-size:12px;color:#73687A;margin-top:6px}.sp-transform{margin-top:15px;display:flex;align-items:center;gap:16px;font-size:14px}.sp-transform code{font:16px Georgia,serif}.sp-transform span{font-size:12px;color:#73687A}.sp-recursion{width:710px;height:278px}.sp-tree-root{display:block;margin:6px auto 18px;min-width:210px!important;background:#4D225D!important;color:white!important}.sp-tree-root b{margin-left:14px;color:white!important}.sp-tree-branches{display:flex;justify-content:space-evenly;gap:14px;height:222px;overflow:auto;align-items:flex-start;border-top:1px solid #d8d0dc;padding-top:14px}.sp-tree-branch{min-width:135px;flex:1;max-width:220px;position:relative;display:flex;flex-direction:column;gap:6px}.sp-tree-branch:before{content:'';width:1px;height:14px;background:#d8d0dc;position:absolute;top:-14px;left:50%}.sp-tree-branch>button:first-child{border-top:4px solid #4D225D;display:flex;justify-content:space-between;font-size:15px}.sp-tree-branch b{font-size:12px;font-weight:500;color:inherit}.sp-tree-child{margin-left:12px;display:flex;align-items:center;gap:6px;justify-content:space-between;font-size:13px!important}.sp-tree-branch small{font-size:11px;color:#73687A;text-align:center}.sp-model-flow{width:710px;height:300px}.sp-shap-switch{display:flex;align-items:center;gap:7px;height:35px}.sp-shap-switch button{font-size:13px;padding:5px 8px}.sp-shap-switch span{font-size:12px;color:#73687A}.sp-shap{width:710px;height:250px}.sp-shap rect{transition:width 400ms ease,x 400ms ease}.sp-shap-equation{font-size:13px;display:flex;justify-content:space-between}.sp-shap-equation b{color:#4D225D!important}.sp-empty{padding:60px 55px;background:#f6f3f7;height:290px}.sp-empty h3{font:600 25px/1.25 Urbane,Arial,sans-serif;margin:0 0 15px}.sp-empty p{font:300 20px/1.5 Urbane,Arial,sans-serif;margin:0 0 22px}.sp-technical p{font-size:15px!important;margin-bottom:12px!important}.sp-technical h3{font-size:21px}.sp-technical b{color:#4D225D!important}
.sp-meaning{padding-top:4px}.sp-meaning-step{display:grid;grid-template-columns:104px 1fr;gap:18px;padding:14px 0;border-bottom:1px solid var(--sp-rule);align-items:start}.sp-meaning-step>span{font-weight:600;font-size:19px}.sp-meaning-step p{font-size:18px;line-height:1.4;margin:0}.sp-meaning-result{display:flex;gap:18px;padding:16px 0;font-size:17px;line-height:1.4}.sp-meaning-result b{color:#E64366!important;white-space:nowrap}.sp-meaning-controls{margin-bottom:10px;flex-direction:row;gap:16px}.sp-meaning-controls label{flex:1;min-width:0}.sp-meaning-controls select{max-width:100px}.sp-explanation p.sp-interpretation{font-size:17px!important;line-height:1.35!important;margin-bottom:10px!important}.sp-meaning-limit{font-size:13px;line-height:1.35;color:#73687A}
@keyframes spRevealOdd{from{opacity:.15}to{opacity:1}}@keyframes spRevealEven{from{opacity:.15}to{opacity:1}}@keyframes spFlow{to{stroke-dashoffset:-20}}.sp-visual{animation-duration:350ms;animation-timing-function:ease}.sp-playing .sp-arrow{stroke-dasharray:6 4;animation:spFlow 1s linear infinite}
@media(prefers-reduced-motion:reduce){.sp-point,.sp-shap rect{transition:none}.sp-visual,.sp-arrow{animation:none!important}}
@media print{.spotify-explorer:not(.sp-print-stage){display:none!important}}
.spotify-explorer.sp-print-stage .sp-controls{display:none}.spotify-explorer.sp-print-stage,.spotify-explorer.sp-print-stage *{animation:none!important;transition:none!important}
</style>
