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
