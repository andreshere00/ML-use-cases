---
theme: "./theme"
title: "Machine learning in real companies"
info: "Three real machine learning use cases: regression (idealista), clustering (Spotify) and a system that combines them (Uber). InnoIT template."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-real-world-ml"
layout: "cover"
---
# Machine learning<br>**in real companies**

Predict, group and combine: from idealista and Spotify to the Uber simulator

InnoIT

<!-- Storyline: we start with two simple, complete cases (predicting a number with idealista, discovering groups with Spotify) and finish with a system that combines them (Uber). The first two include an interactive demo; the third is a step-by-step walkthrough with synthetic numbers. -->
---
layout: "agenda"
---
# Contents

1. Objectives
2. Prediction: idealista
3. Classification and clustering: Spotify
4. Putting it together: the Uber simulator
5. Conclusions and next steps

<div class="agenda-note">Three real cases, from simple to integrated. The demo figures are synthetic.</div>
---
layout: "two-cols"
---
# Objectives

::left::

## What we will learn

Tell **predicting a value** (regression) apart from **discovering groups** (clustering) and what each task is for.

See how real companies do it: idealista values properties and Spotify segments users.

See how **several techniques combine** in one system: Uber dynamic pricing.

::right::

## What you take away

A way to read any use case: **data → model → decision**.

A numeric example of each technique, to see how it works inside.

The limits of each approach: what data it needs, how it is validated and what can go wrong.

<!-- The objectives are about understanding, not implementation. The demos and examples use synthetic data; the sources describe each company's documented deployment. Jupyter Notebook simulations and a web app for Uber will come later. -->
---
layout: "section"
---
01

# Prediction: idealista

First task: estimate a number from the characteristics of an observation

<!-- Context. Regression is the most intuitive prediction task: given a set of attributes, estimate a continuous value. It underlies many valuation systems and, later, the sensitivity of demand to price in the Uber case. -->
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
layout: "section"
---
02

# Classification and clustering: Spotify

Second task: discover groups when there are no prior labels

<!-- Context. We move from predicting a number to organising the data. In classification the labels already exist and are learned; in clustering they do not, and the algorithm proposes the groups. Spotify uses it to segment users and understand each segment. The same principle will later group the zones of a city in the Uber case. -->
---
layout: "case"
company: "Spotify (Sweden)"
status: "Documented user-research method"
takeaway: "Clustering discovers groups that researchers can then investigate."
detail: "Spotify uses XGBoost and SHAP to explain the resulting segments."
sourceLabel: "Spotify Engineering"
source: "https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering"
---
# Clustering

::left::

## Concept

Discover groups with similar behavior without predefined group labels.

## Real use case

Spotify combines UMAP with recursive HDBSCAN to discover finer segments of users.

::right::

## Advantage

Finds unexpected segments and supports targeted user research.

## Limitation

Feature choices shape the groups. Stable clusters still need human validation.

<!--
UMAP compresses high-dimensional data. HDBSCAN discovers dense groups and can leave some observations as noise. Recursion means repeating that process within a group. Spotify then learns one-versus-all XGBoost models and uses SHAP to understand the features associated with each cluster. This source describes user segmentation and research. It does not establish that Discover Weekly uses this pipeline. Evaluate stability across samples and feature choices, then validate usefulness with researchers.

Primary source: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering

Publication: 5 Dec 2023. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->
---
layout: "solution"
diagram: "clustering"
---
# <span style="color:#1ED760">Spotify</span>: discovering and explaining groups

<!-- Interactive view: nine-stage Vue/SVG demonstration using 684 synthetic listeners, computed UMAP/HDBSCAN fits, XGBoost surrogates and exact native TreeSHAP. No Spotify user data or internal parameters. The PDF retains the overview diagram. Companion files: spotify-clustering.html, spotify-clustering-walkthrough.pdf and SPOTIFY-EXPLORER.md. Company logo: official Spotify press kit, https://newsroom.spotify.com/media-kit/logo-and-brand-assets/ .

Spotify recursively reruns UMAP and HDBSCAN on the original data points of a selected cluster. It trains one-versus-all XGBoost models on the original features and resulting cluster labels, then uses SHAP for explanation. This is not a diagram of Discover Weekly.
Source: https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "section"
---
03

# Putting it together: the Uber simulator

A real system does not use one technique, but several chained together
---
layout: "two-cols"
---
# From two cases to a complete system

::left::

## What we have seen

