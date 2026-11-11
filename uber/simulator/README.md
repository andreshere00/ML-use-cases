# Simulador de precio dinámico (Uber)

Demo en React + TypeScript que imita una app de viajes y encadena, en cada tick de 5 minutos, los cuatro algoritmos de la presentación (`uber/es`) y del notebook (`notebooks/04-uber-precio-dinamico.ipynb`):

1. **Series temporales** (`src/sim/forecast.ts`): media ponderada de los últimos 4 viernes, efecto de la lluvia y corrección en vivo.
2. **k-means** (`src/sim/kmeans.ts`): agrupa las nueve zonas en negocios, residencial y ocio nocturno.
3. **Regresión** (`src/sim/regression.ts`): elasticidad log-lineal (β = 0,507) y multiplicador de equilibrio por bisección.
4. **Bucle de precio** (`src/sim/pricing.ts`): `m ← m + η·(R − 1)`, acotado entre 1,0× y 3,0×.

`src/sim/engine.ts` los une sobre una ciudad sintética (`src/sim/world.ts`) que simula un viernes de 17:30 a 02:00. El estilo visual sigue Base, el sistema de diseño de Uber.

Datos sintéticos con fines didácticos: no es el sistema de precios de Uber.

## Ejecutar

Requiere Node.js 22.12+ y pnpm.

```bash
pnpm install
pnpm dev      # http://localhost:5183
pnpm test     # comprueba los números de las diapositivas
pnpm build
```
