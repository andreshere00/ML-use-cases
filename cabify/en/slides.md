---
theme: "./theme"
title: "Cabify: legitimate or artificial traffic"
info: "Cabify: legitimate or artificial traffic. InnoIT template."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-ml-use-case-cabify"
layout: "cover"
---
# <span style="color:#7145D6">Cabify</span><br>**legitimate or artificial traffic**

Binary classification and a blocking threshold, explained step by step

InnoIT · ML use case

---
layout: "problem"
subtitle: "Every verification SMS costs money, whether a person or a bot asked for it"
caption: "Both mistakes cost money. The blocking threshold decides which one you accept more often."
sourceLabel: "Infobip customer case with Cabify testimony"
source: "https://www.infobip.com/customer/cabify"
labels:
  aria: "Diagram: real customers and bots send verification requests, a classifier allows or blocks each one, and each combination of request and decision has a different cost."
  sourcePrefix: "Source:"
  laneRequests: "Requests arrive"
  laneDecision: "Decision"
  laneOutcome: "Outcome"
  genuine: "Real customer"
  genuineNote: "One request,\nenters the code"
  bot: "Bot"
  botNote: "Hundreds of requests,\ncodes never entered,\nhigh-cost routes"
  gate: "Allow or block?"
  gateNote: "Infobip Signals\nscores each request"
  low: "low risk"
  high: "high risk"
  allow: "Allowed"
  block: "Blocked"
  rowGenuine: "Real\ncustomer"
  rowBot: "Bot"
  gaTitle: "Signs up"
  gaNote: "The cost is\njustified"
  gbTitle: "Customer lost"
  gbNote: "A wrong\nblock"
  baTitle: "Cabify pays"
  baNote: "for every fake\nSMS (AIT)"
  bbTitle: "Loss avoided"
  bbNote: "The bot is\nstopped"
---
# <span style="color:#7145D6">Cabify</span>: the problem

<!--
Preamble to the case. A verification SMS costs money whether a person or a bot requested it. AIT means Artificial Inflation of Traffic: bots trigger large volumes of SMS, often to high-cost routes, and the company pays for messages nobody reads. Infobip Signals sits in front of that traffic and decides, for each request, whether to allow or block it. The four boxes on the right are the four outcomes of any binary decision: they become the confusion matrix and the cost per 1,000 requests in the interactive slide.

This is a simplified teaching illustration. The behaviours drawn for real customers and bots (request counts, codes entered, high-cost routes) are illustrative signals, not Cabify or Infobip data.
Source: https://www.infobip.com/customer/cabify
-->

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
# <span style="color:#7145D6">Cabify</span>: legitimate or artificial traffic

<!-- Interactive screen view: five-stage Vue/SVG demo using 4,000 synthetic verification requests (3,000 training, 1,000 held out, 18.6% artificial). It fits a logistic regression on four illustrative signals, lets you move the blocking threshold and prices the two kinds of error with fictional costs. Cabify, Infobip and customer data are not used. Infobip describes an ML service that identifies patterns and anomalies in SMS traffic and blocks artificial traffic; it does not disclose the model, features, labels or thresholds. The 15.7% reduction in AIT-related financial loss is a supplier-reported result for one quarter and is not reproduced by this demo. The PDF keeps the static functional overview. Companion: cabify-traffic.html and CABIFY-EXPLORER.md. No company logo is included.
Source: https://www.infobip.com/customer/cabify

Functional reconstruction of the published solution. Box positions do not represent actual deployment topology. -->

---
layout: "end"
---
# Discussion

**Which decision in your business is still made by a person for every case?**

What would a wrong block cost you?

www.inno-it.es
