# Explorador de clustering de Spotify

El diagrama interactivo sustituye a la vista en pantalla de la diapositiva de solución 15. El PDF conserva el diagrama de resumen existente.

## Presentar

Abre `spotify-clustering.html` directamente en un navegador para el explorador autónomo. Funciona sin servidor, sin conexión a internet y sin instalar Python. En Slidev, ve a la diapositiva 15.

Usa los nueve botones de etapa o las flechas izquierda/derecha del teclado. Las flechas recorren el diagrama antes de pasar a la siguiente diapositiva de Slidev. Reproducir avanza una etapa cada 5,5 segundos y se detiene al final. Atrás, Reiniciar y la selección de etapa siguen disponibles. En el PDF, los controles son instantáneas estáticas.

Selecciona un cluster en HDBSCAN, continúa hasta Re-embedding y entra en su ajuste hijo. La miga de pan Todos los oyentes devuelve a la población completa. La jerarquía es el árbol de análisis recursivo, no el árbol de densidad condensado de HDBSCAN. Esta demostración contiene un nivel de ajuste recursivo. Un hijo puede, legítimamente, contener solo ruido. Los controles de las etapas de modelado posteriores dejan entonces de estar disponibles porque no existe un objetivo de pertenencia.

La etapa 9, Explicabilidad, resume en lenguaje llano el problema de interpretación, la solución y los resultados calculados. Selecciona un grupo y un oyente para ver los factores globales más fuertes y la mayor contribución local. Distingue las explicaciones del modelo de las afirmaciones causales o de la validación de segmentos.

La vista SHAP admite la selección del modelo de cluster, la selección del oyente y la comparación entre contribuciones locales con signo y valores absolutos medios. Detalles técnicos explica la operación activa, los parámetros y las ecuaciones. El panel se desplaza cuando hace falta. Los colores identifican grupos dentro de un nodo, no perfiles de negocio persistentes entre ajustes distintos.

## Cálculo y procedencia

- 684 oyentes sintéticos, seis variables numéricas ilustrativas: minutos/día, sesiones/día, tasa de saltos, proporción de artistas nuevos, proporción de listas y proporción de escucha nocturna. No son datos de Spotify, ni variables de producción divulgadas, ni ajustes propietarios de parámetros.
- Las variables se estandarizan globalmente una vez para UMAP. El UMAP raíz usa 45 vecinos, min_dist 0,1, métrica euclídea y 2 dimensiones de salida. Los preajustes raíz varían el min_cluster_size de HDBSCAN: 45, 100 y 150. min_samples se mantiene en 12. Que los resultados de equilibrada y gruesa sean parecidos es un resultado calculado, no una diferencia visual forzada.
- Cada cluster raíz con al menos 60 miembros recibe un ajuste UMAP independiente sobre sus filas originales de seis variables, con el escalador global, 15 vecinos y el mismo min_dist. El HDBSCAN hijo usa min_cluster_size 18 y min_samples 7. Las vistas hijas nunca reutilizan como variables las coordenadas 2D del padre.
- Cada cluster que no es ruido tiene un modelo XGBoost binario de pertenencia sobre las variables originales. El ruido forma parte de la clase negativa. Los modelos usan 90 árboles, profundidad 3, tasa de aprendizaje 0,08 y una partición entrenamiento/prueba estratificada 75/25.
- F1 y AUC miden la fidelidad del modelo sustituto en datos reservados respecto a las etiquetas descubiertas. No validan la calidad de los clusters ni estiman el rendimiento en una población recién descubierta. Las propias etiquetas se descubrieron con toda la población del nodo antes de la partición.
- SHAP usa la implementación TreeSHAP nativa exacta de XGBoost, con el fondo de ruta de árbol del entrenamiento y salida en log-odds bruto. El valor base exportado más las contribuciones por variable reconstruye el margen de cada modelo. Las probabilidades independientes uno contra el resto no tienen por qué sumar uno. La importancia global promedia las contribuciones absolutas de todo el nodo.
- Las semillas fijas, los IDs de fila, los parámetros y las versiones de los paquetes están registrados en `data/spotify-demo.json`. El movimiento suave de los puntos conecta vistas calculadas y no reproduce las iteraciones del optimizador de UMAP. Las distancias globales, la densidad y los tamaños de cluster en el espacio UMAP requieren una interpretación cuidadosa.

Esto reproduce la *estructura* del flujo de investigación publicado por Spotify con un conjunto de datos educativo construido de forma independiente. No es una reproducción de los resultados exactos de Spotify, ni una implementación de Discover Weekly, ni una explicación causal del comportamiento de los oyentes. La estabilidad, el sesgo de muestreo y la utilidad siguen requiriendo una validación independiente.

## Editar y reconstruir

La implementación editable es `theme/components/SpotifyClusteringExplorer.vue`. Dibuja SVG y HTML nativo, usa estado de Vue y transiciones CSS, y sirve el mismo componente fuente en Slidev y en el explorador autónomo.

Para recalcular los datos, usa Python 3.12 (los resultados suministrados usaron 3.12.14):

```bash
python3 -m venv .venv-spotify
.venv-spotify/bin/python -m pip install -r tools/spotify-requirements.txt
.venv-spotify/bin/python tools/generate-spotify-demo.py
```

En macOS, XGBoost también requiere un runtime de OpenMP. Instala el runtime oficial si falta en tu entorno. No hace falta ningún runtime de ML para presentar los resultados precalculados.

Para reconstruir el explorador sin conexión y la distribución de Slidev:

```bash
pnpm install
pnpm build:explorer
pnpm build
```

`tools/build-spotify.mjs` empaqueta el componente Vue, el JSON calculado, las fuentes y el logotipo en un archivo HTML autónomo. También escribe los recursos públicos del explorador que usa la distribución de las diapositivas.

## Referencias principales

- [Spotify: Recursive Embedding and Clustering](https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering), 5 de diciembre de 2023.
- [Parámetros de UMAP](https://umap-learn.readthedocs.io/en/latest/parameters.html).
- [Selección de parámetros de HDBSCAN](https://hdbscan.readthedocs.io/en/latest/parameter_selection.html).
- [XGBoost Booster.predict y pred_contribs](https://xgboost.readthedocs.io/en/stable/python/python_api.html#xgboost.Booster.predict).

Revisado el 5 de noviembre de 2026.

## Logotipo de la empresa

El logotipo de la empresa procede de sus [materiales oficiales de prensa](https://newsroom.spotify.com/media-kit/logo-and-brand-assets/). El recurso original está en `public/assets/companies`, con sus proporciones y colores conservados. Está incrustado en el explorador autónomo.

El primer paso presenta un ejemplo concreto. Cada etapa posterior explica su significado para las mismas personas. La historia de Spotify es ilustrativa y se mantiene separada de los datos de comportamiento calculados.
