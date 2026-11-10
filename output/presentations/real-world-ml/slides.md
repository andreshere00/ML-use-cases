---
theme: "./theme"
title: "Machine learning in real companies"
info: "Real enterprise use cases across machine learning, deep learning and GenAI. InnoIT template."
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

Real use cases, concepts and trade-offs

InnoIT · 19 October 2026

---
layout: "agenda"
---
# Learning path

1. Machine learning foundations
2. Deep learning and image generation
3. GenAI systems and agentic workflows

<div class="agenda-note">12 requested topics. 15 cases, a solution diagram for each, and an integrated BBVA Blue closing example.</div>

---
layout: "two-cols"
---
# A guide to the examples

::left::

## Tasks and implementations

Classification, clustering and forecasting describe tasks. Several algorithm families can solve each one.

RAG and agent orchestration describe systems that combine models with other software.

::right::

## How to read each case

Each case covers the concept, real workflow, advantages, limitations and a one-sentence takeaway.

Sources describe the documented deployment at the time of publication. Trade-offs are teaching analysis.

<!-- The order follows conceptual learning difficulty. Companies often combine classical methods, neural networks and generative models. An earlier task can already have a neural implementation. “Multicategoría” is interpreted as multilabel classification, distinct from mutually exclusive multiclass labels. Sources were checked on 19–20 October 2026. -->

---
layout: "section"
---
01

# Machine learning foundations

Relationships, labels, groups and numerical predictions

---
layout: "case"
company: "Walmart (United States)"
status: "Production recommendation system"
takeaway: "Products bought together can inform products recommended together."
detail: "Walmart evaluated FP-Growth, then selected simpler pairwise co-occurrence rules for scale."
sourceLabel: "Walmart Global Tech"
source: "https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f"
---
# Association rules

::left::

## Concept

Find items that appear together more often than chance would suggest.

## Real use case

Walmart mines baskets for complementary product pairs and uses the relationships in recommendations.

::right::

## Advantage

Readable rules can support cross-selling without labeled outcomes.

## Limitation

Popularity and promotions distort co-occurrence. A relationship does not prove causation.

<!--
Association rules describe conditional co-occurrence. Support = P(A and B). Confidence = P(B given A). Lift = P(B given A) / P(B). Lift above 1 indicates positive association against independence. Apriori and FP-Growth are common frequent-itemset algorithms. Walmart evaluated distributed FP-Growth but selected a pairwise probability approach. No revenue uplift is claimed here. Evaluation: minimum support, lift and an online recommendation experiment.

Primary source: https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f

Publication: 24 Aug 2022. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "association"
---
# Walmart: basket associations

<!-- Functional reconstruction of the published batch and lookup workflow. The current-product lookup illustrates how the association table can serve recommendations; the source does not publish the online API. GMV = gross merchandise value. No numerical lift or revenue result is invented.
Source: https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "table"
class: "classification-table"
---
# Three classification outputs

| Task | Labels per observation | Illustrative output |
| --- | --- | --- |
| Binary | One of two | Legitimate or bot traffic |
| Multiclass | One of several | One expense category |
| Multilabel | Several may apply | Several product interests |

“Multicategoría” is treated here as multilabel classification. Examples illustrate the output structure.

---
layout: "case"
company: "Cabify (Spain)"
status: "Operational service via Infobip Signals"
takeaway: "A two-way prediction becomes useful when its errors have clear business costs."
detail: "Infobip reports 15.7% less AIT-related financial loss in one quarter. Model architecture is undisclosed."
sourceLabel: "Infobip customer case with Cabify testimony"
source: "https://www.infobip.com/customer/cabify"
---
# Binary classification

::left::

## Concept

Assign one of two labels, often by applying a threshold to a risk score.

## Real use case

Infobip Signals distinguishes legitimate SMS from bot traffic and blocks fraudulent requests for Cabify.

::right::

## Advantage

Automates high-volume decisions and reduces manual intervention.

## Limitation

