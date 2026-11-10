# Uber: precio dinámico y demanda de viajes

Presentación Slidev independiente en castellano para el caso de uso de **Uber**, parte de la serie de InnoIT *Machine learning en empresas reales*. La serie completa está en [`../../general/es`](../../general/es). La versión en inglés está en [`../en`](../en).

Se basa en el artículo divulgativo de Shuaib Ullattil, [How Uber Uses Data Mining to Handle Dynamic Pricing and Ride Demand](https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1) (Medium, 5 feb 2026). El artículo no publica cifras ni arquitectura reales, así que todos los números de la presentación son **sintéticos** y están marcados como tales.

## Contenido

- Portada, **diagrama del problema** (demanda frente a conductores en una zona), caso, datos de partida y diagrama del flujo del dato al precio.
- **Cuatro algoritmos paso a paso**, cada uno con un ejemplo numérico y un gráfico: series temporales (media ponderada con ajustes), clustering (k-means), regresión (demanda frente al precio y equilibrio) y bucle de precio (control con realimentación).
- Un ejemplo de principio a fin (Centro, viernes 18:00, con lluvia), retos y ética, y debate.

## Estructura

- `slides.md`: la presentación.
- `labels.json` y `diagrams.json`: todo el texto de los gráficos y diagramas (los componentes no contienen texto en ningún idioma).
- `theme/`, `public/`: tema de InnoIT, componentes de los gráficos y fuentes.

## Ejecutar

Requiere Node.js 22.12+ y pnpm.

```bash
pnpm install
pnpm dev      # presentación en vivo
pnpm build    # versión web estática en dist/
pnpm export   # PDF
```
