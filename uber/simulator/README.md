# Simulador de precio dinámico (Uber)

Demo en React + TypeScript que imita una app de viajes y encadena, en cada tick de 5 minutos, los cuatro algoritmos de la presentación (`uber/es`) y del notebook (`notebooks/04-uber-precio-dinamico.ipynb`):

1. **Series temporales** (`src/sim/forecast.ts`): media ponderada de los últimos 4 viernes, efecto de la lluvia y corrección en vivo.
2. **k-means** (`src/sim/kmeans.ts`): agrupa las nueve zonas en negocios, residencial y ocio nocturno.
3. **Regresión** (`src/sim/regression.ts`): elasticidad log-lineal (β = 0,507) y multiplicador de equilibrio por bisección.
4. **Bucle de precio** (`src/sim/pricing.ts`): `m ← m + η·(R − 1)`, acotado entre 1,0× y 3,0×.

`src/sim/engine.ts` los une sobre una ciudad sintética (`src/sim/world.ts`) que simula un viernes de 17:30 a 02:00. El estilo visual sigue Base, el sistema de diseño de Uber.

## Qué se ve

- **Mapa** (`src/components/CityMap.tsx`):
  - el color de cada zona es su multiplicador;
  - cada coche representa unos 9 conductores;
  - los coches circulan a velocidad rápida, media o lenta según la calle;
  - un ciclo de semáforo y carriles por sentido evitan que se choquen.
- **Otros pasajeros** (`src/sim/riders.ts`):
  - en cada tick aparecen solicitudes aleatorias, pero reproducibles, más numerosas donde hay más demanda;
  - cada pasajero acepta el precio con la curva de elasticidad del algoritmo 3;
  - encuentra conductor con más o menos suerte según el ratio demanda/oferta de su zona;
  - se ven esperando en el mapa y en el panel *Otros pasajeros*.
- **Tu viaje:** elige recogida, destino y vehículo. El precio queda fijado al confirmar.
- **Espera hasta la recogida** (`src/sim/traffic.ts`):
  - cada coche del mapa es UberX, Comfort o Black (70/20/10 %);
  - cuando faltan conductores (R > 1), menos coches están libres;
  - la espera de cada vehículo es lo que tarda el coche libre más cercano en llegar por las calles, según su velocidad y la lluvia;
  - por eso cambia en cada tick, es mayor para Black y se ve cuántos hay libres en tu zona;
  - un anillo marca ese coche en el mapa, y al confirmar es él quien va a recogerte.
- **Bajo el capó:** cada algoritmo, con sus números del tick actual. El k-means se anima iteración a iteración.
- **Escenarios:** lluvia, concierto y reactividad η del bucle de precio.

Datos sintéticos con fines didácticos: no es el sistema de precios de Uber.

## Ejecutar

Requiere Node.js 22.12+ y pnpm.

```bash
pnpm install
pnpm dev      # desarrollo: http://localhost:5183
pnpm test     # comprueba los números de las diapositivas
pnpm build    # versión optimizada en dist/
pnpm preview  # sirve dist/ en http://localhost:4173
```
