// Genera guion/Guion-presentacion-general.docx: guion en español del deck general (general/es/slides.md).
// Uso: npm install docx@9 y después node guion/build-guion-general.js
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
// Sigue el orden de general/es/slides.md. Si cambia el deck, actualiza este guion.
const c = []
let n = 0
const slide = (title, time) => h2(`${++n}. ${title}`, time)

// Portada del documento
c.push(
  new Paragraph({ spacing: { before: 400, after: 120 }, children: [run('InnoIT · Machine learning en empresas reales', { color: CORAL, bold: true, size: 24 })] }),
  new Paragraph({ heading: HeadingLevel.TITLE, children: [run('Guion de la presentación')] }),
  new Paragraph({ spacing: { after: 360 }, children: [run('idealista · Spotify · Uber', { size: 30, color: PURPLE })] }),
  say('Texto de apoyo para presentar el deck general, diapositiva a diapositiva. La sesión recorre tres casos reales de menos a más integrado: predecir un número (idealista), descubrir grupos (Spotify) y un sistema que combina varias técnicas para fijar un precio (Uber).'),
  ficha([
    ['Duración', 'Unos 53 minutos, más preguntas.'],
    ['Público', 'Perfil no técnico o con nociones básicas. No hace falta saber programar.'],
    ['Idea que debe quedar', 'Detrás de las apps que usamos cada día hay machine learning, y cualquier caso se entiende con el mismo método: datos → modelo → decisión.'],
    ['Material', 'Deck en Slidev (con las dos demostraciones interactivas), PDF de respaldo y los simuladores web (QR en la última diapositiva).'],
  ]),
  spacer(),
  h3('Cómo usar el guion'),
  say('El párrafo normal es lo que se dice en voz alta; mejor contarlo con palabras propias que leerlo. Hay tres apoyos visuales:'),
  cue('lo que se hace o se enseña en pantalla.'),
  ask('una pregunta para abrir conversación; deja unos segundos antes de responderla tú.'),
  warn('el aviso que evita confundir una demostración con datos o sistemas reales de la empresa.'),
  say('Los tiempos son orientativos. Si vas justo de tiempo, en cada bloque se indica qué se puede resumir.'),
  warn('todos los números de las demostraciones y del ejemplo de Uber son sintéticos. Ninguna de las tres empresas publica sus modelos ni sus parámetros: lo que se enseña es una reconstrucción didáctica de cómo funciona cada técnica.'),
)

// =========================== INTRODUCCIÓN ===========================
c.push(
  h1('Introducción', true),
  slide('Portada', '1 min'),
  say('Buenas. Soy Andrés Herencia, AI Engineer en InnoIT. Mi trabajo es diseñar y construir soluciones de inteligencia artificial y machine learning para casos reales, y de eso va esta sesión: de casos reales.'),
  say('Vamos a ver tres empresas que todos conocéis y cómo usan el machine learning para resolver un problema concreto: predecir, agrupar y, al final, combinar varias técnicas en un sistema completo.'),

  slide('Objetivo de la presentación', '2 min'),
  say('La IA y el machine learning no son algo lejano: ya están en las aplicaciones que usamos cada día, aunque no lo veamos.'),
  ask('¿Quién ha mirado alguna vez cuánto vale un piso en un portal? ¿Y quién ha pagado más por un coche un día de lluvia?'),
  say('Cuando buscas casa y el portal te da un precio estimado al instante, hay un modelo detrás. Cuando tu app de música sabe qué tipo de oyente eres, hay un modelo detrás. Y cuando la tarifa sube porque llueve, también.'),
  say('El objetivo de hoy es doble: entender qué hay detrás de cada una de estas funciones y cómo se implementa. Para no perdernos, vamos a mirar todos los casos con el mismo método: qué datos entran, qué modelo los procesa y qué decisión sale.'),
  cue('señala las tres cajas de abajo: Datos → Modelo → Decisión. Es el hilo que se repite en toda la sesión.'),

  slide('Tres casos de uso', '1,5 min'),
  say('Este es el mapa de la sesión. Tres casos, de menos a más complejo.'),
  bullet('estimar el valor de una vivienda. Es un problema de regresión: predecir un número. Lo veremos con una demo en la que valoramos un piso.', 'idealista:'),
  bullet('descubrir grupos de oyentes sin saber de antemano qué grupos hay. Es clustering. También con una demo para explorar los grupos.', 'Spotify:'),
  bullet('fijar el precio dinámico. Aquí no hay una técnica sino varias encadenadas, y lo recorreremos paso a paso con un ejemplo numérico.', 'Uber:'),
)

