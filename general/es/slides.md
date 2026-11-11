---
theme: "./theme"
title: "Machine learning en empresas reales"
info: "Tres casos de uso reales de machine learning: regresión (idealista), clustering (Spotify) y un sistema que los combina (Uber). Plantilla InnoIT."
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

Predecir, agrupar y combinar: de idealista y Spotify al simulador de Uber

InnoIT

<!-- Hilo conductor: empezamos con dos casos sencillos y completos (predecir un número con idealista, descubrir grupos con Spotify) y terminamos con un sistema que los combina (Uber). Los dos primeros incluyen una demostración interactiva; el tercero, un recorrido paso a paso con números sintéticos. -->
---
layout: "agenda"
---
# Índice

1. Objetivos
2. Predicción: idealista
3. Clasificación y agrupamiento: Spotify
4. Juntamos todo: simulador de Uber
5. Conclusiones y próximos pasos

<div class="agenda-note">Tres casos reales de menos a más integrado. Las cifras de las demostraciones son sintéticas.</div>
---
layout: "two-cols"
---
# Objetivos

::left::

## Qué vamos a aprender

Diferenciar **predecir un valor** (regresión) de **descubrir grupos** (clustering) y entender para qué sirve cada tarea.

Ver cómo lo hacen empresas reales: idealista valora inmuebles y Spotify segmenta usuarios.

Ver cómo **se combinan varias técnicas** en un solo sistema: el precio dinámico de Uber.

::right::

## Qué te llevas

Una forma de leer cualquier caso de uso: **datos → modelo → decisión**.

Un ejemplo numérico de cada técnica, para entender cómo funciona por dentro.

Los límites de cada enfoque: qué datos necesita, cómo se valida y qué puede salir mal.

<!-- Los objetivos son de comprensión, no de implementación. Las demostraciones y los ejemplos usan datos sintéticos; las fuentes describen el despliegue documentado por cada empresa. Más adelante se verán simulaciones en Jupyter Notebook y una aplicación web para Uber. -->
---
layout: "section"
---
01

# Predicción: idealista

Primera tarea: estimar un número a partir de las características de una observación

<!-- Contexto. La regresión es la tarea de predicción más intuitiva: dado un conjunto de atributos, estimar un valor continuo. Es la base de muchos sistemas de valoración y, más adelante, de la sensibilidad de la demanda al precio en el caso de Uber. -->
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
layout: "section"
---
02

# Clasificación y agrupamiento: Spotify

Segunda tarea: descubrir grupos cuando no hay etiquetas previas

<!-- Contexto. Pasamos de predecir un número a organizar los datos. En clasificación las etiquetas ya existen y se aprenden; en clustering no, y el algoritmo propone los grupos. Spotify lo usa para segmentar usuarios y entender cada segmento. Este es el mismo principio que más tarde agrupará las zonas de una ciudad en el caso de Uber. -->
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
layout: "section"
---
03

# Juntamos todo: simulador de Uber

Un sistema real no usa una técnica, sino varias encadenadas
---
layout: "two-cols"
---
# De dos casos a un sistema completo

::left::

## Lo que ya hemos visto

**Regresión** (idealista): estimar un valor continuo a partir de atributos.

**Clustering** (Spotify): agrupar observaciones parecidas sin etiquetas.

::right::

## Lo que añade Uber

**Series temporales**: pronosticar la demanda de los próximos minutos.

**Un bucle de control**: corregir el precio cada pocos minutos hasta equilibrar oferta y demanda.

<!-- Transición. Uber no es una técnica nueva, es el ejemplo de cómo se orquestan varias: dos de ellas ya las conocemos (regresión y clustering). Las dos nuevas son series temporales y un bucle de realimentación. Todo el ejemplo numérico es sintético: Uber no publica sus modelos. -->
---
layout: "problem"
subtitle: "En cada zona y cada pocos minutos, la demanda y los conductores casi nunca coinciden"
caption: "El reto no es solo predecir: es equilibrar oferta y demanda antes de que el desajuste perjudique a todos."
sourceLabel: "Shuaib Ullattil, Medium (5 feb 2026)"
source: "https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1"
---
# <span style="color:#000">Uber</span>: el problema

<!--
Visión general del problema. Uber conecta en tiempo real a quien pide un viaje con el conductor más cercano. La demanda depende de la hora y el día, del clima, de los eventos y del tráfico, y cambia en minutos. El artículo describe dos desajustes: si la demanda supera a la oferta, suben las esperas y las cancelaciones y baja la satisfacción; si la oferta supera a la demanda, los conductores hacen menos viajes, ganan menos y pueden desconectarse.

