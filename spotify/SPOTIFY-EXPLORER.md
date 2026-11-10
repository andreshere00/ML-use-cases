# Spotify clustering explorer

The interactive diagram replaces the screen view of solution slide 15. The PDF retains the existing overview diagram. `spotify-clustering-walkthrough.pdf` provides nine static views of the interactive sequence.

## Present

Open `spotify-clustering.html` directly in a browser for the standalone explorer. Open `presentation.html#15` to use the same component in the offline deck. Both work without a server, internet connection or Python installation. In Slidev, navigate to slide 15.

Use the nine stage buttons or the left/right arrow keys. Arrow keys advance through the diagram before proceeding to the next Slidev slide. Play advances one stage every 5.5 seconds and stops at the end. Back, Reset and stage selection remain available. In the PDF, controls are static snapshots.

Select a cluster in HDBSCAN, continue to Re-embed, and enter its child fit. The All listeners breadcrumb returns to the full population. The hierarchy is the recursive analysis tree, not HDBSCAN's condensed density tree. This demonstration contains one level of recursive fitting. A child can legitimately contain only noise. Controls for later modelling stages then become unavailable because no membership target exists.

Stage 9, Explainability, summarizes the interpretation problem, the solution and the computed results in plain language. Select a group and listener to see the strongest global drivers and the largest local contribution. It distinguishes model explanations from causal claims or segment validation.

The SHAP view supports cluster-model selection, listener selection and signed local versus mean-absolute contributions. Technical details explains the active operation, parameters and equations. The panel scrolls where needed. Colours identify groups within a node, not persistent business personas across different fits.

## Computation and provenance

- 684 synthetic listeners, six illustrative numeric features: minutes/day, sessions/day, skip rate, new-artist share, playlist share and night-listening share. These are not Spotify data, disclosed production features or proprietary parameter settings.
- Features are globally standardized once for UMAP. Root UMAP uses 45 neighbours, min_dist 0.1, Euclidean metric and 2 output dimensions. Root presets vary HDBSCAN min_cluster_size: 45, 100 and 150. min_samples stays 12. Similar outputs for balanced and coarse are a computed result, rather than a forced visual difference.
- Each root cluster with at least 60 members receives a separate UMAP fit on its original six-feature rows, with the global scaler, 15 neighbours and the same min_dist. Child HDBSCAN uses min_cluster_size 18 and min_samples 7. Child views never reuse the parent's 2D coordinates as features.
- Each non-noise cluster has a binary XGBoost membership model on original features. Noise is part of the negative class. Models use 90 trees, depth 3, learning rate 0.08 and a stratified 75/25 train/test split.
- F1 and AUC measure held-out surrogate fidelity to discovered labels. They do not validate cluster quality or estimate performance on a newly discovered population. Labels themselves were discovered using the full node population before the split.
- SHAP uses XGBoost's exact native TreeSHAP implementation, with the training tree-path background and raw log-odds output. The exported base value plus per-feature contributions reconstructs each model margin. Independent one-versus-rest probabilities need not sum to one. Global importance averages absolute contributions across the entire node.
- Fixed seeds, row IDs, parameters and package versions are recorded in `data/spotify-demo.json`. Smooth point movement connects computed views and does not reproduce UMAP optimizer iterations. Global distances, density and cluster sizes in UMAP space need careful interpretation.

This reproduces the *structure* of Spotify's published research workflow using an independently constructed educational dataset. It is not a reproduction of Spotify's exact results, an implementation of Discover Weekly, or a causal explanation of listener behaviour. Stability, sampling bias and usefulness still require separate validation.

## Edit and rebuild

The editable implementation is `theme/components/SpotifyClusteringExplorer.vue`. It draws SVG and native HTML, uses Vue state and CSS transitions, and serves the same source component in Slidev and the standalone explorer.

To recompute the data, use Python 3.12 (the supplied results used 3.12.14):

```bash
python3 -m venv .venv-spotify
.venv-spotify/bin/python -m pip install -r tools/spotify-requirements.txt
.venv-spotify/bin/python tools/generate-spotify-demo.py
```

XGBoost also requires an OpenMP runtime on macOS. Install the official runtime if it is missing from your environment. No ML runtime is needed to present the precomputed results.

To rebuild the offline explorer and Slidev distribution:

```bash
pnpm install
pnpm build:explorer
pnpm build
```

`tools/build-spotify.mjs` bundles the Vue component, computed JSON, fonts and logo into a self-contained HTML file. It also writes the public explorer assets used by the slide distribution. The supplied `presentation.html` additionally embeds that runtime so its diagram controls survive offline export.

## Primary references

- [Spotify: Recursive Embedding and Clustering](https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering), 5 December 2023.
- [UMAP parameters](https://umap-learn.readthedocs.io/en/latest/parameters.html).
- [HDBSCAN parameter selection](https://hdbscan.readthedocs.io/en/latest/parameter_selection.html).
- [XGBoost Booster.predict and pred_contribs](https://xgboost.readthedocs.io/en/stable/python/python_api.html#xgboost.Booster.predict).

Reviewed 5 November 2026.

## Company logo

The company logo comes from its [official press materials](https://newsroom.spotify.com/media-kit/logo-and-brand-assets/). The original asset is in `public/assets/companies`, with its proportions and colours preserved. It is embedded in the standalone explorer and offline deck.

The first step introduces a concrete example. Each subsequent stage explains its meaning for the same people or apartment. The Spotify story is illustrative and remains separate from the computed behaviour data.
