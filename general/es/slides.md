---
theme: "./theme"
title: "Machine learning en empresas reales"
info: "Casos de uso empresariales reales de machine learning, deep learning y GenAI. Plantilla InnoIT."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-real-world-ml-es"
layout: "cover"
---
# Machine learning<br>**en empresas reales**

Casos de uso reales, conceptos y compromisos

InnoIT · 19 de octubre de 2026

---
layout: "agenda"
---
# Ruta de aprendizaje

1. Fundamentos de machine learning
2. Deep learning y generación de imágenes
3. Sistemas GenAI y flujos de trabajo con agentes

<div class="agenda-note">12 temas solicitados. 15 casos, un diagrama de solución para cada uno y un ejemplo integrado de cierre con BBVA Blue.</div>

---
layout: "two-cols"
---
# Guía de los ejemplos

::left::

## Tareas e implementaciones

Clasificación, clustering y forecasting describen tareas. Varias familias de algoritmos pueden resolver cada una.

RAG y la orquestación de agentes describen sistemas que combinan modelos con otro software.

::right::

## Cómo leer cada caso

Cada caso recoge el concepto, el flujo de trabajo real, las ventajas, las limitaciones y una conclusión de una frase.

Las fuentes describen el despliegue documentado en el momento de su publicación. Los compromisos son análisis didáctico.

<!-- El orden sigue la dificultad conceptual de aprendizaje. Las empresas suelen combinar métodos clásicos, redes neuronales y modelos generativos. Una tarea anterior ya puede tener una implementación neuronal. «Multicategoría» se interpreta como clasificación multietiqueta (multilabel), distinta de las etiquetas multiclase mutuamente excluyentes. Las fuentes se consultaron los días 19 y 20 de octubre de 2026. -->

---
layout: "section"
---
01

# Fundamentos de machine learning

Relaciones, etiquetas, grupos y predicciones numéricas

---
layout: "case"
company: "Walmart (Estados Unidos)"
status: "Sistema de recomendación en producción"
takeaway: "Los productos que se compran juntos pueden orientar qué productos se recomiendan juntos."
detail: "Walmart evaluó FP-Growth y eligió después reglas de coocurrencia por pares, más simples, para poder escalar."
sourceLabel: "Walmart Global Tech"
source: "https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f"
---
# Reglas de asociación

::left::

## Concepto

Encontrar artículos que aparecen juntos con más frecuencia de la que cabría esperar por azar.

## Caso de uso real

Walmart extrae de las cestas de la compra pares de productos complementarios y usa esas relaciones en sus recomendaciones.

::right::

## Ventaja

Las reglas legibles pueden apoyar la venta cruzada sin necesidad de resultados etiquetados.

## Limitación

La popularidad y las promociones distorsionan la coocurrencia. Una relación no demuestra causalidad.

<!--
Las reglas de asociación describen coocurrencia condicional. Soporte = P(A y B). Confianza = P(B dado A). Lift = P(B dado A) / P(B). Un lift superior a 1 indica asociación positiva frente a la independencia. Apriori y FP-Growth son algoritmos habituales de conjuntos frecuentes de elementos. Walmart evaluó FP-Growth distribuido, pero eligió un enfoque de probabilidad por pares. Aquí no se afirma ningún aumento de ingresos. Evaluación: soporte mínimo, lift y un experimento de recomendación online.

Fuente principal: https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f

Publicación: 24 ago 2022. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "association"
---
# Walmart: asociaciones en la cesta

<!-- Reconstrucción funcional del flujo por lotes y de consulta publicado. La consulta del producto actual ilustra cómo la tabla de asociaciones puede servir recomendaciones; la fuente no publica la API online. GMV = valor bruto de la mercancía (gross merchandise value). No se inventa ningún resultado numérico de lift ni de ingresos.
Fuente: https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "table"
class: "classification-table"
---
# Tres salidas de clasificación

| Tarea | Etiquetas por observación | Salida ilustrativa |
| --- | --- | --- |
| Binaria | Una de dos | Tráfico legítimo o de bots |
| Multiclase | Una de varias | Una categoría de gasto |
| Multietiqueta | Pueden aplicarse varias | Varios intereses de producto |

Aquí «multicategoría» se trata como clasificación multietiqueta. Los ejemplos ilustran la estructura de la salida.

---
layout: "case"
company: "Cabify (España)"
status: "Servicio operativo mediante Infobip Signals"
takeaway: "Una predicción de dos vías resulta útil cuando sus errores tienen costes de negocio claros."
detail: "Infobip informa de un 15,7 % menos de pérdidas financieras relacionadas con AIT en un trimestre. La arquitectura del modelo no se ha divulgado."
sourceLabel: "Caso de cliente de Infobip con testimonio de Cabify"
source: "https://www.infobip.com/customer/cabify"
---
# Clasificación binaria

::left::

## Concepto

Asignar una de dos etiquetas, a menudo aplicando un umbral a una puntuación de riesgo.

## Caso de uso real

Infobip Signals distingue los SMS legítimos del tráfico de bots y bloquea las solicitudes fraudulentas para Cabify.

::right::

## Ventaja

Automatiza decisiones de gran volumen y reduce la intervención manual.

## Limitación

Los falsos positivos pueden bloquear a clientes reales. Los patrones de ataque cambian con el tiempo.

