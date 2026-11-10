---
theme: "./theme"
title: "Cabify: tráfico legítimo o artificial"
info: "Cabify: tráfico legítimo o artificial. Plantilla InnoIT."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-ml-use-case-cabify-es"
layout: "cover"
---
# <span style="color:#7145D6">Cabify</span><br>**tráfico legítimo o artificial**

Clasificación binaria y umbral de bloqueo, explicados paso a paso

InnoIT · Caso de uso de ML

---
layout: "problem"
subtitle: "Cada SMS de verificación cuesta dinero, lo pida una persona o un bot"
caption: "Ambos errores cuestan dinero. El umbral de bloqueo decide cuál aceptas con más frecuencia."
sourceLabel: "Caso de cliente de Infobip con testimonio de Cabify"
source: "https://www.infobip.com/customer/cabify"
labels:
  aria: "Diagrama: clientes reales y bots envían solicitudes de verificación, un clasificador permite o bloquea cada una y cada combinación de solicitud y decisión tiene un coste distinto."
  sourcePrefix: "Fuente:"
  laneRequests: "Llegan solicitudes"
  laneDecision: "Decisión"
  laneOutcome: "Resultado"
  genuine: "Cliente real"
  genuineNote: "Una solicitud,\nintroduce el código"
  bot: "Bot"
  botNote: "Cientos de solicitudes,\ncódigos sin introducir,\nrutas de alto coste"
  gate: "¿Permitir o\nbloquear?"
  gateNote: "Infobip Signals\npuntúa cada solicitud"
  low: "riesgo bajo"
  high: "riesgo alto"
  allow: "Permitida"
  block: "Bloqueada"
  rowGenuine: "Cliente\nreal"
  rowBot: "Bot"
  gaTitle: "Se registra"
  gaNote: "El coste está\njustificado"
  gbTitle: "Cliente perdido"
  gbNote: "Un bloqueo\nerróneo"
  baTitle: "Cabify paga"
  baNote: "cada SMS falso\n(pérdida AIT)"
  bbTitle: "Pérdida evitada"
  bbNote: "Se detiene\nal bot"
---
# <span style="color:#7145D6">Cabify</span>: el problema

<!--
Preámbulo del caso. Un SMS de verificación cuesta dinero lo pida una persona o un bot. AIT significa Artificial Inflation of Traffic: los bots disparan grandes volúmenes de SMS, a menudo hacia rutas de alto coste, y la empresa paga por mensajes que nadie lee. Infobip Signals se sitúa delante de ese tráfico y decide, para cada solicitud, si la permite o la bloquea. Las cuatro casillas de la derecha son los cuatro resultados de cualquier decisión binaria: se convierten en la matriz de confusión y el coste por 1.000 solicitudes de la diapositiva interactiva.

Es una ilustración didáctica simplificada. Los comportamientos dibujados para clientes reales y bots (número de solicitudes, códigos introducidos, rutas de alto coste) son señales ilustrativas, no datos de Cabify ni de Infobip.
Fuente: https://www.infobip.com/customer/cabify
-->

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
# <span style="color:#7145D6">Cabify</span>: tráfico legítimo o artificial

<!-- Vista interactiva en pantalla: demo Vue/SVG de cinco etapas con 4.000 solicitudes de verificación sintéticas (3.000 de entrenamiento, 1.000 reservadas, 18,6 % artificiales). Ajusta una regresión logística con cuatro señales ilustrativas, permite mover el umbral de bloqueo y valora los dos tipos de error con costes ficticios. No se usan datos de Cabify, de Infobip ni de clientes. Infobip describe un servicio de ML que identifica patrones y anomalías en el tráfico de SMS y bloquea el tráfico artificial; no revela el modelo, las variables, las etiquetas ni los umbrales. La reducción del 15,7 % de las pérdidas financieras relacionadas con AIT es un resultado comunicado por el proveedor para un trimestre y esta demo no lo reproduce. El PDF conserva la visión funcional estática. Complementos: cabify-traffic.html y CABIFY-EXPLORER.md. No se incluye el logotipo de la empresa.
Fuente: https://www.infobip.com/customer/cabify

Reconstrucción funcional de la solución publicada. La posición de los cuadros no representa la topología real del despliegue. -->

---
layout: "end"
---
# Debate

**¿Qué decisión de tu negocio sigue tomando una persona en cada caso?**

¿Cuánto te costaría un bloqueo erróneo?

www.inno-it.es