False positives can block real customers. Attack patterns change over time.

<!--
Binary classification is the task abstraction: legitimate versus bot-generated traffic. The supplier describes an ML system that combines patterns and anomaly signals. It does not disclose a specific supervised classifier, training labels or threshold. AIT means Artificial Inflation of Traffic. The 15.7% figure describes financial loss over one quarter after fraud/authentication changes. It is a supplier-reported business result, not classification accuracy or an isolated model effect. Generic evaluation: precision, recall, PR-AUC and cost at the operating threshold.

Primary source: https://www.infobip.com/customer/cabify

Publication: Undated customer case. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "binary"
---
# Cabify: legitimate or artificial traffic

<!-- This diagram explains the actual service boundary without inventing a training architecture. Legitimate versus bot is the classification task abstraction. The source describes pattern and anomaly signals within the ML service. An allow/block policy must balance artificial traffic against rejection of genuine users.
Source: https://www.infobip.com/customer/cabify

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "case"
company: "Uber (United States)"
status: "COTA support assistant in production (2018 account)"
takeaway: "A ticket gets one issue category, with a human confirming the model’s suggestions."
detail: "Issue identification is separate from COTA’s solution-ranking task."
sourceLabel: "Uber Engineering"
source: "https://www.uber.com/us/en/blog/cota/"
---
# Multiclass classification

::left::

## Concept

Choose one category from three or more mutually exclusive alternatives.

## Real use case

Uber COTA predicts support issue types from ticket text and trip context, helping agents select the right category.

::right::

## Advantage

Reduces the effort of navigating a large support taxonomy.

## Limitation

Similar issues and rare categories can confuse the classifier.

<!--
This case isolates issue-type identification. The 2018 account describes a random-forest baseline and a later neural alternative. COTA presents three likely issue types for human selection. Its separate solution ranker scores ticket-solution pairs with binary random forests. Do not treat those ranked solutions as simultaneous class labels. The source describes historical deployment. Evaluate macro-F1, rare-class recall and top-k accuracy.

Primary source: https://www.uber.com/us/en/blog/cota/

Publication: 3 Jan 2018. Checked: 20 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "multiclass"
---
# Uber COTA: identifying a support issue

<!-- Functional view of the historical COTA issue-identification workflow. The solution-ranking stage is explicitly separate. TF-IDF and LSA describe the documented text pipeline. This view omits storage and refresh logic.
Source: https://www.uber.com/us/en/blog/cota/

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "case"
company: "Amazon Retail (United States)"
status: "Production customer propensity inference"
takeaway: "The same customer can belong to several useful categories at once."
detail: "Amazon describes MXNet models with Spark and Deep Java Library inference."
sourceLabel: "Amazon / AWS Open Source Blog"
source: "https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/"
---
# Multilabel classification

::left::

## Concept

Assign zero, one or several labels to the same observation.

## Real use case

Amazon predicts customer action propensities across thousands of product categories, allowing overlapping interests.

::right::

## Advantage

Represents overlapping interests without forcing a single segment.

## Limitation

Rare labels and different thresholds make training and evaluation harder.

<!--
We interpret the requested “multicategoría” as multilabel classification, the standard English term for non-exclusive labels. Binary relevance is a common baseline that trains one binary model per label. Neural models can share a representation across labels. Amazon documents a multilabel customer action propensity task; this does not mean one hard label for every category. Evaluate per-label precision/recall, micro-F1 and precision at k. Independent thresholds need calibration.

Primary source: https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/

Publication: 14 Jul 2020. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "multilabel"
---
# Amazon: thousands of propensities

<!-- Amazon documents sparse, high-dimensional customer features, per-category binary action labels, MXNet training in Python and Spark/DJL serving in Java or Scala. The diagram omits framework internals and does not imply independent category models or undisclosed score thresholds.
Source: https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
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
layout: "case"
company: "Adyen (Netherlands)"
status: "Production payment-volume monitoring"
takeaway: "An anomaly is unusual relative to a meaningful baseline."
detail: "The model captures trend, seasonality and events, with quantile regression for uncertainty bounds."
sourceLabel: "Adyen Engineering"
source: "https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes"
---
# Anomaly detection

