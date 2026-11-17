// Genera los códigos QR de los simuladores y los copia a las presentaciones.
//
// Uso: node deploy/make-qr.mjs   (lee NGROK_DOMAIN de deploy/ngrok.env o del entorno)
//
// Salida en cada presentación (<deck>/public/qr/):
//   simulator.svg  QR del simulador del caso (o de la página con ambos, en general)
//   github.svg     QR del repositorio de GitHub
//   uber.svg, idealista.svg  solo en general: QR de cada simulador
// Más copias PNG de alta resolución en deploy/qr/ para imprimir o compartir.

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

function readDomain() {
  if (process.env.NGROK_DOMAIN) return process.env.NGROK_DOMAIN
  for (const name of ['ngrok.env', 'ngrok.env.example']) {
    const file = join(HERE, name)
    if (!existsSync(file)) continue
    const match = readFileSync(file, 'utf8').match(/^NGROK_DOMAIN=(.+)$/m)
    if (match) return match[1].trim()
  }
  throw new Error('Define NGROK_DOMAIN en deploy/ngrok.env')
}

const domain = readDomain()
const targets = {
  all: `https://${domain}/`,
  uber: `https://${domain}/uber/`,
  idealista: `https://${domain}/idealista/`,
}
const GITHUB_URL = 'https://github.com/andreshere00/ML-use-cases'
// Presentación -> destino del QR.
const decks = {
  'general/es': 'all',
  'general/en': 'all',
  'uber/es': 'uber',
  'uber/en': 'uber',
  'idealista/es': 'idealista',
  'idealista/en': 'idealista',
}

const options = { errorCorrectionLevel: 'M', margin: 1, color: { dark: '#4D225D', light: '#FFFFFF' } }
mkdirSync(join(HERE, 'qr'), { recursive: true })

targets.github = GITHUB_URL
for (const [key, url] of Object.entries(targets)) {
  await QRCode.toFile(join(HERE, 'qr', `${key}.png`), url, { ...options, width: 1200 })
  console.log(`deploy/qr/${key}.png  ${url}`)
}
for (const [deck, key] of Object.entries(decks)) {
  // La presentación general enlaza además cada simulador por separado.
  const files = { simulator: key, github: 'github' }
  if (key === 'all') Object.assign(files, { uber: 'uber', idealista: 'idealista' })
  for (const [name, target] of Object.entries(files)) {
    const out = join(ROOT, deck, `public/qr/${name}.svg`)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, await QRCode.toString(targets[target], { ...options, type: 'svg' }))
    console.log(`${deck}/public/qr/${name}.svg  ${targets[target]}`)
  }
}