<!--
La clasificación binaria es la abstracción de la tarea: tráfico legítimo frente a tráfico generado por bots. El proveedor describe un sistema de ML que combina patrones y señales de anomalía. No divulga un clasificador supervisado concreto, las etiquetas de entrenamiento ni el umbral. AIT significa Artificial Inflation of Traffic (inflado artificial de tráfico). La cifra del 15,7 % describe la pérdida financiera de un trimestre tras cambios en fraude y autenticación. Es un resultado de negocio comunicado por el proveedor, no la exactitud de la clasificación ni el efecto aislado del modelo. Evaluación genérica: precisión, recall, PR-AUC y coste en el umbral de operación.

Fuente principal: https://www.infobip.com/customer/cabify

Publicación: caso de cliente sin fecha. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "binary"
---
# Cabify: tráfico legítimo o artificial

<!-- Este diagrama explica el límite real del servicio sin inventar una arquitectura de entrenamiento. Legítimo frente a bot es la abstracción de la tarea de clasificación. La fuente describe señales de patrones y de anomalías dentro del servicio de ML. Una política de permitir/bloquear debe equilibrar el tráfico artificial frente al rechazo de usuarios genuinos.
Fuente: https://www.infobip.com/customer/cabify

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "Uber (Estados Unidos)"
status: "Asistente de soporte COTA en producción (relato de 2018)"
takeaway: "Un ticket recibe una categoría de incidencia y una persona confirma las sugerencias del modelo."
detail: "La identificación de la incidencia es independiente de la tarea de ordenación de soluciones de COTA."
sourceLabel: "Uber Engineering"
source: "https://www.uber.com/us/en/blog/cota/"
---
# Clasificación multiclase

::left::

## Concepto

Elegir una categoría entre tres o más alternativas mutuamente excluyentes.

## Caso de uso real

Uber COTA predice los tipos de incidencia de soporte a partir del texto del ticket y del contexto del viaje, y ayuda a los agentes a elegir la categoría correcta.

::right::

## Ventaja

Reduce el esfuerzo de navegar por una taxonomía de soporte extensa.

## Limitación

Las incidencias parecidas y las categorías poco frecuentes pueden confundir al clasificador.

<!--
Este caso aísla la identificación del tipo de incidencia. El relato de 2018 describe una línea base con random forest y una alternativa neuronal posterior. COTA presenta tres tipos de incidencia probables para que una persona elija. Su ordenador de soluciones, separado, puntúa pares ticket-solución con random forests binarios. No hay que tratar esas soluciones ordenadas como etiquetas de clase simultáneas. La fuente describe un despliegue histórico. Evaluar macro-F1, recall de las clases raras y exactitud top-k.

Fuente principal: https://www.uber.com/us/en/blog/cota/

Publicación: 3 ene 2018. Consultado: 20 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "multiclass"
---
# Uber COTA: identificar una incidencia de soporte

<!-- Vista funcional del flujo histórico de identificación de incidencias de COTA. La etapa de ordenación de soluciones es explícitamente independiente. TF-IDF y LSA describen el pipeline de texto documentado. Esta vista omite la lógica de almacenamiento y de actualización.
Fuente: https://www.uber.com/us/en/blog/cota/

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "Amazon Retail (Estados Unidos)"
status: "Inferencia de propensión de clientes en producción"
takeaway: "Un mismo cliente puede pertenecer a varias categorías útiles a la vez."
detail: "Amazon describe modelos MXNet con inferencia mediante Spark y Deep Java Library."
sourceLabel: "Amazon / AWS Open Source Blog"
source: "https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/"
---
# Clasificación multietiqueta

::left::

## Concepto

Asignar cero, una o varias etiquetas a la misma observación.

## Caso de uso real

Amazon predice la propensión de los clientes a actuar en miles de categorías de producto, lo que permite intereses solapados.

::right::

## Ventaja

Representa intereses solapados sin forzar un único segmento.

## Limitación

Las etiquetas poco frecuentes y los distintos umbrales dificultan el entrenamiento y la evaluación.

<!--
Interpretamos la «multicategoría» solicitada como clasificación multietiqueta (multilabel), el término estándar en inglés para etiquetas no excluyentes. Binary relevance es una línea base habitual que entrena un modelo binario por etiqueta. Los modelos neuronales pueden compartir una representación entre etiquetas. Amazon documenta una tarea multietiqueta de propensión a la acción del cliente; esto no significa una etiqueta rígida para cada categoría. Evaluar precisión/recall por etiqueta, micro-F1 y precisión en k. Los umbrales independientes necesitan calibración.

Fuente principal: https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/

Publicación: 14 jul 2020. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "multilabel"
---
# Amazon: miles de propensiones

<!-- Amazon documenta características de cliente dispersas y de alta dimensión, etiquetas binarias de acción por categoría, entrenamiento con MXNet en Python y servicio con Spark/DJL en Java o Scala. El diagrama omite los detalles internos del framework y no implica modelos independientes por categoría ni umbrales de puntuación no divulgados.
Fuente: https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->

---
layout: "case"
company: "Spotify (Suecia)"
status: "Método documentado de investigación de usuarios"
takeaway: "El clustering descubre grupos que los investigadores pueden analizar después."
detail: "Spotify usa XGBoost y SHAP para explicar los segmentos resultantes."
sourceLabel: "Spotify Engineering"
source: "https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering"
---
# Clustering

::left::

## Concepto

Descubrir grupos con comportamiento similar sin etiquetas de grupo predefinidas.

## Caso de uso real

Spotify combina UMAP con HDBSCAN recursivo para descubrir segmentos más finos de usuarios.

::right::

## Ventaja

Encuentra segmentos inesperados y apoya la investigación dirigida de usuarios.

## Limitación

La elección de variables condiciona los grupos. Los clusters estables siguen necesitando validación humana.

