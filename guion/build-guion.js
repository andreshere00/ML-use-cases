// Genera guion/Guion-casos-de-uso-ML.docx (guion de presentación en español)
const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, Footer, Header,
  PageNumber, PageBreak,
} = require('docx')

const PURPLE = '4D225D'
const CORAL = 'E64366'
const GREY = '5B5560'
const FONT = 'Arial'
const CONTENT_W = 9638 // A4 con márgenes de 2 cm

// ---------- helpers ----------
const run = (text, o = {}) => new TextRun({ text, font: FONT, ...o })
const h1 = (text, pageBreak = true) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: pageBreak, children: [run(text)] })
const h2 = (text, time) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [run(text), ...(time ? [run(`   ·   ${time}`, { color: CORAL, bold: false, size: 22 })] : [])],
})
const h3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [run(text)] })
const say = (text) => new Paragraph({ spacing: { after: 140, line: 300 }, children: [run(text, { size: 22 })] })
const labelled = (label, text, fill, color) => new Paragraph({
  spacing: { before: 60, after: 140, line: 288 },
  shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color, space: 8 } },
  indent: { left: 160, right: 80 },
  children: [run(`${label} `, { bold: true, color, size: 20 }), run(text, { size: 20, italics: label === 'Indicación:' })],
})
const cue = (t) => labelled('Indicación:', t, 'F1EEF3', GREY)
const ask = (t) => labelled('Pregunta a la audiencia:', t, 'FCE9ED', CORAL)
const warn = (t) => labelled('Decir siempre:', t, 'FFF4D6', '8A6100')
const bullet = (text, bold) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80, line: 288 },
  children: bold ? [run(bold + ' ', { bold: true, size: 22 }), run(text, { size: 22 })] : [run(text, { size: 22 })],
})
const cell = (children, width, fill) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  shading: fill ? { type: ShadingType.CLEAR, fill, color: 'auto' } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children,
})
const border = { style: BorderStyle.SINGLE, size: 4, color: 'D8D0DC' }
const borders = { top: border, bottom: border, left: border, right: border }
const ficha = (rows) => {
  const w = [2500, CONTENT_W - 2500]
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: w, borders: { ...borders, insideHorizontal: border, insideVertical: border },
    rows: rows.map(([k, v]) => new TableRow({ children: [
      cell([new Paragraph({ children: [run(k, { bold: true, color: PURPLE, size: 20 })] })], w[0], 'EDE9EF'),
      cell([new Paragraph({ children: [run(v, { size: 20 })] })], w[1]),
    ] })),
  })
}
const gridTable = (header, rows, widths) => new Table({
  width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths, borders: { ...borders, insideHorizontal: border, insideVertical: border },
  rows: [
    new TableRow({ tableHeader: true, children: header.map((t, i) => cell([new Paragraph({ children: [run(t, { bold: true, color: 'FFFFFF', size: 20 })] })], widths[i], PURPLE)) }),
    ...rows.map(r => new TableRow({ children: r.map((t, i) => cell([new Paragraph({ children: [run(t, { size: 20, bold: i === 0 })] })], widths[i])) })),
  ],
})
const spacer = () => new Paragraph({ spacing: { after: 120 }, children: [] })

// ---------- contenido ----------
const c = []

// Portada
c.push(
  new Paragraph({ spacing: { before: 400, after: 120 }, children: [run('InnoIT · Machine learning en empresas reales', { color: CORAL, bold: true, size: 24 })] }),
  new Paragraph({ heading: HeadingLevel.TITLE, children: [run('Guion para explicar los casos de uso')] }),
  new Paragraph({ spacing: { after: 360 }, children: [run('Cabify · idealista · Spotify · Uber · Deck general', { size: 30, color: PURPLE })] }),
  say('Este documento es el texto de apoyo para presentar, diapositiva a diapositiva, los casos de uso de las presentaciones en español: cuatro capítulos con demostración interactiva y un capítulo con los otros doce casos reales del deck general. Cada caso explica un problema de negocio, el tipo de machine learning que lo resuelve y cómo funciona paso a paso con un ejemplo sencillo.'),
  spacer(),
  h3('Contenido'),
  bullet('Cabify: tráfico legítimo o artificial (clasificación binaria). Unos 12 minutos.'),
  bullet('idealista: estimar el valor de un inmueble (regresión). Unos 12 minutos.'),
  bullet('Spotify: descubrir y explicar grupos (clustering). Unos 15 minutos.'),
  bullet('Uber: precio dinámico y demanda de viajes (series temporales, clustering, regresión y bucle de precio). Unos 20 minutos.'),
  bullet('Deck general: otros doce casos (Walmart, Uber COTA, Amazon, Adyen, Iberdrola, Booking.com, ING, BMW, Mango, Allianz, Google y BBVA), más la síntesis final. Unos 45 minutos.'),
  bullet('Anexo: glosario de apoyo y preguntas frecuentes.'),
  spacer(),
  h3('Cómo usar el guion'),
  say('El texto en párrafo normal es lo que se dice en voz alta; conviene adaptarlo con palabras propias en lugar de leerlo. Hay tres tipos de apoyo visual:'),
  cue('lo que se hace o se enseña en pantalla (por ejemplo, mover un control de la demostración).'),
  ask('una pregunta para abrir conversación; deja unos segundos de silencio antes de responderla tú.'),
  warn('el aviso que evita que la audiencia confunda una demostración con datos o sistemas reales de la empresa.'),
  say('Los tiempos son orientativos y suman la presentación completa de cada caso. Si hay poco tiempo, en cada caso se indica qué etapas se pueden resumir.'),
  warn('todos los números, gráficos y ejemplos de las demostraciones son ilustrativos y sintéticos. Ninguna empresa ha publicado sus modelos, sus variables ni sus umbrales. Lo que se muestra es una reconstrucción didáctica de cómo funciona la técnica, no el sistema real.'),
  h3('Nota sobre el PDF'),
  say('En el PDF exportado, la diapositiva interactiva de cada caso se reparte en varias páginas: primero un diagrama resumen y después una página por cada etapa de la demostración. En pantalla, las etapas se recorren con las pestañas o las flechas del teclado. El guion sigue el orden de las etapas, de modo que sirve igual en ambos formatos.'),
)

// =========================== CABIFY ===========================
c.push(
  h1('1. Cabify: tráfico legítimo o artificial'),
  ficha([
    ['Tipo de problema', 'Clasificación binaria: asignar una de dos etiquetas (legítimo o artificial) a cada solicitud.'],
    ['Idea que debe quedar', 'Una predicción de dos vías resulta útil cuando sus errores tienen costes de negocio claros. El umbral de bloqueo es una decisión de negocio, no técnica.'],
    ['Caso real', 'Cabify usa Infobip Signals, un servicio de ML que identifica patrones y anomalías en el tráfico de SMS y bloquea el tráfico artificial (AIT).'],
    ['Dato publicado', 'Infobip informa de un 15,7 % menos de pérdidas financieras relacionadas con AIT en un trimestre. Es un resultado de negocio comunicado por el proveedor, no la exactitud del modelo.'],
    ['Demostración', '4.000 solicitudes sintéticas (3.000 de entrenamiento y 1.000 reservadas, un 18,6 % artificiales) y una regresión logística con cuatro señales.'],
    ['Duración', 'Unos 12 minutos.'],
    ['Fuente', 'Caso de cliente de Infobip con testimonio de Cabify: https://www.infobip.com/customer/cabify'],
  ]),
  spacer(),

  h2('Portada', '30 s'),
  say('Empezamos con un problema muy cotidiano: cuando alguien se registra en una app, ¿es una persona o es un programa automático? Parece un detalle técnico, pero cada vez que esa app envía un SMS de verificación, alguien paga por él. Vamos a ver cómo se decide, solicitud a solicitud, si dejar pasar o bloquear.'),

  h2('El problema', '2 min'),
  cue('Diagrama de la diapositiva «Cabify: el problema». Recorre de izquierda a derecha: solicitudes, decisión, resultado.'),
  say('Un cliente real pide un SMS, lo recibe, introduce el código y se registra. Un bot hace cientos de solicitudes, casi nunca introduce el código y a menudo las dirige a rutas internacionales de alto coste. En ambos casos, la empresa paga el SMS.'),
  say('A este fraude se le llama AIT, de Artificial Inflation of Traffic, inflado artificial de tráfico: los bots disparan grandes volúmenes de mensajes que nadie lee y la empresa paga por todos ellos.'),
  say('Un sistema de machine learning se coloca delante de ese tráfico y decide, para cada solicitud, si la permite o la bloquea. Fijaos en las cuatro casillas de la derecha. Son los cuatro resultados posibles de cualquier decisión de sí o no: permitir a un cliente real, que es lo correcto; bloquearlo por error, y perdemos un cliente; permitir un bot, y pagamos un SMS falso; o bloquear un bot, que es la pérdida que evitamos.'),
  say('Dos de esas casillas son errores, y cada error cuesta dinero distinto. Esa es la idea central de este caso: el umbral de bloqueo decide cuál de los dos errores aceptamos con más frecuencia.'),
  warn('el diagrama es una ilustración simplificada. Los comportamientos dibujados (número de solicitudes, códigos introducidos, rutas de alto coste) son señales ilustrativas, no datos de Cabify ni de Infobip.'),

  h2('El caso real: clasificación binaria', '2 min'),
  say('Clasificación binaria significa asignar una de dos etiquetas, normalmente aplicando un umbral a una puntuación de riesgo: el modelo da un número y nosotros decidimos a partir de cuál bloqueamos.'),
  say('El caso real es el de Cabify, que usa Infobip Signals para distinguir los SMS legítimos del tráfico de bots. La ventaja es clara: se automatizan decisiones de gran volumen sin que nadie tenga que revisar cada una. La limitación también: los falsos positivos pueden bloquear a clientes reales y los patrones de ataque cambian con el tiempo, así que el modelo hay que vigilarlo.'),
  say('Infobip informa de un 15,7 % menos de pérdidas financieras relacionadas con AIT en un trimestre. Conviene leerlo bien: es un resultado de negocio que cuenta el proveedor, no la exactitud del clasificador ni el efecto aislado del modelo, porque ese trimestre también hubo cambios en fraude y autenticación. Tampoco sabemos qué algoritmo concreto usan ni qué umbral.'),

  h2('Demostración interactiva (5 etapas)', '6 min'),
  say('Como no conocemos el sistema real, hemos construido uno pequeño con datos inventados para ver cómo funciona por dentro. Son 4.000 solicitudes sintéticas; 3.000 sirven para que el modelo aprenda y 1.000 las reservamos para comprobarlo con datos que no ha visto.'),

  h3('Etapa 1 · Solicitud'),
  cue('Pestaña «Solicitud». Cambia las señales con los controles.'),
  say('Seguimos a una solicitud concreta: un registro que pide un SMS de verificación. Del comportamiento de esa solicitud sacamos cuatro señales: cuántas solicitudes por minuto hace, qué proporción de códigos se introduce, si la ruta es de alto coste y si el dispositivo es desconocido. Cada señal se convierte en un número; ese vector de números es lo único que ve el modelo.'),
  ask('¿Qué señal os parece la más sospechosa? Probad a cambiarla y veremos si el resto de pasos lo confirman.'),

  h3('Etapa 2 · Puntuación'),
  cue('Pestaña «Puntuación». Señala las dos mitades: entrenamiento y puntuación.'),
  say('Aquí hay dos momentos distintos. En el entrenamiento, que se hace una vez, el modelo mira 3.000 solicitudes ya etiquetadas (esta era un bot, esta una persona) y aprende cuánto pesa cada señal. El modelo es una regresión logística: suma las señales ponderadas y las convierte en una probabilidad entre 0 y 1.'),
  say('En la puntuación, que se hace con cada solicitud nueva, se aplican esos pesos ya fijados. El resultado no es un sí o un no, es un riesgo: por ejemplo, un 68 % de probabilidad de tráfico artificial. Aún no hemos decidido nada.'),

  h3('Etapa 3 · Umbral'),
  cue('Pestaña «Umbral». Arrastra la línea del umbral sobre la distribución de puntuaciones.'),
  say('Ahora convertimos la probabilidad en decisión. Elegimos un umbral y bloqueamos todo lo que lo supere. Fijaos en que las dos distribuciones se solapan: hay bots con puntuación baja y clientes reales con puntuación alta. Por eso cualquier umbral deja pasar algunos bots y frena a algunos usuarios genuinos. Si lo subo, bloqueo menos clientes buenos pero se me cuelan más bots; si lo bajo, ocurre lo contrario.'),
  say('Esta solicitud se permite o se bloquea según de qué lado de la línea caiga. Mueve la línea y veréis cómo cambia la decisión para la misma solicitud.'),

  h3('Etapa 4 · Coste'),
  cue('Pestaña «Coste». Cambia el precio de bloquear a un usuario genuino (2 €, 5 € o 10 €) y observa el umbral más barato.'),
  say('Con las 1.000 solicitudes reservadas podemos contar los aciertos y los errores. Con el umbral inicial de 0,5, la demostración tiene una precisión de alrededor del 82 % y un recall de alrededor del 72 %: de cada 100 solicitudes que bloquea, unas 82 eran realmente bots, y de cada 100 bots, detecta unos 72.'),
  say('Pero lo importante no es el porcentaje, es el dinero. Ponemos un precio ficticio a cada error: dejar pasar un bot cuesta 1,50 euros de SMS, y bloquear a un cliente real cuesta 5 euros de cliente perdido. La gráfica muestra el coste por cada 1.000 solicitudes para todos los umbrales posibles, y el mejor umbral es el más barato.'),
  say('Y aquí está la lección: si cambio el precio de bloquear a un cliente de 5 a 10 euros, el mejor umbral se mueve. Ningún experto en datos puede decidir ese umbral sin saber cuánto vale un cliente para el negocio. Por eso decimos que el umbral es una decisión de negocio.'),
  warn('los precios (1,50 €, 5 € y los demás) son ficticios. Las métricas son resultados de la demostración sintética, no la exactitud medida por Infobip.'),

  h3('Etapa 5 · Explicabilidad'),
  cue('Pestaña «Explicabilidad». Muestra las barras que suben o bajan el riesgo.'),
  say('Última pregunta: ¿por qué esta solicitud obtiene esta puntuación? Partimos de una solicitud media y descomponemos la diferencia señal por señal. Las barras que empujan hacia la derecha aumentan el riesgo; las que empujan hacia la izquierda lo reducen. Introducir el código, por ejemplo, es la señal que más baja el riesgo; un dispositivo desconocido o una ruta de alto coste lo suben.'),
  say('Esto sirve para algo muy práctico: si un cliente protesta porque se le ha bloqueado, podemos explicar qué señales pesaron. Y una advertencia: una puntuación alta es una estimación de riesgo, no una prueba de fraude.'),

  h2('Cierre y debate', '1 min'),
  ask('¿Qué decisión de tu negocio sigue tomando una persona en cada caso? ¿Cuánto te costaría un bloqueo erróneo?'),
  say('Resumen para cerrar: un modelo da una puntuación, un umbral la convierte en decisión, y el umbral correcto depende de lo que cuesta cada tipo de error. Eso es clasificación binaria.'),
  cue('Si vas corto de tiempo, resume las etapas 1 y 2 en un minuto y dedica el resto a las etapas 3 y 4, que son las que transmiten el mensaje de negocio.'),
)