::left::

## Concept

Flag observations that differ from the expected pattern for their context.

## Real use case

Adyen models merchant payment volumes and alerts teams when observations fall outside expected bounds.

::right::

## Advantage

Can identify rare operational problems without labeled incident examples.

## Limitation

Holidays and merchant changes cause false alerts. Sensitive thresholds increase noise.

<!--
This is a contextual time-series anomaly detector. A sudden drop at a normally busy time is more informative than a low volume at night. Adyen models trend, seasonality and events, and uses quadratic quantile regression on residuals for bounds. The company evaluated and rejected isolation forests and autoencoders for this application, so those are not the deployed methods here. Evaluate incident detection rate, false alerts and time to detection. An alert requires investigation rather than establishing a root cause.

Primary source: https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes

Publication: 9 Oct 2019. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "anomaly"
---
# Adyen: detecting a payment-volume drop

<!-- The source discloses trend/seasonal/event modeling, quadratic quantile regression on residuals, Spark training and real-time Java scoring. The interval notation is a teaching abstraction. The diagram does not claim that all anomalies are fraud or that an alert identifies a root cause.
Source: https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
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
layout: "case"
company: "Iberdrola (Spain)"
status: "Operational MeteoFlow system"
takeaway: "Forecasting turns an uncertain future into a quantified planning input."
detail: "Iberdrola documents 450+ wind and solar plants, with hourly forecasts up to 96 hours."
sourceLabel: "Iberdrola"
source: "https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project"
---
# Forecasting

::left::

## Concept

Estimate future values using time-dependent patterns and available drivers.

## Real use case

MeteoFlow combines weather and generation data, using ML to refine renewable output forecasts.

::right::

## Advantage

Supports planning when wind and solar output vary with weather.

## Limitation

Forecast uncertainty grows with the horizon and unexpected weather changes.

<!--
Regression predicts a numeric target. Forecasting adds a future horizon and temporal dependence, and can itself use regression. MeteoFlow also supplies daily forecasts up to ten days. Coverage and forecast horizons are deployment figures, not accuracy improvements. Iberdrola does not disclose the exact ML algorithm. Use rolling-origin backtesting, compare against a seasonal or persistence baseline, and measure interval coverage as well as MAE. A random train/test split can leak future information.

Primary source: https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project

Publication: Undated corporate project page. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "forecasting"
---
# Iberdrola: renewable output forecasts

<!-- The source explicitly lists global weather information, historical generation and real-time production with predictive ML. The diagram shows information dependencies without asserting a particular physical model, neural architecture or training schedule. Forecasts support energy sales and maintenance planning.
Source: https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "case"
company: "Booking.com (Netherlands)"
status: "Documented review-analysis workflow"
takeaway: "A review can praise the location while criticizing the room."
detail: "Aspect extraction identifies the subject. Sentiment analysis estimates the opinion about it."
sourceLabel: "Booking.com team / AWS Machine Learning Blog"
source: "https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/"
---
# Sentiment analysis and NLP

::left::

## Concept

Extract opinions from language and link each opinion to what it describes.

## Real use case

Booking.com links review opinions to 50+ aspects, such as cleanliness or location.

::right::

## Advantage

Makes specific praise and complaints visible across many reviews.

## Limitation

Sarcasm, mixed opinions and language differences can change interpretation.

<!--
NLP is the broader field of computational language processing. Sentiment analysis is one task within it. Aspect-based analysis separates a whole-review score into opinions about specific aspects. “Great location, noisy room” is an illustrative sentence, not an actual Booking.com review. The source documents a data-labeling and training workflow using SageMaker Ground Truth. It does not publish a causal booking uplift from this system. Evaluate aspect extraction and sentiment separately, including language-specific error analysis.

Primary source: https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/

