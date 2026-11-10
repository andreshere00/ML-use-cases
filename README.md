# ML-use-cases

Casos de uso de Machine Learning y GenAI llevados a cabo por empresas reales, presentados como decks de [Slidev](https://sli.dev) con el tema de InnoIT. / Machine Learning and GenAI use cases carried out by real companies, presented as Slidev decks with the InnoIT theme.

| Carpeta / Folder | EN | ES | Contenido / Content |
|---|---|---|---|
| `general/` | [`en`](general/en) | [`es`](general/es) | Serie completa: 15 casos de ML, deep learning y GenAI, con ambos exploradores. / Full series. |
| `idealista/` | [`en`](idealista/en) | [`es`](idealista/es) | Regresión: valoración automática de inmuebles (idealista/data). / Regression. |
| `cabify/` | [`en`](cabify/en) | [`es`](cabify/es) | Clasificación binaria: tráfico legítimo o artificial y umbral de bloqueo (Cabify). / Binary classification. |
| `spotify/` | [`en`](spotify/en) | [`es`](spotify/es) | Clustering: segmentación con UMAP + HDBSCAN recursivos (Spotify). / Clustering. |

Cada carpeta de idioma es un proyecto Slidev independiente (`slides.md`, `theme/`, `public/`, `package.json`). Each language folder is an independent Slidev project.

## Ejecutar / Run

Requiere / Requires Node.js 22.12+ and pnpm.

```bash
cd spotify/es        # o / or idealista/en, general/es, ...
pnpm install
pnpm dev
```

Los HTML de los exploradores y los PDF de las versiones en castellano se generan con `pnpm build:explorer` y `pnpm export`. / The Spanish explorer HTML and PDF files are generated with those commands.