Los números del diagrama (165 solicitudes y 110 conductores en Centro, viernes a las 18:00) son un ejemplo sintético que se mantiene durante toda la presentación. No son datos de Uber.
Fuente: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1
-->
---
layout: "case"
company: "Uber (presencia global)"
status: "Caso de estudio divulgativo; los modelos reales de Uber son propietarios"
takeaway: "El precio funciona como una señal que equilibra el sistema, no solo como una forma de cobrar más."
detail: "El artículo no publica cifras ni arquitectura real: los números de esta presentación son sintéticos."
sourceLabel: "Shuaib Ullattil, Medium (5 feb 2026)"
source: "https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1"
---
# Precio dinámico y demanda

::left::

## Concepto

Predecir la demanda por zona y ajustar el precio en tiempo real.

## Caso de uso real

Series temporales, clustering y regresión para fijar el precio dinámico.

::right::

## Ventaja

Menos esperas y una oferta de conductores más estable.

## Limitación

Las subidas bruscas se perciben como injustas y exigen datos sensibles.

<!--
El artículo es una descripción divulgativa de un caso de estudio sobre Big Data y minería de datos. Nombra cuatro técnicas: regresión (sensibilidad de la demanda al precio), clustering (zonas con comportamiento parecido), series temporales (patrones por hora, día y estación) y analítica predictiva (histórico más datos en tiempo real). No indica algoritmos concretos, parámetros, cifras de mejora ni arquitectura. Las diapositivas siguientes reconstruyen cada técnica con la versión más sencilla posible y datos sintéticos, para entender cómo funciona, no cómo la implementa Uber.

Fuente principal: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1

Publicación: 5 feb 2026. Consultado: 10 de noviembre de 2026.
Las ventajas y limitaciones son puntos didácticos de análisis, salvo que se atribuyan expresamente.
-->
---
layout: "table"
class: "summary-table"
---
# Los datos de partida

| Fuente | Qué contiene | Para qué sirve |
|---|---|---|
| Solicitudes y viajes | Origen, destino, hora, duración, ruta, cancelaciones y pagos | Medir la demanda real y su histórico |
| GPS de móviles | Posición y velocidad de cada conductor, cada pocos segundos | Conocer la oferta y el tráfico en tiempo real |
| Contexto externo | Clima, cortes de carretera y eventos locales | Anticipar picos que el histórico no explica |
| Uso de la app | Valoraciones, cancelaciones y comentarios | Entender el comportamiento y la satisfacción |

Volumen, variedad y velocidad: las tres «V» del Big Data. Fuente: Shuaib Ullattil, Medium (5 feb 2026).

<!--
El artículo enumera estas fuentes: datos de cada solicitud (coordenadas de recogida y destino, marcas de tiempo, duración estimada, ruta, estado del conductor), datos de interacción (uso de la app, cancelaciones, valoraciones, pagos), señales GPS de alta frecuencia y fuentes externas (clima, cortes de carretera, eventos). El texto señala volumen (millones de viajes al día), variedad (registros estructurados, trazas de ubicación y comentarios) y velocidad (decisiones en tiempo real).
-->
---
layout: "solution"
diagram: "uberPipeline"
---
# <span style="color:#000">Uber</span>: del dato al precio

<!-- Reconstrucción funcional a partir de la descripción del artículo: datos de viajes, GPS y contexto externo se agregan por zona y por intervalos cortos; tres familias de modelos alimentan un motor de precio que decide el multiplicador; el precio cambia el comportamiento de pasajeros y conductores y eso genera datos nuevos. La posición de los cuadros no representa la topología real del despliegue de Uber, que no es pública.
Fuente: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1 -->
---
layout: "section"
---
Algoritmos

# Cuatro piezas, paso a paso

Cada una con un ejemplo numérico sintético: Centro, viernes 18:00, con lluvia.
---
layout: "walk"
step: 1
subtitle: "Pronóstico de la demanda de Centro entre las 18:00 y las 18:15"
note: "Datos sintéticos. Uber no publica sus modelos: aquí se usa una media ponderada estacional con ajustes, la forma más sencilla de una serie temporal."
---
# Series temporales: ¿cuántos viajes habrá?

::steps::

1. **Mirar el pasado.** Solicitudes a esa hora los últimos 4 viernes: 120, 132, 128 y 140.
2. **Ponderar.** Los viernes recientes pesan más: 0,1·120 + 0,2·132 + 0,3·128 + 0,4·140 = <em>132,8</em>.
3. **Ajustar por contexto.** Un modelo aprendió que la lluvia añade ≈18 % de demanda: 132,8 × 1,18 = <em>156,7</em>.
4. **Corregir en vivo.** En los primeros 5 min hay 58 solicitudes frente a 52 esperadas (+11 %). Se aplica la mitad: 156,7 × 1,055 = <em>165</em>.

::viz::

<TimeSeriesViz />

