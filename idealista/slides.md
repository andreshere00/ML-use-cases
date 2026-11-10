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