<!--
UMAP comprime datos de alta dimensión. HDBSCAN descubre grupos densos y puede dejar algunas observaciones como ruido. Recursión significa repetir ese proceso dentro de un grupo. Después, Spotify entrena modelos XGBoost uno-contra-todos y usa SHAP para entender las variables asociadas a cada cluster. Esta fuente describe segmentación e investigación de usuarios. No establece que Discover Weekly use este pipeline. Evaluar la estabilidad entre muestras y elecciones de variables, y validar después la utilidad con los investigadores.

Fuente principal: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering

Publicación: 5 dic 2023. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "clustering"
---
# <span style="color:#1ED760">Spotify</span>: descubrir y explicar grupos

<!-- Vista interactiva: demostración Vue/SVG de nueve etapas con 684 oyentes sintéticos, ajustes calculados de UMAP/HDBSCAN, modelos sustitutos XGBoost y TreeSHAP nativo exacto. Sin datos de usuarios de Spotify ni parámetros internos. El PDF conserva el diagrama de visión general. Archivos complementarios: spotify-clustering.html, spotify-clustering-walkthrough.pdf y SPOTIFY-EXPLORER.md. Logotipo de la empresa: kit de prensa oficial de Spotify, https://newsroom.spotify.com/media-kit/logo-and-brand-assets/ .

Spotify vuelve a ejecutar recursivamente UMAP y HDBSCAN sobre los puntos de datos originales de un cluster seleccionado. Entrena modelos XGBoost uno-contra-todos sobre las variables originales y las etiquetas de cluster resultantes, y después usa SHAP para la explicación. Este no es un diagrama de Discover Weekly.
Fuente: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "Adyen (Países Bajos)"
status: "Monitorización del volumen de pagos en producción"
takeaway: "Una anomalía es algo inusual respecto a una línea base significativa."
detail: "El modelo captura tendencia, estacionalidad y eventos, con regresión cuantílica para los límites de incertidumbre."
sourceLabel: "Adyen Engineering"
source: "https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes"
---
# Detección de anomalías

::left::

## Concepto

Señalar observaciones que difieren del patrón esperado para su contexto.

## Caso de uso real

Adyen modela los volúmenes de pago de los comercios y avisa a los equipos cuando las observaciones quedan fuera de los límites esperados.

::right::

## Ventaja

Puede identificar problemas operativos poco frecuentes sin ejemplos etiquetados de incidentes.

## Limitación

Los festivos y los cambios en los comercios provocan falsas alertas. Los umbrales sensibles aumentan el ruido.

<!--
Es un detector contextual de anomalías en series temporales. Una caída repentina en un momento normalmente activo es más informativa que un volumen bajo por la noche. Adyen modela tendencia, estacionalidad y eventos, y usa regresión cuantílica cuadrática sobre los residuos para obtener los límites. La empresa evaluó y descartó los isolation forests y los autoencoders para esta aplicación, por lo que no son los métodos desplegados aquí. Evaluar la tasa de detección de incidentes, las falsas alertas y el tiempo hasta la detección. Una alerta exige investigación; no establece por sí misma una causa raíz.

Fuente principal: https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes

Publicación: 9 oct 2019. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "anomaly"
---
# Adyen: detectar una caída del volumen de pagos

<!-- La fuente revela el modelado de tendencia/estacionalidad/eventos, la regresión cuantílica cuadrática sobre residuos, el entrenamiento en Spark y la puntuación en tiempo real en Java. La notación de intervalos es una abstracción didáctica. El diagrama no afirma que todas las anomalías sean fraude ni que una alerta identifique una causa raíz.
Fuente: https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "idealista/data (España)"
status: "Servicio comercial de valoración automática"
takeaway: "La regresión estima un número a partir de las características de una observación."
detail: "La empresa revela el enfoque de valoración, pero no el estimador exacto."
sourceLabel: "idealista/data e idealista labs"
source: "https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/"
---
# Análisis de regresión

::left::

## Concepto

Estimar un número continuo a partir de variables explicativas.

## Caso de uso real

idealista/data combina comparables y ML hedónico para estimar el valor de los inmuebles a partir de su ubicación y sus atributos.

::right::

## Ventaja

Produce estimaciones coherentes en grandes carteras de inmuebles.

## Limitación

La falta de atributos y los cambios del mercado reducen la precisión. Las estimaciones difieren de los precios de venta reales.

<!--
Un modelo hedónico relaciona el valor de un inmueble con atributos como la ubicación, el tamaño y el tipo de propiedad. Un regresor lineal es una línea base didáctica interpretable; la empresa no dice que su estimador en producción sea una regresión lineal. La valoración automática combina ML con inmuebles comparables. La estimación de un modelo no es un precio de venta garantizado ni una tasación formal. Evaluar el MAE en euros y los errores porcentuales, segmentados por ubicación y tipo de inmueble. La predicción por sí sola no identifica los factores causales del precio.

Fuente principal: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/
Fuente principal adicional: https://www.idealista.com/labs/blog/?p=3987
Publicación: página de producto y artículo de ingeniería del 17 feb 2021. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "regression"
---
# <span style="color:#B1D400">idealista</span>: estimar el valor de un inmueble