// =========================== IDEALISTA ===========================
c.push(
  h1('2. idealista: estimar el valor de un inmueble'),
  ficha([
    ['Tipo de problema', 'Regresión: estimar un número continuo a partir de las características de una observación.'],
    ['Idea que debe quedar', 'La respuesta es un número, no un sí o un no. Importa cuánto se aleja del precio real, y el coste del error depende del sentido en que se equivoque.'],
    ['Caso real', 'idealista/data combina comparables y un modelo de ML hedónico para estimar el valor de los inmuebles a partir de su ubicación y sus atributos.'],
    ['Lo que no se sabe', 'La empresa explica el enfoque, pero no publica su estimador exacto, sus reglas de emparejamiento ni sus pesos.'],
    ['Demostración', '480 inmuebles sintéticos en tres zonas (360 de entrenamiento y 120 reservados), una regresión lineal, seis viviendas comparables y una mezcla 50/50.'],
    ['Duración', 'Unos 12 minutos.'],
    ['Fuente', 'idealista/data e idealista labs: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/'],
  ]),
  spacer(),

  h2('Portada', '30 s'),
  say('Ahora, un problema distinto: no se trata de decir sí o no, sino de poner un número. ¿Cuánto vale un piso? Vamos a ver cómo se estima, y sobre todo cómo se mide si la estimación es buena.'),

  h2('El problema', '2 min'),
  cue('Diagrama de «idealista: el problema». Recorre entradas, modelo y resultado.'),
  say('Un inmueble tiene un precio real que nadie conoce hasta que se vende. Valorarlo a mano no escala cuando hay que hacerlo para toda una cartera. Así que se estima: el modelo recibe los atributos del inmueble (ubicación, tipo, superficie, habitaciones) y aprende de miles de viviendas comparables de las que sí conocemos el precio.'),
  say('En la caja central tenéis la versión más simple de la idea: la recta roja dice que el precio crece con la superficie, y el inmueble nuevo se lee sobre esa recta. Además, los comparables, las viviendas más parecidas, aportan una segunda opinión.'),
  say('Fijaos en lo que cambia respecto al caso anterior. Aquí la respuesta es un número continuo, así que una estimación nunca es simplemente correcta o incorrecta. Puede quedar muy baja, cercana o muy alta, y el coste del error depende del sentido: si es muy baja, el vendedor puede malvender; si es muy alta, la vivienda puede no venderse.'),
  say('La curva de abajo a la derecha es la distribución de esos errores. Un buen modelo la mantiene estrecha y centrada en cero. Más adelante la mediremos con un número: el error absoluto medio, en euros.'),
  warn('el diagrama de dispersión, la recta y la curva de error son ilustrativos, no datos de idealista.'),

  h2('El caso real: análisis de regresión', '2 min'),
  say('Regresión significa estimar un número continuo a partir de variables explicativas. idealista/data combina comparables con un modelo de ML hedónico: un modelo hedónico relaciona el valor de un inmueble con sus atributos, como la ubicación, el tamaño y el tipo de propiedad.'),
  say('La ventaja es que produce estimaciones coherentes en carteras enormes. Las limitaciones: si faltan atributos o el mercado cambia, la precisión baja, y una estimación no es un precio de venta garantizado ni una tasación formal. Además, una predicción por sí sola no nos dice qué factores causan el precio.'),
  warn('idealista no ha publicado qué regresor usa. La regresión lineal de la demostración es una línea base didáctica e interpretable, no el modelo real de la empresa.'),

  h2('Demostración interactiva (5 etapas)', '6 min'),
  say('La demostración usa 480 inmuebles inventados en tres zonas, A, B y C. 360 sirven para aprender y 120 se reservan para evaluar. Todos los precios y zonas son ficticios.'),

  h3('Etapa 1 · Ejemplo'),
  cue('Pestaña «Ejemplo». Cambia superficie, habitaciones, zona, reforma y ascensor.'),
  say('Ana quiere estimar el precio de su piso: unos 80 metros cuadrados, dos habitaciones, en la zona A, reformado y con ascensor. Vamos a seguir esta misma vivienda en todos los pasos. Podéis cambiar sus atributos y ver cómo se mueve todo lo demás.'),

  h3('Etapa 2 · Viviendas similares'),
  cue('Pestaña «Viviendas similares». Señala las seis viviendas de referencia.'),
  say('El primer método es el más intuitivo, el que haría una persona: buscar seis viviendas como la de Ana, de la misma zona, con tamaño y número de dormitorios parecidos. Sus precios dan una primera comparación: la media de esos seis precios es una estimación.'),

  h3('Etapa 3 · Regresión'),
  cue('Pestaña «Regresión». Muestra la relación que aprende el modelo.'),
  say('El segundo método es la regresión: en lugar de mirar solo seis casos, aprende de todas las viviendas conocidas una relación numérica. Por ejemplo, cuánto añade cada metro cuadrado, cuánto una reforma o un ascensor. Con esa relación, predice el precio de Ana a partir de los atributos de su piso.'),

  h3('Etapa 4 · Estimación'),
  cue('Pestaña «Estimación». Enseña cómo se combinan los dos métodos.'),
  say('Para la vivienda de Ana combinamos las dos estimaciones: la media de las viviendas similares y la predicción de la regresión. En la demostración usamos un promedio 50/50 explícitamente ilustrativo; no sabemos cómo pondera idealista los comparables y el modelo.'),
  say('El resultado es una sola cifra continua. Y ahora viene la pregunta clave: ¿cómo sabemos si es buena? Con las 120 viviendas reservadas, el modelo ha estimado sus precios sin haberlas visto y los comparamos con los reales. La media de esas diferencias, en valor absoluto, es el error absoluto medio o MAE.'),
  cue('Dato de apoyo por si preguntan (datos sintéticos): en la demostración el MAE es de unos 9.900 euros con la regresión sola, unos 13.900 con los comparables solos y unos 10.600 con la mezcla. La mezcla no mejora a la regresión sola; es un ejemplo de método combinado, no una receta óptima.'),

  h3('Etapa 5 · Explicabilidad'),
  cue('Pestaña «Explicabilidad». Muestra cómo afectan el tamaño, la reforma y el ascensor.'),
  say('Por último, ¿qué problema resuelve todo esto? Para Ana, la demostración explica cuánto aportan el tamaño, la reforma y el ascensor a la estimación. En la demostración, cada metro cuadrado añade unos 2.000 euros; la reforma, unos 27.000; el ascensor, unos 15.000. Son cifras de un modelo sintético, no precios de mercado.'),
  say('Con esto una persona puede entender el número y discutirlo, en lugar de aceptarlo como una caja negra. Pero cuidado: que un atributo pese en la predicción no prueba que sea la causa del precio.'),

  h2('Cierre y debate', '1 min'),
  ask('¿Qué cifra de tu negocio sigue estimándose a mano? ¿Qué necesitarías para predecirla?'),
  say('Resumen: regresión es predecir un número; se mide por cuánto se equivoca, no por si acierta; y conviene evaluar el error por segmentos (zona y tipo de inmueble), porque el promedio puede esconder zonas donde falla.'),
)

