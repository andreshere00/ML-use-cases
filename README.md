# ML-use-cases

Machine Learning and GenAI use cases carried out by real companies, presented as [Slidev](https://sli.dev) decks with the InnoIT theme.

| Folder | Content |
|---|---|
| [`general/`](general) | Full series: 15 cases across ML, deep learning and GenAI, with both interactive explorers. |
| [`idealista/`](idealista) | Regression: automated property valuation (idealista/data). |
| [`spotify/`](spotify) | Clustering: recursive UMAP + HDBSCAN user segmentation (Spotify). |

Each folder is an independent Slidev project (`slides.md`, `theme/`, `public/`, `package.json`) with its own HTML and PDF versions.

## Run a deck

Requires Node.js 22.12+ and pnpm.

```bash
cd spotify        # or idealista / general
pnpm install
pnpm dev
```