Publication: 14 Jan 2022. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "sentiment"
---
# Booking.com: aspect-level opinions

<!-- ABSA means aspect-based sentiment analysis. Human annotators mark and link aspect spans and sentiment spans with SageMaker Ground Truth. The runtime box summarizes the task; it does not assert a specific token classifier or transformer architecture. The sample review and its outputs illustrate the task rather than quoting customer data.
Source: https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "case"
company: "ING (Netherlands)"
status: "Deployed credit-risk monitoring application"
takeaway: "Text mining turns a document stream into evidence for investigation."
detail: "ING describes processing up to 80,000 news articles per day."
sourceLabel: "ING"
source: "https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html"
---
# Text mining

::left::

## Concept

Extract structured facts and recurring signals from a large text collection.

## Real use case

ING’s Early Warning System combines signals from news and market data for credit-risk analysts.

::right::

## Advantage

Helps analysts monitor more external information than they can read manually.

## Limitation

Irrelevant or duplicated news creates noise. A signal still needs an analyst’s judgment.

<!--
Text mining focuses here on extracting and aggregating information from a corpus. It can use NLP components such as entity extraction, translation and sentiment. The distinction from the previous slide is the business output: company risk signals across many articles rather than the polarity of a review aspect. ING combines news processing with Refinitiv market data and analyst-defined alert criteria. The source treats stronger prediction capabilities as future ambition, so this slide makes no claim that the system predicts defaults. Evaluate relevance, entity-linking accuracy and analyst acceptance of alerts.

Primary source: https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html

Publication: 17 Dec 2018. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "textmining"
---
# ING: news becomes a risk watchlist

<!-- ING documents public news, Google NLP/translation, Refinitiv data and analyst-defined criteria. Example criteria include negative media coverage and a share-price decline beyond a threshold. The diagram does not assume a specific entity-linking system, classifier or probability-of-default model.
Source: https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "section"
---
02

# Deep learning

Neural networks learn visual features and generate new images

---
layout: "case"
company: "BMW Group (Germany)"
status: "Series-production applications since 2018"
takeaway: "A learned visual pattern can turn a camera image into a quality check."
detail: "Employees label component images and train a neural network."
sourceLabel: "BMW Group"
source: "https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video"
---
# Pattern recognition

::left::

## Concept

Learn visual features that identify an object or a recurring configuration.

## Real use case

At Dingolfing, BMW compares a vehicle’s model badge with its order specification and flags missing or incorrect badges.

::right::

## Advantage

Performs repeated visual checks at production speed.

## Limitation

New components and lighting conditions require representative images and monitoring.

<!--
Pattern recognition spans many modalities and is broader than deep learning. This case specifically uses a trained neural network for visual recognition. A typical vision network learns features from pixels before predicting the component identity. The software then compares that identity to an order specification. BMW explicitly documents production use. We do not repeat the source’s “100% reliability” phrase as a general benchmark. Evaluate defect recall and false-rejection rate under actual factory conditions.

Primary source: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video

Publication: 15 Jul 2019. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "patterns"
---
# BMW: image recognition checks the badge

<!-- BMW documents employee image labeling, neural-network training and comparison of live model-designation images against order data at Dingolfing. The pass/notify split is the task outcome. No CNN architecture, confidence threshold or universal accuracy claim is invented.
Source: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "image-right"
image: "/assets/bmw-inspection.jpg"
alt: "Official BMW production image illustrating a visual inspection system"
class: "inspection-visual"
---
# BMW visual inspection

The camera observes a vehicle component.

**The neural network recognizes it**

Software compares the result with the order specification and flags a mismatch.

<div class="photo-credit">BMW Group production photo. Source: BMW Group, 15 July 2019.</div>

<!-- Image credit and source: https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video . The image illustrates BMW production inspection, not an independently measured accuracy benchmark. -->