// =========================== IDEALISTA ===========================
c.push(
  h1('Caso 1. idealista: predecir un número'),
  ficha([
    ['Técnica', 'Regresión: estimar un valor continuo a partir de variables.'],
    ['Caso real', 'idealista/data ofrece un servicio de valoración automática que combina inmuebles comparables y ML hedónico.'],
    ['Demostración', '480 inmuebles sintéticos (360 de entrenamiento, 120 reservados), una regresión lineal como línea base y seis comparables. Cinco etapas.'],
    ['Duración', 'Unos 9 minutos.'],
  ]),
  spacer(),
  slide('Sección 01 · Predicción: idealista', '20 s'),
  say('Empezamos por la tarea más intuitiva del machine learning: predecir un número.'),

  slide('Análisis de regresión', '2 min'),
  say('La regresión consiste en estimar un número a partir de unas variables. En una vivienda, el número es el precio y las variables son la ubicación, los metros, los dormitorios, si está reformada o si tiene ascensor.'),
  say('idealista/data lo usa en un servicio comercial de valoración automática: combina inmuebles comparables, es decir, viviendas parecidas que ya tienen precio, con un modelo hedónico, que es un modelo que reparte el precio entre los atributos de la vivienda.'),
  say('¿Qué gana? Puede valorar miles de inmuebles con un criterio coherente. ¿Dónde falla? Si faltan datos de la vivienda o el mercado cambia rápido, pierde precisión.'),
  warn('idealista publica el enfoque, pero no su modelo exacto. Y una estimación no es un precio de venta garantizado ni una tasación.'),

  slide('Demo: estimar el valor de un inmueble', '6 min'),
  say('Vamos a verlo con un ejemplo: el piso de Ana.'),
  h3('Etapa 1 · Ejemplo'),
  say('Ana quiere saber cuánto vale su piso: 80 metros, 2 dormitorios, zona B, reformado y con ascensor. Lo primero que hace el modelo es convertir la vivienda en una fila de números, un vector. El modelo no ve «un piso bonito»; ve números.'),
  cue('cambia la superficie con el control de la derecha; el resto de etapas siguen a la misma vivienda.'),
  h3('Etapa 2 · Viviendas similares'),
  say('Primera forma de valorar: buscar las seis viviendas más parecidas en la misma zona y mirar su precio. Es lo que haría un agente inmobiliario.'),
  h3('Etapa 3 · Regresión'),
  say('Segunda forma: aprender de todas las viviendas conocidas cuánto aporta cada atributo al precio, y aplicarlo al piso de Ana. Así no dependemos solo de seis vecinos.'),
  h3('Etapa 4 · Estimación'),
  say('Combinamos las dos: la media de los comparables y la predicción de la regresión. En la demo es mitad y mitad, solo para ilustrarlo.'),
  warn('la mezcla 50/50 es ilustrativa; idealista no publica cómo pondera ambas fuentes.'),
  h3('Etapa 5 · Explicabilidad'),
  say('Y lo más útil para Ana: por qué sale ese precio. Cuánto suma el tamaño, cuánto la reforma, cuánto el ascensor. Un número sin explicación genera poca confianza.'),
  ask('si fueras Ana, ¿qué atributo de tu piso crees que más pesa en el precio?'),
  say('Para saber si el modelo es bueno, se prueba con viviendas que no ha visto y se mide cuántos euros se equivoca de media, por zona y tipo de inmueble.'),
  cue('si vas justo de tiempo, enseña solo las etapas 1, 4 y 5.'),
)