<!-- Vista interactiva en pantalla: demo Vue/SVG de cinco etapas con 480 inmuebles sintéticos, 360 de entrenamiento y 120 reservados. Ajusta una línea base hedónica OLS, encuentra seis inmuebles de entrenamiento similares y usa una mezcla 50/50 explícitamente ilustrativa. Todos los precios y zonas son ficticios. El servicio publicado de idealista combina la comparación con ML hedónico, pero no revela su regresor exacto, sus reglas de emparejamiento ni sus pesos. El PDF conserva la visión funcional estática original. Complementos: idealista-valuation.html, idealista-valuation-walkthrough.pdf e IDEALISTA-EXPLORER.md. La estimación de un modelo no es un precio de venta garantizado ni una tasación formal. Página principal del producto revisada de nuevo el 5 de noviembre de 2026. Logotipo de la empresa: idealista/data, de los materiales oficiales de prensa, https://www.idealista.com/sala-de-prensa/materiales/ .
Fuente: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/
Fuente adicional: https://www.idealista.com/labs/blog/?p=3987
Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "Iberdrola (España)"
status: "Sistema MeteoFlow operativo"
takeaway: "El forecasting convierte un futuro incierto en una entrada de planificación cuantificada."
detail: "Iberdrola documenta más de 450 plantas eólicas y solares, con previsiones horarias de hasta 96 horas."
sourceLabel: "Iberdrola"
source: "https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project"
---
# Forecasting

::left::

## Concepto

Estimar valores futuros a partir de patrones temporales y de los factores disponibles.

## Caso de uso real

MeteoFlow combina datos meteorológicos y de generación, y usa ML para afinar las previsiones de producción renovable.

::right::

## Ventaja

Apoya la planificación cuando la producción eólica y solar varía con el tiempo meteorológico.

## Limitación

La incertidumbre de la previsión crece con el horizonte y con los cambios meteorológicos inesperados.

<!--
La regresión predice un objetivo numérico. El forecasting añade un horizonte futuro y dependencia temporal, y puede usar regresión por dentro. MeteoFlow también ofrece previsiones diarias de hasta diez días. La cobertura y los horizontes de previsión son cifras de despliegue, no mejoras de precisión. Iberdrola no revela el algoritmo exacto de ML. Usar backtesting con origen móvil, comparar con una línea base estacional o de persistencia y medir la cobertura de los intervalos además del MAE. Una división aleatoria entre entrenamiento y prueba puede filtrar información del futuro.

Fuente principal: https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project

Publicación: página corporativa de proyecto sin fecha. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "forecasting"
---
# Iberdrola: previsiones de producción renovable

<!-- La fuente enumera explícitamente información meteorológica global, generación histórica y producción en tiempo real con ML predictivo. El diagrama muestra dependencias de información sin afirmar un modelo físico, una arquitectura neuronal ni un calendario de entrenamiento concretos. Las previsiones apoyan la venta de energía y la planificación del mantenimiento.
Fuente: https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "Booking.com (Países Bajos)"
status: "Flujo documentado de análisis de reseñas"
takeaway: "Una reseña puede elogiar la ubicación y criticar la habitación."
detail: "La extracción de aspectos identifica el tema. El análisis de sentimiento estima la opinión sobre él."
sourceLabel: "Equipo de Booking.com / AWS Machine Learning Blog"
source: "https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/"
---
# Análisis de sentimiento y PLN

::left::

## Concepto

Extraer opiniones del lenguaje y vincular cada opinión con aquello que describe.

## Caso de uso real

Booking.com vincula las opiniones de las reseñas con más de 50 aspectos, como la limpieza o la ubicación.

::right::

## Ventaja

Hace visibles los elogios y las quejas concretas entre muchas reseñas.

## Limitación

El sarcasmo, las opiniones mixtas y las diferencias de idioma pueden cambiar la interpretación.

<!--
El PLN (procesamiento del lenguaje natural, NLP) es el campo más amplio del procesamiento computacional del lenguaje. El análisis de sentimiento es una tarea dentro de él. El análisis basado en aspectos separa la puntuación de una reseña completa en opiniones sobre aspectos concretos. «Gran ubicación, habitación ruidosa» es una frase ilustrativa, no una reseña real de Booking.com. La fuente documenta un flujo de etiquetado de datos y entrenamiento con SageMaker Ground Truth. No publica un aumento causal de reservas atribuible a este sistema. Evaluar por separado la extracción de aspectos y el sentimiento, con un análisis de errores específico por idioma.

Fuente principal: https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/

Publicación: 14 ene 2022. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "sentiment"
---
# Booking.com: opiniones por aspecto

<!-- ABSA significa análisis de sentimiento basado en aspectos (aspect-based sentiment analysis). Anotadores humanos marcan y vinculan tramos de aspecto y tramos de sentimiento con SageMaker Ground Truth. El cuadro de ejecución resume la tarea; no afirma un clasificador de tokens ni una arquitectura transformer concretos. La reseña de ejemplo y sus salidas ilustran la tarea y no citan datos de clientes.
Fuente: https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "ING (Países Bajos)"
status: "Aplicación desplegada de monitorización del riesgo de crédito"
takeaway: "La minería de textos convierte un flujo de documentos en evidencia para investigar."
detail: "ING describe el procesamiento de hasta 80.000 noticias al día."
sourceLabel: "ING"
source: "https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html"
---
# Minería de textos

::left::

## Concepto

Extraer hechos estructurados y señales recurrentes de una gran colección de textos.

## Caso de uso real

El Early Warning System de ING combina señales de noticias y de datos de mercado para los analistas de riesgo de crédito.

::right::

## Ventaja

Ayuda a los analistas a monitorizar más información externa de la que pueden leer manualmente.

## Limitación

Las noticias irrelevantes o duplicadas generan ruido. Una señal sigue necesitando el criterio de un analista.

