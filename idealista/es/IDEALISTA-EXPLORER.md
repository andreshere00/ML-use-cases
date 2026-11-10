# Explorador de valoración de idealista

Abre `idealista-valuation.html` para la demostración interactiva sin conexión. El mismo componente está integrado en la diapositiva 19 de la presentación nativa de Slidev. Los PDF de la presentación conservan la vista estática original.

## Cinco etapas

1. **Inmueble:** edita la superficie, los dormitorios, la zona ficticia, la reforma y el ascensor. Los atributos se convierten en un vector numérico de variables.
2. **Viviendas similares:** inspecciona los seis inmuebles de entrenamiento más cercanos de la misma zona y su precio de referencia medio.
3. **Regresión:** muestra la diferencia entre ajustar un modelo con ejemplos conocidos y aplicar sus pesos fijos a una vivienda nueva.
4. **Estimación:** combina las dos estimaciones calculadas con un promedio 50/50 explícitamente ilustrativo. El resultado se muestra redondeado a 1.000 €.
5. **Explicabilidad:** explica el problema en lenguaje llano y muestra los ajustes aritméticos exactos desde una línea base hasta esta estimación.

Usa Siguiente, Atrás, las pestañas de etapa o las flechas del teclado. Reproducir avanza cada 5,5 segundos. Editar vivienda vuelve a las entradas. Reiniciar restaura el piso original. Detalles técnicos explica el cálculo real. La versión sin conexión funciona directamente desde un archivo local, sin servidor ni instalación de ML. En la presentación completa, las flechas recorren el diagrama antes de pasar a la diapositiva siguiente.

## Caso publicado y decisiones didácticas

El [servicio AVM de idealista/data](https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/) combina un método de comparación con un modelo de machine learning hedónico. Su página de producto identifica los datos catastrales y/o la ubicación, el tipo de inmueble y la superficie como entradas de la valoración. No publica el regresor exacto, las reglas de coincidencia, los coeficientes de producción ni los pesos de combinación. Página de producto consultada el 5 de noviembre de 2026.

Es una línea base educativa independiente que ilustra esa estructura. **No es el modelo ni los datos de producción de idealista.** Las 480 observaciones de inmuebles, los precios de referencia y las zonas son sintéticos. La reforma, los dormitorios y el ascensor son variables didácticas ilustrativas, no afirmaciones sobre el conjunto de variables divulgado por la empresa. El objetivo es un precio de referencia sintético, sin pretender representar transacciones ni precios de oferta reales. Los tres nombres de zona no se corresponden con barrios reales.

## Cálculo reproducible

- Semilla aleatoria fija 42. Se dividen 480 filas sintéticas en 360 de entrenamiento y 120 observaciones reservadas antes del ajuste o la comparación.
- Mínimos cuadrados ordinarios con intercepto. Seis columnas numéricas: superficie, número de dormitorios, indicador de zona B, indicador de zona C, reformado y ascensor. La zona A es la categoría de referencia. Se ajusta una vez con los datos de entrenamiento.
- La selección de comparables usa observaciones de entrenamiento de la misma zona ficticia. Se ordena por `(diferencia de superficie / 30)^2 + (diferencia de dormitorios / 2)^2 + 0,25 por cada discrepancia de reforma/ascensor`, con el ID de fila como desempate. Se promedian los seis precios de referencia más cercanos.
- La predicción es `0,5 * media de comparables + 0,5 * predicción de la regresión`. La ponderación igual es una elección didáctica transparente, no una fórmula divulgada por idealista.
- Se informa el MAE en datos reservados con esas mismas reglas, sin incluir filas reservadas en el ajuste del modelo ni en el conjunto de comparables. Es una métrica de demostración sintética, no la precisión medida de idealista, ni un intervalo de confianza ni una tasación formal.
- El gráfico final usa aritmética aditiva exacta, sin SHAP. La línea base es la predicción media del modelo de entrenamiento. Cada contribución del modelo es `0,5 * coeficiente * (variable - media de entrenamiento de la variable)`. Los dos términos de zona se combinan. La contribución de los comparables es `0,5 * (media de comparables - línea base)`. La línea base más todas las contribuciones reconstruye la predicción combinada sin redondear.
- El coeficiente de una variable describe una asociación en este modelo sintético ajustado. Cambiar las entradas también cambia el conjunto de comparables. Los precios y los ajustes son ilustrativos, no estimaciones de mercado.

## Editar y reconstruir

Componente Vue/SVG editable: `theme/components/IdealistaValuationExplorer.vue`.
Filas de entrenamiento calculadas, coeficientes y evaluación: `data/idealista-demo.json`.
Generador: `tools/generate-idealista-demo.py` (Python 3.12, NumPy 2.2.6 y scikit-learn 1.7.2).

```bash
python3 -m venv .venv-idealista
.venv-idealista/bin/python -m pip install -r tools/idealista-requirements.txt
.venv-idealista/bin/python tools/generate-idealista-demo.py
pnpm install
pnpm build:idealista
pnpm build
```

El archivo autónomo ya incluye los datos calculados, el runtime de Vue, las fuentes y el logotipo. No hace falta Python para presentarlo. `tools/build-idealista.mjs` regenera el HTML autónomo y sus recursos públicos.

## Logotipo de la empresa

El logotipo de la empresa procede de sus [materiales oficiales de prensa](https://www.idealista.com/sala-de-prensa/materiales/). El recurso original está en `public/assets/companies`, con sus proporciones y colores conservados. Está incrustado en el explorador autónomo.

El primer paso presenta un ejemplo concreto. Cada etapa posterior explica su significado para el mismo piso. La historia es ilustrativa.