// =========================== SPOTIFY ===========================
c.push(
  h1('Caso 2. Spotify: descubrir grupos'),
  ficha([
    ['Técnica', 'Clustering: agrupar datos parecidos sin etiquetas previas. Después, un clasificador explica cada grupo.'],
    ['Caso real', 'Spotify Engineering describe un método de investigación de usuarios: UMAP + HDBSCAN recursivo, y XGBoost con SHAP para explicar los segmentos.'],
    ['Demostración', '684 oyentes sintéticos, seis etapas más el ejemplo inicial. La recursión (re-embedding y jerarquía) queda para el notebook 03.'],
    ['Duración', 'Unos 9 minutos.'],
  ]),
  spacer(),
  slide('Sección 02 · Clasificación y agrupamiento: Spotify', '20 s'),
  say('En idealista sabíamos qué queríamos predecir: el precio. Ahora cambiamos de problema: no sabemos qué grupos hay, y queremos que los datos nos los enseñen.'),

  slide('Clustering', '2 min'),
  say('Clustering es agrupar datos parecidos sin etiquetas previas. Nadie le dice al algoritmo «estos son los fans del rock»; él encuentra grupos de oyentes que se comportan parecido.'),
  say('Esto es distinto de la clasificación: en clasificación las etiquetas ya existen y el modelo aprende a ponerlas. En clustering, el algoritmo propone los grupos.'),
  say('Spotify combina dos técnicas: UMAP, que comprime muchas variables en un mapa de dos dimensiones, y HDBSCAN, que encuentra las zonas densas de ese mapa. Su ventaja es que descubre segmentos que nadie esperaba. Su límite: los grupos dependen de las variables que elijas.'),
  warn('es un método de investigación de usuarios. No significa que Discover Weekly ni las recomendaciones funcionen así.'),

  slide('Demo: descubrir y explicar grupos', '5 min'),
  h3('Etapa 1 · Variables'),
  say('Cada oyente se convierte en una fila de números: cuánto escucha, a qué horas, cuánto varía, etc. Seguimos a Ana, a Luis y a Marta.'),
  h3('Etapa 2 · UMAP'),
  say('UMAP coloca a cada oyente en un mapa: los que se parecen quedan cerca. Ojo, el mapa muestra parecido, no etiquetas de género musical.'),
  h3('Etapa 3 · HDBSCAN'),
  say('HDBSCAN busca las zonas con muchos puntos juntos y las convierte en grupos. Los puntos aislados quedan como ruido: no los fuerza a entrar en ningún grupo.'),
  h3('Etapas 4 y 5 · XGBoost y SHAP'),
  say('Ya tenemos grupos, pero ¿qué los define? Entrenamos un modelo que predice «pertenece a este grupo o no» y con SHAP vemos qué variables pesan más. Aquí aparece la clasificación: no para predecir algo nuevo, sino para explicar los grupos.'),
  h3('Etapa 6 · Explicabilidad'),
  say('El algoritmo propone; las personas deciden. Los investigadores revisan los grupos y validan si tienen sentido y si sirven para algo.'),
  cue('si alguien pregunta por subgrupos más finos: Spotify repite el proceso dentro de cada grupo (recursión). No está en la demo; se ve en el notebook 03.'),

  slide('Cuando el grupo se equivoca de grupo', '1 min'),
  say('Una pausa. Marta escuchaba a Taylor Swift y el algoritmo la puso en su grupo. Pero un día se pone la camiseta de AC/DC… ¿sigue en su grupo?'),
  say('La respuesta: depende de lo que escuche a partir de ahora. Los grupos salen del comportamiento, y si el comportamiento cambia, al volver a ejecutar el algoritmo el grupo puede cambiar. Por eso los grupos se revisan y se validan, no se dan por buenos para siempre.'),
)