<!--
Aquí la minería de textos se centra en extraer y agregar información de un corpus. Puede usar componentes de PLN como la extracción de entidades, la traducción y el sentimiento. La diferencia con la diapositiva anterior es la salida de negocio: señales de riesgo de empresas a partir de muchos artículos, en lugar de la polaridad del aspecto de una reseña. ING combina el procesamiento de noticias con datos de mercado de Refinitiv y criterios de alerta definidos por analistas. La fuente trata las capacidades de predicción más potentes como una ambición futura, así que esta diapositiva no afirma que el sistema prediga impagos. Evaluar la relevancia, la exactitud del enlace de entidades y la aceptación de las alertas por parte de los analistas.

Fuente principal: https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html

Publicación: 17 dic 2018. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "textmining"
---
# ING: las noticias se convierten en una lista de vigilancia de riesgo

<!-- ING documenta noticias públicas, PLN y traducción de Google, datos de Refinitiv y criterios definidos por analistas. Algunos criterios de ejemplo son la cobertura mediática negativa y una caída de la cotización superior a un umbral. El diagrama no presupone un sistema concreto de enlace de entidades, un clasificador ni un modelo de probabilidad de impago.
Fuente: https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "section"
---
02

# Deep learning

Las redes neuronales aprenden rasgos visuales y generan imágenes nuevas

---
layout: "case"
company: "BMW Group (Alemania)"
status: "Aplicaciones en producción en serie desde 2018"
takeaway: "Un patrón visual aprendido puede convertir la imagen de una cámara en un control de calidad."
detail: "Los empleados etiquetan imágenes de componentes y entrenan una red neuronal."
sourceLabel: "BMW Group"
source: "https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video"
---
# Reconocimiento de patrones

::left::

## Concepto

Aprender rasgos visuales que identifican un objeto o una configuración recurrente.

## Caso de uso real

En Dingolfing, BMW compara la insignia del modelo de un vehículo con la especificación del pedido y señala las insignias ausentes o incorrectas.

::right::

## Ventaja

Realiza controles visuales repetidos a la velocidad de la producción.

## Limitación

Los componentes nuevos y las condiciones de iluminación requieren imágenes representativas y monitorización.

<!--
El reconocimiento de patrones abarca muchas modalidades y es más amplio que el deep learning. Este caso usa específicamente una red neuronal entrenada para el reconocimiento visual. Una red de visión típica aprende rasgos a partir de los píxeles antes de predecir la identidad del componente. Después, el software compara esa identidad con la especificación del pedido. BMW documenta expresamente el uso en producción. No repetimos la expresión «100 % de fiabilidad» de la fuente como referencia general. Evaluar el recall de defectos y la tasa de falsos rechazos en condiciones reales de fábrica.

Fuente principal: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video

Publicación: 15 jul 2019. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "patterns"
---
# BMW: el reconocimiento de imágenes comprueba la insignia

<!-- BMW documenta el etiquetado de imágenes por parte de empleados, el entrenamiento de la red neuronal y la comparación de imágenes en vivo de la denominación del modelo con los datos del pedido en Dingolfing. La separación entre aprobar y notificar es el resultado de la tarea. No se inventa ninguna arquitectura CNN, umbral de confianza ni afirmación universal de precisión.
Fuente: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "image-right"
image: "/assets/bmw-inspection.jpg"
alt: "Imagen oficial de producción de BMW que ilustra un sistema de inspección visual"
class: "inspection-visual"
---
# Inspección visual en BMW

La cámara observa un componente del vehículo.

**La red neuronal lo reconoce**

El software compara el resultado con la especificación del pedido y señala cualquier discrepancia.

<div class="photo-credit">Foto de producción de BMW Group. Fuente: BMW Group, 15 de julio de 2019.</div>

<!-- Crédito de la imagen y fuente: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video . La imagen ilustra la inspección en producción de BMW, no una medición independiente de precisión. -->

---
layout: "case"
company: "Mango (España)"
status: "Campaña Mango Teen publicada"
takeaway: "Generar imágenes nuevas conservando las características del producto real."
detail: "Mango no nombra ninguna arquitectura de modelo concreta. Difusión y GAN son ejemplos generales, no elecciones confirmadas."
sourceLabel: "Mango Fashion Group"
source: "https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen"
---
# Generación de imágenes

::left::

## Concepto

Generar imágenes nuevas a partir de la estructura visual aprendida.

## Caso de uso real

Mango creó Sunset Dream a partir de fotos reales de las prendas, un modelo generativo y una selección y un retoque realizados por personas.

::right::

## Ventaja

Amplía las opciones creativas y apoya flujos de producción repetibles.

## Limitación

La fidelidad al producto y la calidad editorial siguen requiriendo dirección de arte humana.

<!--
El deep learning es la familia tecnológica subyacente. La generación de imágenes ya es IA generativa, así que enlaza las dos secciones. Los modelos de difusión aprenden a invertir un proceso de ruido. Las GAN entrenan un generador frente a un discriminador. Estas definiciones ilustran familias de algoritmos y no son afirmaciones sobre la implementación de Mango. La campaña publicada usó fotos reales de producto y edición humana. No se afirma ninguna mejora de tiempo, coste ni conversión. Revisar la fidelidad de las prendas, los artefactos visibles, los derechos de uso y la idoneidad editorial.

Fuente principal: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen

Publicación: 10 jul 2024. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "imagegen"
---
# Mango: de prendas reales a imágenes de campaña

<!-- Este diagrama sigue el comunicado de julio de 2024: fotografías reales de las prendas, entrenamiento del modelo generativo, generación, selección por el equipo de arte y acabado en el estudio de fotografía. No introduce un pipeline de prompts no divulgado ni sugiere que los controles de calidad del producto estén totalmente automatizados.
Fuente: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "image-right"
image: "/assets/mango-campaign.jpg"
alt: "Imagen oficial de la campaña Mango Teen Sunset Dream generada con IA"
---
# Mango Teen: Sunset Dream

