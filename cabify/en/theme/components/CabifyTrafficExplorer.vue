<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import data from '../../data/cabify-demo.json'
const props=defineProps({initialStage:{type:Number,default:0},onSlideBoundary:Function,printStage:{type:Number,default:null}})
const root=ref(null),stage=ref(props.initialStage),playing=ref(false),details=ref(false)
const initialRequest=()=>({burst:6,completion:45,highCost:0,newDevice:1})
const req=ref(initialRequest())
const threshold=ref(.5)
const falseBlockCost=ref(data.costs.blockedGenuine)
const stages=['Request','Risk score','Threshold','Cost','Explainability']
const eur=(n,d=0)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',minimumFractionDigits:d,maximumFractionDigits:d}).format(n)
const sgn=n=>(n>=0?'+':'−')+Math.abs(n).toFixed(2)
const pct=p=>Math.round(p*100)+'%'
const sigmoid=z=>1/(1+Math.exp(-z))
const vector=r=>[Math.log1p(r.burst),r.completion/100,r.highCost,r.newDevice]
const logit=r=>data.intercept+vector(r).reduce((s,v,j)=>s+v*data.coefficients[j],0)
const z=computed(()=>logit(req.value))
const score=computed(()=>sigmoid(z.value))
const names=['Requests per minute','Codes entered','High-cost route','Unfamiliar device']
const contributions=computed(()=>vector(req.value).map((v,j)=>({name:names[j],value:data.coefficients[j]*(v-data.means[j])})))
const maxContribution=computed(()=>Math.max(.5,...contributions.value.map(c=>Math.abs(c.value))))
const biggest=computed(()=>[...contributions.value].sort((a,b)=>Math.abs(b.value)-Math.abs(a.value))[0])
const decision=computed(()=>score.value>=threshold.value?'Block':'Allow')
const bots=data.scores.filter(s=>s[1]===1).length,genuine=data.scores.length-bots
function confusion(t){let tp=0,fp=0;for(const [p,l] of data.scores)if(p>=t){l?tp++:fp++}return {tp,fp,fn:bots-tp,tn:genuine-fp}}
const costAt=(t,c=falseBlockCost.value)=>{const m=confusion(t);return (m.fp*c+m.fn*data.costs.missedBot)/data.testN*1000}
const matrix=computed(()=>confusion(threshold.value))
const precision=computed(()=>matrix.value.tp+matrix.value.fp?matrix.value.tp/(matrix.value.tp+matrix.value.fp):1)
const recall=computed(()=>matrix.value.tp/bots)
const cost=computed(()=>costAt(threshold.value))
const curve=computed(()=>Array.from({length:99},(_,i)=>{const t=(i+1)/100;return {t,c:costAt(t)}}))
const best=computed(()=>curve.value.reduce((a,b)=>b.c<a.c?b:a))
const maxCost=computed(()=>Math.max(...curve.value.map(p=>p.c)))
const bins=computed(()=>{const b=Array.from({length:20},()=>({g:0,b:0}));for(const [p,l] of data.scores)b[Math.min(19,Math.floor(p*20))][l?'b':'g']++;return b})
const maxBin=computed(()=>Math.max(...bins.value.map(b=>b.g+b.b)))
const barH=b=>Math.sqrt(b.g+b.b)/Math.sqrt(maxBin.value)*165
const histX=t=>40+t*650
const curveX=t=>30+t*320,curveY=c=>196-c/maxCost.value*170
const curvePath=computed(()=>curve.value.map((p,i)=>(i?'L':'M')+curveX(p.t).toFixed(1)+' '+curveY(p.c).toFixed(1)).join(' '))
const titles=['A verification SMS to check','Logistic regression turns signals into a score','A threshold turns the score into a decision','Each kind of error has a price','Why did this request score this way?']
const explanations=[
 'A sign-up asks for a verification SMS. Change its signals to follow this one request through every step.',
 'Learn from past labelled requests, then turn this request’s signals into a probability of artificial traffic.',
 'Choose the score at which a request is blocked. Every threshold lets some bots through and stops some genuine users.',
 'Put a price on each mistake. The best threshold depends on what each kind of error costs.',
 'Split the risk score into the signals that pushed it up or down for this request.'
]
function go(i){stage.value=Math.max(0,Math.min(stages.length-1,i));playing.value=false}
function reset(){req.value=initialRequest();threshold.value=.5;falseBlockCost.value=data.costs.blockedGenuine;stage.value=0;details.value=false;playing.value=false}
function togglePlay(){if(stage.value===stages.length-1)stage.value=0;playing.value=!playing.value}
function onKey(e){
 if(props.printStage!=null||!root.value||root.value.getBoundingClientRect().width===0||e.altKey||e.metaKey||e.ctrlKey||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return
 if(e.key==='ArrowRight'&&stage.value<stages.length-1){e.preventDefault();e.stopImmediatePropagation();go(stage.value+1)}
 else if(e.key==='ArrowLeft'&&stage.value>0){e.preventDefault();e.stopImmediatePropagation();go(stage.value-1)}
 else if(props.onSlideBoundary&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();props.onSlideBoundary(e.key==='ArrowRight'?1:-1)}
}
let timer
onMounted(()=>{window.addEventListener('keydown',onKey,true);timer=setInterval(()=>{if(playing.value){if(stage.value<stages.length-1)stage.value++;else playing.value=false}},5500)})
onBeforeUnmount(()=>{clearInterval(timer);window.removeEventListener('keydown',onKey,true)})
watch(stage,()=>details.value=false)
watch(()=>props.printStage,v=>{if(v!=null)stage.value=Math.max(0,Math.min(stages.length-1,v))},{immediate:true})
defineExpose({go,reset,stage,req,threshold})
</script>

<template>
<section ref="root" class="cabify-explorer" :class="{'ct-playing':playing,'ct-print-stage':printStage!=null}" :data-stage="stage" aria-label="Interactive Cabify traffic classification walkthrough">
 <nav class="ct-steps" aria-label="Classification stages"><button v-for="(name,i) in stages" :key="name" :class="{active:stage===i,completed:stage>i}" :aria-current="stage===i?'step':undefined" @click="go(i)"><span>{{i+1}}</span>{{name}}</button></nav>
 <div class="ct-workspace">
  <div class="ct-visual" :style="{animationName:stage%2?'ctRevealOdd':'ctRevealEven'}">
   <div class="ct-plot-heading">{{['The request becomes a feature vector','Learning first, scoring second','Where the line falls on held-out traffic','Counting the mistakes at this threshold','An exact log-odds breakdown of this score'][stage]}}</div>
   <div v-if="stage===0" class="ct-property-view">
    <div class="ct-home-title">Verification request <span>{{eur(data.costs.missedBot,2)}} per unblocked bot message · fictional</span></div>
    <div class="ct-feature-row"><span>Requests/min</span><b>{{req.burst}}</b><span>Codes entered</span><b>{{req.completion}}%</b></div>
    <div class="ct-feature-row"><span>High-cost route</span><b>{{req.highCost?'Yes':'No'}}</b><span>Unfamiliar device</span><b>{{req.newDevice?'Yes':'No'}}</b></div>
    <svg class="ct-vector-flow" viewBox="0 0 700 110" role="img" aria-label="Request signals become a numeric model input"><defs><marker id="ct-vector-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4D225D"/></marker></defs><path d="M350 5 V38" class="ct-arrow" marker-end="url(#ct-vector-arrow)"/><text x="350" y="73" text-anchor="middle" class="ct-svg-equation">x = [{{vector(req).map(v=>+v.toFixed(2)).join(', ')}}]</text><text x="350" y="103" text-anchor="middle" class="ct-svg-small">ln(1 + requests/min), share of codes entered, high-cost route, unfamiliar device</text></svg>
    <div class="ct-chart-note">The signals are illustrative. Infobip does not publish the features its ML service uses.</div>
   </div>
   <template v-else-if="stage===1">
    <svg class="ct-training" viewBox="0 0 700 300" role="img" aria-label="Fit logistic regression on labelled requests, then score this request"><defs><marker id="ct-model-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#4D225D"/></marker></defs>
     <text x="10" y="25" class="ct-svg-label">TRAINING · computed once</text>
     <rect x="10" y="42" width="222" height="84" fill="#EDE9EF"/><text x="25" y="72" class="ct-svg-label">{{data.trainN.toLocaleString('en')}} labelled requests</text><text x="25" y="101" class="ct-svg-body">Signals X + bot or genuine y</text>
     <path d="M232 84 H280" class="ct-arrow" marker-end="url(#ct-model-arrow)"/>
     <rect x="287" y="42" width="190" height="84" fill="#4D225D"/><text x="302" y="73" class="ct-svg-label ct-white">Logistic regression</text><text x="302" y="102" class="ct-svg-body ct-white">Learn weights β</text>
     <path d="M477 84 H521" class="ct-arrow" marker-end="url(#ct-model-arrow)"/><text x="535" y="77" class="ct-svg-label">Maximum likelihood</text><text x="535" y="103" class="ct-svg-body">min log-loss</text>
     <line x1="10" y1="150" x2="690" y2="150" class="ct-axis"/>
     <text x="10" y="179" class="ct-svg-label">SCORING · updates with your inputs</text>
     <rect x="10" y="197" width="222" height="80" fill="#EDE9EF"/><text x="25" y="226" class="ct-svg-label">This request’s signals</text><text x="25" y="254" class="ct-svg-body">{{req.burst}}/min · {{req.completion}}% codes entered</text>
     <path d="M232 237 H280" class="ct-arrow" marker-end="url(#ct-model-arrow)"/>
     <rect x="287" y="197" width="190" height="80" fill="#4D225D"/><text x="302" y="227" class="ct-svg-label ct-white">Fixed fitted model</text><text x="302" y="254" class="ct-svg-body ct-white">p = 1 / (1 + e⁻ᶻ)</text>
     <path d="M477 237 H521" class="ct-arrow" marker-end="url(#ct-model-arrow)"/><text x="535" y="231" class="ct-svg-label">Risk of bot traffic</text><text x="535" y="258" class="ct-svg-price">{{pct(score)}}</text>
    </svg>
   </template>
   <template v-else-if="stage===2">
    <svg class="ct-hist" viewBox="0 0 700 262" role="img" aria-label="Held-out risk scores for genuine and artificial requests, with the blocking threshold">
     <rect :x="histX(threshold)" y="8" :width="690-histX(threshold)" height="197" fill="#E64366" opacity=".08"/>
     <g v-for="(b,i) in bins" :key="i"><template v-if="b.g+b.b"><rect :x="40+i*32.5+2" :y="205-barH(b)*b.g/(b.g+b.b)" :width="28.5" :height="barH(b)*b.g/(b.g+b.b)" fill="#4D225D"/><rect :x="40+i*32.5+2" :y="205-barH(b)" :width="28.5" :height="barH(b)*b.b/(b.g+b.b)" fill="#E64366"/></template></g>
     <line x1="40" y1="205" x2="690" y2="205" class="ct-axis"/>
     <text v-for="v in [0,.25,.5,.75,1]" :key="v" :x="histX(v)" y="233" text-anchor="middle" class="ct-svg-small">{{v}}</text>
     <text x="365" y="255" text-anchor="middle" class="ct-svg-small">Risk score (probability of bot traffic)</text>
     <line :x1="histX(threshold)" y1="8" :x2="histX(threshold)" y2="205" stroke="#4D225D" stroke-width="2.5" stroke-dasharray="6 4"/>
     <text :x="Math.min(histX(threshold)+6,590)" y="22" class="ct-svg-label">Block ≥ {{threshold.toFixed(2)}}</text>
     <path :d="`M${histX(score)-7} 218 L${histX(score)+7} 218 L${histX(score)} 207 Z`" fill="#E64366"/>
     <text :x="histX(score)>560?histX(score)-10:histX(score)+10" y="217" :text-anchor="histX(score)>560?'end':'start'" class="ct-svg-small">this request {{pct(score)}}</text>
    </svg>
    <div class="ct-legend"><i class="ct-key ct-plum"></i>Genuine ({{genuine}})<i class="ct-key ct-pink"></i>Artificial ({{bots}})<span>Bar height uses a square-root scale · {{data.testN.toLocaleString('en')}} held-out requests</span></div>
   </template>
   <template v-else-if="stage===3">
    <div class="ct-cost-grid">
     <div class="ct-matrix">
      <div class="ct-matrix-head"></div><div class="ct-matrix-head">Blocked</div><div class="ct-matrix-head">Allowed</div>
      <div class="ct-matrix-side">Actually a bot</div><div class="ct-cell ct-good"><b>{{matrix.tp}}</b><span>bots stopped</span></div><div class="ct-cell ct-bad"><b>{{matrix.fn}}</b><span>bots missed · {{eur(data.costs.missedBot,2)}} each</span></div>
      <div class="ct-matrix-side">Actually genuine</div><div class="ct-cell ct-bad"><b>{{matrix.fp}}</b><span>real users blocked · {{eur(falseBlockCost)}} each</span></div><div class="ct-cell ct-good"><b>{{matrix.tn}}</b><span>real users allowed</span></div>
     </div>
     <svg class="ct-curve" viewBox="0 0 360 240" role="img" aria-label="Cost per 1,000 requests at every threshold">
      <line x1="30" y1="196" x2="350" y2="196" class="ct-axis"/><line x1="30" y1="20" x2="30" y2="196" class="ct-axis"/>
      <path :d="curvePath" fill="none" stroke="#4D225D" stroke-width="2.5"/>
      <circle :cx="curveX(best.t)" :cy="curveY(best.c)" r="6" fill="white" stroke="#4D225D" stroke-width="2.5"/>
      <circle :cx="curveX(threshold)" :cy="curveY(cost)" r="6" fill="#E64366"/>
      <text v-for="v in [0,.5,1]" :key="v" :x="curveX(v)" y="214" text-anchor="middle" class="ct-svg-small">{{v}}</text>
      <text x="190" y="232" text-anchor="middle" class="ct-svg-small">Blocking threshold</text>
      <text x="36" y="14" class="ct-svg-small">Cost per 1,000 requests</text>
      <text x="344" y="42" text-anchor="end" class="ct-svg-small">○ cheapest {{best.t.toFixed(2)}}</text><text x="344" y="58" text-anchor="end" class="ct-svg-small" fill="#E64366">● current {{threshold.toFixed(2)}}</text>
     </svg>
    </div>
    <div class="ct-breakdown-total"><span>{{matrix.fp}} × {{eur(falseBlockCost)}} + {{matrix.fn}} × {{eur(data.costs.missedBot,2)}}, scaled to 1,000 requests</span><b>= {{eur(cost)}}</b></div>
    <div class="ct-chart-note">Fictional prices, chosen to illustrate the trade-off. They are not Cabify or Infobip figures.</div>
   </template>
   <template v-else-if="stage===4">
    <svg class="ct-breakdown" viewBox="0 0 700 265" role="img" aria-label="Exact additive log-odds contributions from the average request to this request"><line x1="420" y1="12" x2="420" y2="190" class="ct-axis"/><g v-for="(a,i) in contributions" :key="a.name"><text x="10" :y="48+i*40" class="ct-svg-body">{{a.name}}</text><rect :x="a.value<0?420-Math.abs(a.value)/maxContribution*200:420" :y="28+i*40" :width="Math.max(1,Math.abs(a.value)/maxContribution*200)" height="26" :fill="a.value>=0?'#E64366':'#4D225D'"/><text :x="a.value<0?412-Math.abs(a.value)/maxContribution*200:428+Math.abs(a.value)/maxContribution*200" :y="47+i*40" :text-anchor="a.value<0?'end':'start'" class="ct-svg-small">{{sgn(a.value)}}</text></g><text x="408" y="216" text-anchor="end" class="ct-svg-small">Lowers risk</text><text x="433" y="216" class="ct-svg-small">Raises risk</text></svg>
    <div class="ct-breakdown-total">Average request {{sgn(data.baseline)}} + signals <b>= {{sgn(z)}} log-odds → {{pct(score)}} risk</b></div><div class="ct-chart-note">Exact arithmetic of this model, in log-odds. The average request is the mean of the training data.</div>
   </template>
  </div>
  <aside class="ct-explanation">
   <div class="ct-panel-top"><span>{{stage+1}} / {{stages.length}}</span><button @click="details=!details" :aria-expanded="details">{{details?'Close details':'Technical details'}}</button></div>
   <template v-if="!details">
    <h3>{{titles[stage]}}</h3><p>{{explanations[stage]}}</p>
    <form v-if="stage===0" class="ct-inputs" @submit.prevent>
     <label>Requests per minute <span class="ct-range"><input v-model.number="req.burst" type="range" min="1" max="40" step="1" aria-label="Requests per minute from this source"/><b>{{req.burst}}</b></span></label>
     <label>Codes entered <span class="ct-range"><input v-model.number="req.completion" type="range" min="0" max="100" step="5" aria-label="Share of sent codes that are entered"/><b>{{req.completion}}%</b></span></label>
     <label>High-cost route <input v-model="req.highCost" type="checkbox" :true-value="1" :false-value="0" aria-label="Destination uses a high-cost route"/></label>
     <label>Unfamiliar device <input v-model="req.newDevice" type="checkbox" :true-value="1" :false-value="0" aria-label="Request comes from an unfamiliar device"/></label>
    </form>
    <div v-if="stage===1" class="ct-readout"><b>What does it learn?</b><span>Entering more codes lowers risk. Each doubling of the request rate adds {{sgn(data.coefficients[0]*Math.log(2))}} log-odds, holding the other signals fixed.</span><small>A fitted association in synthetic data.</small></div>
    <template v-if="stage===2"><form class="ct-inputs" @submit.prevent><label>Block at <span class="ct-range"><input v-model.number="threshold" type="range" min="0.05" max="0.95" step="0.01" aria-label="Blocking threshold"/><b>{{threshold.toFixed(2)}}</b></span></label></form><div class="ct-readout"><b>This request: {{decision}}</b><span>Score {{pct(score)}} against a threshold of {{pct(threshold)}}.</span><small>Genuine users blocked: {{matrix.fp}} of {{genuine}}. Bots allowed: {{matrix.fn}} of {{bots}}.</small></div></template>
    <template v-if="stage===3"><form class="ct-inputs" @submit.prevent><label>Block at <span class="ct-range"><input v-model.number="threshold" type="range" min="0.05" max="0.95" step="0.01" aria-label="Blocking threshold"/><b>{{threshold.toFixed(2)}}</b></span></label><label>Cost of blocking a real user <select v-model.number="falseBlockCost" aria-label="Cost of blocking a genuine user"><option :value="2">€2</option><option :value="5">€5</option><option :value="10">€10</option></select></label></form><div class="ct-readout"><b>Precision {{pct(precision)}} · recall {{pct(recall)}}</b><span>Of the requests blocked, {{pct(precision)}} are bots. Of all bots, {{pct(recall)}} are stopped.</span><button class="ct-primary" @click="threshold=best.t">Use cheapest threshold ({{best.t.toFixed(2)}})</button></div></template>
    <template v-if="stage===4"><div class="ct-readout ct-meaning-readout"><b>This request</b><span>{{biggest.name}} moves its risk the most: {{sgn(biggest.value)}} log-odds against the average request.</span><b>Decision at {{threshold.toFixed(2)}}</b><span>{{decision}}. The score is {{pct(score)}}.</span></div><div class="ct-meaning-limit">Bars explain this calculation. They do not prove intent, and a high score is not proof of fraud.</div></template>
   </template>
   <div v-else class="ct-technical"><h3>Actual demo calculation</h3><p><b>Data:</b> {{data.n.toLocaleString('en')}} synthetic requests, {{pct(data.prevalence)}} artificial. {{data.trainN.toLocaleString('en')}} training and {{data.testN.toLocaleString('en')}} held out, stratified split. Seed {{data.seed}}. Includes bots that mimic real users and real users who retry, so the classes overlap.</p><p><b>Model:</b> logistic regression with an intercept (L2, C = 1). Inputs: ln(1 + requests/min), share of codes entered, high-cost route, unfamiliar device. Fit once on training rows.</p><p><b>Learned weights:</b><br>Intercept {{sgn(data.intercept)}}<br><span v-for="(name,i) in ['ln(1 + requests/min)','Codes entered (0–1)','High-cost route','Unfamiliar device']" :key="name">{{name}}: {{sgn(data.coefficients[i])}}<br></span></p><p><b>Decision:</b> block when the predicted probability is at least the threshold. The threshold is a business choice, not a model output.</p><p><b>Cost:</b> blocked genuine users × cost A + missed bots × {{eur(data.costs.missedBot,2)}}, per 1,000 requests. Fictional prices.</p><p><b>Breakdown:</b> each term is β × (x − training mean) in log-odds. With the average request’s log-odds, the terms sum exactly to this request’s log-odds.</p><p><b>Held-out quality:</b> AUC {{data.metrics.auc.toFixed(3)}}. At 0.50: precision {{pct(data.metrics.precision)}}, recall {{pct(data.metrics.recall)}}. Synthetic results, not Infobip’s accuracy.</p><p><b>Published method:</b> Infobip Signals uses ML to identify artificial traffic. The model, features, labels and thresholds are not public.</p></div>
  </aside>
 </div>
 <div class="ct-controls"><div class="ct-control-group"><button :disabled="stage===0" aria-label="Previous stage" @click="go(stage-1)">← Back</button><button class="ct-primary" :disabled="stage===stages.length-1" aria-label="Next stage" @click="go(stage+1)">Next →</button><button @click="togglePlay" :aria-pressed="playing">{{playing?'Pause':'Play'}}</button><button @click="reset">Reset</button></div><button class="ct-edit" @click="go(0)">Edit request</button><span class="ct-current-home">{{req.burst}}/min · {{req.completion}}% entered · {{pct(score)}} risk</span><a class="ct-open" href="cabify-traffic.html" target="_blank" rel="noopener">Open explorer ↗</a></div>
 <div class="ct-provenance"><b>Computed demo · synthetic requests and prices</b><span>← / → steps · teaching baseline · no Cabify or Infobip data or proprietary model</span></div>
</section>
</template>

<style scoped>
.cabify-explorer{width:1136px;height:472px;color:#4D225D;font:300 17px/1.35 Urbane,Arial,sans-serif;position:relative;text-align:left;--ct-rule:#d8d0dc}.cabify-explorer *{box-sizing:border-box}.cabify-explorer button,.cabify-explorer select{font:500 15px/1.25 Urbane,Arial,sans-serif;color:inherit}.cabify-explorer button,.ct-open{cursor:pointer;border:1px solid var(--ct-rule);background:white;padding:7px 10px}.cabify-explorer button:hover,.ct-open:hover{background:#EDE9EF}.cabify-explorer button:disabled{opacity:.35;cursor:default}.cabify-explorer button:focus-visible,.cabify-explorer input:focus-visible,.cabify-explorer select:focus-visible,.ct-open:focus-visible{outline:3px solid #E64366;outline-offset:2px}.cabify-explorer select{padding:5px;background:white;border:1px solid var(--ct-rule)}.ct-steps{display:flex;border-bottom:1px solid var(--ct-rule);height:40px;margin-bottom:13px}.ct-steps button{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;border:none;border-bottom:3px solid transparent;padding:4px 6px;font-size:17px}.ct-steps button span{font-size:13px;display:inline-flex;width:23px;height:23px;align-items:center;justify-content:center;background:#EDE9EF;border-radius:50%}.ct-steps button.active{border-color:#E64366;font-weight:600}.ct-steps button.active span{background:#4D225D;color:white}.ct-steps button.completed span{background:#e9dce7}.ct-workspace{display:grid;grid-template-columns:710px 402px;gap:24px;height:344px}.ct-visual{height:344px;min-width:0;overflow:hidden;animation-duration:350ms;animation-timing-function:ease}.ct-plot-heading{height:30px;font-size:16px;font-weight:500}.ct-explanation{border-left:1px solid var(--ct-rule);padding-left:20px;max-height:352px;overflow:auto;scrollbar-width:thin}.ct-panel-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:13px;color:#73687A}.ct-panel-top button{font-size:13px;padding:4px 7px}.ct-explanation h3{font:600 21px/1.2 Urbane,Arial,sans-serif;color:#4D225D;margin:0 0 7px}.ct-explanation p{font-size:16px!important;line-height:1.35!important;margin:0 0 9px!important}.ct-readout{display:flex;flex-direction:column;gap:5px;padding:9px 12px;background:#f6f3f7;font-size:14.5px;line-height:1.35}.ct-readout b{color:#4D225D!important}.ct-readout small{font-size:13px;color:#73687A}.ct-inputs{display:flex;flex-direction:column;gap:7px}.ct-inputs label{display:flex;align-items:center;justify-content:space-between;font-size:16px;min-height:30px}.ct-range{display:flex;align-items:center;gap:10px}.ct-range input{width:140px;accent-color:#4D225D}.ct-range b{font-size:15px;width:58px;text-align:right}.ct-inputs select{width:110px;font-size:14px}.ct-inputs input[type=checkbox]{accent-color:#4D225D;width:20px;height:20px;margin:0}.ct-controls{height:42px;display:flex;align-items:center;gap:15px;margin-top:15px}.ct-control-group{display:flex;gap:6px}.ct-primary{background:#4D225D!important;color:white!important;border-color:#4D225D!important}.ct-edit{margin-left:auto}.ct-current-home{font-size:14px;color:#73687A}.ct-open{font-size:13px;color:#4D225D;text-decoration:none!important;white-space:nowrap}.ct-provenance{display:flex;justify-content:space-between;font-size:12px;color:#73687A;margin-top:4px}.ct-provenance b{font-weight:500;color:#73687A!important}.ct-home-title{font-size:29px;font-weight:600;margin:12px 0 14px;display:flex;justify-content:space-between;align-items:center}.ct-home-title span{font-weight:300;font-size:17px;color:#73687A}.ct-feature-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;padding:11px 0;border-bottom:1px solid var(--ct-rule);align-items:center;font-size:21px}.ct-feature-row b{font-size:24px}.ct-vector-flow{width:710px;height:100px;display:block}.ct-chart-note{font-size:13px;color:#73687A;line-height:1.35;margin-top:6px}.ct-svg-equation{font:500 27px Urbane,Arial,sans-serif;fill:#4D225D}.ct-svg-small{font:300 13px Urbane,Arial,sans-serif;fill:#73687A}.ct-svg-label{font:600 16px Urbane,Arial,sans-serif;fill:#4D225D}.ct-svg-body{font:300 17px Urbane,Arial,sans-serif;fill:#4D225D}.ct-svg-price{font:600 23px Urbane,Arial,sans-serif;fill:#E64366}.ct-white{fill:white}.ct-arrow{stroke:#4D225D;stroke-width:2;fill:none}.ct-axis{stroke:var(--ct-rule);stroke-width:1}.ct-table-note{font-size:14px;color:#73687A;margin:3px 0 10px}.ct-comparables{width:100%;border-collapse:collapse;table-layout:fixed;font-size:16px}.ct-comparables th{font-weight:500;background:#4D225D;color:white;font-size:13px;text-align:right;padding:7px 6px}.ct-comparables td{border-bottom:1px solid var(--ct-rule);padding:4px 6px;text-align:right}.ct-comparables th:first-child,.ct-comparables td:first-child{text-align:left}.ct-comparables th:last-child{width:145px}.ct-comparable-mean{display:flex;justify-content:space-between;margin-top:10px;font-size:18px}.ct-comparable-mean b{color:#E64366!important}.ct-training{width:710px;height:300px}.ct-estimate-inputs{display:flex;align-items:center;justify-content:space-around;margin-top:12px}.ct-estimate-inputs>div{display:flex;flex-direction:column;gap:6px;width:275px;text-align:center}.ct-estimate-inputs b{font-size:30px;color:#4D225D!important}.ct-estimate-inputs small{font-size:13px;color:#73687A}.ct-plus{font-size:28px}.ct-blend-arrow{width:710px;height:45px;margin-top:5px}.ct-final-price{display:flex;flex-direction:column;align-items:center;gap:3px;margin-top:3px;animation:ctPrice 400ms ease}.ct-final-price>span{font-size:20px}.ct-final-price strong{font-size:52px;line-height:1.2;font-weight:600;color:#E64366}.ct-final-price small{font-size:13px;color:#73687A}.ct-breakdown{width:710px;height:260px}.ct-breakdown rect{transition:width 350ms ease,x 350ms ease}.ct-breakdown-total{font-size:16px;display:flex;justify-content:space-between}.ct-meaning-readout{gap:6px}.ct-meaning-limit{font-size:13px;line-height:1.35;color:#73687A;margin-top:8px}.ct-technical p{font-size:15px!important;line-height:1.4!important;margin-bottom:12px!important}.ct-technical h3{font-size:21px}.ct-technical b{color:#4D225D!important}
@keyframes ctRevealOdd{from{opacity:.15}to{opacity:1}}@keyframes ctRevealEven{from{opacity:.15}to{opacity:1}}@keyframes ctPrice{from{opacity:.35;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes ctFlow{to{stroke-dashoffset:-20}}.ct-playing .ct-arrow{stroke-dasharray:6 4;animation:ctFlow 1s linear infinite}@media(prefers-reduced-motion:reduce){.ct-visual,.ct-final-price,.ct-arrow{animation:none!important}.ct-breakdown rect{transition:none}}@media print{.cabify-explorer:not(.ct-print-stage){display:none!important}}
.ct-property-view .ct-home-title{font-size:27px;margin:4px 0 6px}.ct-property-view .ct-feature-row{grid-template-columns:1.25fr .6fr 1.5fr .65fr;font-size:19px;padding:8px 0}.ct-property-view .ct-feature-row b{font-size:23px}.ct-property-view .ct-vector-flow{height:96px;margin-top:2px}.ct-hist{width:710px;height:262px;display:block}.ct-legend{display:flex;align-items:center;gap:7px;font-size:13px;color:#73687A;margin-top:2px}.ct-legend span{margin-left:auto}.ct-key{display:inline-block;width:12px;height:12px}.ct-key.ct-plum{background:#4D225D}.ct-key.ct-pink{background:#E64366;margin-left:10px}.ct-cost-grid{display:grid;grid-template-columns:320px 360px;gap:30px;height:232px}.ct-matrix{display:grid;grid-template-columns:78px 1fr 1fr;grid-template-rows:28px 1fr 1fr;gap:5px;font-size:13px}.ct-matrix-head{font-weight:600;text-align:center;align-self:end;color:#4D225D;font-size:15px}.ct-matrix-side{font-weight:600;font-size:14px;align-self:center;color:#4D225D}.ct-cell{display:flex;flex-direction:column;justify-content:center;gap:3px;padding:8px;text-align:center}.ct-cell b{font-size:30px;font-weight:600;line-height:1}.ct-cell span{font-size:12px;line-height:1.25;color:#4D225D}.ct-cell.ct-good{background:#EDE9EF}.ct-cell.ct-bad{background:#fbe3e9}.ct-cell.ct-bad b{color:#E64366!important}.ct-curve{width:360px;height:240px}.ct-readout .ct-primary{margin-top:4px;background:#4D225D!important;color:white!important;border-color:#4D225D!important;font-size:14px}
.cabify-explorer.ct-print-stage .ct-controls{display:none}.cabify-explorer.ct-print-stage,.cabify-explorer.ct-print-stage *{animation:none!important;transition:none!important}
</style>