// =========================== UBER ===========================
c.push(
  h1('Caso 3. Uber: un sistema completo'),
  ficha([
    ['Técnicas', 'Series temporales, clustering, regresión y un bucle de control.'],
    ['Caso real', 'Artículo divulgativo (Shuaib Ullattil, Medium, 5 feb 2026) sobre cómo Uber usa minería de datos para el precio dinámico.'],
    ['Ejemplo', 'Zona Centro, viernes a las 18:00, con lluvia: 165 solicitudes y 110 conductores. Las mismas cifras en todas las diapositivas.'],
    ['Duración', 'Unos 23 minutos.'],
  ]),
  spacer(),
  warn('Uber no publica sus modelos. Todo el ejemplo numérico es sintético y cada pieza es la versión más sencilla de la técnica.'),
  slide('Sección 03 · Juntamos todo: simulador de Uber', '20 s'),
  say('Hasta ahora, una técnica por caso. Pero los sistemas reales casi nunca usan una sola.'),

  slide('De dos casos a un sistema completo', '1,5 min'),
  say('De lo que ya hemos visto, Uber reutiliza dos piezas: la regresión de idealista y el clustering de Spotify. Y añade dos nuevas: las series temporales, para pronosticar la demanda de los próximos minutos, y un bucle de control, que corrige el precio cada pocos minutos hasta equilibrar oferta y demanda.'),

  slide('Uber: el problema', '2 min'),
  say('Uber tiene que juntar, en cada zona y cada pocos minutos, a quien pide un viaje con un conductor libre. Y casi nunca coinciden.'),
  say('Si hay más demanda que conductores, suben las esperas y las cancelaciones. Si hay más conductores que demanda, los conductores ganan menos y se desconectan. El reto no es solo predecir: es equilibrar el sistema antes de que el desajuste perjudique a todos.'),
  say('Nuestro ejemplo: Centro, viernes a las 18:00, llueve. 165 solicitudes y solo 110 conductores.'),
  ask('¿Qué haríais vosotros para equilibrarlo?'),

  slide('Los datos de partida', '2 min'),
  say('Antes del modelo, los datos. Uber combina cuatro fuentes: las solicitudes y viajes, que miden la demanda; el GPS de los conductores, que da la oferta y el tráfico en tiempo real; el contexto externo, como el clima o los eventos; y el uso de la app, como cancelaciones y valoraciones.'),
  say('Mucho volumen, mucha variedad y mucha velocidad: las tres «V» del Big Data.'),

  slide('Uber: del dato al precio', '2 min'),
  say('Así encajan las piezas: los datos se agregan por zona y en intervalos cortos, varios modelos alimentan un motor de precio, y el precio cambia el comportamiento de pasajeros y conductores. Ese comportamiento genera datos nuevos y el ciclo vuelve a empezar.'),
  cue('recorre el diagrama de izquierda a derecha y termina en la flecha de vuelta: es un bucle, no una línea.'),

  slide('Sección · Cuatro piezas, paso a paso', '20 s'),
  say('Ahora abrimos cada pieza con el mismo ejemplo: Centro, viernes 18:00, con lluvia.'),

  slide('Series temporales: ¿cuántos viajes habrá?', '3 min'),
  say('Primera pregunta: ¿cuántas solicitudes habrá entre las 18:00 y las 18:15?'),
  say('Miramos los últimos cuatro viernes a esa hora: 120, 132, 128 y 140. Damos más peso a los recientes y sale 132,8. Un modelo aprendió que la lluvia añade un 18 % de demanda: 156,7. Y en los primeros cinco minutos llegan más solicitudes de las esperadas, así que corregimos un poco al alza: 165.'),
  say('Esto es una serie temporal en su versión más simple. En producción se usan modelos más complejos, pero la idea es la misma: el pasado, el contexto y lo que está pasando ahora.'),

  slide('Clustering: ¿qué tipo de zona es?', '3 min'),
  say('Segunda pregunta: ¿qué tipo de zona es Centro? Aquí vuelve el clustering, esta vez con k-means.'),
  say('Describimos cada zona con dos números: qué parte de su demanda cae en la hora punta de la mañana y qué parte de madrugada. K-means coloca tres centros, asigna cada zona al más cercano, mueve los centros a la media y repite hasta que nada cambia.'),
  say('Salen tres tipos de zona: negocios, ocio nocturno y residencial. Centro cae entre las de negocios. Zonas del mismo tipo se pronostican juntas y ayudan a anticipar dónde mandar conductores.'),
  cue('los centros empiezan mal colocados a propósito: enseña cómo el algoritmo se corrige solo en dos iteraciones.'),

  slide('Regresión: demanda frente al precio', '3 min'),
  say('Tercera pregunta: si subo el precio, ¿cuánta demanda pierdo? Vuelve la regresión.'),
  say('Con datos históricos de precio y demanda vemos que la demanda cae de forma exponencial: cada vez que el multiplicador sube 1,0×, se pierde alrededor de un 40 % de la demanda.'),
  say('Con eso buscamos el equilibrio: el precio en el que la demanda baja y la oferta sube hasta coincidir. Sale 1,39×, con unos 136 viajes atendidos.'),
  warn('la respuesta de los conductores al precio (+60 % por cada +1,0×) es una hipótesis didáctica.'),

  slide('Bucle de precio: ajustar cada 5 minutos', '3 min'),
  say('Cuarta pieza, y la que lo une todo: un bucle de control. Cada cinco minutos medimos R, demanda entre conductores. A las 18:00, 165 entre 110: 1,5.'),
  say('Si R es mayor que 1, el precio sube; si es menor, baja. A las 18:05 el multiplicador pasa a 1,40×. Los pasajeros y conductores reaccionan, R baja, y el precio se estabiliza cerca de 1,4×. Cuando la demanda cae, el precio vuelve solo a 1,00×.'),
  say('Es como un termostato: no hace falta acertar el precio a la primera, porque el sistema se corrige.'),

  slide('Un viernes a las 18:00, de principio a fin', '2 min'),
  say('Juntemos todo. La serie temporal pronostica 165 solicitudes. El clustering dice que Centro es zona de negocios. La regresión da un equilibrio de 1,39×. El bucle sube el multiplicador a 1,40× en cinco minutos y lo mantiene.'),
  say('Resultado para el pasajero: un viaje de 12 euros se ve a 16,80. Datos, modelo, decisión.'),

  slide('Retos y ética', '3 min'),
  say('Que funcione no significa que no tenga problemas. Tres retos:'),
  bullet('ubicaciones en tiempo real de millones de personas. Hace falta consentimiento, seguridad y gobierno del dato.', 'Privacidad:'),
  bullet('subir precios con mal tiempo o en una emergencia se vive como abusivo, aunque equilibre el sistema.', 'Percepción de justicia:'),
  bullet('millones de usuarios con baja latencia; los modelos se vigilan y se reentrenan.', 'Escala técnica:'),
  say('Ideas para mitigar: un tope al multiplicador, el precio visible antes de confirmar y avisos claros.'),
  ask('¿Es justo subir el precio cuando llueve? ¿Dónde pondríais el límite?'),
  warn('las mitigaciones son propuestas para el debate, no medidas que el artículo atribuya a Uber.'),
)

