// Servidor estático sin dependencias para publicar los simuladores tras ngrok.
// Sirve tmp/deploy/site: / (portada), /uber/ y /idealista/.
//
// Uso: node deploy/serve.mjs [puerto]   (por defecto 8080)

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '../tmp/deploy/site')
const PORT = Number(process.argv[2] || process.env.PORT || 8080)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, clean)
  if (!file.startsWith(ROOT)) return null
  try {
    const s = await stat(file)
    if (s.isDirectory()) file = join(file, 'index.html')
    await stat(file)
    return file
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  const path = (req.url || '/').split('?')[0]
  // /uber -> /uber/ para que las rutas relativas de la app funcionen.
  if (/^\/(uber|idealista)$/.test(path)) {
    res.writeHead(301, { Location: `${path}/` }).end()
    return
  }
  const file = await resolveFile(path)
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found')
    return
  }
  const hashed = file.includes('/assets/')
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
    'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => {
  console.log(`Simuladores en http://localhost:${PORT}  (/uber/, /idealista/)`)
})
