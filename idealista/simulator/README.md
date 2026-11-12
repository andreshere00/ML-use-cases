# Simulador de valoración automática (idealista)

Demo en React + TypeScript que imita un portal inmobiliario y encadena, para cada vivienda, los algoritmos de la presentación (`idealista/es`) y del notebook (`notebooks/01-idealista-regresion.ipynb`):

1. **Regresión lineal** (`src/sim/regression.ts`): mínimos cuadrados sobre seis variables (m², dormitorios, zona B, zona C, reformado y ascensor) y, para ver cómo aprende, el mismo ajuste con descenso de gradiente animado.
2. **Comparables** (`src/sim/comparables.ts`): las k viviendas más parecidas de la misma zona, con la distancia `(Δm²/30)² + (Δdorm./2)² + 0,25` por cada diferencia de reforma o ascensor.
3. **Mezcla** (`src/sim/valuation.ts`): `w · regresión + (1 − w) · comparables` y su error medio (MAE) con las 120 viviendas de prueba.
4. **Explicabilidad**: cascada exacta desde la valoración media hasta el precio de la vivienda.

`src/sim/engine.ts` pone el mercado en marcha: cada día se publica un anuncio de una vivienda de prueba, que el modelo no ha visto; se valora al instante, se etiqueta como buen precio, ajustado o alto y acaba vendiéndose antes o después según su sobreprecio. El usuario puede valorar su propia vivienda, elegir el precio de salida y publicarla. El estilo visual comparte esqueleto con el simulador de Uber, con tokens inspirados en idealista.

La interfaz está en español y en inglés: el botón del globo, arriba a la derecha, abre una ventana para cambiar de idioma, y la elección se recuerda en el navegador. Los textos están en `src/i18n.tsx`.

Datos sintéticos con fines didácticos (semilla 42): no es el modelo de valoración ni los datos de idealista. Las tres zonas son ficticias, y los días de venta y las visitas siguen un modelo ilustrativo.

## Ejecutar

Requiere Node.js 22.12+ y pnpm.

```bash
pnpm install
pnpm dev      # http://localhost:5184
pnpm test     # comprueba los números del notebook (coeficientes, comparables y MAE)
pnpm build
```

## Regenerar los datos

`src/data/market.json` contiene las 360 viviendas de entrenamiento y las 120 de prueba. Se genera con el entorno de los notebooks:

```bash
../../notebooks/.venv/bin/python tools/generate-market.py
```