<!--
Algoritmo 1: series temporales. Es la técnica que captura patrones recurrentes por hora, día y estación. Aquí se usa su versión más simple: una media ponderada de los mismos momentos de semanas anteriores (seasonal naive ponderado), un multiplicador por contexto (la lluvia, aprendido de histórico) y una corrección con los datos en vivo (lo que el artículo llama analítica predictiva: histórico más streaming).

Cuentas: 0,1·120 + 0,2·132 + 0,3·128 + 0,4·140 = 132,8. 132,8 × 1,18 = 156,7. Esperado en 5 minutos: 156,7 / 3 = 52,2. Observado: 58, es decir, +11,0 %. Se aplica la mitad de la desviación (+5,5 %): 156,7 × 1,0552 = 165,4. En la práctica se usan modelos como ARIMA, suavizado exponencial o redes neuronales con muchas más variables.
-->
---
layout: "viz"
step: 2
subtitle: "k-means agrupa zonas por su perfil de demanda (k = 3)"
note: "Datos sintéticos de nueve zonas (A–I). Cada zona se describe con dos números; los grupos nacen de los datos, sin etiquetas previas. Zonas del mismo grupo comparten patrón: se pronostican juntas y se anticipa dónde enviar conductores."
---
# Clustering: ¿qué tipo de zona es?

::viz::

<KMeansViz />

<!--
Algoritmo 2: clustering con k-means. Cada zona se representa con dos números: qué porcentaje de su demanda cae en la hora punta de la mañana y qué porcentaje de madrugada. Pasos: 1) elegir k centros iniciales; 2) asignar cada zona al centro más cercano (distancia euclídea); 3) mover cada centro a la media de sus zonas; 4) repetir hasta que no cambie ninguna asignación.

Los centros iniciales están mal puestos a propósito (dos en la zona de negocios) para mostrar que el algoritmo se corrige solo: iteración 1, centros en (38, 9), (55, 6) y (10, 42,7); iteración 2, centros en (30, 12,7), (51,7, 4,3) y (10, 42,7); la tercera no cambia nada. Elegir k y las variables es una decisión humana; en la práctica se prueban varios k y se valida con expertos de operaciones.
-->
---
layout: "walk"
step: 3
subtitle: "Sensibilidad de la demanda al precio y precio de equilibrio"
note: "Datos sintéticos. La respuesta de la oferta (+60 % de conductores por cada +1,0×) es una hipótesis didáctica; en la práctica también se estima con datos."
---
# Regresión: demanda frente al precio

::steps::

1. **Reunir pares (precio, demanda).** Seis niveles históricos: a 1,0× la demanda es el 100 %; a 1,5×, el 79 %; a 2,5×, el 47 %.
2. **Elegir la forma.** La demanda cae de forma exponencial: <code>demanda(m) = base · e^(−β·(m−1))</code>.
3. **Ajustar por mínimos cuadrados** sobre ln(demanda): <em>β = 0,51</em>, R² = 0,999. Cada +1,0× quita ≈40 % de la demanda.
4. **Buscar el equilibrio.** Demanda(m) = oferta(m): 165·e^(−0,51(m−1)) = 110·(1 + 0,6(m−1)) → <em>m* = 1,39×</em>, unos 136 viajes.

::viz::

<RegressionViz />

<!--
Algoritmo 3: regresión. Se ajusta una recta sobre el logaritmo de la demanda frente al multiplicador (regresión log-lineal): ln(demanda) = a − β(m − 1). Con las seis observaciones sintéticas (m = 1,0; 1,2; 1,5; 1,8; 2,0; 2,5 y demanda 100; 92; 79; 68; 61; 47 % de la base) sale β = 0,507 y R² = 0,999. Cada subida de 1,0× multiplica la demanda por e^(−0,507) = 0,60, es decir, quita un 40 %.

La base de 165 solicitudes sale del algoritmo 1. La oferta crece 60 % por cada +1,0× de multiplicador (hipótesis didáctica). El equilibrio se resuelve numéricamente (bisección): m* = 1,387, con demanda = oferta = 135,6 viajes. A precio normal faltaban 55 conductores; con 1,39× se atienden unos 136 de los 165 viajes (el resto espera, cancela o elige otra opción).
-->
---
layout: "walk"
step: 4
subtitle: "Control con realimentación: el precio se corrige cada 5 minutos hasta equilibrar"
note: "Simulación sintética con la demanda y la oferta del ejemplo. Cuando la demanda baja a las 18:30, el multiplicador vuelve solo a 1,00×."
---
# Bucle de precio: ajustar cada 5 minutos

::steps::