---
layout: "case"
company: "Mango (Spain)"
status: "Published Mango Teen campaign"
takeaway: "Generate new imagery while preserving the real product’s characteristics."
detail: "Mango names no specific model architecture. Diffusion and GANs are general examples, not confirmed choices."
sourceLabel: "Mango Fashion Group"
source: "https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen"
---
# Image generation

::left::

## Concept

Generate new images using learned visual structure.

## Real use case

Mango created Sunset Dream using real garment photos, a generative model and human selection and retouching.

::right::

## Advantage

Expands creative options and supports repeatable production workflows.

## Limitation

Product fidelity and editorial quality still require human art direction.

<!--
Deep learning is the underlying technology family. Image generation is already generative AI, so it bridges the two sections. Diffusion models learn to reverse a noise process. GANs train a generator against a discriminator. These definitions illustrate algorithm families and are not claims about Mango’s implementation. The published campaign used real product photos and human editing. No time, cost or conversion improvement is claimed. Review garment fidelity, visible artifacts, usage rights and editorial suitability.

Primary source: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen

Publication: 10 Jul 2024. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "imagegen"
---
# Mango: real garments to campaign images

<!-- This diagram follows the July 2024 release: real garment photographs, generative model training, generation, art-team selection and photography-studio finishing. It does not introduce an undisclosed prompt pipeline or suggest that product quality checks are fully automated.
Source: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "image-right"
image: "/assets/mango-campaign.jpg"
alt: "Official Mango Teen Sunset Dream campaign image generated with AI"
---
# Mango Teen: Sunset Dream

A published campaign created with generative AI in July 2024.

**Real garment photographs anchor the work**

Mango’s art team selects and retouches generated images to preserve product detail and editorial quality.

<div class="photo-credit">Official campaign image. Credit: Mango Fashion Group.</div>

<!-- Campaign image source: https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen . This is a real published AI-generated campaign asset, not a photo of an actual campaign shoot. -->

---
layout: "section"
---
03

# GenAI systems

Retrieval, multimodal generation and coordinated tool use

---
layout: "two-cols"
class: "process-slide"
---
# What RAG adds to a language model

::left::

## Retrieval

1. Read the employee’s question.
2. Search the authorized knowledge base.
3. Select relevant document passages.

::right::

## Grounded generation

4. Give the model the retrieved evidence.
5. Generate an answer with sources.
6. Check the answer or escalate.

<!-- Simplified teaching workflow for retrieval-augmented generation, informed by the Allianz EKA source and BBVA information-agent technical account: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html and https://www.bbvaaifactory.com/our-rag-based-information-agent/ . Retrieval can use keywords, embeddings or a hybrid. Access controls must apply before content reaches the model. RAG does not itself guarantee correctness. -->

---
layout: "case"
company: "Allianz (Germany)"
status: "EKA live at Allianz Leben from July 2024"
takeaway: "Retrieve the evidence first, then generate a grounded answer."
detail: "Allianz reports over 90% accuracy on common queries, without publishing the benchmark methodology."
sourceLabel: "Allianz"
source: "https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html"
---
# Intelligent search with RAG

::left::

## Concept

Retrieve relevant knowledge before an LLM generates an answer.

## Real use case

Allianz EKA searches AWISO, summarizes relevant knowledge and links call-center staff to full sources.

::right::

## Advantage

Makes internal knowledge easier to access and inspect.

## Limitation

Missing retrieval results and outdated documents can still produce wrong answers.

<!--
RAG means retrieval-augmented generation. It is a system architecture, not one algorithm or a guarantee of factual accuracy. EKA also includes fine-tuning and multi-agent elements; this slide isolates its documented RAG role. The source says the pilot began in July 2023 and went live at Allianz Leben one year later. The reported accuracy applies to common queries; it is not a universal correctness score. Evaluate retrieval recall, groundedness and end-to-end task correctness. Source links support verification.

Primary source: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html

Publication: 7 Feb 2025. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "rag"
---
# Allianz: retrieval grounds the answer

