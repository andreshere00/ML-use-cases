---
theme: "./theme"
title: "idealista: estimating a property value with regression"
info: "idealista: estimating a property value with regression. InnoIT template."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-ml-use-case-idealista"
layout: "cover"
---
# <span style="color:#B1D400">idealista</span><br>**estimating a property value**

Comparables and regression, explained step by step

InnoIT · ML use case

---
layout: "problem"
subtitle: "Valuing a home means estimating a number, and no estimate is exact"
caption: "The answer is a number, not a yes or no. What matters is how far it lands from the real price."
sourceLabel: "idealista/data and idealista labs"
source: "https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/"
labels:
  aria: "Diagram: a home with an unknown value and thousands of comparable homes with known prices feed a model that fits a price-versus-area line and estimates the value. The estimate can land too low, close to or too high compared with the real price, and the spread of those errors measures the model."
  sourcePrefix: "Source:"
  laneInputs: "Inputs"
  laneModel: "Model"
  laneOutcome: "Outcome"
  subject: "Home to value"
  subjectNote: "Location, type,\narea and rooms"
  unknown: "Value unknown"
  comps: "Comparable homes"
  compsNote: "Thousands of similar\nhomes, prices known"
  model: "Estimate\nthe value"
  modelNote: "Comparables and\nregression"
  plot: "price vs. area"
  low: "Too low"
  lowNote: "Seller may\nundersell"
  ok: "Close"
  okNote: "A useful\nreference"
  high: "Too high"
  highNote: "Home may\nnot sell"
  errTitle: "Error = estimate − real price"
  errLow: "estimate below"
  errMid: "typical error"
  errHigh: "estimate above"
---
# <span style="color:#B1D400">idealista</span>: the problem

<!--
Preamble to the case. A home has a real price that nobody knows until it sells. Valuing it by hand does not scale across a whole portfolio, so we estimate it: the model receives the home's attributes (location, type, area, rooms) and learns from thousands of comparable homes whose prices are known. In the middle box, the red line is the simplest version of that idea: price grows with area, and the new home is read off the line. Comparables add a second opinion from the most similar homes.

Here the answer is not a yes or no but a continuous number, so an estimate is never simply right or wrong. The estimate lands too low, close to or too high, and the cost of the error depends on the direction: a seller may undersell, or a home priced too high may not sell. The curve at the bottom right is the distribution of those errors. A good model keeps it narrow and centred on zero; the interactive slide measures its width as the mean absolute error (MAE) in euros on homes the model has not seen.

This is a simplified teaching illustration. The scatter plot, the line and the error curve are illustrative, not idealista data, and no euro value is shown. idealista/data combines comparables with a hedonic ML model but does not publish its exact estimator.
Source: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/
-->

---
layout: "case"
company: "idealista/data (Spain)"
status: "Commercial automated valuation service"
takeaway: "Regression estimates a number from the characteristics of an observation."
detail: "The company discloses the valuation approach, but not the exact estimator."
sourceLabel: "idealista/data and idealista labs"
source: "https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/"
---
# Regression analysis

::left::

## Concept

Estimate a continuous number from explanatory features.

## Real use case

idealista/data combines comparables and hedonic ML to estimate property values from location and attributes.

::right::

## Advantage

Produces consistent estimates across large property portfolios.

## Limitation

Missing attributes and market changes reduce accuracy. Estimates differ from completed sale prices.

<!--
A hedonic model relates property value to attributes such as location, size and property type. A linear regressor is an interpretable teaching baseline; the company does not say that its production estimator is linear regression. Automated valuation combines ML with comparable properties. A model estimate is not a guaranteed sale price or a formal appraisal. Evaluate MAE in euros and percentage errors, segmented by location and property type. Prediction alone does not identify causal price drivers.

Primary source: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/
Additional primary source: https://www.idealista.com/labs/blog/?p=3987
Publication: Product page and 17 Feb 2021 engineering post. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "regression"
---
# <span style="color:#B1D400">idealista</span>: estimating a property value

<!-- Interactive screen view: five-stage Vue/SVG demo using 480 synthetic properties, 360 training and 120 held out. It fits an OLS hedonic baseline, finds six similar training properties and uses an explicitly illustrative 50/50 blend. All prices and zones are fictional. The published idealista service combines comparison with hedonic ML, but does not disclose its exact regressor, matching rules or weights. The PDF keeps the original static functional overview. Companion: idealista-valuation.html, idealista-valuation-walkthrough.pdf and IDEALISTA-EXPLORER.md. A model estimate is not a guaranteed sale price or formal appraisal. Primary product page rechecked 5 November 2026. Company logo: idealista/data from the official press materials, https://www.idealista.com/sala-de-prensa/materiales/ .
Source: https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/
Additional source: https://www.idealista.com/labs/blog/?p=3987
Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->

---
layout: "end"
---
# Discussion

**Which number in your business is still estimated by hand?**

What would you need to predict it?

www.inno-it.es