// =========================== SPOTIFY ===========================
c.push(
  h1('3. Spotify: descubrir y explicar grupos'),
  ficha([
    ['Tipo de problema', 'Clustering: descubrir grupos con comportamiento parecido sin etiquetas de grupo predefinidas (aprendizaje no supervisado).'],
    ['Idea que debe quedar', 'El clustering propone los grupos; las personas deciden cuáles merece la pena trabajar. Y un segundo modelo permite explicar qué define cada grupo.'],
    ['Caso real', 'Método documentado de investigación de usuarios de Spotify: UMAP y HDBSCAN recursivos para descubrir segmentos, y XGBoost con SHAP para explicarlos. Publicado el 5 de diciembre de 2023.'],
    ['Lo que no es', 'No es el sistema de recomendación de Discover Weekly. La fuente trata de segmentación e investigación de usuarios.'],
    ['Demostración', '684 oyentes sintéticos descritos con seis variables de comportamiento, con ajustes calculados de UMAP y HDBSCAN, modelos XGBoost y SHAP.'],
    ['Duración', 'Unos 15 minutos.'],
    ['Fuente', 'Spotify Engineering: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering'],
  ]),
  spacer(),

  h2('Portada', '30 s'),
  say('Este tercer caso cambia las reglas: no tenemos una etiqueta que predecir. Nadie nos ha dicho qué tipos de oyentes existen. La pregunta es: ¿podemos descubrir los grupos y, además, entender qué los hace distintos?'),

  h2('El problema', '2 min'),
  cue('Diagrama de «Spotify: el problema». Tres bandas: el problema, cómo funciona, qué se obtiene.'),
  say('Un servicio de música tiene un número enorme de oyentes, cada uno descrito por muchas variables de comportamiento, y ningún grupo predefinido. La nube gris de la izquierda es ese punto de partida: no sabemos quiénes son ni en qué se diferencian.'),
  say('El método tiene dos pasos. El paso uno es hallar grupos: primero se comprimen las variables con una técnica llamada UMAP, y luego se buscan zonas densas con HDBSCAN. Algunos oyentes no encajan en ningún grupo y quedan como ruido, y eso está bien. Además, el proceso se puede repetir dentro de un grupo elegido para encontrar segmentos más finos.'),
  say('El paso dos es explicar los grupos. Se entrena un modelo, XGBoost, para predecir si un oyente pertenece a un grupo o no, y se usa SHAP para ver qué comportamientos pesan más. Así sabemos qué define a cada grupo.'),
  say('Después, y esto es importante, los investigadores de usuarios validan e interpretan los segmentos. El algoritmo propone; las personas deciden.'),
  warn('los puntos, las barras y los nombres de comportamientos (podcasts, uso nocturno, tasa de saltos, uso de listas) son ilustrativos, no datos ni variables de Spotify. Y no es un diagrama de Discover Weekly.'),

  h2('El caso real: clustering', '2 min'),
  say('Clustering significa descubrir grupos con comportamiento similar sin que nadie los haya etiquetado antes. Spotify combina UMAP con HDBSCAN recursivo para descubrir segmentos más finos de usuarios, y usa XGBoost y SHAP para explicarlos.'),
  say('La ventaja: encuentra segmentos inesperados y ayuda a dirigir la investigación de usuarios. La limitación: las variables que elijamos condicionan los grupos que salen, y los clusters estables siguen necesitando validación humana: no basta con que el algoritmo encuentre un grupo, hay que comprobar que se repite con otra muestra y que significa algo para el negocio.'),

  h2('Demostración interactiva (9 etapas)', '9 min'),
  say('Para ver el método por dentro usamos 684 oyentes inventados descritos con seis variables de comportamiento. En la historia que seguimos hay tres personas: Ana, Luis y Marta.'),

  h3('Etapa 1 · Ejemplo'),
  cue('Pestaña «Ejemplo».'),
  say('Ana y Luis comparten artistas, por ejemplo, escuchan a AC/DC y a Metallica; Marta escucha otra cosa, a Taylor Swift. La pregunta es si el algoritmo es capaz de descubrir el grupo de Ana y Luis, y de explicar qué lo hace distinto. Si lo explica bien, podríamos incluso pensar en una recomendación útil para Ana.'),
  warn('es una historia ilustrativa. La demostración calculada usa variables de comportamiento, no recuentos de artistas ni usuarios reales.'),

  h3('Etapa 2 · Variables'),
  cue('Pestaña «Variables».'),
  say('Lo primero es convertir la escucha de Ana en una fila de números: minutos al día, escucha nocturna y así hasta seis variables de comportamiento. Cada oyente es una fila y cada variable, una columna. Ese es el punto de partida de cualquier algoritmo de clustering.'),

  h3('Etapa 3 · UMAP'),
  cue('Pestaña «UMAP».'),
  say('Seis columnas son imposibles de dibujar, así que UMAP las comprime a dos para poder verlas. La idea es que los oyentes parecidos queden cerca en el dibujo. Con variables de artistas adecuadas, Ana y Luis aparecerían cerca. Ojo: UMAP muestra similitud, no etiqueta géneros ni dice por qué son parecidos.'),
  say('Hay un indicador de calidad en pantalla, la confiabilidad del vecindario, que dice si los vecinos del dibujo siguen siendo vecinos de verdad. Es una comprobación local, no una prueba de que los grupos sean útiles.'),

  h3('Etapa 4 · HDBSCAN'),
  cue('Pestaña «HDBSCAN». Cambia el grupo a inspeccionar con el selector.'),
  say('Sobre ese dibujo, HDBSCAN busca zonas densas: lugares donde hay muchos oyentes juntos. Cada zona densa es un grupo y se pinta de un color. Un grupo podría contener a Ana y a Luis, mientras Marta cae en otro sitio. Los oyentes que no están en ninguna zona densa se marcan como ruido, y no pasa nada: no todo el mundo tiene que pertenecer a un grupo.'),

  h3('Etapa 5 · Re-embedding'),
  cue('Pestaña «Re-embedding». Elige un grupo padre con el selector.'),
  say('Ahora viene lo de «recursivo». Cogemos el grupo de Ana y volvemos a empezar, pero con una condición clave: usamos sus filas originales, no las coordenadas del dibujo anterior. Se recalculan vecinos, UMAP y HDBSCAN solo con esa población. Esto puede revelar hábitos más finos dentro de un grupo grande.'),

  h3('Etapa 6 · Jerarquía'),
  cue('Pestaña «Jerarquía». Haz clic en una rama para inspeccionar su población.'),
  say('El resultado se ve como un árbol: la población completa arriba, los grupos grandes debajo y, dentro de ellos, los subgrupos. Cada nivel es un nuevo ajuste con sus propias coordenadas y asignaciones. Es el árbol del análisis recursivo, no el árbol interno de HDBSCAN. Un grupo puede no dividirse en nada, y eso también es un resultado.'),

  h3('Etapa 7 · XGBoost'),
  cue('Pestaña «XGBoost».'),
  say('Hasta aquí hemos descubierto los grupos; ahora hay que entenderlos. Para cada grupo entrenamos un modelo que predice «pertenece a este grupo o no», frente a todos los demás, usando las variables originales. No nos interesa predecir nada nuevo: nos interesa que el modelo nos diga qué variables importan para separar un grupo del resto.'),

  h3('Etapa 8 · SHAP'),
  cue('Pestaña «SHAP». Alterna entre explicación local y global.'),
  say('SHAP mide cuánto empuja cada variable la puntuación de un oyente hacia un grupo. En modo local vemos a un oyente concreto; en modo global, el promedio de todos los oyentes del nodo. Las barras explican comportamiento: qué hábitos definen cada grupo.'),
  warn('SHAP explica el modelo que hemos entrenado, no la realidad. Los resultados dependen del embedding y del clustering elegidos.'),

  h3('Etapa 9 · Explicabilidad'),
  cue('Pestaña «Explicabilidad». Enseña el texto «Qué significan los resultados».'),
  say('El último paso es traducir la explicación a lenguaje humano: «este grupo escucha mucho por la noche y salta poco». Y entonces se valida con oyentes y con los investigadores de usuarios. Las explicaciones del modelo no prueban causas ni validan los segmentos por sí solas.'),

  h2('Cierre y debate', '1 min'),
  ask('¿Qué grupos podrías descubrir en tus propios datos? ¿Y quién los investigaría?'),
  say('Resumen: el clustering descubre, XGBoost y SHAP explican, y las personas validan. Sin ese último paso, un grupo es solo un dibujo.'),
  cue('Si vas corto de tiempo: resume las etapas 2 a 4 como «convertir, dibujar, agrupar» y dedica el tiempo a la recursión (etapas 5 y 6) y a la explicación (etapas 7 y 8).'),
)