Una campaña publicada, creada con IA generativa en julio de 2024.

**Las fotografías reales de las prendas anclan el trabajo**

El equipo de arte de Mango selecciona y retoca las imágenes generadas para conservar el detalle del producto y la calidad editorial.

<div class="photo-credit">Imagen oficial de la campaña. Crédito: Mango Fashion Group.</div>

<!-- Fuente de la imagen de campaña: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen . Es un recurso real publicado de una campaña generada con IA, no una foto de una sesión real de la campaña. -->

---
layout: "section"
---
03

# Sistemas GenAI

Recuperación, generación multimodal y uso coordinado de herramientas

---
layout: "two-cols"
class: "process-slide"
---
# Qué aporta RAG a un modelo de lenguaje

::left::

## Recuperación

1. Leer la pregunta del empleado.
2. Buscar en la base de conocimiento autorizada.
3. Seleccionar los pasajes relevantes de los documentos.

::right::

## Generación fundamentada

4. Dar al modelo la evidencia recuperada.
5. Generar una respuesta con fuentes.
6. Comprobar la respuesta o escalarla.

<!-- Flujo didáctico simplificado de generación aumentada con recuperación (RAG), basado en la fuente de Allianz EKA y en el relato técnico del agente de información de BBVA: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html y https://www.bbvaaifactory.com/our-rag-based-information-agent/ . La recuperación puede usar palabras clave, embeddings o un enfoque híbrido. Los controles de acceso deben aplicarse antes de que el contenido llegue al modelo. RAG no garantiza por sí mismo la corrección. -->

---
layout: "case"
company: "Allianz (Alemania)"
status: "EKA en producción en Allianz Leben desde julio de 2024"
takeaway: "Primero se recupera la evidencia y después se genera una respuesta fundamentada."
detail: "Allianz comunica una exactitud superior al 90 % en las consultas habituales, sin publicar la metodología del benchmark."
sourceLabel: "Allianz"
source: "https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html"
---
# Búsqueda inteligente con RAG

::left::

## Concepto

Recuperar conocimiento relevante antes de que un LLM genere una respuesta.

## Caso de uso real

Allianz EKA busca en AWISO, resume el conocimiento relevante y remite al personal del centro de llamadas a las fuentes completas.

::right::

## Ventaja

Hace que el conocimiento interno sea más fácil de consultar y de revisar.

## Limitación

La falta de resultados de recuperación y los documentos desactualizados pueden seguir produciendo respuestas erróneas.

<!--
RAG significa generación aumentada con recuperación (retrieval-augmented generation). Es una arquitectura de sistema, no un algoritmo único ni una garantía de exactitud factual. EKA también incluye ajuste fino (fine-tuning) y elementos multiagente; esta diapositiva aísla su papel documentado de RAG. La fuente indica que el piloto comenzó en julio de 2023 y entró en producción en Allianz Leben un año después. La exactitud comunicada se aplica a las consultas habituales; no es una puntuación universal de corrección. Evaluar el recall de la recuperación, la fundamentación (groundedness) y la corrección de la tarea de extremo a extremo. Los enlaces a las fuentes permiten verificar.

Fuente principal: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html

Publicación: 7 feb 2025. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "rag"
---
# Allianz: la recuperación fundamenta la respuesta

<!-- Allianz documenta la división en fragmentos por párrafo, la recuperación de documentos relevantes, los resúmenes, los resaltados y los enlaces a los documentos completos, junto con la retroalimentación del personal. El cuadro de conocimiento no es una afirmación sobre una base de datos vectorial concreta. La retroalimentación apoya el refinamiento; no se implica un reentrenamiento automático del modelo.
Fuente: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "case"
company: "Google (Estados Unidos)"
status: "Veo 3 lanzado en Google Vids (junio de 2025)"
takeaway: "Un solo prompt puede generar tanto la escena en movimiento como su sonido."
detail: "El comunicado de lanzamiento documenta clips de 8 segundos. Es una capacidad de producto ya lanzada."
sourceLabel: "Google Workspace Updates"
source: "https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html"
---
# Generación multimodal

::left::

## Concepto

Generar contenido relacionado entre modalidades, como vídeo y sonido.

## Caso de uso real

Google Vids usa Veo 3 para convertir un prompt de texto en un clip de vídeo con sonido, listo para previsualizar e insertar.

::right::

## Ventaja

Crea un borrador audiovisual sin tener que filmar ni grabar una primera versión.

## Limitación

La continuidad visual, el habla y los detalles factuales siguen necesitando revisión humana.

<!--
Modalidad significa una forma de información, como texto, imagen, audio o vídeo. Este producto genera vídeo y sonido con Veo 3. El relato del lanzamiento de junio de 2025 especifica clips de 8 segundos y un flujo de prompt, previsualización e inserción. Los usuarios pueden silenciar el audio tras insertarlo. Los prompts de formación y de demostración de producto de la fuente son ejemplos ilustrativos, no despliegues de clientes con nombre. Este caso trata del producto lanzado por Google, no de una afirmación sobre su marketing interno. Evaluar la coherencia audiovisual y la exactitud respecto al encargo.

Fuente principal: https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html

Publicación: 9 jun 2025. Consultado: 20 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "multimodal"
---
# Google Vids: generar vídeo y sonido

<!-- Flujo de producto del comunicado de lanzamiento de Google Vids. Un único paso de generación produce vídeo y sonido. Estos cuadros describen el flujo de trabajo del usuario, no una arquitectura de modelo no documentada.
Fuente: https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "two-cols"
class: "process-slide"
---
# Qué coordina un orquestador