<!-- Allianz documents paragraph chunking, relevant-document retrieval, summaries, highlights and links to full documents, alongside staff feedback. The knowledge box is not a claim about a particular vector database. Feedback supports refinement; automatic model retraining is not implied.
Source: https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "case"
company: "Google (United States)"
status: "Veo 3 launched in Google Vids (June 2025)"
takeaway: "One prompt can generate both the moving scene and its accompanying sound."
detail: "The launch release documents 8-second clips. This is a shipped product capability."
sourceLabel: "Google Workspace Updates"
source: "https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html"
---
# Multimodal generation

::left::

## Concept

Generate related content across modalities, such as video and sound.

## Real use case

Google Vids uses Veo 3 to turn a text prompt into a video clip with sound, ready to preview and insert.

::right::

## Advantage

Creates an audiovisual draft without filming or recording a first version.

## Limitation

Visual continuity, speech and factual details still need human review.

<!--
Modality means a form of information, such as text, image, audio or video. This product generates video and sound with Veo 3. The June 2025 launch account specifies 8-second clips and a prompt, preview, insert workflow. Users can mute audio after insertion. Training and product-demo prompts in the source are illustrative examples, not named customer deployments. This case concerns Google’s released product, rather than a claim about its internal marketing. Evaluate audiovisual consistency and accuracy against the brief.

Primary source: https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html

Publication: 9 Jun 2025. Checked: 20 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "multimodal"
---
# Google Vids: generating video and sound

<!-- Product workflow from the Google Vids launch release. A single generation step produces video and sound. These boxes describe the user workflow, rather than an undocumented model architecture.
Source: https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "two-cols"
class: "process-slide"
---
# What an orchestrator coordinates

::left::

## Request and routing

1. Interpret the goal and context.
2. Select a relevant specialist or tool.
3. Request clarification when needed.

::right::

## Action and feedback

4. Execute the authorized operation.
5. Inspect the result and update state.
6. Reply, retry or hand over to a person.

<!-- A conceptual workflow, not a literal BBVA architecture diagram. Source for the real implementation on the next slide: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/ . Agentic systems need explicit boundaries around tools, permissions, confirmations and cancellation. A fixed workflow with an LLM step can be useful without full autonomy. -->

---
layout: "case"
company: "BBVA (Spain)"
status: "Blue assistant deployed in Spain in 2025"
takeaway: "Agents become operationally useful when the right tool can carry out the task."
detail: "BBVA describes filtering 150+ operations to around 5–6 candidates before routing."
sourceLabel: "BBVA AI Factory and BBVA rollout announcement"
source: "https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/"
---
# Agentic workflow orchestration

::left::

## Concept

Coordinate specialized agents and tools to complete a bounded task.

## Real use case

Blue routes requests to a banking tool, an information agent or a clarification step.

::right::

## Advantage

Connects conversational requests to defined account and card operations.

## Limitation

Routing errors can select the wrong workflow. Permissions and confirmations matter.

<!--
An agent combines model-based decisions with tools and state. Orchestration coordinates those parts, including specialization and handoffs. Blue represents banking operations as callable tools and loads a shortlist of descriptions for routing. The technical article describes multiple agent roles, not merely a scripted chatbot. The rollout announcement scheduled availability in Spain from 20 February 2025. Evaluate successful completion, wrong-tool rate, unauthorized actions and escalation quality. The numbered workflow on the preceding slide is a teaching abstraction, not a literal architecture diagram.

Primary source: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/
Additional primary source: https://www.bbva.com/en/innovation/for-the-first-time-in-spain-bbva-will-offer-ai-powered-account-and-card-management-with-its-virtual-assistant/
Publication: 13 Nov 2025 technical account. Checked: 19 October 2026.
Advantages and limitations are analytical teaching points unless explicitly attributed.
-->

---
layout: "solution"
diagram: "agents"
---
# BBVA Blue: routing a banking request