// =========================== UBER ===========================
c.push(
  h1('4. Uber: precio dinámico y demanda de viajes'),
  ficha([
    ['Tipo de problema', 'Varios a la vez: series temporales (pronosticar), clustering (agrupar zonas), regresión (sensibilidad al precio) y un bucle de realimentación (ajustar el precio).'],
    ['Idea que debe quedar', 'El precio funciona como una señal que equilibra el sistema, no solo como una forma de cobrar más.'],
    ['Fuente del caso', 'Artículo divulgativo sobre Big Data y minería de datos en Uber (Shuaib Ullattil, Medium, 5 de febrero de 2026). Los modelos reales de Uber son propietarios.'],
    ['Lo que no se sabe', 'El artículo no publica algoritmos concretos, parámetros, cifras de mejora ni arquitectura.'],
    ['Ejemplo conductor', 'Zona Centro, viernes a las 18:00, con lluvia: 165 solicitudes y 110 conductores. Todo sintético.'],
    ['Duración', 'Unos 20 minutos.'],
    ['Fuente', 'https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1'],
  ]),
  spacer(),

  h2('Portada', '30 s'),
  say('Cerramos con el caso más completo, porque aquí cuatro técnicas trabajan juntas. La pregunta que contesta es: ¿cuánto debería costar un viaje ahora mismo, en esta zona? Vamos a construir la respuesta pieza a pieza con un único ejemplo.'),

  h2('El problema', '2 min'),
  cue('Diagrama de «Uber: el problema».'),
  say('Uber conecta en tiempo real a quien pide un viaje con el conductor más cercano. El problema es que la demanda cambia en minutos: depende de la hora y el día, del clima, de los eventos y del tráfico. Y casi nunca coincide con el número de conductores disponibles.'),
  say('Hay dos desajustes. Si la demanda supera a la oferta, suben las esperas y las cancelaciones y baja la satisfacción. Si la oferta supera a la demanda, los conductores hacen menos viajes, ganan menos y pueden desconectarse. Ambos perjudican a todos.'),
  say('El ejemplo que seguiremos todo el rato: zona Centro, viernes a las 18:00. Hay 165 solicitudes y solo 110 conductores.'),
  warn('estas cifras (165 solicitudes y 110 conductores) son un ejemplo sintético, no datos de Uber.'),

  h2('El caso: precio dinámico y demanda', '1 min'),
  say('El concepto es predecir la demanda por zona y ajustar el precio en tiempo real. Según el artículo se usan series temporales, clustering y regresión. La ventaja: menos esperas y una oferta de conductores más estable. La limitación: las subidas bruscas se perciben como injustas y se necesitan datos sensibles, como las ubicaciones en tiempo real.'),
  warn('el artículo describe las técnicas, pero no los algoritmos concretos. Lo que veremos son las versiones más sencillas de cada técnica, para entender cómo funcionan, no cómo las implementa Uber.'),

  h2('Los datos de partida', '1 min'),
  cue('Tabla «Los datos de partida».'),
  gridTable(['Fuente', 'Qué contiene', 'Para qué sirve'], [
    ['Solicitudes y viajes', 'Origen, destino, hora, duración, ruta, cancelaciones y pagos', 'Medir la demanda real y su histórico'],
    ['GPS de móviles', 'Posición y velocidad de cada conductor, cada pocos segundos', 'Conocer la oferta y el tráfico en tiempo real'],
    ['Contexto externo', 'Clima, cortes de carretera y eventos locales', 'Anticipar picos que el histórico no explica'],
    ['Uso de la app', 'Valoraciones, cancelaciones y comentarios', 'Entender el comportamiento y la satisfacción'],
  ], [2200, 3900, 3538]),
  spacer(),
  say('Son las tres «V» del Big Data: volumen, con millones de viajes al día; variedad, con registros estructurados, trazas de ubicación y comentarios; y velocidad, porque las decisiones son en tiempo real.'),

  h2('Del dato al precio', '1 min'),
  cue('Diagrama «Uber: del dato al precio».'),
  say('Este es el mapa de lo que viene. Los datos de viajes, el GPS y el contexto se agregan por zona y en intervalos cortos. Tres familias de modelos alimentan un motor de precio que decide el multiplicador. Y ese precio cambia el comportamiento de pasajeros y conductores, lo que genera datos nuevos: es un circuito, no una línea recta.'),
  warn('la posición de los cuadros no representa la arquitectura real de Uber, que no es pública.'),

  h2('Cuatro piezas, paso a paso', '10 min'),
  say('Cada pieza usa el mismo ejemplo: Centro, viernes a las 18:00, con lluvia.'),

  h3('Pieza 1 · Series temporales: ¿cuántos viajes habrá?'),
  cue('Diapositiva «Series temporales». Sigue los cuatro pasos y el gráfico.'),
  say('Queremos pronosticar la demanda de Centro entre las 18:00 y las 18:15. Hacemos cuatro cosas.'),
  bullet('Miramos el pasado: las solicitudes a esa hora en los últimos cuatro viernes fueron 120, 132, 128 y 140.', 'Mirar el pasado.'),
  bullet('Los viernes recientes pesan más. 0,1 por 120, más 0,2 por 132, más 0,3 por 128, más 0,4 por 140, da 132,8.', 'Ponderar.'),
  bullet('Un modelo ha aprendido que la lluvia añade un 18 % de demanda: 132,8 por 1,18 son 156,7.', 'Ajustar por contexto.'),
  bullet('En los primeros cinco minutos hay 58 solicitudes frente a las 52 esperadas, un 11 % más. Aplicamos la mitad de esa desviación: 156,7 por 1,055 son unas 165 solicitudes.', 'Corregir en vivo.'),
  say('Esa es la idea de una serie temporal: capturar patrones recurrentes por hora, día y estación, y corregirlos con lo que está pasando ahora. Es la versión más simple posible; en la práctica se usan modelos como ARIMA, suavizado exponencial o redes neuronales con muchas más variables.'),

  h3('Pieza 2 · Clustering: ¿qué tipo de zona es?'),
  cue('Diapositiva «Clustering». Avanza las iteraciones del algoritmo k-means.'),
  say('Ahora, ¿qué zonas se comportan igual? Usamos nueve zonas y las describimos con solo dos números: qué porcentaje de su demanda cae en la hora punta de la mañana y qué porcentaje de madrugada. El algoritmo k-means las agrupa en tres grupos.'),
  say('Funciona así: se eligen tres centros al azar, se asigna cada zona al centro más cercano, se mueve cada centro a la media de sus zonas y se repite hasta que nada cambia. Los centros iniciales están mal colocados a propósito, dos en la zona de negocios, para que veáis cómo el algoritmo se corrige solo; a la tercera iteración ya no cambia nada.'),
  say('¿Para qué sirve? Las zonas del mismo grupo comparten patrón: se pueden pronosticar juntas y se puede anticipar dónde enviar conductores. Elegir cuántos grupos y qué variables usar es una decisión humana, que se valida con los expertos de operaciones.'),

  h3('Pieza 3 · Regresión: demanda frente al precio'),
  cue('Diapositiva «Regresión». Enseña la curva y el punto de equilibrio.'),
  say('Tercera pieza: ¿cuánta demanda perdemos si subimos el precio? Reunimos pares históricos de precio y demanda: a precio normal, 1,0 veces, la demanda es el 100 %; a 1,5 veces, el 79 %; a 2,5 veces, el 47 %.'),
  say('La demanda cae de forma exponencial, así que ajustamos por mínimos cuadrados sobre el logaritmo. El resultado: un coeficiente de 0,51 con un ajuste casi perfecto, y cada subida de 1,0 en el multiplicador quita alrededor del 40 % de la demanda.'),
  say('Con eso buscamos el equilibrio: el multiplicador en el que la demanda iguala a la oferta. Suponiendo que la oferta de conductores crece un 60 % por cada subida de 1,0 en el multiplicador, sale un equilibrio en 1,39 veces, con unos 136 viajes atendidos de los 165 pedidos.'),
  warn('la respuesta de la oferta (60 % más de conductores por cada 1,0 de multiplicador) es una hipótesis didáctica. Todos los datos de esta pieza son sintéticos.'),

  h3('Pieza 4 · Bucle de precio: ajustar cada 5 minutos'),
  cue('Diapositiva «Bucle de precio». Recorre la simulación franja a franja.'),
  say('La cuarta pieza hace que todo funcione en tiempo real. Cada cinco minutos se mide la relación entre demanda y conductores: a las 18:00, 165 entre 110 son 1,50. Si es mayor que uno, el multiplicador sube; si es menor, baja. La regla es sencilla: el multiplicador nuevo es el anterior más 0,8 por la diferencia respecto a 1.'),
  say('En la simulación, el multiplicador sube a 1,40 desde las 18:05; luego, mientras los pasajeros esperan y los conductores se acercan, ajusta a 1,47 y se estabiliza cerca de 1,4. Cuando la demanda cae, el precio vuelve solo a 1,00 hacia las 18:45.'),
  say('Esto es un control con realimentación: el precio modifica el comportamiento y el comportamiento modifica el precio. La ganancia de 0,8 gobierna la rapidez; si es demasiado alta, el precio oscila, y si es demasiado baja, reacciona tarde. En la práctica el precio además se suaviza, se limita y se muestra redondeado.'),

  h2('Un viernes a las 18:00, de principio a fin', '2 min'),
  cue('Diapositiva «Un viernes a las 18:00, de principio a fin».'),
  say('Juntamos las cuatro piezas. El clustering sitúa a Centro entre las zonas de negocios. La serie temporal pronostica 165 solicitudes con lluvia. La regresión dice que el equilibrio está en 1,39 veces, con unos 136 viajes. El bucle sube el multiplicador a 1,40 en cinco minutos y lo estabiliza cerca de 1,4. Con una tarifa base de 12 euros, la pasajera ve 16,80 euros.'),
  warn('la tarifa base de 12 euros también es ficticia.'),

  h2('Retos y ética', '2 min'),
  say('Hay tres retos, que vienen del propio artículo. El primero es la privacidad: se manejan ubicaciones en tiempo real de pasajeros y conductores, y eso exige consentimiento, seguridad y gobierno del dato. El segundo es la percepción de justicia: subir precios en emergencias o con mal tiempo se vive como abusivo, aunque equilibre el sistema. El tercero es la escala técnica: flujos de millones de usuarios con baja latencia, con modelos que hay que vigilar y reentrenar.'),
  say('Como ideas para mitigar, y son propuestas didácticas para el debate, no medidas que el artículo atribuya a Uber: poner un tope al multiplicador, mostrar el precio antes de confirmar y avisar con claridad al usuario.'),

  h2('Cierre y debate', '1 min'),
  ask('¿Qué precio o prioridad ajustas hoy a mano que un bucle de datos podría equilibrar? ¿Qué te parecería injusto aunque fuera eficiente?'),
  cue('Si vas corto de tiempo: presenta solo el ejemplo de principio a fin y una pieza en detalle (la 3 o la 4), y menciona las otras dos en una frase cada una.'),
)

// =========================== DECK GENERAL ===========================
// Un caso del deck general: ficha breve, flujo del diagrama, ventaja/limitación, avisos y pregunta.
const gcase = (o) => [
  h2(o.title, o.time),
  ficha([
    ['Tarea', o.tarea],
    ['Empresa y estado', o.estado],
    ['Idea que debe quedar', o.idea],
  ]),
  spacer(),
  ...o.say.map(say),
  cue(`Diapositiva de solución «${o.diag}». Recorre el diagrama en este orden: ${o.cue}`),
  ...o.steps.map(([b, t]) => bullet(t, b)),
  say(`Ventaja: ${o.ventaja} Limitación: ${o.limite}`),
  ...(o.extra || []).map(say),
  warn(o.warn),
  ask(o.ask),
]

