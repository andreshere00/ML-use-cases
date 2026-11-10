# idealista: estimating a property value with regression

Standalone Slidev deck for the **idealista** use case, part of the InnoIT *Machine learning in real companies* series. The complete series lives in [`../general`](../general).

## Contents

- `slides.md`: the deck (cover, case, interactive solution, discussion).
- `theme/`, `public/`, `data/`, `diagrams.json`: InnoIT theme, fonts, logos, synthetic data and diagram content.
- `tools/`: scripts that build and regenerate the interactive explorer.
- `idealista-valuation.html`: self-contained offline explorer. `idealista-valuation-walkthrough.pdf`: static PDF of its stages.
- `IDEALISTA-EXPLORER.md`: controls, computation details and limits.

## Run

Requires Node.js 22.12+ and pnpm.

```bash
pnpm install
pnpm dev      # live deck
pnpm build    # explorer + static web version in dist/
pnpm export   # PDF
```