<!-- BBVA explicitly describes a classification/routing agent, preliminary operation filtering, function calling and multiple agent roles. Clarification and out-of-scope fallback responses are distinct functions, grouped in this view to preserve legibility. Source: routing technical article, 13 November 2025.
Source: https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/
Additional source: https://www.bbva.com/en/innovation/for-the-first-time-in-spain-bbva-will-offer-ai-powered-account-and-card-management-with-its-virtual-assistant/
Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->
---
layout: "table"
class: "summary-table"
---
# Method selection: structured outputs

| Business question | Method | Case |
| --- | --- | --- |
| What occurs together? | Association rules | Walmart |
| Which of two outcomes? | Binary classification | Cabify |
| Which single category? | Multiclass classification | Uber |
| Which overlapping labels? | Multilabel classification | Amazon |
| Which groups emerge? | Clustering | Spotify |
| What deviates from normal? | Anomaly detection | Adyen |
| What numeric value? | Regression | idealista |
| What future value? | Forecasting | Iberdrola |

The output and business decision determine the task.

---
layout: "table"
class: "summary-table"
---
# Method selection: language and GenAI

| Business question | Method | Case |
| --- | --- | --- |
| What is the opinion about? | Sentiment and NLP | Booking.com |
| What signals occur in text? | Text mining | ING |
| What visual pattern is present? | Pattern recognition | BMW |
| What image can we create? | Image generation | Mango |
| What do our documents say? | Search with RAG | Allianz |
| Can a prompt yield video and sound? | Multimodal generation | Google |
| Can software complete the task? | Agent orchestration | BBVA |

Image generation uses deep learning and is already a form of GenAI.

---
layout: "default"
---
# Business value and model quality

A useful model changes a decision or makes a workflow easier.

- **Classification:** precision and recall reflect different error costs.
- **Prediction:** backtests need realistic time and data boundaries.
- **GenAI systems:** correct retrieval or fluent text alone does not prove task success.
- **Every method:** deployment needs ownership, monitoring and a clear fallback.

<!-- These are analytical takeaways, not new claims of company outcomes. Classification errors have different business costs, illustrated by Cabify fraud filtering. Forecasting requires temporal backtesting. For GenAI, measure end-to-end task success and compare it with a simple baseline. -->

---
layout: "default"
class: "references-slide"
---
# Sources 1 of 3

<div class="references"><div class="reference-item"><div class="reference-company">Walmart <span>Association rules</span></div><a href="https://medium.com/walmartglobaltech/scaling-product-recommendations-using-basket-analysis-part-1-8434d4f8756f">Walmart Global Tech</a><span class="reference-date"> · 24 Aug 2022</span></div><div class="reference-item"><div class="reference-company">Cabify <span>Binary classification</span></div><a href="https://www.infobip.com/customer/cabify">Infobip customer case with Cabify testimony</a><span class="reference-date"> · Undated customer case</span></div><div class="reference-item"><div class="reference-company">Uber <span>Multiclass classification</span></div><a href="https://www.uber.com/us/en/blog/cota/">Uber Engineering</a><span class="reference-date"> · 3 Jan 2018</span></div><div class="reference-item"><div class="reference-company">Amazon Retail <span>Multilabel classification</span></div><a href="https://aws.amazon.com/blogs/opensource/how-amazon-retail-systems-run-machine-learning-predictions-with-apache-spark-using-deep-java-library/">Amazon / AWS Open Source Blog</a><span class="reference-date"> · 14 Jul 2020</span></div><div class="reference-item"><div class="reference-company">Spotify <span>Clustering</span></div><a href="https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering">Spotify Engineering</a><span class="reference-date"> · 5 Dec 2023</span></div></div>

<div class="reference-note">Primary company or implementation-partner sources. Additional links appear in speaker notes. Checked 19–20 October 2026.</div>

---
layout: "default"
class: "references-slide"
---
# Sources 2 of 3