c.push(
  h1('5. Deck general: otros doce casos reales'),
  say('El deck «Machine learning en empresas reales» recorre quince casos y tres bloques: fundamentos de machine learning, deep learning y sistemas GenAI. Tres de ellos ya tienen capítulo propio en este guion, con su demostración interactiva: Cabify (clasificación binaria), Spotify (clustering) e idealista (regresión). Este capítulo cubre los otros doce, en el orden de las diapositivas.'),
  ficha([
    ['Cómo está montado', 'Cada caso tiene una diapositiva de concepto (qué es, caso real, ventaja y limitación) y una diapositiva de solución con un diagrama del flujo publicado. El guion sigue ese orden.'],
    ['Tareas e implementaciones', 'Clasificación, clustering y forecasting describen tareas: varias familias de algoritmos pueden resolver cada una. RAG y la orquestación de agentes describen sistemas que combinan modelos con otro software.'],
    ['Qué se publica y qué no', 'Las fuentes describen el despliegue documentado en el momento de su publicación. Las ventajas y limitaciones son análisis didáctico, salvo que se atribuyan expresamente. Los diagramas son reconstrucciones funcionales: la posición de los cuadros no representa la arquitectura real.'],
    ['Duración', 'Unos 3 minutos por caso; con la síntesis final, alrededor de 45 minutos. Para una sesión corta, elige un caso por bloque.'],
    ['Fuentes', 'Consultadas el 19 y el 20 de octubre de 2026; se citan junto a cada caso y en el anexo.'],
  ]),
  spacer(),
  warn('estos casos no tienen demostración interactiva. Los diagramas muestran el flujo documentado, no datos ni modelos reales; cuando pongas un ejemplo, di que es inventado.'),

  h2('Apertura del deck', '1 min'),
  say('La idea que atraviesa toda la presentación es esta: no empezamos por el algoritmo, empezamos por la pregunta de negocio. ¿Qué ocurre junto? ¿Cuál de dos resultados? ¿Qué valor futuro? Según la salida que necesitamos y la decisión que vamos a tomar, la tarea es una u otra. Vamos a verlo con doce empresas reales.'),
  cue('Diapositivas «Ruta de aprendizaje» y «Guía de los ejemplos». La ruta tiene tres bloques: fundamentos, deep learning y sistemas GenAI.'),

  // ---------- Bloque 1 ----------
  h2('Bloque 1 · Fundamentos de machine learning'),
  say('Relaciones, etiquetas, grupos y predicciones numéricas. Es el bloque con más casos: ocho de los doce que veremos aquí, más los tres con capítulo propio.'),

  ...gcase({
    title: 'Walmart: reglas de asociación', time: '3 min',
    tarea: 'Reglas de asociación (aprendizaje no supervisado, sin resultados etiquetados).',
    estado: 'Walmart, Estados Unidos. Sistema de recomendación en producción (Walmart Global Tech, 24 de agosto de 2022).',
    idea: 'Los productos que se compran juntos pueden orientar qué productos se recomiendan juntos.',
    diag: 'Walmart: asociaciones en la cesta',
    cue: 'historial de cestas, filtro, probabilidades de pares, validación, tabla de asociaciones y consulta.',
    say: [
      'Empezamos por lo más intuitivo: ¿qué se compra junto? Una regla de asociación detecta artículos que aparecen juntos más a menudo de lo que cabría esperar por azar. No hace falta que nadie haya etiquetado nada: basta con mirar las cestas de la compra.',
      'Hay tres medidas que conviene saber nombrar. El soporte mide cuántas cestas contienen los dos productos. La confianza mide, de las cestas que tienen A, cuántas tienen también B. Y el lift compara esa confianza con lo normal que sería B por sí solo: un lift superior a 1 indica una asociación positiva frente a la independencia.',
    ],
    steps: [
      ['Historial de cestas.', 'Las transacciones se agrupan por departamento y por tiempo.'],
      ['Filtrar.', 'Se filtran las transacciones por soporte, precio y contribución al valor bruto de la mercancía (GMV).'],
      ['Probabilidades de pares.', 'Se cuentan las compras conjuntas y se calculan las relaciones entre productos.'],
      ['Validar y ordenar.', 'Se seleccionan pares diversos entre subcategorías.'],
      ['Tabla de asociaciones.', 'Es el resultado del proceso por lotes: reglas de pares de productos calculadas de antemano.'],
      ['Consulta.', 'El identificador del producto que se mira es la clave: se buscan sus pares y se ofrecen como recomendación.'],
    ],
    ventaja: 'las reglas son legibles y apoyan la venta cruzada sin resultados etiquetados.',
    limite: 'la popularidad y las promociones distorsionan la coocurrencia, y una relación no demuestra causalidad.',
    extra: ['Un dato interesante: Walmart evaluó FP-Growth, un algoritmo muy conocido de conjuntos frecuentes, y eligió después reglas de coocurrencia por pares, más simples, para poder escalar. A veces el método más sencillo es el que se puede poner en producción.'],
    warn: 'la fuente no publica aumentos de ingresos ni valores de lift. Los pares de productos que menciones como ejemplo son inventados, y la API de consulta online no la describe la fuente.',
    ask: '¿Qué dos productos o servicios de tu negocio crees que se piden juntos y nadie lo ha medido?',
  }),

  h3('Interludio · Tres salidas de clasificación'),
  cue('Diapositiva «Tres salidas de clasificación». Úsala como puente entre Cabify, Uber y Amazon.'),
  gridTable(['Tarea', 'Etiquetas por observación', 'Salida ilustrativa'], [
    ['Binaria', 'Una de dos', 'Tráfico legítimo o de bots'],
    ['Multiclase', 'Una de varias', 'Una categoría de gasto'],
    ['Multietiqueta', 'Pueden aplicarse varias', 'Varios intereses de producto'],
  ], [2200, 3400, 4038]),
  spacer(),
  say('En el deck, «multicategoría» se interpreta como clasificación multietiqueta, que es el término estándar para etiquetas que no se excluyen entre sí. Después de esta tabla viene Cabify (binaria, ya cubierta en el capítulo 1), Uber (multiclase) y Amazon (multietiqueta).'),

  ...gcase({
    title: 'Uber COTA: clasificación multiclase', time: '3 min',
    tarea: 'Clasificación multiclase: elegir una categoría entre tres o más alternativas mutuamente excluyentes.',
    estado: 'Uber, Estados Unidos. Asistente de soporte COTA en producción, según un relato de Uber Engineering del 3 de enero de 2018.',
    idea: 'Un ticket recibe una categoría de incidencia y una persona confirma las sugerencias del modelo.',
    diag: 'Uber COTA: identificar una incidencia de soporte',
    cue: 'ticket, contexto, rasgos de texto, modelo, tres tipos probables, agente y categoría confirmada.',
    say: [
      'Este no es el caso de Uber del capítulo 4. Allí hablábamos de precio dinámico; aquí hablamos del soporte al cliente. Es otro problema, otro año y otra técnica.',
      'Un usuario escribe un ticket: «me cobraron de más en el viaje de ayer». El agente de soporte tiene que elegir, entre una taxonomía enorme, el tipo de incidencia correcto. Es clasificación multiclase: hay muchas categorías, pero cada ticket recibe exactamente una.',
    ],
    steps: [
      ['Ticket entrante.', 'El mensaje del cliente y la incidencia seleccionada.'],
      ['Recopilar contexto.', 'Se combinan el mensaje y la información del viaje.'],
      ['Rasgos de texto.', 'Se limpia el texto y se aplican TF-IDF y LSA: dos técnicas clásicas para convertir texto en números.'],
      ['Modelo de tipo de incidencia.', 'Un random forest, según el relato de 2018.'],
      ['Tres tipos principales.', 'El modelo no decide solo: presenta tres categorías candidatas.'],
      ['Agente de soporte.', 'Revisa las sugerencias y elige. La categoría confirmada es la etiqueta final del ticket.'],
    ],
    ventaja: 'reduce el esfuerzo de navegar por una taxonomía de soporte extensa.',
    limite: 'las incidencias parecidas y las categorías poco frecuentes pueden confundir al clasificador.',
    extra: ['Aclara una distinción: COTA tiene otro paso, la ordenación de soluciones, que puntúa pares ticket-solución. Es una tarea separada y no hay que tratar esas soluciones como etiquetas simultáneas. Para evaluarlo, importa el macro-F1, el recall de las clases raras y la exactitud top-k: ¿está la categoría correcta entre las tres sugeridas?'],
    warn: 'es un despliegue histórico (2018) y la fuente no garantiza que siga igual hoy. El ejemplo del cobro de más es inventado.',
    ask: '¿Dónde tiene tu equipo una lista larga de categorías que una persona recorre a mano?',
  }),

  ...gcase({
    title: 'Amazon: clasificación multietiqueta', time: '3 min',
    tarea: 'Clasificación multietiqueta: asignar cero, una o varias etiquetas a la misma observación.',
    estado: 'Amazon Retail, Estados Unidos. Inferencia de propensión de clientes en producción (AWS Open Source Blog, 14 de julio de 2020).',
    idea: 'Un mismo cliente puede pertenecer a varias categorías útiles a la vez.',
    diag: 'Amazon: miles de propensiones',
    cue: 'datos de entrenamiento, MXNet, archivos del modelo, Spark con DJL, inferencia y vector de propensión.',
    say: [
      'Ahora cambiamos una palabra: en lugar de una categoría, varias a la vez. Un cliente puede estar interesado en libros, en jardinería y en electrónica al mismo tiempo, y obligarle a elegir un solo segmento sería inventarse una simplificación.',
      'Amazon predice la propensión de los clientes a actuar en miles de categorías de producto. El resultado no es una etiqueta, es un vector con una puntuación para cada categoría.',
    ],
    steps: [
      ['Datos de entrenamiento.', 'Variables de cliente dispersas y de alta dimensión, más etiquetas binarias de acciones pasadas por categoría.'],
      ['Entrenar en Python.', 'MXNet ajusta un único clasificador multietiqueta.'],
      ['Artefactos del modelo.', 'Los científicos de datos entregan los archivos del modelo entrenado.'],
      ['Spark y DJL.', 'Spark reparte el lote de clientes; el código Java o Scala carga el modelo con Deep Java Library.'],
      ['Inferencia.', 'Se aplica el modelo a cada lote.'],
      ['Vector de propensión.', 'Una puntuación para cada categoría de producto: varias pueden ser altas a la vez.'],
    ],
    ventaja: 'representa intereses solapados sin forzar un único segmento.',
    limite: 'las etiquetas poco frecuentes y los distintos umbrales dificultan el entrenamiento y la evaluación.',
    extra: ['Matiz importante para quien sepa del tema: una línea base habitual es entrenar un modelo binario por etiqueta (binary relevance), pero el diagrama no implica modelos independientes por categoría. Se evalúa con precisión y recall por etiqueta, micro-F1 y precisión en k, y como los umbrales son independientes, hay que calibrarlos.'],
    warn: 'la fuente documenta la tarea y la infraestructura, no resultados de negocio ni umbrales de puntuación.',
    ask: '¿Qué interés de tus clientes se solapa con otros y hoy lo tratas como una sola etiqueta?',
  }),

  ...gcase({
    title: 'Adyen: detección de anomalías', time: '3 min',
    tarea: 'Detección de anomalías en series temporales: señalar lo que se aparta del patrón esperado para su contexto.',
    estado: 'Adyen, Países Bajos. Monitorización del volumen de pagos en producción (Adyen Engineering, 9 de octubre de 2019).',
    idea: 'Una anomalía es algo inusual respecto a una línea base significativa.',
    diag: 'Adyen: detectar una caída del volumen de pagos',
    cue: 'volúmenes históricos, línea base, intervalo esperado, volumen observado, comparación y aviso.',
    say: [
      'Una caída de pagos a las cuatro de la madrugada es normal; la misma caída un viernes a mediodía es una alarma. La anomalía no depende del número absoluto, depende de lo que esperábamos en ese momento. Por eso la clave es construir una línea base con contexto.',
    ],
    steps: [
      ['Volúmenes históricos.', 'El recuento de pagos de cada comercio en intervalos de tiempo.'],
      ['Línea base esperada.', 'Se ajustan tendencia, estacionalidad y efectos de eventos.'],
      ['Intervalo esperado.', 'La regresión cuantílica estima los límites del residuo y da un margen inferior y superior para cada momento.'],
      ['Volumen observado.', 'Se cuentan los pagos del intervalo actual y se compara con esos límites.'],
      ['Decisión.', 'Dentro del intervalo, se sigue monitorizando. Fuera, se avisa a soporte para investigar el cambio de volumen del comercio.'],
    ],
    ventaja: 'puede identificar problemas operativos poco frecuentes sin ejemplos etiquetados de incidentes.',
    limite: 'los festivos y los cambios en los comercios provocan falsas alertas, y los umbrales sensibles aumentan el ruido.',
    extra: ['Adyen modela con regresión cuantílica cuadrática sobre los residuos; entrena en Spark y puntúa en tiempo real en Java. Y un detalle que sorprende: la empresa evaluó y descartó los isolation forests y los autoencoders para esta aplicación, así que no son los métodos desplegados. Se evalúa por tasa de detección de incidentes, falsas alertas y tiempo hasta la detección.'],
    warn: 'una alerta exige investigación; no establece una causa raíz y no todas las anomalías son fraude. La notación de intervalos del diagrama es una abstracción didáctica.',
    ask: '¿Qué métrica de tu negocio tiene un patrón diario o semanal que haría falta conocer para saber cuándo algo va mal?',
  }),

  ...gcase({
    title: 'Iberdrola: forecasting', time: '3 min',
    tarea: 'Forecasting (previsión): estimar valores futuros a partir de patrones temporales y factores disponibles.',
    estado: 'Iberdrola, España. Sistema MeteoFlow operativo; página corporativa de proyecto, sin fecha.',
    idea: 'El forecasting convierte un futuro incierto en una entrada de planificación cuantificada.',
    diag: 'Iberdrola: previsiones de producción renovable',
    cue: 'datos meteorológicos, historial de generación y producción en vivo, que alimentan los modelos, y después la previsión y las decisiones operativas.',
    say: [
      'La regresión predice un número. El forecasting predice un número en el futuro: añade un horizonte y una dependencia temporal. Y aquí el futuro importa mucho, porque la producción eólica y solar depende del tiempo que haga.',
      'Iberdrola documenta MeteoFlow en más de 450 plantas eólicas y solares, con previsiones horarias de hasta 96 horas y diarias de hasta diez días.',
    ],
    steps: [
      ['Tres entradas.', 'Previsiones de viento y radiación solar; historial de generación de la planta; y producción en vivo con datos actuales.'],
      ['Modelos MeteoFlow.', 'Estiman la producción y afinan las predicciones con machine learning.'],
      ['Previsión de generación.', 'Horaria hasta 96 horas y diaria hasta 10 días.'],
      ['Decisiones.', 'Planificación del mercado energético y ventanas de mantenimiento.'],
    ],
    ventaja: 'apoya la planificación cuando la producción varía con el tiempo meteorológico.',
    limite: 'la incertidumbre crece con el horizonte y con los cambios meteorológicos inesperados.',
    extra: ['Para evaluar, se usa backtesting con origen móvil, se compara con una línea base estacional o de persistencia («mañana será como hoy») y se mide la cobertura de los intervalos además del error medio. Una división aleatoria entre entrenamiento y prueba puede filtrar información del futuro.'],
    warn: 'las cifras de cobertura (450 plantas, 96 horas, diez días) son de despliegue, no mejoras de precisión. Iberdrola no nombra la familia exacta de modelo de ML.',
    ask: '¿Qué decisión de tu negocio tomas hoy mirando atrás cuando necesitarías mirar adelante?',
  }),

  ...gcase({
    title: 'Booking.com: análisis de sentimiento y PLN', time: '3 min',
    tarea: 'Procesamiento del lenguaje natural (PLN): análisis de sentimiento basado en aspectos (ABSA).',
    estado: 'Booking.com, Países Bajos. Flujo documentado de análisis de reseñas (AWS Machine Learning Blog, 14 de enero de 2022).',
    idea: 'Una reseña puede elogiar la ubicación y criticar la habitación.',
    diag: 'Booking.com: opiniones por aspecto',
    cue: 'reseñas, etiquetado humano, datos de entrenamiento y entrenamiento; después la reseña de ejemplo, la inferencia y el resultado por aspecto.',
    say: [
      'Una nota de cuatro sobre cinco no explica nada. Lo valioso está en el texto: «personal estupendo, camas incómodas» es positivo y negativo a la vez, sobre cosas distintas. El análisis basado en aspectos separa la puntuación global de la reseña en opiniones sobre temas concretos.',
      'El PLN es el campo amplio del procesamiento computacional del lenguaje; el análisis de sentimiento es una tarea dentro de él. Booking.com vincula las opiniones de las reseñas con más de 50 aspectos, como la limpieza o la ubicación.',
    ],
    steps: [
      ['Reseñas de hoteles.', 'Se recopila el texto para anotación humana.'],
      ['Etiquetar tramos.', 'Anotadores humanos marcan los aspectos y las opiniones y vinculan sus tramos, con SageMaker Ground Truth.'],
      ['Datos de entrenamiento vinculados.', 'Aspectos, sentimiento y relaciones entre ellos.'],
      ['Entrenar el modelo ABSA.', 'Aprende análisis de sentimiento basado en aspectos.'],
      ['Inferencia.', 'Con una reseña nueva se identifican los aspectos y la opinión asociada a cada uno: Personal, positivo; Camas, negativo.'],
      ['Información de las reseñas.', 'Se muestra qué elogian o critican los huéspedes.'],
    ],
    ventaja: 'hace visibles los elogios y las quejas concretas entre muchas reseñas.',
    limite: 'el sarcasmo, las opiniones mixtas y las diferencias de idioma pueden cambiar la interpretación.',
    extra: ['Se evalúan por separado la extracción de aspectos y el sentimiento, con un análisis de errores por idioma.'],
    warn: '«Personal estupendo, camas incómodas» es una frase ilustrativa, no una reseña real. La fuente describe el etiquetado y el entrenamiento y no publica un aumento causal de reservas.',
    ask: '¿Qué comentarios libres de tus clientes se quedan sin leer porque solo mirabas la puntuación?',
  }),

  ...gcase({
    title: 'ING: minería de textos', time: '3 min',
    tarea: 'Minería de textos: extraer hechos estructurados y señales recurrentes de una gran colección de documentos.',
    estado: 'ING, Países Bajos. Aplicación desplegada de monitorización del riesgo de crédito (ING, 17 de diciembre de 2018).',
    idea: 'La minería de textos convierte un flujo de documentos en evidencia para investigar.',
    diag: 'ING: las noticias se convierten en una lista de vigilancia de riesgo',
    cue: 'noticias, PLN y traducción, señales de noticias, información de mercado, criterios de alerta y analista.',
    say: [
      'Fijaos en la diferencia con Booking.com. Allí la salida era la polaridad de un aspecto dentro de una reseña. Aquí la salida es de negocio: señales de riesgo de empresas, a partir de muchos artículos. La herramienta puede ser parecida (entidades, traducción, sentimiento), pero lo que se produce es distinto.',
      'ING describe el procesamiento de hasta 80.000 noticias al día para su Early Warning System, que ayuda a los analistas de riesgo de crédito.',
    ],
    steps: [
      ['Noticias públicas.', 'Artículos en distintos idiomas y mercados.'],
      ['PLN y traducción.', 'Los servicios de lenguaje de Google procesan el texto en idioma local.'],
      ['Señales de noticias.', 'Sentimiento sobre la cobertura relevante de clientes.'],
      ['Información de mercado.', 'Datos financieros de Refinitiv en tiempo real.'],
      ['Criterios de alerta.', 'Reglas definidas por los analistas; por ejemplo, cobertura mediática negativa o una caída de la cotización superior a un umbral.'],
      ['Analista de riesgo.', 'Revisa la alerta e investiga la exposición.'],
    ],
    ventaja: 'ayuda a los analistas a monitorizar más información externa de la que pueden leer manualmente.',
    limite: 'las noticias irrelevantes o duplicadas generan ruido y una señal sigue necesitando el criterio de un analista.',
    extra: ['Se evalúan la relevancia, la exactitud del enlace de entidades y la aceptación de las alertas por parte de los analistas.'],
    warn: 'la fuente presenta la predicción de impagos como una ambición futura: no afirmes que el sistema prediga impagos. La salida es una alerta para el analista.',
    ask: '¿Qué fuente de documentos externos te gustaría vigilar y hoy nadie tiene tiempo de leer?',
  }),

  // ---------- Bloque 2 ----------
  h2('Bloque 2 · Deep learning'),
  say('Las redes neuronales aprenden rasgos visuales y generan imágenes nuevas. Dos casos: uno reconoce y otro genera.'),

  ...gcase({
    title: 'BMW: reconocimiento de patrones', time: '3 min',
    tarea: 'Reconocimiento de patrones con una red neuronal entrenada para el reconocimiento visual.',
    estado: 'BMW Group, Alemania. Aplicaciones en producción en serie desde 2018 (BMW Group, 15 de julio de 2019).',
    idea: 'Un patrón visual aprendido puede convertir la imagen de una cámara en un control de calidad.',
    diag: 'BMW: el reconocimiento de imágenes comprueba la insignia',
    cue: 'imágenes de componentes, etiquetado, entrenamiento y red entrenada; después la cámara en vivo, el reconocimiento, la comprobación con el pedido y el resultado.',
    say: [
      'El reconocimiento de patrones es más amplio que el deep learning, pero este caso usa específicamente una red neuronal. Una red de visión aprende rasgos a partir de los píxeles antes de predecir qué componente tiene delante.',
      'En Dingolfing, BMW comprueba que la insignia del modelo de un coche recién producido coincide con la especificación del pedido, y señala las insignias ausentes o incorrectas.',
    ],
    steps: [
      ['Imágenes de componentes.', 'Fotografías desde distintos ángulos.'],
      ['Etiquetado por empleados.', 'Marcan componentes y posibles desviaciones.'],
      ['Entrenar la red.', 'Aprende distinciones visuales a partir de imágenes etiquetadas y deja una red entrenada.'],
      ['Línea de producción.', 'La cámara captura la insignia de un vehículo recién producido; la red la reconoce.'],
      ['Comprobar el pedido.', 'El software compara la insignia observada con la especificación requerida.'],
      ['Resultado.', 'Si coincide, supera el control; si no, se avisa al equipo.'],
    ],
    ventaja: 'realiza controles visuales repetidos a la velocidad de la producción.',
    limite: 'los componentes nuevos y las condiciones de iluminación requieren imágenes representativas y monitorización.',
    extra: ['Hay una diapositiva siguiente con una imagen oficial de producción: la cámara observa un componente, la red lo reconoce y el software señala cualquier discrepancia. Se evalúan el recall de defectos y la tasa de falsos rechazos en condiciones reales de fábrica.'],
    warn: 'la fuente habla de «100 % de fiabilidad», pero no repitas esa cifra como referencia general. La imagen ilustra la inspección, no es una medición independiente de precisión, y no se inventan arquitectura ni umbrales.',
    ask: '¿Qué control visual repetitivo hay en tu operación y qué errores serían más caros: dejar pasar uno malo o rechazar uno bueno?',
  }),

  ...gcase({
    title: 'Mango: generación de imágenes', time: '3 min',
    tarea: 'Generación de imágenes con deep learning, que ya es una forma de IA generativa.',
    estado: 'Mango, España. Campaña Mango Teen «Sunset Dream» publicada (Mango Fashion Group, 10 de julio de 2024).',
    idea: 'Generar imágenes nuevas conservando las características del producto real.',
    diag: 'Mango: de prendas reales a imágenes de campaña',
    cue: 'fotos reales de las prendas, entrenamiento del modelo, generación, imágenes candidatas, selección del equipo de arte, retoque y campaña.',
    say: [
      'Pasamos de reconocer a crear. La generación de imágenes aprende la estructura visual de las imágenes de entrenamiento y produce imágenes nuevas. Es el puente entre los bloques de deep learning y de GenAI.',
      'Mango creó Sunset Dream, la primera campaña de su línea Teen generada con IA, a partir de fotos reales de las prendas.',
    ],
    steps: [
      ['Fotos reales.', 'Se fotografía cada prenda de la colección.'],
      ['Entrenar el modelo.', 'Aprende cómo se coloca la prenda real sobre un modelo.'],
      ['Generar.', 'Se sintetizan varias imágenes candidatas de campaña.'],
      ['Selección del equipo de arte.', 'Revisa el detalle de la prenda y la calidad editorial.'],
      ['Retocar y finalizar.', 'Las imágenes se editan y se masterizan en el estudio.'],
      ['Campaña publicada.', 'Sunset Dream para Mango Teen.'],
    ],
    ventaja: 'amplía las opciones creativas y apoya flujos de producción repetibles.',
    limite: 'la fidelidad al producto y la calidad editorial siguen requiriendo dirección de arte humana.',
    extra: ['Hay una diapositiva con la imagen oficial de la campaña: las fotografías reales de las prendas anclan el trabajo y el equipo de arte selecciona y retoca lo generado.', 'Para quien pregunte: los modelos de difusión aprenden a invertir un proceso de ruido, y las GAN entrenan un generador frente a un discriminador. Son ejemplos de familias de algoritmos, no lo que usa Mango.'],
    warn: 'Mango no nombra ninguna arquitectura de modelo. No se afirma ninguna mejora de tiempo, coste ni conversión. Cuida también los derechos de uso y la fidelidad de las prendas.',
    ask: '¿Qué contenido visual produces hoy con sesiones caras y podrías explorar con una persona que dirija y revise?',
  }),

  // ---------- Bloque 3 ----------
  h2('Bloque 3 · Sistemas GenAI'),
  say('Recuperación, generación multimodal y uso coordinado de herramientas. Aquí ya no hablamos de un algoritmo, sino de sistemas que combinan modelos con otro software.'),

  h3('Interludio · Qué aporta RAG a un modelo de lenguaje'),
  cue('Diapositiva de dos columnas con el flujo en seis pasos.'),
  bullet('leer la pregunta del empleado, buscar en la base de conocimiento autorizada y seleccionar los pasajes relevantes.', 'Recuperación (pasos 1 a 3):'),
  bullet('dar al modelo la evidencia recuperada, generar una respuesta con fuentes y comprobarla o escalarla.', 'Generación fundamentada (pasos 4 a 6):'),
  say('La recuperación puede usar palabras clave, embeddings o un enfoque híbrido. Los controles de acceso deben aplicarse antes de que el contenido llegue al modelo. Y RAG no garantiza por sí mismo la corrección: es una arquitectura de sistema, no un algoritmo único.'),

  ...gcase({
    title: 'Allianz: búsqueda inteligente con RAG', time: '3 min',
    tarea: 'Generación aumentada con recuperación (RAG): recuperar conocimiento relevante antes de que un LLM genere la respuesta.',
    estado: 'Allianz, Alemania. EKA en producción en Allianz Leben desde julio de 2024; piloto desde julio de 2023 (Allianz, 7 de febrero de 2025).',
    idea: 'Primero se recupera la evidencia y después se genera una respuesta fundamentada.',
    diag: 'Allianz: la recuperación fundamenta la respuesta',
    cue: 'documentos de AWISO, fragmentos y base de conocimiento; después la pregunta, los pasajes relevantes, la generación y la respuesta con fuentes.',
    say: [
      'Un empleado del centro de llamadas tiene a un cliente al teléfono y necesita la respuesta ahora, no en un manual de trescientas páginas. Allianz EKA busca en AWISO, la base de conocimiento interna, resume lo relevante y remite a las fuentes completas.',
    ],
    steps: [
      ['Documentos de AWISO.', 'Conocimiento interno de productos y procesos.'],
      ['Fragmentos.', 'El contenido se divide por párrafos en pasajes manejables y se guarda en la base de conocimiento, enlazado a los documentos completos.'],
      ['Pregunta del empleado.', 'Una consulta sobre una incidencia de un cliente.'],
      ['Pasajes relevantes.', 'Se recupera la información coincidente.'],
      ['Generación con LLM.', 'Se usa la evidencia recuperada para redactar la respuesta.'],
      ['Respuesta con fuentes.', 'Destacados, resumen y enlaces a los documentos completos.'],
      ['Feedback.', 'El feedback del personal ayuda a refinar el sistema.'],
    ],
    ventaja: 'hace que el conocimiento interno sea más fácil de consultar y de revisar.',
    limite: 'la falta de resultados de recuperación y los documentos desactualizados pueden seguir produciendo respuestas erróneas.',
    extra: ['Allianz comunica una exactitud superior al 90 % en las consultas habituales, pero no publica la metodología del benchmark. EKA incluye además ajuste fino y elementos multiagente; esta diapositiva aísla solo su papel de RAG. Se evalúan el recall de la recuperación, la fundamentación (groundedness) y la corrección de la tarea de extremo a extremo. Los enlaces a las fuentes permiten verificar.'],
    warn: 'esa exactitud no es una puntuación universal de corrección. La retroalimentación apoya el refinamiento: no implica un reentrenamiento automático del modelo, y el cuadro de conocimiento no afirma una base de datos vectorial concreta.',
    ask: '¿Qué conocimiento interno está en documentos que nadie encuentra cuando hace falta?',
  }),

  ...gcase({
    title: 'Google Vids: generación multimodal', time: '3 min',
    tarea: 'Generación multimodal: crear contenido relacionado entre modalidades, como vídeo y sonido.',
    estado: 'Google, Estados Unidos. Veo 3 lanzado en Google Vids en junio de 2025 (Google Workspace Updates, 9 de junio de 2025).',
    idea: 'Un solo prompt puede generar tanto la escena en movimiento como su sonido.',
    diag: 'Google Vids: generar vídeo y sonido',
    cue: 'prompt, editor, generación con Veo 3, clip audiovisual, previsualización, inserción, línea de tiempo y vídeo final.',
    say: [
      'Modalidad significa una forma de información: texto, imagen, audio o vídeo. Lo nuevo aquí es que un mismo paso de generación produce dos modalidades coherentes entre sí: imágenes en movimiento y su sonido.',
      'Es una capacidad de producto ya lanzada: no hay que filmar ni grabar una primera versión para tener un borrador audiovisual.',
    ],
    steps: [
      ['Prompt.', 'El usuario describe la escena y el sonido deseado.'],
      ['Editor de Vids.', 'Elige Veo 3 y hace clic en Crear.'],
      ['Generación.', 'Veo 3 genera vídeo y audio a la vez: un clip de 8 segundos con sonido.'],
      ['Previsualización.', 'El usuario ve y escucha el clip antes de insertarlo.'],
      ['Insertar y editar.', 'Se añade al Vid y, en la línea de tiempo, se mantiene el sonido o se silencia el clip.'],
    ],
    ventaja: 'crea un borrador audiovisual sin tener que filmar ni grabar una primera versión.',
    limite: 'la continuidad visual, el habla y los detalles factuales siguen necesitando revisión humana.',
    extra: ['Se evalúa la coherencia audiovisual y la exactitud respecto al encargo.'],
    warn: 'los prompts de formación y de demostración de la fuente son ejemplos ilustrativos, no despliegues de clientes con nombre. Este caso trata del producto lanzado por Google, no de su marketing interno, y el flujo describe el trabajo del usuario, no una arquitectura de modelo no documentada.',
    ask: '¿Qué vídeo corto de formación o de producto produces hoy con mucho esfuerzo y un borrador te ayudaría a empezar?',
  }),

  h3('Interludio · Qué coordina un orquestador'),
  cue('Diapositiva de dos columnas con el flujo en seis pasos. Es un flujo conceptual, no el diagrama literal de la arquitectura de BBVA.'),
  bullet('interpretar el objetivo y el contexto, seleccionar un especialista o una herramienta relevante y pedir aclaraciones cuando haga falta.', 'Solicitud y enrutamiento (pasos 1 a 3):'),
  bullet('ejecutar la operación autorizada, inspeccionar el resultado y actualizar el estado, y responder, reintentar o pasar el caso a una persona.', 'Acción y retroalimentación (pasos 4 a 6):'),
  say('Un agente combina decisiones basadas en modelos con herramientas y estado. La orquestación coordina esas piezas, con especialización y traspasos. Los sistemas agénticos necesitan límites explícitos en torno a las herramientas, los permisos, las confirmaciones y la cancelación. Un flujo fijo con un paso de LLM puede ser útil sin autonomía total.'),

  ...gcase({
    title: 'BBVA Blue: orquestación de flujos agénticos', time: '4 min',
    tarea: 'Orquestación de agentes: coordinar agentes y herramientas especializados para completar una tarea acotada.',
    estado: 'BBVA, España. Asistente Blue desplegado en España desde el 20 de febrero de 2025; relato técnico de BBVA AI Factory del 13 de noviembre de 2025.',
    idea: 'Los agentes resultan operativamente útiles cuando la herramienta adecuada puede ejecutar la tarea.',
    diag: 'BBVA Blue: enrutar una solicitud bancaria',
    cue: 'mensaje y contexto, preselección, agente de enrutamiento y sus tres salidas posibles.',
    say: [
      'Aquí el sistema no solo contesta: actúa. Un cliente escribe «cuánto tengo en la cuenta» o «quiero pagar con el móvil», y el sistema tiene que decidir qué hacer con esa frase.',
    ],
    steps: [
      ['Mensaje y contexto.', 'La solicitud del cliente y el historial de conversación.'],
      ['Preselección.', 'De más de 150 operaciones se eligen unas 5 o 6 candidatas antes del enrutamiento.'],
      ['Agente de enrutamiento.', 'Elige la siguiente acción a partir de descripciones dinámicas de herramientas.'],
      ['Herramienta bancaria.', 'Una operación como la consulta de saldo o el pago móvil.'],
      ['Agente de información.', 'Responde a partir de las FAQ del banco, con RAG.'],
      ['Aclarar o respuesta de reserva.', 'Pide el detalle que falta o responde dentro de los límites cuando algo está fuera de alcance.'],
    ],
    ventaja: 'conecta las solicitudes conversacionales con operaciones definidas de cuentas y tarjetas.',
    limite: 'los errores de enrutamiento pueden elegir un flujo equivocado; los permisos y las confirmaciones importan.',
    extra: ['Para evaluar: éxito en la finalización, tasa de herramienta equivocada, acciones no autorizadas y calidad de la escalada.'],
    warn: 'la fuente describe varios roles de agente, no un simple chatbot con guion. Las respuestas de aclaración y las de reserva son funciones distintas, agrupadas en el diagrama para conservar la legibilidad. El flujo del interludio es una abstracción didáctica.',
    ask: '¿Qué tareas de atención al cliente podría completar un software con límites claros, sin pasar por una persona?',
  }),

  h3('Cierre integrado · BBVA Blue: conocimiento y acciones'),
  cue('Diapositiva final de solución, «BBVA Blue: conocimiento y acciones». Es la reconstrucción que une RAG y orquestación.'),
  say('El cierre une las dos mitades del bloque. Por un lado, el agente de información reformula la conversación, calcula embeddings de la consulta y de los títulos de las FAQ, compara por similitud del coseno y genera la respuesta fundamentada en esas FAQ. Por otro, el enrutador decide si hace falta una operación concreta del cliente. Se separan así la información general de las operaciones específicas de cada cliente.'),
  warn('no se asume que Blue incluya detectores de anomalías, modelos de forecasting ni clasificadores de sentimiento. Es una reconstrucción a partir de dos artículos de BBVA AI Factory (13 de noviembre y 18 de diciembre de 2025).'),

  // ---------- Síntesis ----------
  h2('Síntesis: elegir el método', '4 min'),
  cue('Diapositivas «Elección de método: salidas estructuradas» y «Elección de método: lenguaje y GenAI».'),
  gridTable(['Pregunta de negocio', 'Método', 'Caso'], [
    ['¿Qué ocurre junto?', 'Reglas de asociación', 'Walmart'],
    ['¿Cuál de dos resultados?', 'Clasificación binaria', 'Cabify'],
    ['¿Qué categoría única?', 'Clasificación multiclase', 'Uber COTA'],
    ['¿Qué etiquetas solapadas?', 'Clasificación multietiqueta', 'Amazon'],
    ['¿Qué grupos emergen?', 'Clustering', 'Spotify'],
    ['¿Qué se desvía de lo normal?', 'Detección de anomalías', 'Adyen'],
    ['¿Qué valor numérico?', 'Regresión', 'idealista'],
    ['¿Qué valor futuro?', 'Forecasting', 'Iberdrola'],
    ['¿Sobre qué es la opinión?', 'Sentimiento y PLN', 'Booking.com'],
    ['¿Qué señales aparecen en el texto?', 'Minería de textos', 'ING'],
    ['¿Qué patrón visual hay?', 'Reconocimiento de patrones', 'BMW'],
    ['¿Qué imagen podemos crear?', 'Generación de imágenes', 'Mango'],
    ['¿Qué dicen nuestros documentos?', 'Búsqueda con RAG', 'Allianz'],
    ['¿Puede un prompt dar vídeo y sonido?', 'Generación multimodal', 'Google'],
    ['¿Puede el software completar la tarea?', 'Orquestación de agentes', 'BBVA'],
  ], [4200, 3400, 2038]),
  spacer(),
  say('La salida y la decisión de negocio determinan la tarea. Y una nota para que no quede ninguna duda: la generación de imágenes usa deep learning y ya es una forma de GenAI, así que las dos familias no se excluyen.'),

  h2('Valor de negocio y calidad del modelo', '2 min'),
  say('Un modelo útil cambia una decisión o facilita un flujo de trabajo. Cuatro ideas para llevarse:'),
  bullet('la precisión y el recall reflejan costes de error distintos, como vimos con el filtrado de fraude de Cabify.', 'Clasificación:'),
  bullet('los backtests necesitan límites realistas de tiempo y de datos.', 'Predicción:'),
  bullet('una recuperación correcta o un texto fluido, por sí solos, no demuestran el éxito de la tarea; mide el resultado de extremo a extremo y compáralo con una línea base sencilla.', 'Sistemas GenAI:'),
  bullet('el despliegue requiere responsables, monitorización y una alternativa clara.', 'Todo método:'),
  warn('son conclusiones analíticas, no nuevas afirmaciones de resultados de las empresas.'),

  h2('Debate final', '2 min'),
  cue('Diapositiva «Debate».'),
  ask('¿Qué decisión de negocio necesita una mejor entrada? ¿Una regla, una predicción, contenido generado o una tarea completada?'),
)