1. **Medir.** Cada 5 min: R = demanda / conductores. A las 18:00, 165 / 110 = <em>1,50</em>.
2. **Corregir el precio.** <code>m ← m + 0,8·(R − 1)</code>, entre 1,0× y 3,0×: 1,00 + 0,8·0,50 = <em>1,40×</em> desde las 18:05.
3. **Dejar reaccionar.** Algunos pasajeros esperan y los conductores se acercan. A las 18:05, R = 1,09 → <em>1,47×</em>.
4. **Repetir y relajar.** Se estabiliza en ≈1,4×. Al caer la demanda (R &lt; 1) el precio baja a 1,00× a las 18:45.

::viz::

<PricingLoopViz />

<!--
Algoritmo 4: bucle de realimentación, que es lo que el artículo describe como "proceso automático de decisión en tiempo real". Cada 5 minutos se calcula R = demanda / oferta en la zona. Si R > 1 el multiplicador sube; si R < 1 baja. La ganancia 0,8 controla la rapidez (demasiado alta provoca oscilaciones, demasiado baja reacciona tarde). El multiplicador se acota entre 1,0 y 3,0.

Simulación: la demanda depende del precio con la curva del algoritmo 3 y los conductores se acercan hacia el objetivo de oferta a razón de la mitad de la distancia por cada paso de 5 minutos. Base de demanda por tick: 165 hasta las 18:25, 130 a las 18:30, 110 a las 18:35 y 100 después. Multiplicador resultante: 1,00; 1,40; 1,47; 1,46; 1,43; 1,40; 1,39; 1,22; 1,02; 1,00. R: 1,50; 1,09; 0,98; 0,96; 0,97; 0,98; 0,78; 0,76; 0,82; 0,87. En la realidad el precio se suaviza, se limita y se muestra redondeado.
-->
---
layout: "solution"
diagram: "uberExample"
---
# Un viernes a las 18:00, de principio a fin

<!-- Recorrido completo del ejemplo con cifras sintéticas, coherentes con las diapositivas anteriores. La serie temporal pronostica 165 solicitudes con lluvia; el clustering sitúa a Centro entre las zonas de negocios; la regresión da un equilibrio de 1,39 con unos 136 viajes; el bucle sube el multiplicador a 1,40 en cinco minutos y lo estabiliza cerca de 1,4; con una tarifa base de 12,00 euros el pasajero ve 16,80 euros. La tarifa base de 12 euros también es ficticia.
Fuente: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1 -->
---
layout: "two-cols"
---
# Retos y ética

::left::

## Privacidad

Ubicaciones en tiempo real de pasajeros y conductores: exigen consentimiento, seguridad y gobierno del dato.

## Percepción de justicia

Subir precios en emergencias o con mal tiempo se vive como abusivo, aunque equilibre el sistema.

::right::

## Escala técnica

Flujos de millones de usuarios con baja latencia; los modelos se vigilan y se reentrenan.

## Ideas para mitigar

Tope al multiplicador, precio visible antes de confirmar y avisos claros al usuario.

<!--
Los tres retos (privacidad, percepción de justicia y escala técnica) proceden del artículo. Las ideas de mitigación son propuestas didácticas para el debate, no medidas que el artículo atribuya a Uber.
Fuente: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1
-->
---
layout: "two-cols"
---
# Conclusiones y próximos pasos

::left::

## Conclusiones

**Regresión** estima un número, pero no garantiza un precio de venta.

**Clustering** descubre grupos sin etiquetas, y los grupos hay que validarlos.

**Los sistemas reales combinan técnicas**: Uber encadena series temporales, clustering, regresión y un bucle de control.

::right::

## Próximos pasos

**Notebooks de Jupyter** para simular cada caso paso a paso.

**Una aplicación web** que simule el comportamiento del precio dinámico de Uber.

Probar las ideas con datos propios y medir el impacto en una decisión concreta.

<!-- Las conclusiones son análisis didáctico, no afirmaciones de las empresas. Los próximos pasos (notebooks y aplicación web) se tratarán más adelante. -->
---
layout: "default"
class: "references-slide"
---
# Fuentes

<div class="references"><div class="reference-item"><div class="reference-company">idealista/data <span>Análisis de regresión</span></div><a href="https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/">idealista/data</a><span class="reference-date"> · 17 feb 2021</span></div><div class="reference-item"><div class="reference-company">Spotify <span>Clustering</span></div><a href="https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering">Spotify Engineering</a><span class="reference-date"> · 5 dic 2023</span></div><div class="reference-item"><div class="reference-company">Uber <span>Precio dinámico y demanda</span></div><a href="https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1">Shuaib Ullattil, Medium</a><span class="reference-date"> · 5 feb 2026</span></div></div>

<div class="reference-note">Fuentes divulgativas o de las propias empresas. Los datos de las demostraciones y del ejemplo de Uber son sintéticos. Consultadas del 19 de octubre al 10 de noviembre de 2026.</div>
---
layout: "end"
---
# Gracias

**¿Qué decisión de tu empresa podría apoyarse en uno de estos tres enfoques?**

www.inno-it.es