**Regression** (idealista): estimate a continuous value from attributes.

**Clustering** (Spotify): group similar observations without labels.

::right::

## What Uber adds

**Time series**: forecast the demand of the next minutes.

**A control loop**: correct the price every few minutes until supply and demand balance.

<!-- Transition. Uber is not a new technique, it is an example of how several are orchestrated: two of them we already know (regression and clustering). The two new ones are time series and a feedback loop. The whole numeric example is synthetic: Uber does not publish its models. -->
---
layout: "problem"
subtitle: "In every zone and every few minutes, demand and drivers almost never match"
caption: "The challenge is not just to predict: it is to balance supply and demand before the gap hurts everyone."
sourceLabel: "Shuaib Ullattil, Medium (5 Feb 2026)"
source: "https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1"
---
# <span style="color:#000">Uber</span>: the problem

<!--
Overview of the problem. Uber connects, in real time, whoever asks for a ride with the nearest driver. Demand depends on the time and day, the weather, events and traffic, and it changes within minutes. The article describes two mismatches: if demand exceeds supply, waits and cancellations go up and satisfaction goes down; if supply exceeds demand, drivers make fewer trips, earn less and may log off.

The numbers in the diagram (165 requests and 110 drivers in Downtown, Friday at 18:00) are a synthetic example kept throughout the presentation. They are not Uber data.
Source: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1
-->
---
layout: "case"
company: "Uber (global presence)"
status: "Explanatory case study; Uber's real models are proprietary"
takeaway: "Price works as a signal that balances the system, not just as a way to charge more."
detail: "The article publishes no real figures or architecture: the numbers in this deck are synthetic."
sourceLabel: "Shuaib Ullattil, Medium (5 Feb 2026)"
source: "https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1"
---
# Dynamic pricing and demand

::left::

## Concept

Predict demand per zone and adjust the price in real time.

## Real use case

Time series, clustering and regression to set the dynamic price.

::right::

## Advantage

Shorter waits and a more stable driver supply.

## Limitation

Sharp surges feel unfair and require sensitive data.

<!--
The article is an explanatory description of a Big Data and data mining case study. It names four techniques: regression (sensitivity of demand to price), clustering (zones with similar behaviour), time series (patterns by hour, day and season) and predictive analytics (history plus real-time data). It does not state specific algorithms, parameters, improvement figures or architecture. The following slides rebuild each technique in its simplest possible version with synthetic data, to understand how it works, not how Uber implements it.

Main source: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1

Published: 5 Feb 2026. Consulted: 10 November 2026.
The advantages and limitations are didactic analysis points, unless explicitly attributed.
-->
---
layout: "table"
class: "summary-table"
---
# The starting data

| Source | What it contains | What it is for |
|---|---|---|
| Requests and trips | Pickup, drop-off, time, duration, route, cancellations and payments | Measure real demand and its history |
| Phone GPS | Position and speed of each driver, every few seconds | Know supply and traffic in real time |
| External context | Weather, road closures and local events | Anticipate peaks that history does not explain |
| App usage | Ratings, cancellations and comments | Understand behaviour and satisfaction |

Volume, variety and velocity: the three "V"s of Big Data. Source: Shuaib Ullattil, Medium (5 Feb 2026).

<!--
The article lists these sources: data for each request (pickup and drop-off coordinates, timestamps, estimated duration, route, driver status), interaction data (app usage, cancellations, ratings, payments), high-frequency GPS signals and external sources (weather, road closures, events). The text points to volume (millions of trips a day), variety (structured records, location traces and comments) and velocity (real-time decisions).
-->
---
layout: "solution"
diagram: "uberPipeline"
---
# <span style="color:#000">Uber</span>: from data to price

<!-- Functional reconstruction based on the article's description: trip data, GPS and external context are aggregated per zone and over short intervals; three families of models feed a pricing engine that decides the multiplier; the price changes the behaviour of riders and drivers, and that generates new data. The position of the boxes does not represent the topology of Uber's real deployment, which is not public.
Source: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1 -->
---
layout: "section"
---
Algorithms

# Four pieces, step by step

Each one with a synthetic numeric example: Downtown, Friday 18:00, with rain.
---
layout: "walk"
step: 1
subtitle: "Forecast of Downtown demand between 18:00 and 18:15"
note: "Synthetic data. Uber does not publish its models: a weighted seasonal average with adjustments is used here, the simplest form of a time series."
---
# Time series: how many trips will there be?

::steps::