// =========================== ANEXO ===========================
c.push(
  h1('Anexo A. Glosario de apoyo'),
  say('Definiciones de una frase, pensadas para decirlas en voz alta si alguien pregunta.'),
  gridTable(['Término', 'Explicación breve'], [
    ['AIT', 'Artificial Inflation of Traffic: inflado artificial de tráfico. Bots que disparan SMS de verificación que nadie lee y que la empresa paga.'],
    ['Clasificación binaria', 'Asignar una de dos etiquetas a cada caso, normalmente aplicando un umbral a una puntuación.'],
    ['Regresión logística', 'Modelo que suma señales ponderadas y las convierte en una probabilidad entre 0 y 1.'],
    ['Umbral', 'La puntuación a partir de la cual se toma una decisión (por ejemplo, bloquear). Es una decisión de negocio.'],
    ['Precisión y recall', 'Precisión: de lo que el modelo marca como bot, cuánto lo era. Recall: de todos los bots, cuántos detecta.'],
    ['Falso positivo / falso negativo', 'Falso positivo: bloquear a alguien legítimo. Falso negativo: dejar pasar un bot.'],
    ['Log-odds', 'La escala en la que la regresión logística suma las contribuciones de cada señal antes de convertirlas en probabilidad.'],
    ['Regresión', 'Estimar un número continuo (un precio, una demanda) a partir de variables explicativas.'],
    ['Modelo hedónico', 'Modelo que relaciona el valor de un bien con sus atributos: ubicación, tamaño, tipo.'],
    ['MAE', 'Error absoluto medio: la media de las diferencias, en valor absoluto, entre la estimación y el valor real.'],
    ['Comparables', 'Viviendas muy parecidas a la que se valora, cuyo precio se conoce.'],
    ['Clustering', 'Descubrir grupos de casos parecidos sin etiquetas previas.'],
    ['UMAP', 'Técnica que comprime muchas variables a dos dimensiones para poder dibujar el parecido entre casos.'],
    ['HDBSCAN', 'Algoritmo que encuentra zonas densas de puntos y deja el resto como ruido.'],
    ['Recursión', 'Repetir el proceso dentro de un grupo ya hallado, empezando de nuevo con sus datos originales.'],
    ['XGBoost', 'Modelo de árboles de decisión muy usado para predecir; aquí aprende a separar un grupo del resto.'],
    ['SHAP', 'Método que reparte la predicción de un modelo entre las variables y muestra cuánto empuja cada una.'],
    ['k-means', 'Algoritmo de clustering: asigna cada caso al centro más cercano y mueve los centros hasta que nada cambia.'],
    ['Serie temporal', 'Datos ordenados en el tiempo, de los que se extraen patrones por hora, día o estación para pronosticar.'],
    ['Bucle de realimentación', 'Sistema que mide, corrige y vuelve a medir: el precio cambia el comportamiento y el comportamiento cambia el precio.'],
    ['Reglas de asociación', 'Reglas del tipo «quien compra A suele comprar B», halladas en las cestas de compra sin etiquetas previas.'],
    ['Soporte, confianza y lift', 'Soporte: cuántas cestas contienen ambos productos. Confianza: de las cestas con A, cuántas incluyen B. Lift: confianza dividida por lo habitual que es B; mayor que 1 indica asociación positiva.'],
    ['Clasificación multiclase', 'Elegir una categoría entre tres o más; cada caso recibe exactamente una.'],
    ['Clasificación multietiqueta', 'Cada caso puede recibir cero, una o varias etiquetas a la vez.'],
    ['TF-IDF y LSA', 'Técnicas clásicas para convertir texto en números: TF-IDF pondera las palabras por lo distintivas que son; LSA resume su significado en pocas dimensiones.'],
    ['Detección de anomalías', 'Señalar lo que se aparta de lo esperado en su contexto, normalmente sin ejemplos etiquetados de incidentes.'],
    ['Regresión cuantílica', 'Regresión que estima un percentil (por ejemplo, el límite superior o inferior) en lugar de la media; sirve para fijar intervalos esperados.'],
    ['Forecasting y backtesting', 'Forecasting: estimar valores futuros. Backtesting: simular la previsión en el pasado respetando el orden temporal para medir su error real.'],
    ['PLN y ABSA', 'PLN: procesamiento del lenguaje natural. ABSA: análisis de sentimiento basado en aspectos, que da una opinión por tema y no una sola nota.'],
    ['Minería de textos', 'Extraer señales y hechos estructurados de grandes colecciones de documentos.'],
    ['Reconocimiento de patrones', 'Identificar regularidades en los datos; aquí, con una red neuronal que reconoce componentes en imágenes.'],
    ['Modelo de difusión y GAN', 'Dos familias de modelos generativos de imágenes: la difusión aprende a invertir un proceso de ruido; la GAN enfrenta un generador a un discriminador.'],
    ['RAG', 'Generación aumentada con recuperación: se buscan primero pasajes relevantes en una base de conocimiento y el modelo redacta la respuesta con esa evidencia.'],
    ['Multimodal', 'Que trabaja con varias modalidades de información (texto, imagen, audio, vídeo) a la vez.'],
    ['Agente y orquestación', 'Agente: sistema que combina decisiones de un modelo con herramientas y estado. Orquestación: coordinar varios agentes o herramientas con permisos y traspasos.'],
  ], [2600, CONTENT_W - 2600]),

  h1('Anexo B. Preguntas frecuentes'),
  h3('Cabify'),
  bullet('No lo sabemos. Infobip lo describe como un servicio de ML que combina patrones y señales de anomalía, pero no publica el clasificador, las etiquetas de entrenamiento ni el umbral. La regresión logística de la demostración es una línea base didáctica.', '¿Es este el modelo que usa Cabify?'),
  bullet('Es el resultado de negocio que comunica el proveedor: un trimestre con un 15,7 % menos de pérdidas financieras relacionadas con AIT. No es la exactitud del clasificador ni el efecto aislado del modelo.', '¿Qué significa el 15,7 %?'),
  h3('idealista'),
  bullet('No. Un modelo da una estimación, no un precio de venta garantizado ni una tasación formal, y su precisión baja si faltan atributos o cambia el mercado.', '¿Es una tasación?'),
  bullet('Se mide con datos reservados que el modelo no ha visto, usando el error absoluto medio en euros y los errores porcentuales, por zona y tipo de inmueble.', '¿Cómo sabemos si el modelo es bueno?'),
  h3('Spotify'),
  bullet('No. La fuente describe un método de investigación de usuarios; no establece que Discover Weekly use este proceso.', '¿Así funcionan las recomendaciones de Spotify?'),
  bullet('Comprobando que los grupos se repiten con otras muestras y otras elecciones de variables, y validando con los investigadores que aportan algo útil.', '¿Cómo sabemos que un grupo es real?'),
  bullet('Porque cada uno resuelve un problema distinto. Con muchas variables, los puntos se alejan casi por igual unos de otros y la noción de «zona densa» pierde sentido, así que HDBSCAN funciona peor. UMAP comprime los datos a pocas dimensiones conservando los vecinos cercanos, y en ese espacio reducido HDBSCAN encuentra con claridad las zonas densas, sin fijar el número de grupos y dejando el resto como ruido. Además, esas dos dimensiones permiten dibujar el mapa. Hay un matiz: UMAP puede deformar distancias y densidades, así que los grupos se validan después con las variables originales.', '¿Por qué se usa UMAP junto con HDBSCAN y no solo HDBSCAN?'),
  h3('Uber'),
  bullet('No. Uber no ha publicado sus modelos. Las cuatro piezas son reconstrucciones didácticas a partir de la descripción de un artículo divulgativo.', '¿Es así como Uber calcula el precio?'),
  bullet('Depende de lo que se priorice: por eso se proponen topes, precio visible antes de confirmar y avisos claros. Es un buen tema de debate, no una cuestión técnica.', '¿Es justo subir el precio con mal tiempo?'),
  h3('Deck general'),
  bullet('No. Los diagramas son reconstrucciones funcionales de lo que cada empresa ha publicado, no sus sistemas internos. La posición de los cuadros no representa la arquitectura real.', '¿Son estos los sistemas reales de cada empresa?'),
  bullet('No. Son análisis didáctico, salvo que se atribuyan expresamente a la fuente. Las empresas no publican, en general, su metodología de evaluación.', '¿Las ventajas y limitaciones las han publicado las empresas?'),
  bullet('Son el mismo tipo de familia, con salidas distintas. La clasificación binaria elige entre dos resultados; la multiclase, una categoría entre varias; la multietiqueta puede asignar varias a la vez.', '¿En qué se diferencian clasificación binaria, multiclase y multietiqueta?'),
  bullet('Es una arquitectura de sistema, no un algoritmo. Reduce el riesgo de respuestas sin fundamento porque aporta evidencia, pero la recuperación puede fallar y los documentos pueden estar desactualizados; hay que medir el resultado de extremo a extremo.', '¿RAG garantiza que la respuesta sea correcta?'),
  bullet('Un chatbot responde; un sistema agéntico puede además ejecutar operaciones con herramientas. Por eso necesita permisos, confirmaciones, un plan de reserva y la posibilidad de pasar el caso a una persona.', '¿Qué diferencia hay entre un chatbot y un sistema agéntico como el de BBVA?'),
  spacer(),
  h3('Fuentes'),
  bullet('Cabify: https://www.infobip.com/customer/cabify (caso de cliente de Infobip, sin fecha).'),
  bullet('idealista: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/ y https://www.idealista.com/labs/blog/?p=3987 (17 de febrero de 2021).'),
  bullet('Spotify: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering (5 de diciembre de 2023).'),
  bullet('Uber: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1 (5 de febrero de 2026).'),
  bullet('Walmart: https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f (24 de agosto de 2022).'),
  bullet('Uber COTA: https://www.uber.com/us/en/blog/cota/ (3 de enero de 2018).'),
  bullet('Amazon: https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/ (14 de julio de 2020).'),
  bullet('Adyen: https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes (9 de octubre de 2019).'),
  bullet('Iberdrola: https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project (sin fecha).'),
  bullet('Booking.com: https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/ (14 de enero de 2022).'),
  bullet('ING: https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html (la diapositiva cita la fecha del 17 de diciembre de 2018; comprueba la fecha en la fuente antes de citarla).'),
  bullet('BMW Group: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production (15 de julio de 2019).'),
  bullet('Mango: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen (10 de julio de 2024).'),
  bullet('Allianz: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html (7 de febrero de 2025).'),
  bullet('Google: https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html (9 de junio de 2025).'),
  bullet('BBVA: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/ (13 de noviembre de 2025), https://www.bbvaaifactory.com/our-rag-based-information-agent/ (18 de diciembre de 2025) y https://www.bbva.com/en/innovation/for-the-first-time-in-spain-bbva-will-offer-ai-powered-account-and-card-management-with-its-virtual-assistant/.'),
)

// ---------- documento ----------
const doc = new Document({
  creator: 'InnoIT',
  title: 'Guion para explicar los casos de uso de machine learning',
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 60, bold: true, color: PURPLE }, paragraph: { spacing: { before: 0, after: 160 }, keepNext: true } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 36, bold: true, color: PURPLE }, paragraph: { spacing: { before: 240, after: 200 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 28, bold: true, color: PURPLE }, paragraph: { spacing: { before: 320, after: 120 }, keepNext: true, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 23, bold: true, color: CORAL }, paragraph: { spacing: { before: 220, after: 80 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('InnoIT · Guion de casos de uso de ML', { size: 16, color: GREY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Página ', { size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: GREY })] })] }) },
    children: c,
  }],
})

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(__dirname, 'Guion-casos-de-uso-ML.docx')
  fs.writeFileSync(out, buf)
  console.log('OK', out, buf.length)
})