::left::

## Solicitud y enrutamiento

1. Interpretar el objetivo y el contexto.
2. Seleccionar un especialista o una herramienta relevante.
3. Pedir aclaraciones cuando haga falta.

::right::

## Acción y retroalimentación

4. Ejecutar la operación autorizada.
5. Inspeccionar el resultado y actualizar el estado.
6. Responder, reintentar o pasar el caso a una persona.

<!-- Un flujo conceptual, no un diagrama literal de la arquitectura de BBVA. La fuente de la implementación real está en la diapositiva siguiente: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/ . Los sistemas agénticos necesitan límites explícitos en torno a las herramientas, los permisos, las confirmaciones y la cancelación. Un flujo fijo con un paso de LLM puede ser útil sin autonomía total. -->

---
layout: "case"
company: "BBVA (España)"
status: "Asistente Blue desplegado en España en 2025"
takeaway: "Los agentes resultan operativamente útiles cuando la herramienta adecuada puede ejecutar la tarea."
detail: "BBVA describe el filtrado de más de 150 operaciones hasta unos 5-6 candidatos antes del enrutamiento."
sourceLabel: "BBVA AI Factory y anuncio del despliegue de BBVA"
source: "https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/"
---
# Orquestación de flujos agénticos

::left::

## Concepto

Coordinar agentes y herramientas especializados para completar una tarea acotada.

## Caso de uso real

Blue enruta las solicitudes a una herramienta bancaria, a un agente de información o a un paso de aclaración.

::right::

## Ventaja

Conecta las solicitudes conversacionales con operaciones definidas de cuentas y tarjetas.

## Limitación

Los errores de enrutamiento pueden elegir un flujo equivocado. Los permisos y las confirmaciones importan.

<!--
Un agente combina decisiones basadas en modelos con herramientas y estado. La orquestación coordina esas piezas, incluyendo la especialización y los traspasos. Blue representa las operaciones bancarias como herramientas invocables y carga una lista corta de descripciones para el enrutamiento. El artículo técnico describe varios roles de agente, no simplemente un chatbot con guion. El anuncio del despliegue programó la disponibilidad en España desde el 20 de febrero de 2025. Evaluar el éxito en la finalización, la tasa de herramienta equivocada, las acciones no autorizadas y la calidad de la escalada. El flujo numerado de la diapositiva anterior es una abstracción didáctica, no un diagrama literal de arquitectura.

Fuente principal: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/
Fuente principal adicional: https://www.bbva.com/en/innovation/for-the-first-time-in-spain-bbva-will-offer-ai-powered-account-and-card-management-with-its-virtual-assistant/
Publicación: relato técnico del 13 nov 2025. Consultado: 19 de octubre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->

---
layout: "solution"
diagram: "agents"
---
# BBVA Blue: enrutar una solicitud bancaria

<!-- BBVA describe explícitamente un agente de clasificación/enrutamiento, un filtrado preliminar de operaciones, function calling y varios roles de agente. Las respuestas de aclaración y las de reserva por estar fuera de alcance son funciones distintas, agrupadas en esta vista para conservar la legibilidad. Fuente: artículo técnico sobre enrutamiento, 13 de noviembre de 2025.
Fuente: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/
Fuente adicional: https://www.bbva.com/en/innovation/for-the-first-time-in-spain-bbva-will-offer-ai-powered-account-and-card-management-with-its-virtual-assistant/
Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->
---
layout: "table"
class: "summary-table"
---
# Elección de método: salidas estructuradas

| Pregunta de negocio | Método | Caso |
| --- | --- | --- |
| ¿Qué ocurre junto? | Reglas de asociación | Walmart |
| ¿Cuál de dos resultados? | Clasificación binaria | Cabify |
| ¿Qué categoría única? | Clasificación multiclase | Uber |
| ¿Qué etiquetas solapadas? | Clasificación multietiqueta | Amazon |
| ¿Qué grupos emergen? | Clustering | Spotify |
| ¿Qué se desvía de lo normal? | Detección de anomalías | Adyen |
| ¿Qué valor numérico? | Regresión | idealista |
| ¿Qué valor futuro? | Forecasting | Iberdrola |

La salida y la decisión de negocio determinan la tarea.

---
layout: "table"
class: "summary-table"
---
# Elección de método: lenguaje y GenAI

| Pregunta de negocio | Método | Caso |
| --- | --- | --- |
| ¿Sobre qué es la opinión? | Sentimiento y PLN | Booking.com |
| ¿Qué señales aparecen en el texto? | Minería de textos | ING |
| ¿Qué patrón visual hay? | Reconocimiento de patrones | BMW |
| ¿Qué imagen podemos crear? | Generación de imágenes | Mango |
| ¿Qué dicen nuestros documentos? | Búsqueda con RAG | Allianz |
| ¿Puede un prompt dar vídeo y sonido? | Generación multimodal | Google |
| ¿Puede el software completar la tarea? | Orquestación de agentes | BBVA |

La generación de imágenes usa deep learning y ya es una forma de GenAI.

---
layout: "default"
---
# Valor de negocio y calidad del modelo

Un modelo útil cambia una decisión o facilita un flujo de trabajo.

- **Clasificación:** la precisión y el recall reflejan costes de error distintos.
- **Predicción:** los backtests necesitan límites realistas de tiempo y de datos.
- **Sistemas GenAI:** una recuperación correcta o un texto fluido, por sí solos, no demuestran el éxito de la tarea.
- **Todo método:** el despliegue requiere responsables, monitorización y una alternativa clara.

