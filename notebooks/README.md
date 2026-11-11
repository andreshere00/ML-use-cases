# Notebooks interactivos

Los casos de uso de las presentaciones, paso a paso y con controles interactivos (`ipywidgets`) para ver los resultados cambiar en tiempo real. Cada notebook es independiente, genera sus propios datos sintéticos con semilla fija (42) y reproduce los mismos cálculos que los exploradores de las diapositivas.

| Notebook | Caso | Técnica | Qué se puede tocar |
|---|---|---|---|
| [`01-idealista-regresion`](01-idealista-regresion.ipynb) | idealista | Regresión lineal + comparables | Entrenamiento animado, peso de la mezcla, tasador con cascada de precio |
| [`02-cabify-clasificacion`](02-cabify-clasificacion.ipynb) | Cabify | Regresión logística | Entrenamiento animado con frontera de decisión, umbral y coste de negocio, explicación de una solicitud |
| [`03-spotify-clustering`](03-spotify-clustering.ipynb) | Spotify | UMAP + HDBSCAN recursivos, XGBoost + SHAP | Parámetros de UMAP y HDBSCAN, subgrupos por grupo, explicación de cada oyente |
| [`04-uber-precio-dinamico`](04-uber-precio-dinamico.ipynb) | Uber | Series temporales, k-means, regresión, bucle de control | Pronóstico, k-means animado, equilibrio por bisección, simulación del multiplicador |

Los controles ▶ (*Play*) reproducen los procesos iterativos (descenso de gradiente, k-means, bisección, ticks del bucle de precios).

## Ejecutar

Requiere Python 3.12+. Desde esta carpeta:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/jupyter lab
```

En macOS, XGBoost (solo lo usa el apartado 6 del notebook de Spotify) necesita OpenMP:

```bash
brew install libomp
```

Ejecuta las celdas en orden (*Run → Run All Cells*). Los widgets necesitan un kernel activo: en GitHub o en una vista estática solo se ven el código y el texto. La primera ejecución de UMAP tarda unos segundos porque numba compila el código.

## Aviso

Todos los datos son sintéticos y los modelos son líneas base didácticas independientes. **No son los sistemas de idealista, Cabify/Infobip, Spotify ni Uber, ni usan sus datos.**