// =========================== CIERRE ===========================
c.push(
  h1('Cierre'),
  slide('Conclusiones y próximos pasos', '2 min'),
  say('Tres ideas para llevarse:'),
  bullet('estima un número, pero no garantiza un precio de venta.', 'La regresión'),
  bullet('descubre grupos sin etiquetas, y esos grupos hay que validarlos.', 'El clustering'),
  bullet('Uber encadena series temporales, clustering, regresión y un bucle de control.', 'Los sistemas reales combinan técnicas:'),
  say('Y los próximos pasos: notebooks de Jupyter para simular cada caso paso a paso, una aplicación web que simula el precio dinámico de Uber, y lo más importante, probar estas ideas con vuestros propios datos y medirlas en una decisión concreta.'),

  slide('Fuentes', '20 s'),
  say('Aquí están las tres fuentes: la página de idealista/data, el artículo de Spotify Engineering y el artículo divulgativo sobre Uber. Recordad que los datos de las demos son sintéticos.'),

  slide('Gracias', '2 min + preguntas'),
  say('Os dejo una pregunta: ¿qué decisión de vuestra empresa podría apoyarse en uno de estos tres enfoques? ¿Predecir un número, descubrir grupos o combinar varias piezas?'),
  cue('señala el QR: desde el móvil se pueden probar los simuladores de Uber e idealista. Deja la diapositiva puesta durante las preguntas.'),
)

// =========================== ANEXO ===========================
c.push(
  h1('Anexo. Preguntas frecuentes'),
  h3('idealista'),
  bullet('No. Un modelo da una estimación, no un precio de venta garantizado ni una tasación formal.', '¿Es una tasación?'),
  bullet('Se prueba con viviendas que el modelo no ha visto y se mide el error medio en euros y en porcentaje, por zona y tipo de inmueble.', '¿Cómo sé si el modelo es bueno?'),
  h3('Spotify'),
  bullet('No. La fuente describe un método de investigación de usuarios; no dice que las recomendaciones usen este proceso.', '¿Así funcionan las recomendaciones?'),
  bullet('Con muchas variables, todos los puntos parecen igual de lejos y HDBSCAN funciona peor. UMAP comprime a pocas dimensiones conservando los vecinos, y ahí HDBSCAN encuentra bien las zonas densas. Como UMAP puede deformar distancias, los grupos se validan después con las variables originales.', '¿Por qué UMAP y HDBSCAN juntos?'),
  bullet('Comprobando que se repiten con otras muestras y otras variables, y validando con los investigadores que aportan algo útil.', '¿Cómo sé que un grupo es real?'),
  h3('Uber'),
  bullet('No. Uber no publica sus modelos. Las cuatro piezas son reconstrucciones didácticas a partir de un artículo divulgativo.', '¿Así calcula Uber el precio?'),
  bullet('Porque el precio cambia el comportamiento: si suben los precios, baja la demanda y llegan más conductores. Un bucle corrige sobre la marcha en lugar de tener que acertar a la primera.', '¿Por qué un bucle y no calcular el precio una vez?'),
  spacer(),
  h3('Fuentes'),
  bullet('idealista/data: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/ e idealista labs: https://www.idealista.com/labs/blog/?p=3987 (17 feb 2021).'),
  bullet('Spotify Engineering: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering (5 dic 2023).'),
  bullet('Uber: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1 (5 feb 2026).'),
)

// ---------- documento ----------
const doc = new Document({
  creator: 'InnoIT',
  title: 'Guion de la presentación: machine learning en empresas reales',
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
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('InnoIT · Guion de la presentación', { size: 16, color: GREY })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Página ', { size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: GREY })] })] }) },
    children: c,
  }],
})

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(__dirname, 'Guion-presentacion-general.docx')
  fs.writeFileSync(out, buf)
  console.log('OK', out, buf.length, 'diapositivas:', n)
})