1. **Look at the past.** Requests at that time over the last 4 Fridays: 120, 132, 128 and 140.
2. **Weight.** Recent Fridays count more: 0.1·120 + 0.2·132 + 0.3·128 + 0.4·140 = <em>132.8</em>.
3. **Adjust for context.** A model learned that rain adds ≈18% demand: 132.8 × 1.18 = <em>156.7</em>.
4. **Correct live.** In the first 5 min there are 58 requests against 52 expected (+11%). Half is applied: 156.7 × 1.055 = <em>165</em>.

::viz::

<TimeSeriesViz />

<!--
Algorithm 1: time series. This is the technique that captures recurring patterns by hour, day and season. Here its simplest version is used: a weighted average of the same moments in previous weeks (weighted seasonal naive), a context multiplier (rain, learned from history) and a correction with live data (what the article calls predictive analytics: history plus streaming).

Calculations: 0.1·120 + 0.2·132 + 0.3·128 + 0.4·140 = 132.8. 132.8 × 1.18 = 156.7. Expected in 5 minutes: 156.7 / 3 = 52.2. Observed: 58, that is +11.0%. Half of the deviation is applied (+5.5%): 156.7 × 1.0552 = 165.4. In practice, models such as ARIMA, exponential smoothing or neural networks with many more variables are used.
-->
---
layout: "viz"
step: 2
subtitle: "k-means groups zones by their demand profile (k = 3)"
note: "Synthetic data for nine zones (A–I). Each zone is described by two numbers; the groups emerge from the data, with no prior labels. Zones in the same group share a pattern: they are forecast together and it is anticipated where to send drivers."
---
# Clustering: what kind of zone is it?

::viz::

<KMeansViz />

<!--
Algorithm 2: clustering with k-means. Each zone is represented by two numbers: what percentage of its demand falls in the morning rush hour and what percentage after midnight. Steps: 1) choose k initial centres; 2) assign each zone to the nearest centre (Euclidean distance); 3) move each centre to the mean of its zones; 4) repeat until no assignment changes.

The initial centres are badly placed on purpose (two in the business zone) to show that the algorithm corrects itself: iteration 1, centres at (38, 9), (55, 6) and (10, 42.7); iteration 2, centres at (30, 12.7), (51.7, 4.3) and (10, 42.7); the third changes nothing. Choosing k and the variables is a human decision; in practice several k are tried and validated with operations experts.
-->
---
layout: "walk"
step: 3
subtitle: "Sensitivity of demand to price and equilibrium price"
note: "Synthetic data. The supply response (+60% drivers for every +1.0×) is a didactic hypothesis; in practice it is also estimated from data."
---
# Regression: demand versus price

::steps::

1. **Gather (price, demand) pairs.** Six historical levels: at 1.0× demand is 100%; at 1.5×, 79%; at 2.5×, 47%.
2. **Choose the shape.** Demand falls exponentially: <code>demand(m) = base · e^(−β·(m−1))</code>.
3. **Fit by least squares** on ln(demand): <em>β = 0.51</em>, R² = 0.999. Each +1.0× removes ≈40% of demand.
4. **Find the equilibrium.** Demand(m) = supply(m): 165·e^(−0.51(m−1)) = 110·(1 + 0.6(m−1)) → <em>m* = 1.39×</em>, about 136 trips.

::viz::

<RegressionViz />

<!--
Algorithm 3: regression. A line is fitted on the logarithm of demand against the multiplier (log-linear regression): ln(demand) = a − β(m − 1). With the six synthetic observations (m = 1.0, 1.2, 1.5, 1.8, 2.0, 2.5 and demand 100, 92, 79, 68, 61, 47% of the base) we get β = 0.507 and R² = 0.999. Each 1.0× increase multiplies demand by e^(−0.507) = 0.60, that is, it removes 40%.

The base of 165 requests comes from algorithm 1. Supply grows 60% for every +1.0× of multiplier (didactic hypothesis). The equilibrium is solved numerically (bisection): m* = 1.387, with demand = supply = 135.6 trips. At the normal price 55 drivers were missing; at 1.39× about 136 of the 165 trips are served (the rest wait, cancel or choose another option).
-->
---
layout: "walk"
step: 4
subtitle: "Feedback control: the price is corrected every 5 minutes until it balances"
note: "Synthetic simulation with the demand and supply of the example. When demand drops at 18:30, the multiplier returns to 1.00× on its own."
---
# Price loop: adjust every 5 minutes

