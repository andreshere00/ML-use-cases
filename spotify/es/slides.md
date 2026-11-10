---
theme: "./theme"
title: "Spotify: descubrir grupos con clustering"
info: "Spotify: descubrir grupos con clustering. Plantilla InnoIT."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-ml-use-case-spotify-es"
layout: "cover"
---
# <span style="color:#1ED760">Spotify</span><br>**descubrir grupos**

UMAP y HDBSCAN recursivos, explicados paso a paso

InnoIT · Caso de uso de ML

---
layout: "problem"
subtitle: "Millones de oyentes se comportan distinto, pero nadie sabe qué grupos existen"
caption: "El clustering propone los grupos. Las personas deciden cuáles merece la pena trabajar."
sourceLabel: "Spotify Engineering"
source: "https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering"
labels:
  aria: "Diagrama: oyentes sin etiquetar pasan por dos pasos, encontrar grupos con UMAP y HDBSCAN y explicarlos con XGBoost y SHAP, y salen como grupos descubiertos con los comportamientos que definen cada uno."
  sourcePrefix: "Fuente:"
  laneProblem: "El problema"
  laneMethod: "Cómo funciona"
  laneResult: "Qué se obtiene"
  listeners: "Millones de\noyentes"
  listenersNote: "Muchos comportamientos,\nsin grupos predefinidos"
  ask: "¿Quiénes son?"
  step1: "1 · Hallar grupos"
  step1Note: "UMAP + HDBSCAN,\nrepetido dentro de\nun grupo elegido"
  step2: "2 · Explicar grupos"
  step2Note: "XGBoost uno contra\ntodos y SHAP sobre\nlas variables originales"
  groupIds: "etiquetas de grupo"
  found: "Grupos hallados"
  foundNote: "Oyentes con comportamiento\nparecido. Algunos\nquedan como ruido."
  explained: "Grupos explicados"
  explainedNote: "SHAP muestra qué\ncomportamientos definen\ncada grupo, para que\nlos investigadores\nlo validen."
  f1: "Podcasts"
  f2: "Uso nocturno"
  f3: "Tasa de saltos"
  f4: "Uso de listas"
---
# <span style="color:#1ED760">Spotify</span>: el problema

<!--
Preámbulo del caso. Un servicio de música tiene un enorme número de oyentes, cada uno descrito por muchas variables de comportamiento, y ningún grupo predefinido. La nube gris de la izquierda es ese punto de partida: nadie sabe quiénes son los oyentes ni en qué se diferencian. El paso 1 comprime las variables con UMAP y encuentra grupos densos con HDBSCAN; algunos oyentes quedan como ruido, y el proceso puede repetirse dentro de un grupo elegido para hallar segmentos más finos. El paso 2 entrena modelos XGBoost uno-contra-todos sobre las variables originales y las etiquetas de grupo descubiertas, y usa SHAP para mostrar qué comportamientos definen cada grupo. Después los investigadores de usuarios validan e interpretan los segmentos. La diapositiva interactiva siguiente ejecuta todo este flujo con oyentes sintéticos.

Esta es una ilustración didáctica simplificada. Los puntos, las barras y los nombres de comportamientos (podcasts, uso nocturno, tasa de saltos, uso de listas) son ilustrativos, no datos ni variables de Spotify. La fuente describe segmentación e investigación de usuarios; no es un diagrama de Discover Weekly.
Fuente: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering
-->

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
layout: "end"
---
# Debate

**¿Qué grupos podrías descubrir en tus propios datos?**

¿Y quién los investigaría?

www.inno-it.es