<!-- Estas son conclusiones analíticas, no nuevas afirmaciones de resultados de las empresas. Los errores de clasificación tienen costes de negocio distintos, como ilustra el filtrado de fraude de Cabify. El forecasting requiere backtesting temporal. En GenAI, medir el éxito de la tarea de extremo a extremo y compararlo con una línea base sencilla. -->

---
layout: "default"
class: "references-slide"
---
# Fuentes 1 de 3

<div class="references"><div class="reference-item"><div class="reference-company">Walmart <span>Reglas de asociación</span></div><a href="https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f">Walmart Global Tech</a><span class="reference-date"> · 24 ago 2022</span></div><div class="reference-item"><div class="reference-company">Cabify <span>Clasificación binaria</span></div><a href="https://www.infobip.com/customer/cabify">Caso de cliente de Infobip con testimonio de Cabify</a><span class="reference-date"> · Caso de cliente sin fecha</span></div><div class="reference-item"><div class="reference-company">Uber <span>Clasificación multiclase</span></div><a href="https://www.uber.com/us/en/blog/cota/">Uber Engineering</a><span class="reference-date"> · 3 ene 2018</span></div><div class="reference-item"><div class="reference-company">Amazon Retail <span>Clasificación multietiqueta</span></div><a href="https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/">Amazon / AWS Open Source Blog</a><span class="reference-date"> · 14 jul 2020</span></div><div class="reference-item"><div class="reference-company">Spotify <span>Clustering</span></div><a href="https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering">Spotify Engineering</a><span class="reference-date"> · 5 dic 2023</span></div></div>

<div class="reference-note">Fuentes primarias de las empresas o de sus socios de implementación. Los enlaces adicionales figuran en las notas del orador. Consultadas del 19 al 20 de octubre de 2026.</div>

---
layout: "default"
class: "references-slide"
---
# Fuentes 2 de 3

<div class="references"><div class="reference-item"><div class="reference-company">Adyen <span>Detección de anomalías</span></div><a href="https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes">Adyen Engineering</a><span class="reference-date"> · 9 oct 2019</span></div><div class="reference-item"><div class="reference-company">idealista/data <span>Análisis de regresión</span></div><a href="https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/">idealista/data e idealista labs</a><span class="reference-date"> · Página de producto y artículo de ingeniería del 17 feb 2021</span></div><div class="reference-item"><div class="reference-company">Iberdrola <span>Forecasting</span></div><a href="https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project">Iberdrola</a><span class="reference-date"> · Página corporativa de proyecto sin fecha</span></div><div class="reference-item"><div class="reference-company">Booking.com <span>Análisis de sentimiento y PLN</span></div><a href="https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/">Equipo de Booking.com / AWS Machine Learning Blog</a><span class="reference-date"> · 14 ene 2022</span></div><div class="reference-item"><div class="reference-company">ING <span>Minería de textos</span></div><a href="https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html">ING</a><span class="reference-date"> · 17 dic 2018</span></div></div>

<div class="reference-note">Fuentes primarias de las empresas o de sus socios de implementación. Los enlaces adicionales figuran en las notas del orador. Consultadas del 19 al 20 de octubre de 2026.</div>

---
layout: "default"
class: "references-slide"
---
# Fuentes 3 de 3

<div class="references"><div class="reference-item"><div class="reference-company">BMW Group <span>Reconocimiento de patrones</span></div><a href="https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video">BMW Group</a><span class="reference-date"> · 15 jul 2019</span></div><div class="reference-item"><div class="reference-company">Mango <span>Generación de imágenes</span></div><a href="https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen">Mango Fashion Group</a><span class="reference-date"> · 10 jul 2024</span></div><div class="reference-item"><div class="reference-company">Allianz <span>Búsqueda inteligente con RAG</span></div><a href="https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html">Allianz</a><span class="reference-date"> · 7 feb 2025</span></div><div class="reference-item"><div class="reference-company">Google <span>Generación multimodal</span></div><a href="https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html">Google Workspace Updates</a><span class="reference-date"> · 9 jun 2025</span></div><div class="reference-item"><div class="reference-company">BBVA <span>Orquestación de flujos agénticos</span></div><a href="https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/">BBVA AI Factory y anuncio del despliegue de BBVA</a><span class="reference-date"> · Relato técnico del 13 nov 2025</span></div></div>

<div class="reference-note">Fuentes primarias de las empresas o de sus socios de implementación. Los enlaces adicionales figuran en las notas del orador. Consultadas del 19 al 20 de octubre de 2026.</div>

---
layout: "solution"
diagram: "integrated"
---
# BBVA Blue: conocimiento y acciones

<!-- Reconstrucción funcional integrada a partir del artículo de enrutamiento de BBVA AI Factory (13 de noviembre de 2025) y del artículo sobre el agente de información con RAG (18 de diciembre de 2025). El artículo de RAG documenta expresamente la reformulación de la conversación, los embeddings de consultas y de títulos de FAQ, la similitud del coseno y la generación fundamentada en las FAQ. También separa la información general de las operaciones específicas de cada cliente. Pago y saldo son ejemplos citados en el artículo de enrutamiento. No se asume que Blue incluya ningún detector de anomalías, modelo de forecasting ni clasificador de sentimiento.
Fuentes: https://www.bbvaaifactory.com/our-rag-based-information-agent/
https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/ -->
---
layout: "end"
---
# Debate

**¿Qué decisión de negocio necesita una mejor entrada?**

¿Una regla, una predicción, contenido generado o una tarea completada?

www.inno-it.es
