---
theme: "./theme"
title: "Spotify: discovering groups with clustering"
info: "Spotify: discovering groups with clustering. InnoIT template."
author: "InnoIT"
aspectRatio: "16/9"
canvasWidth: 1280
colorSchema: "light"
fonts: {"sans": "Urbane", "local": "Urbane", "weights": "300,500,600"}
transition: "fade"
drawings: {"enabled": false}
download: false
exportFilename: "innoit-ml-use-case-spotify"
layout: "cover"
---
# <span style="color:#1ED760">Spotify</span><br>**discovering groups**

Recursive UMAP and HDBSCAN, explained step by step

InnoIT · ML use case

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
layout: "end"
---
# Discussion

**Which groups could you discover in your own data?**

And who would investigate them?

www.inno-it.es
