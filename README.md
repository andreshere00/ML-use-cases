# ML-use-cases

[Castellano](#castellano) · [English](#english)

---

## Castellano

Casos de uso de Machine Learning y GenAI llevados a cabo por empresas reales. Cada caso tiene tres formatos:

- **Presentaciones** de [Slidev](https://sli.dev) con el tema de InnoIT.
- **Notebooks** de Jupyter interactivos.
- **Simuladores** web: precio dinámico de Uber y valoración automática de viviendas de idealista.

### Contenido

| Carpeta | Qué contiene |
|---|---|
| [`general/`](general) (`en`, `es`) | Serie completa con varios casos y los exploradores de idealista y Spotify. |
| [`idealista/`](idealista) (`en`, `es`) | Regresión: valoración automática de inmuebles (idealista/data). |
| [`cabify/`](cabify) (`en`, `es`) | Clasificación binaria: tráfico legítimo o artificial y umbral de bloqueo (Cabify). |
| [`spotify/`](spotify) (`en`, `es`) | Clustering: segmentación con UMAP + HDBSCAN recursivos (Spotify). |
| [`uber/`](uber) (`en`, `es`) | Precio dinámico de Uber con cuatro algoritmos: series temporales, clustering, regresión y bucle de precios. |
| [`uber/simulator/`](uber/simulator) | App web (React + TypeScript) que simula el precio dinámico de Uber en directo. |
| [`idealista/simulator/`](idealista/simulator) | App web (React + TypeScript) que valora viviendas y simula un mercado de anuncios (idealista). |
| [`notebooks/`](notebooks) | Notebooks con los cuatro casos paso a paso (idealista, Cabify, Spotify y Uber). |

Cada carpeta de idioma (`<caso>/en`, `<caso>/es`) es un proyecto Slidev independiente: `slides.md`, `theme/`, `public/` y `package.json`.

### Requisitos

| Para | Necesitas |
|---|---|
| Presentaciones y simuladores | [Node.js](https://nodejs.org) 22.12+ y [pnpm](https://pnpm.io) (`npm install -g pnpm`, o `npx pnpm@10 …` sin instalar) |
| Notebooks | Python 3.12+ y [uv](https://docs.astral.sh/uv/) |

Solo hace falta lo que vayas a usar. Para ver los PDF y los HTML no se necesita nada.

### Ver presentaciones

No hace falta instalar nada: cada carpeta incluye la presentación exportada en PDF.

| Caso | Castellano | English |
|---|---|---|
| Serie general | [`innoit-real-world-ml-es.pdf`](general/es/innoit-real-world-ml-es.pdf) | [`innoit-real-world-ml.pdf`](general/en/innoit-real-world-ml.pdf) |
| idealista | [`innoit-ml-use-case-idealista-es.pdf`](idealista/es/innoit-ml-use-case-idealista-es.pdf) | [`innoit-ml-use-case-idealista.pdf`](idealista/en/innoit-ml-use-case-idealista.pdf) |
| Cabify | [`innoit-ml-use-case-cabify-es.pdf`](cabify/es/innoit-ml-use-case-cabify-es.pdf) | [`innoit-ml-use-case-cabify.pdf`](cabify/en/innoit-ml-use-case-cabify.pdf) |
| Spotify | [`innoit-ml-use-case-spotify-es.pdf`](spotify/es/innoit-ml-use-case-spotify-es.pdf) | [`innoit-ml-use-case-spotify.pdf`](spotify/en/innoit-ml-use-case-spotify.pdf) |
| Uber | [`innoit-ml-use-case-uber-es.pdf`](uber/es/innoit-ml-use-case-uber-es.pdf) | [`innoit-ml-use-case-uber-en.pdf`](uber/en/innoit-ml-use-case-uber-en.pdf) |

Los exploradores interactivos también funcionan sin conexión: abre en el navegador el `.html` que hay en cada carpeta.

- `cabify/<idioma>/cabify-traffic.html`
- `idealista/<idioma>/idealista-valuation.html`
- `spotify/<idioma>/spotify-clustering.html`
- [`general/en/presentation.html`](general/en/presentation.html): la serie completa en un solo archivo.

### Lanzar todo a la vez

Desde la raíz del repositorio, un solo comando arranca las diez presentaciones, los dos simuladores y JupyterLab:

```bash
./start-all.sh
```

| Servidor | URL |
|---|---|
| Serie general (`es`, `en`) | http://localhost:3030, http://localhost:3031 |
| idealista (`es`, `en`) | http://localhost:3032, http://localhost:3033 |
| Cabify (`es`, `en`) | http://localhost:3034, http://localhost:3035 |
| Spotify (`es`, `en`) | http://localhost:3036, http://localhost:3037 |
| Uber (`es`, `en`) | http://localhost:3038, http://localhost:3039 |
| Simulador Uber | http://localhost:5183 |
| Simulador idealista | http://localhost:5184 |
| Notebooks (JupyterLab) | http://localhost:8888/lab |

- Instala las dependencias que falten (`pnpm install` en cada carpeta sin `node_modules/` y `uv sync` en `notebooks/`). Si no tienes pnpm, usa `npx pnpm@10`.
- No abre pestañas en el navegador: entra en la URL que quieras. Cada presentación sirve también `/presenter` y `/overview`.
- Para lanzar solo una parte, indica los grupos: `./start-all.sh slides`, `./start-all.sh sims` o `./start-all.sh notebooks` (se pueden combinar).
- La salida de cada servidor queda en `tmp/start-all/<servidor>.log`.
- `Ctrl+C` los detiene todos.

### Lanzar servidor de presentaciones

Desde la carpeta de la presentación que quieras:

```bash
cd uber/es
```

```bash
pnpm install
```

```bash
pnpm dev
```

Slidev abre la presentación en http://localhost:3030. También sirve:

- la vista del presentador: http://localhost:3030/presenter
- el resumen de diapositivas: http://localhost:3030/overview

Para abrir otra presentación a la vez, usa otro puerto (`pnpm dev --port 3031`).

Otros comandos, en la misma carpeta:

| Comando | Qué hace |
|---|---|
| `pnpm build` | Genera la versión web estática en `dist/` (en idealista, Cabify y Spotify regenera también el explorador). |
| `pnpm build:explorer` | Regenera solo el explorador `.html`. No existe en las carpetas de Uber. |
| `pnpm export` | Exporta el PDF. La primera vez pide instalar `playwright-chromium`. |

Para servir la versión estática generada: `npx serve dist`.

### Ver notebooks

Los notebooks se guardan ya ejecutados, con sus gráficas, así que se pueden leer directamente:

- en GitHub, o en el editor (VS Code, PyCharm…), abriendo los archivos de [`notebooks/`](notebooks);
- [`01-idealista-regresion`](notebooks/01-idealista-regresion.ipynb) · [`02-cabify-clasificacion`](notebooks/02-cabify-clasificacion.ipynb) · [`03-spotify-clustering`](notebooks/03-spotify-clustering.ipynb) · [`04-uber-precio-dinamico`](notebooks/04-uber-precio-dinamico.ipynb).

En una vista estática no funcionan los controles interactivos (sliders y botones ▶): para eso hay que lanzar Jupyter.

### Lanzar servidor de notebooks

```bash
cd notebooks
```

```bash
uv sync
```

```bash
uv run jupyter lab
```

- `uv sync` crea `.venv/` con las versiones exactas de `uv.lock`.
- `jupyter lab` se abre en http://localhost:8888.
- Ejecuta las celdas en orden (*Run → Run All Cells*).
- En macOS, el apartado de XGBoost del notebook de Spotify necesita OpenMP: `brew install libomp`.

Más detalles en [`notebooks/README.md`](notebooks/README.md).

### Ver simulador Uber

El simulador es una app web: hay que compilarla y servirla en local.

```bash
cd uber/simulator
```

```bash
pnpm install
```

```bash
pnpm build
```

```bash
pnpm preview
```

`pnpm build` compila la versión optimizada en `dist/` y `pnpm preview` la sirve en http://localhost:4173.

Qué se ve en el simulador:

- **Ciudad:** nueve zonas, con coches que circulan a velocidad rápida, media o lenta.
- **Otros pasajeros:** piden viajes a la vez que tú y aceptan o rechazan el precio según la elasticidad.
- **Tu viaje:** pídelo desde el panel de la izquierda.
- **Escenarios:** activa lluvia o un concierto y mira cómo reaccionan los cuatro algoritmos en el panel *Bajo el capó*.

### Lanzar simulador Uber

Para desarrollar, con recarga automática al editar:

```bash
cd uber/simulator
```

```bash
pnpm install
```

```bash
pnpm dev
```

Se abre en http://localhost:5183.

`pnpm test` comprueba que el simulador reproduce los números de las diapositivas y del notebook.

Más detalles en [`uber/simulator/README.md`](uber/simulator/README.md).

### Simulador idealista

Igual que el de Uber: `pnpm build` + `pnpm preview` para verlo, o `pnpm dev` para desarrollar (http://localhost:5184).

```bash
cd idealista/simulator
```

```bash
pnpm install
```

```bash
pnpm dev
```

Qué se ve en el simulador:

- **Tu vivienda:** elige zona, superficie, dormitorios, reforma y ascensor y obtén la valoración con su rango de error.
- **Mapa de precios:** las 360 viviendas de entrenamiento coloreadas por €/m² y los comparables elegidos.
- **Nuevos anuncios:** cada día se publica una vivienda que el modelo no ha visto; se valora y se etiqueta como buen precio, ajustado o alto.
- **Tu anuncio:** elige el precio de salida, publícalo y mira cuánto tarda en venderse.
- **Modelo:** cambia el peso de la regresión y el número de comparables y sigue los cuatro pasos en *Bajo el capó*.

`pnpm test` comprueba que reproduce los coeficientes, los comparables y el MAE del notebook. Más detalles en [`idealista/simulator/README.md`](idealista/simulator/README.md).

### Aviso

Todos los datos son sintéticos y los modelos son líneas base didácticas. **No son los sistemas de idealista, Cabify/Infobip, Spotify ni Uber, ni usan sus datos.**

---

## English

Machine Learning and GenAI use cases carried out by real companies. Each case comes in three formats:

- **Presentations** built with [Slidev](https://sli.dev) and the InnoIT theme.
- **Notebooks:** interactive Jupyter notebooks.
- **Simulators:** web apps for Uber's dynamic pricing and idealista's automated home valuation.

### Contents

| Folder | What it holds |
|---|---|
| [`general/`](general) (`en`, `es`) | Full series with several cases and the idealista and Spotify explorers. |
| [`idealista/`](idealista) (`en`, `es`) | Regression: automated property valuation (idealista/data). |
| [`cabify/`](cabify) (`en`, `es`) | Binary classification: legitimate or artificial traffic and the blocking threshold (Cabify). |
| [`spotify/`](spotify) (`en`, `es`) | Clustering: segmentation with recursive UMAP + HDBSCAN (Spotify). |
| [`uber/`](uber) (`en`, `es`) | Uber dynamic pricing with four algorithms: time series, clustering, regression and a pricing loop. |
| [`uber/simulator/`](uber/simulator) | Web app (React + TypeScript) that simulates Uber's dynamic pricing live. |
| [`idealista/simulator/`](idealista/simulator) | Web app (React + TypeScript) that values homes and simulates a listings market (idealista). |
| [`notebooks/`](notebooks) | Notebooks that walk through the four cases (idealista, Cabify, Spotify and Uber) step by step. |

Each language folder (`<case>/en`, `<case>/es`) is an independent Slidev project: `slides.md`, `theme/`, `public/` and `package.json`.

### Requirements

| For | You need |
|---|---|
| Presentations and simulators | [Node.js](https://nodejs.org) 22.12+ and [pnpm](https://pnpm.io) (`npm install -g pnpm`, or `npx pnpm@10 …` without installing) |
| Notebooks | Python 3.12+ and [uv](https://docs.astral.sh/uv/) |

You only need what you plan to use. The PDF and HTML files need nothing.

### View the presentations

No installation needed: every folder includes the presentation exported as a PDF.

| Case | Spanish | English |
|---|---|---|
| General series | [`innoit-real-world-ml-es.pdf`](general/es/innoit-real-world-ml-es.pdf) | [`innoit-real-world-ml.pdf`](general/en/innoit-real-world-ml.pdf) |
| idealista | [`innoit-ml-use-case-idealista-es.pdf`](idealista/es/innoit-ml-use-case-idealista-es.pdf) | [`innoit-ml-use-case-idealista.pdf`](idealista/en/innoit-ml-use-case-idealista.pdf) |
| Cabify | [`innoit-ml-use-case-cabify-es.pdf`](cabify/es/innoit-ml-use-case-cabify-es.pdf) | [`innoit-ml-use-case-cabify.pdf`](cabify/en/innoit-ml-use-case-cabify.pdf) |
| Spotify | [`innoit-ml-use-case-spotify-es.pdf`](spotify/es/innoit-ml-use-case-spotify-es.pdf) | [`innoit-ml-use-case-spotify.pdf`](spotify/en/innoit-ml-use-case-spotify.pdf) |
| Uber | [`innoit-ml-use-case-uber-es.pdf`](uber/es/innoit-ml-use-case-uber-es.pdf) | [`innoit-ml-use-case-uber-en.pdf`](uber/en/innoit-ml-use-case-uber-en.pdf) |

The interactive explorers also work offline: open the `.html` file in each folder in a browser.

- `cabify/<language>/cabify-traffic.html`
- `idealista/<language>/idealista-valuation.html`
- `spotify/<language>/spotify-clustering.html`
- [`general/en/presentation.html`](general/en/presentation.html): the full series in a single file.

### Run everything at once

From the repository root, one command starts the ten presentations, both simulators and JupyterLab:

```bash
./start-all.sh
```

| Server | URL |
|---|---|
| General series (`es`, `en`) | http://localhost:3030, http://localhost:3031 |
| idealista (`es`, `en`) | http://localhost:3032, http://localhost:3033 |
| Cabify (`es`, `en`) | http://localhost:3034, http://localhost:3035 |
| Spotify (`es`, `en`) | http://localhost:3036, http://localhost:3037 |
| Uber (`es`, `en`) | http://localhost:3038, http://localhost:3039 |
| Uber simulator | http://localhost:5183 |
| idealista simulator | http://localhost:5184 |
| Notebooks (JupyterLab) | http://localhost:8888/lab |

- It installs any missing dependencies (`pnpm install` in every folder without `node_modules/`, and `uv sync` in `notebooks/`). Without pnpm installed, it uses `npx pnpm@10`.
- It does not open browser tabs: go to the URL you want. Each presentation also serves `/presenter` and `/overview`.
- To start only part of it, name the groups: `./start-all.sh slides`, `./start-all.sh sims` or `./start-all.sh notebooks` (they can be combined).
- Each server's output goes to `tmp/start-all/<server>.log`.
- `Ctrl+C` stops them all.

### Run the presentation server

From the folder of the presentation you want:

```bash
cd uber/en
```

```bash
pnpm install
```

```bash
pnpm dev
```

Slidev opens the presentation at http://localhost:3030. It also serves:

- the presenter view: http://localhost:3030/presenter
- the slide overview: http://localhost:3030/overview

To open another presentation at the same time, use another port (`pnpm dev --port 3031`).

Other commands, in the same folder:

| Command | What it does |
|---|---|
| `pnpm build` | Builds the static web version into `dist/` (for idealista, Cabify and Spotify it also rebuilds the explorer). |
| `pnpm build:explorer` | Rebuilds only the `.html` explorer. Not available in the Uber folders. |
| `pnpm export` | Exports the PDF. The first run asks to install `playwright-chromium`. |

To serve the built static version: `npx serve dist`.

### View the notebooks

The notebooks are saved already executed, with their charts, so you can read them as they are:

- on GitHub, or in an editor (VS Code, PyCharm…), by opening the files in [`notebooks/`](notebooks);
- [`01-idealista-regresion`](notebooks/01-idealista-regresion.ipynb) · [`02-cabify-clasificacion`](notebooks/02-cabify-clasificacion.ipynb) · [`03-spotify-clustering`](notebooks/03-spotify-clustering.ipynb) · [`04-uber-precio-dinamico`](notebooks/04-uber-precio-dinamico.ipynb).

The interactive controls (sliders and ▶ buttons) do not work in a static view. To use them, run Jupyter.

The notebooks are written in Spanish.

### Run the notebook server

```bash
cd notebooks
```

```bash
uv sync
```

```bash
uv run jupyter lab
```

- `uv sync` creates `.venv/` with the exact versions from `uv.lock`.
- JupyterLab opens at http://localhost:8888.
- Run the cells in order (*Run → Run All Cells*).
- On macOS, the XGBoost section of the Spotify notebook needs OpenMP: `brew install libomp`.

More details (in Spanish) in [`notebooks/README.md`](notebooks/README.md).

### View the Uber simulator

The simulator is a web app: build it and serve it locally.

```bash
cd uber/simulator
```

```bash
pnpm install
```

```bash
pnpm build
```

```bash
pnpm preview
```

`pnpm build` builds the optimised version into `dist/`, and `pnpm preview` serves it at http://localhost:4173.

What the simulator shows:

- **City:** nine zones, with cars driving at fast, medium or slow speed.
- **Other riders:** they request trips at the same time as you and accept or decline the price according to the fitted elasticity.
- **Your trip:** request it from the left panel.
- **Scenarios:** turn on rain or a concert and watch the four algorithms react in the *Bajo el capó* (under the hood) panel.

The interface is in Spanish.

### Run the Uber simulator

For development, with hot reload on every edit:

```bash
cd uber/simulator
```

```bash
pnpm install
```

```bash
pnpm dev
```

It opens at http://localhost:5183.

`pnpm test` checks that the simulator reproduces the numbers from the slides and the notebook.

More details (in Spanish) in [`uber/simulator/README.md`](uber/simulator/README.md).

### idealista simulator

Same as the Uber one: `pnpm build` + `pnpm preview` to view it, or `pnpm dev` to develop (http://localhost:5184).

```bash
cd idealista/simulator
```

```bash
pnpm install
```

```bash
pnpm dev
```

What the simulator shows:

- **Your home:** pick the zone, size, bedrooms, renovation and lift and get the valuation with its error range.
- **Price map:** the 360 training homes coloured by €/m², plus the chosen comparables.
- **New listings:** every day a home the model has not seen is listed, valued and tagged as a good, fair or high price.
- **Your listing:** choose the asking price, publish it and see how long it takes to sell.
- **Model:** change the regression weight and the number of comparables and follow the four steps in *Bajo el capó* (under the hood).

The interface is in Spanish. `pnpm test` checks that it reproduces the notebook's coefficients, comparables and MAE. More details (in Spanish) in [`idealista/simulator/README.md`](idealista/simulator/README.md).

### Disclaimer

All data are synthetic and the models are teaching baselines. **They are not the systems of idealista, Cabify/Infobip, Spotify or Uber, and they do not use their data.**
