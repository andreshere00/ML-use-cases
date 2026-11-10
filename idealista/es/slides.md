---
theme: "./theme"
title: "idealista: estimar el valor de un inmueble con regresión"
info: "idealista: estimar el valor de un inmueble con regresión. Plantilla InnoIT."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-ml-use-case-idealista-es"
layout: "cover"
---
# <span style="color:#B1D400">idealista</span><br>**estimar el valor de un inmueble**

Comparables y regresión, explicados paso a paso

InnoIT · Caso de uso de ML

---
layout: "problem"
subtitle: "Valorar un inmueble es estimar un número, y ninguna estimación es exacta"
caption: "La respuesta es un número, no un sí o un no. Importa cuánto se aleja del precio real."
sourceLabel: "idealista/data e idealista labs"
source: "https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/"
labels:
  aria: "Diagrama: un inmueble de valor desconocido y miles de viviendas comparables con precio conocido alimentan un modelo que ajusta una recta de precio frente a superficie y estima el valor. La estimación puede quedar muy baja, cercana o muy alta respecto al precio real, y la dispersión de esos errores mide el modelo."
  sourcePrefix: "Fuente:"
  laneInputs: "Entradas"
  laneModel: "Modelo"
  laneOutcome: "Resultado"
  subject: "Inmueble"
  subjectNote: "Ubicación, tipo,\nárea y habitaciones"
  unknown: "Sin valorar"
  comps: "Comparables"
  compsNote: "Miles de viviendas\ncon precio conocido"
  model: "Estimar\nel valor"
  modelNote: "Comparables y\nregresión"
  plot: "precio vs. superficie"
  low: "Muy bajo"
  lowNote: "El vendedor\npuede malvender"
  ok: "Cercano"
  okNote: "Una referencia\nútil"
  high: "Muy alto"
  highNote: "Puede no\nvenderse"
  errTitle: "Error = estimación − precio real"
  errLow: "estimación por debajo"
  errMid: "error típico"
  errHigh: "estimación por encima"
---
# <span style="color:#B1D400">idealista</span>: el problema

<!--
Preámbulo del caso. Un inmueble tiene un precio real que nadie conoce hasta que se vende. Valorarlo a mano no escala a toda una cartera, así que se estima: el modelo recibe los atributos del inmueble (ubicación, tipo, superficie, habitaciones) y aprende de miles de viviendas comparables cuyo precio se conoce. En la caja central, la recta roja es la versión más simple de esa idea: el precio crece con la superficie y el inmueble nuevo se lee sobre la recta. Los comparables aportan una segunda opinión de las viviendas más parecidas.

Aquí la respuesta no es un sí o un no sino un número continuo, así que una estimación nunca es simplemente correcta o incorrecta. La estimación queda muy baja, cercana o muy alta, y el coste del error depende del sentido: el vendedor puede malvender, o una vivienda con precio demasiado alto puede no venderse. La curva de abajo a la derecha es la distribución de esos errores. Un buen modelo la mantiene estrecha y centrada en cero; la diapositiva interactiva mide su anchura como error absoluto medio (MAE) en euros sobre viviendas que el modelo no ha visto.

Es una ilustración didáctica simplificada. El diagrama de dispersión, la recta y la curva de error son ilustrativos, no datos de idealista, y no se muestra ningún valor en euros. idealista/data combina comparables con un modelo de ML hedónico, pero no publica su estimador exacto.
Fuente: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/
-->

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
layout: "end"
---
# Debate

**¿Qué cifra de tu negocio sigue estimándose a mano?**

¿Qué necesitarías para predecirla?

www.inno-it.es