<div class="references"><div class="reference-item"><div class="reference-company">Adyen <span>Anomaly detection</span></div><a href="https://www.adyen.com/en_GB/knowledge-hub/monitoring-payment-volumes">Adyen Engineering</a><span class="reference-date"> · 9 Oct 2019</span></div><div class="reference-item"><div class="reference-company">idealista/data <span>Regression analysis</span></div><a href="https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/">idealista/data and idealista labs</a><span class="reference-date"> · Product page and 17 Feb 2021 engineering post</span></div><div class="reference-item"><div class="reference-company">Iberdrola <span>Forecasting</span></div><a href="https://www.iberdrola.com/about-us/our-innovation-model/meteoflow-project">Iberdrola</a><span class="reference-date"> · Undated corporate project page</span></div><div class="reference-item"><div class="reference-company">Booking.com <span>Sentiment analysis and NLP</span></div><a href="https://aws.amazon.com/blogs/machine-learning/labeling-text-for-aspect-based-sentiment-analysis-using-sagemaker-ground-truth/">Booking.com team / AWS Machine Learning Blog</a><span class="reference-date"> · 14 Jan 2022</span></div><div class="reference-item"><div class="reference-company">ING <span>Text mining</span></div><a href="https://ing.com/news/2020/07/using-ai-to-assess-credit-risk.html">ING</a><span class="reference-date"> · 17 Dec 2018</span></div></div>

<div class="reference-note">Primary company or implementation-partner sources. Additional links appear in speaker notes. Checked 19–20 October 2026.</div>

---
layout: "default"
class: "references-slide"
---
# Sources 3 of 3

<div class="references"><div class="reference-item"><div class="reference-company">BMW Group <span>Pattern recognition</span></div><a href="https://www.press.bmwgroup.com/global/article/detail/T0298650EN/fast-efficient-reliable:-artificial-intelligence-in-bmw-group-production?showMedia=video">BMW Group</a><span class="reference-date"> · 15 Jul 2019</span></div><div class="reference-item"><div class="reference-company">Mango <span>Image generation</span></div><a href="https://mangofashiongroup.com/en/w/mango-crea-la-primera-campa%C3%B1a-generada-con-inteligencia-artificial-para-su-l%C3%ADnea-teen">Mango Fashion Group</a><span class="reference-date"> · 10 Jul 2024</span></div><div class="reference-item"><div class="reference-company">Allianz <span>Intelligent search with RAG</span></div><a href="https://www.allianz.com/en/mediacenter/news/articles/250207-allianz-ai-enterprise-knowledge-assistant-enhances-productivity.html">Allianz</a><span class="reference-date"> · 7 Feb 2025</span></div><div class="reference-item"><div class="reference-company">Google <span>Multimodal generation</span></div><a href="https://workspaceupdates.googleblog.com/2025/06/generate-video-clips-with-sound-using-veo3-google-vids.html">Google Workspace Updates</a><span class="reference-date"> · 9 Jun 2025</span></div><div class="reference-item"><div class="reference-company">BBVA <span>Agentic workflow orchestration</span></div><a href="https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/">BBVA AI Factory and BBVA rollout announcement</a><span class="reference-date"> · 13 Nov 2025 technical account</span></div></div>

<div class="reference-note">Primary company or implementation-partner sources. Additional links appear in speaker notes. Checked 19–20 October 2026.</div>

---
layout: "solution"
diagram: "integrated"
---
# BBVA Blue: knowledge and actions

<!-- Integrated functional reconstruction from BBVA AI Factory’s routing article (13 November 2025) and RAG information-agent article (18 December 2025). The RAG article explicitly documents conversation reformulation, query/FAQ-title embeddings, cosine similarity and FAQ-grounded generation. It also separates general information from customer-specific operations. Payment and balance are examples named in the routing article. No anomaly detector, forecasting model or sentiment classifier is assumed to be inside Blue.
Sources: https://www.bbvaaifactory.com/our-rag-based-information-agent/
https://www.bbvaaifactory.com/the-routing-agent-a-key-component-for-agentic-ai-assistants/ -->
---
layout: "end"
---
# Discussion

**Which business decision needs a better input?**

A rule, a prediction, generated content or a completed task?

www.inno-it.es