::steps::

1. **Measure.** Every 5 min: R = demand / drivers. At 18:00, 165 / 110 = <em>1.50</em>.
2. **Correct the price.** <code>m ← m + 0.8·(R − 1)</code>, between 1.0× and 3.0×: 1.00 + 0.8·0.50 = <em>1.40×</em> from 18:05.
3. **Let it react.** Some riders wait and drivers move closer. At 18:05, R = 1.09 → <em>1.47×</em>.
4. **Repeat and relax.** It settles at ≈1.4×. When demand falls (R &lt; 1) the price drops to 1.00× at 18:45.

::viz::

<PricingLoopViz />

<!--
Algorithm 4: feedback loop, which is what the article describes as an "automatic real-time decision process". Every 5 minutes R = demand / supply is computed in the zone. If R > 1 the multiplier goes up; if R < 1 it goes down. The gain 0.8 controls the speed (too high causes oscillations, too low reacts late). The multiplier is bounded between 1.0 and 3.0.

Simulation: demand depends on price through the curve of algorithm 3 and drivers move toward the supply target at half of the distance per 5-minute step. Demand base per tick: 165 until 18:25, 130 at 18:30, 110 at 18:35 and 100 afterwards. Resulting multiplier: 1.00, 1.40, 1.47, 1.46, 1.43, 1.40, 1.39, 1.22, 1.02, 1.00. R: 1.50, 1.09, 0.98, 0.96, 0.97, 0.98, 0.78, 0.76, 0.82, 0.87. In reality the price is smoothed, capped and shown rounded.
-->
---
layout: "solution"
diagram: "uberExample"
---
# A Friday at 18:00, end to end

<!-- Full walk-through of the example with synthetic figures, consistent with the previous slides. The time series forecasts 165 requests with rain; clustering places Downtown among the business zones; the regression gives an equilibrium of 1.39 with about 136 trips; the loop raises the multiplier to 1.40 in five minutes and settles near 1.4; with a base fare of 12.00 euros the rider sees 16.80 euros. The base fare of 12 euros is also fictitious.
Source: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1 -->
---
layout: "two-cols"
---
# Challenges and ethics

::left::

## Privacy

Real-time locations of riders and drivers: they require consent, security and data governance.

## Perception of fairness

Raising prices in emergencies or bad weather feels abusive, even if it balances the system.

::right::

## Technical scale

Streams from millions of users with low latency; models are monitored and retrained.

## Ideas to mitigate

A cap on the multiplier, a price shown before confirming and clear notices to the user.

<!--
The three challenges (privacy, perception of fairness and technical scale) come from the article. The mitigation ideas are didactic proposals for discussion, not measures that the article attributes to Uber.
Source: https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1
-->
---
layout: "two-cols"
---
# Conclusions and next steps

::left::

## Conclusions

**Regression** estimates a number, but does not guarantee a sale price.

**Clustering** discovers groups without labels, and the groups need validation.

**Real systems combine techniques**: Uber chains time series, clustering, regression and a control loop.

::right::

## Next steps

**Jupyter notebooks** to simulate each case step by step.

**A web app** that simulates the behaviour of Uber dynamic pricing.

Try the ideas with your own data and measure the impact on a specific decision.

<!-- The conclusions are didactic analysis, not claims by the companies. The next steps (notebooks and web app) will be covered later. -->
---
layout: "default"
class: "references-slide"
---
# Sources

<div class="references"><div class="reference-item"><div class="reference-company">idealista/data <span>Regression analysis</span></div><a href="https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/">idealista/data</a><span class="reference-date"> · 17 Feb 2021</span></div><div class="reference-item"><div class="reference-company">Spotify <span>Clustering</span></div><a href="https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering">Spotify Engineering</a><span class="reference-date"> · 5 Dec 2023</span></div><div class="reference-item"><div class="reference-company">Uber <span>Dynamic pricing and demand</span></div><a href="https://medium.com/@shuaibullattil7768/how-uber-uses-data-mining-to-handle-dynamic-pricing-and-ride-demand-f69548be14e1">Shuaib Ullattil, Medium</a><span class="reference-date"> · 5 Feb 2026</span></div></div>

<div class="reference-note">Explanatory or company sources. The demo data and the Uber example are synthetic. Consulted from 19 October to 10 November 2026.</div>
---
layout: "end"
---
# Thank you

**Which decision in your company could rely on one of these three approaches?**

www.inno-it.es
