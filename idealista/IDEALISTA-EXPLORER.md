# idealista valuation explorer

Open `idealista-valuation.html` for the offline interactive demonstration. The same component is embedded on slide 19 of `presentation.html` and in the native Slidev deck. The main deck PDF keeps its original static overview. `idealista-valuation-walkthrough.pdf` contains five static snapshots.

## Five stages

1. **Property:** edit floor area, bedrooms, fictional zone, renovation and lift. Attributes become a numeric feature vector.
2. **Similar homes:** inspect the six closest training properties in the same zone and their mean reference price.
3. **Regression:** see the distinction between fitting a model on known examples and applying its fixed weights to a new home.
4. **Estimate:** combine the two computed estimates with an explicitly illustrative 50/50 average. Display the result rounded to €1,000.
5. **Explainability:** explain the problem in plain English and show the exact arithmetic adjustments from a baseline to this estimate.

Use Next, Back, the stage tabs or the arrow keys. Play advances every 5.5 seconds. Edit home returns to the inputs. Reset restores the original apartment. Technical details explains the actual calculation. The offline version works directly from a local file without a server or ML installation. In the full deck, arrow keys move through the diagram before proceeding to the next slide.

## Published case and teaching choices

[idealista/data's AVM service](https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/valoracion-automatica/) combines a comparison method with a hedonic machine-learning model. Its product page identifies cadastral data and/or location, property type and area as valuation inputs. It does not publish the exact regressor, matching rules, production coefficients or combination weights. Product page checked 5 November 2026.

This is an independent educational baseline that illustrates that structure. It is **not idealista's production model or data**. All 480 property observations, reference prices and zones are synthetic. Renovation, bedrooms and lift are illustrative teaching features, not claims about the company's disclosed feature set. The target is a synthetic reference price, with no claim to represent actual transactions or asking prices. The three zone names have no correspondence to real neighbourhoods.

## Reproducible computation

- Fixed random seed 42. Split 480 synthetic rows into 360 training and 120 held-out observations before fitting or comparison.
- Ordinary least squares with an intercept. Six numeric columns: floor area, bedroom count, zone B indicator, zone C indicator, renovated and lift. Zone A is the reference category. Fit once on training data.
- Comparable selection uses training observations in the same fictional zone. Rank by `(area difference / 30)^2 + (bedroom difference / 2)^2 + 0.25 per renovation/lift mismatch`, tie-breaking by row ID. Average the six closest reference prices.
- Prediction is `0.5 * comparable mean + 0.5 * regression prediction`. Equal weighting is a transparent teaching choice, not a disclosed idealista formula.
- Report held-out MAE from those same rules, without putting held-out rows in the model fit or comparable pool. This is a synthetic demonstration metric, not idealista's measured accuracy, a confidence interval or a formal appraisal.
- The final chart uses exact additive arithmetic, without SHAP. Baseline is the mean training-model prediction. Each model contribution is `0.5 * coefficient * (feature - training feature mean)`. Combine both zone terms. The comparable contribution is `0.5 * (comparable mean - baseline)`. Baseline plus all contributions reconstructs the unrounded blended prediction.
- A feature's coefficient describes an association in this fitted synthetic model. Changing the inputs also changes the comparable set. Prices and adjustments are illustrative, not market estimates.

## Edit and rebuild

Editable Vue/SVG component: `theme/components/IdealistaValuationExplorer.vue`.
Computed training rows, coefficients and evaluation: `data/idealista-demo.json`.
Generator: `tools/generate-idealista-demo.py` (Python 3.12, NumPy 2.2.6 and scikit-learn 1.7.2).

```bash
python3 -m venv .venv-idealista
.venv-idealista/bin/python -m pip install -r tools/idealista-requirements.txt
.venv-idealista/bin/python tools/generate-idealista-demo.py
pnpm install
pnpm build:idealista
pnpm build
```

The provided standalone file and offline deck already include the computed data, Vue runtime, fonts and logo. No Python is needed to present them. `tools/build-idealista.mjs` regenerates the standalone HTML and its public assets. The delivered `presentation.html` additionally embeds the runtime so its controls remain interactive offline.

## Company logo

The company logo comes from its [official press materials](https://www.idealista.com/sala-de-prensa/materiales/). The original asset is in `public/assets/companies`, with its proportions and colours preserved. It is embedded in the standalone explorer and offline deck.

The first step introduces a concrete example. Each subsequent stage explains its meaning for the same people or apartment. The Spotify story is illustrative and remains separate from the computed behaviour data.
