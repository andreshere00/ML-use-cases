# Uber: dynamic pricing and ride demand

Standalone Slidev deck for the **Uber** use case, part of the InnoIT *Machine learning in real companies* series. The complete series lives in [`../../general/en`](../../general/en). The Spanish version is in [`../es`](../es).

It is based on the explanatory article by Shuaib Ullattil, [How Uber Uses Data Mining to Handle Dynamic Pricing and Ride Demand](https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1) (Medium, 5 Feb 2026). The article publishes no real figures or architecture, so every number in the deck is **synthetic** and labelled as such.

## Contents

- Cover, **problem overview diagram** (demand versus drivers in one zone), case, starting data and a data-to-price flow diagram.
- **Four algorithms step by step**, each with a numeric example and a chart: time series (weighted average with adjustments), clustering (k-means), regression (demand versus price and equilibrium) and the price loop (feedback control).
- An end-to-end example (Downtown, Friday 18:00, with rain), challenges and ethics, and discussion.

## Structure

- `slides.md`: the deck.
- `labels.json` and `diagrams.json`: all text of the charts and diagrams (the components contain no language-specific text).
- `theme/`, `public/`: InnoIT theme, chart components and fonts.

## Run

Requires Node.js 22.12+ and pnpm.

```bash
pnpm install
pnpm dev      # live deck
pnpm build    # static web version in dist/
pnpm export   # PDF
```
