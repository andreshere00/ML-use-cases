# idealista: estimar el valor de un inmueble con regresión

Presentación Slidev independiente en castellano para el caso de uso de **idealista**, parte de la serie de InnoIT *Machine learning en empresas reales*. La serie completa está en [`../../general/es`](../../general/es). La versión en inglés está en [`../en`](../en).

## Contenido

- `slides.md`: la presentación (portada, caso, solución interactiva, debate).
- `theme/`, `public/`, `data/`, `diagrams.json`: tema de InnoIT, fuentes, logotipos, datos sintéticos y contenido del diagrama.
- `tools/`: scripts que construyen y regeneran el explorador interactivo.
- `IDEALISTA-EXPLORER.md`: controles, detalles de cálculo y límites.
- `idealista-valuation.html` y el PDF se generan al construir (`pnpm build:explorer`, `pnpm export`) y no se versionan.

## Ejecutar

Requiere Node.js 22.12+ y pnpm.

```bash
pnpm install
pnpm dev      # presentación en vivo
pnpm build    # explorador + versión web estática en dist/
pnpm export   # PDF
```
