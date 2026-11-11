# Machine learning en empresas reales

> **Estructura actual de `slides.md` (26 diapositivas):** título, índice, objetivos, regresión con idealista, clustering con Spotify, el simulador de Uber (problema, datos, cuatro algoritmos paso a paso, ejemplo de principio a fin y retos), conclusiones y próximos pasos (notebooks de Jupyter y aplicación web, pendientes), fuentes y cierre. La descripción de más abajo corresponde a la serie anterior de 49 diapositivas, que sigue en el historial de git.

Presentación en castellano basada en la plantilla original de Slidev de InnoIT. Los 12 temas solicitados se amplían a 15 casos para explicar por separado la clasificación binaria, multiclase y multietiqueta, y para distinguir la regresión de la previsión.

## Diagramas de solución

Las 49 diapositivas incluyen 15 diagramas de solución específicos de cada caso y un diagrama integrado de BBVA Blue. Cada diagrama explica las entradas de datos, los pasos de procesamiento/modelo y el resultado de negocio. El entrenamiento y el servicio se separan cuando está documentado. Los nodos discontinuos contienen ejemplos ilustrativos. Los límites de las fuentes publicadas aparecen en los pies y en las notas. Edita `diagrams.json` para cambiar el contenido y las posiciones de los diagramas. Los diagramas usan texto HTML nativo y conectores SVG en el tema Vue local, de modo que siguen siendo editables.

## Ver y editar

- Edita `slides.md` para actualizar la presentación. Los enlaces a las fuentes de cada empresa y las notas didácticas están en sus comentarios HTML.
- `cases.json` contiene el contenido estructurado de los casos y sus referencias.
- Los artefactos generados en inglés (`presentation.html`, `innoit-real-world-ml.pdf` y los PDF de los recorridos) están en la carpeta `../en`. Los exploradores HTML en castellano se regeneran con `pnpm build:explorer` y `pnpm build:idealista`.

## Slidev

Requiere Node.js 22.12+ y pnpm. Ejecuta `pnpm install` y después `pnpm dev`. `pnpm build` genera la versión web. Para exportar un PDF, usa `pnpm export`.

## Evidencia

Fuentes consultadas el 19 de octubre de 2026. El estado de despliegue describe el periodo de publicación. Las ventajas, las limitaciones y las pautas de evaluación son análisis didáctico, salvo que se atribuyan expresamente. Los detalles de arquitectura se limitan a lo que divulga cada fuente. El caso de Cabify procede de su socio de implantación, con testimonio del cliente. «Multicategoría» se interpreta como clasificación multietiqueta.

Se conservan el tema original, el logotipo, los colores y las fuentes web Urbane. Ten en cuenta las condiciones de licencia de la fuente si la distribuyes públicamente. Las imágenes oficiales de BMW y Mango se acreditan en las notas.

## Actualización de diversidad de empresas

Los 15 casos principales presentan ahora 15 empresas distintas. Uber COTA sustituye a la categorización de transacciones de BBVA y Google Vids sustituye a Spotify Gen AI Ads. Spotify sigue siendo el ejemplo de clustering y BBVA Blue sigue siendo el caso agéntico y el ejemplo integrado de cierre. Las dos fuentes sustitutas se consultaron el 20 de octubre de 2026.

## Recorrido interactivo de Spotify

La diapositiva de solución 15 contiene un explorador Vue/SVG de nueve etapas con datos sintéticos calculados, preajustes de parámetros, ajuste recursivo, XGBoost y TreeSHAP. Abre `spotify-clustering.html` (tras generarlo) para la versión autónoma sin conexión. Consulta `SPOTIFY-EXPLORER.md` para los controles, los detalles de cálculo, los límites y las instrucciones de reconstrucción.

## Recorrido interactivo de idealista

La diapositiva de solución 19 contiene un explorador de valoración Vue/SVG de cinco etapas: inmueble, viviendas similares, regresión, estimación y explicabilidad. Cambia los atributos del piso para recalcular sus inmuebles comparables, la predicción lineal ajustada y una combinación 50/50 explícitamente ilustrativa. Todas las viviendas, zonas y precios son sintéticos. Abre `idealista-valuation.html` (tras generarlo) para la versión autónoma sin conexión. Consulta `IDEALISTA-EXPLORER.md` para el caso publicado, las decisiones didácticas y las instrucciones de reconstrucción.
