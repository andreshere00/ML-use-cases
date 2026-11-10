# Explorador de clasificación de tráfico de Cabify

Abre `cabify-traffic.html` (se genera con `pnpm build:explorer`) para la demostración interactiva sin conexión. El mismo componente está integrado en la presentación nativa de Slidev. La exportación a PDF conserva la vista funcional estática.

## Cinco etapas

1. **Solicitud:** edita las solicitudes por minuto, la proporción de códigos de verificación introducidos, la ruta de alto coste y el dispositivo desconocido. Las señales se convierten en un vector numérico de variables.
2. **Puntuación:** muestra la diferencia entre ajustar una regresión logística con solicitudes etiquetadas y aplicar sus pesos fijos a una solicitud nueva. La salida es una probabilidad de tráfico artificial.
3. **Umbral:** arrastra el umbral de bloqueo sobre la distribución de puntuaciones reservadas. Esta solicitud se permite o se bloquea según dónde caiga la línea.
4. **Coste:** una matriz de confusión, la precisión y el recall con el umbral elegido, y el coste por cada 1.000 solicitudes con todos los umbrales. Cambia el precio de bloquear a un usuario genuino y usa el umbral más barato.
5. **Explicabilidad:** contribuciones aditivas exactas en log-odds desde la solicitud media hasta esta.

Usa Siguiente, Atrás, las pestañas de etapa o las flechas del teclado. Reproducir avanza cada 5,5 segundos. Editar solicitud vuelve a las entradas. Reiniciar restaura la solicitud y los ajustes originales. Detalles técnicos explica el cálculo real. La versión sin conexión funciona directamente desde un archivo local, sin servidor ni instalación de ML. En la presentación completa, las flechas recorren las etapas antes de pasar a la diapositiva siguiente.

## Caso publicado y decisiones didácticas

El [caso de cliente de Infobip](https://www.infobip.com/customer/cabify) describe que Cabify usa Infobip Signals, un servicio de ML que identifica patrones y anomalías en el tráfico de SMS y bloquea el tráfico artificial (AIT, Artificial Inflation of Traffic). Informa de un 15,7 % menos de pérdidas financieras relacionadas con AIT en un trimestre. No publica la familia de modelo, las variables, las etiquetas de entrenamiento ni los umbrales. Página del caso consultada el 19 de octubre de 2026.

Es una línea base educativa independiente que ilustra una decisión de clasificación binaria. **No es Infobip Signals, ni el sistema de Cabify, ni sus datos.** Las 4.000 solicitudes, las señales y los precios son sintéticos y ficticios. Las cuatro señales son variables didácticas ilustrativas, no afirmaciones sobre lo que usa Infobip. La cifra del 15,7 % es un resultado de negocio comunicado por el proveedor y esta demo no la reproduce ni la contrasta.

## Cálculo reproducible

- Semilla aleatoria fija 42. 4.000 solicitudes sintéticas, el 18,6 % artificiales. División estratificada en 3.000 solicitudes de entrenamiento y 1.000 reservadas antes del ajuste.
- Dos complicaciones crean un solapamiento realista: bots «lentos y discretos» que imitan a usuarios genuinos, y usuarios genuinos con mala cobertura que reintentan y rara vez completan el primer código.
- Regresión logística con término independiente (L2, C = 1). Entradas: `ln(1 + solicitudes por minuto)`, proporción de códigos introducidos (0 a 1), ruta de alto coste (0/1) y dispositivo desconocido (0/1). Se ajusta una vez con los datos de entrenamiento.
- Una solicitud se bloquea cuando su probabilidad prevista es igual o superior al umbral. El umbral es una decisión de negocio.
- El coste por cada 1.000 solicitudes es `(genuinos bloqueados × coste de bloquear + bots no detectados × 1,50 €) / 1.000 solicitudes reservadas × 1.000`. El coste de bloquear es seleccionable (2 €, 5 €, 10 €). Todos los precios son ficticios.
- El desglose es aritmética aditiva exacta en log-odds, sin SHAP. La línea base es la solicitud media del conjunto de entrenamiento. Cada término es `coeficiente × (variable − media de entrenamiento)`. La línea base más todos los términos reconstruye los log-odds de esta solicitud.
- Las métricas con datos reservados son resultados sintéticos de demostración, no la exactitud medida por Infobip. Una puntuación alta es una estimación de riesgo, no una prueba de fraude.

## Editar y reconstruir

Componente Vue/SVG editable: `theme/components/CabifyTrafficExplorer.vue`.
Coeficientes calculados y puntuaciones reservadas: `data/cabify-demo.json`.
Generador: `tools/generate-cabify-demo.py` (Python 3.12+, NumPy 2.2.6 y scikit-learn 1.7.2).

```bash
python3 -m venv .venv-cabify
.venv-cabify/bin/python -m pip install -r tools/cabify-requirements.txt
.venv-cabify/bin/python tools/generate-cabify-demo.py
pnpm install
pnpm build:explorer
pnpm build
```

El archivo independiente generado incluye los datos calculados, el entorno de ejecución de Vue y las fuentes. No se necesita Python para presentarlo. `tools/build-cabify.mjs` regenera el HTML independiente y sus recursos públicos.

## Logotipo de la empresa

No se incluye ningún logotipo de Cabify ni de Infobip. El nombre de la empresa se compone en texto, con el morado de Cabify como acento.
