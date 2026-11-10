# Cabify: tráfico legítimo o artificial con clasificación binaria

Presentación Slidev independiente en castellano para el caso de uso de **Cabify**, parte de la serie de InnoIT *Machine learning en empresas reales*. La serie completa está en [`../../general/es`](../../general/es). La versión en inglés está en [`../en`](../en).

## Contenido

- `slides.md`: la presentación (portada, caso, solución interactiva, debate).
- `theme/`, `public/`, `data/`, `diagrams.json`: tema de InnoIT, fuentes, datos sintéticos y contenido del diagrama.
- `tools/`: scripts que construyen el explorador interactivo y regeneran sus datos sintéticos.
- `CABIFY-EXPLORER.md`: controles, detalles de cálculo y límites.
- `cabify-traffic.html` es el explorador autónomo sin conexión, que se regenera con `pnpm build:explorer`.

## Ejecutar

Requiere Node.js 22.12+ y pnpm.

```bash
pnpm install
pnpm dev      # presentación en vivo
pnpm build    # explorador + versión web estática en dist/
pnpm export   # PDF
```
