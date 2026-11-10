import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const cliRequire=createRequire(fs.realpathSync(path.join(root,'node_modules/@slidev/cli/package.json')))
const {build}=await import(cliRequire.resolve('vite'))
const {default:vue}=await import(cliRequire.resolve('@vitejs/plugin-vue'))
await build({configFile:false,root,publicDir:false,plugins:[vue()],resolve:{alias:{vue:cliRequire.resolve('vue/dist/vue.esm-bundler.js')}},
  define:{'process.env.NODE_ENV':JSON.stringify('production'),__VUE_OPTIONS_API__:'false',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},
  build:{outDir:path.join(root,'public/spotify-assets'),emptyOutDir:true,
    lib:{entry:path.join(root,'tools/spotify-entry.js'),name:'SpotifyWalkthrough',formats:['iife'],fileName:()=> 'explorer.js',cssFileName:'explorer'},
    cssCodeSplit:false,assetsInlineLimit:Infinity,chunkSizeWarningLimit:4000}})
const assets=path.join(root,'public/spotify-assets')
const css=fs.readFileSync(path.join(assets,'explorer.css'),'utf8')
const js=fs.readFileSync(path.join(assets,'explorer.js'),'utf8')
const fonts=[300,500,600].map(w=>`@font-face{font-family:Urbane;font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(root,`public/fonts/urbane-${w}.woff2`)).toString('base64')})}`).join('')
const logo=fs.readFileSync(path.join(root,'public/assets/innoit-logo.png')).toString('base64')
const companyLogo=fs.readFileSync(path.join(root,'public/assets/companies/spotify-logo-green.png')).toString('base64')
const html=`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Explorador de clustering de Spotify · InnoIT</title><style>${fonts}${css}
html,body{margin:0;background:#1d1221;width:100%;height:100%;overflow:hidden}body{font-family:Urbane,Arial,sans-serif;color:#4D225D}.sp-page{width:1280px;height:720px;background:white;position:absolute;top:50%;left:50%;transform-origin:50% 50%;box-sizing:border-box;padding:64px 72px}.sp-page h1{font:600 44px/1.25 Urbane,Arial,sans-serif;margin:0}.sp-subtitle{max-width:956px;font:300 21px/1.3 Urbane,Arial,sans-serif;color:#73687A;margin-top:5px}.sp-page [data-spotify-mount]{position:absolute;top:164px;left:72px;width:1136px;height:472px}.company-mark{position:absolute;right:72px;top:118px;width:148px;height:36px;display:flex;align-items:center;justify-content:flex-end}.company-mark img{max-width:148px;max-height:32px;width:auto;height:auto;object-fit:contain}.sp-source{position:absolute;top:639px;left:72px;font-size:13px;color:#73687A}.sp-source a{color:inherit}.sp-footer{position:absolute;bottom:0;left:0;right:0;height:58px;background:#4D225D;color:white;display:flex;align-items:center;padding:0 72px;font-size:16px}.sp-footer img{margin-left:auto;width:108px}.sp-footer span{margin-left:28px}
</style></head><body><main class="sp-page"><h1><span style="color:#1ED760">Spotify</span>: descubrir y explicar grupos</h1><div class="sp-subtitle">UMAP y HDBSCAN recursivos, explicados con una demostración calculada</div><div class="company-mark"><img src="data:image/png;base64,${companyLogo}" alt="Spotify"></div><div data-spotify-mount></div><div class="sp-source">Fuente: <a href="https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering" target="_blank" rel="noopener">Spotify Engineering</a> · Reconstrucción didáctica</div><footer class="sp-footer">InnoIT<span>Explorador interactivo</span><img src="data:image/png;base64,${logo}" alt="InnoIT"></footer></main><script>${js.replace(/<\/script/gi,'<\\/script')}</script><script>function fit(){document.querySelector('.sp-page').style.transform='translate(-50%,-50%) scale('+Math.min(innerWidth/1280,innerHeight/720)+')'}fit();addEventListener('resize',fit);</script></body></html>`
fs.writeFileSync(path.join(root,'spotify-clustering.html'),html)
fs.writeFileSync(path.join(root,'public/spotify-clustering.html'),html)
console.log('Standalone offline explorer built:',(html.length/1024/1024).toFixed(1),'MB')
