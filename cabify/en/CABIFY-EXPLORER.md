# Cabify traffic classification explorer

Open `cabify-traffic.html` (generated with `pnpm build:explorer`) for the offline interactive demonstration. The same component is embedded in the native Slidev deck. The PDF export keeps the static functional overview.

## Five stages

1. **Request:** edit requests per minute, share of verification codes entered, high-cost route and unfamiliar device. The signals become a numeric feature vector.
2. **Risk score:** see the difference between fitting a logistic regression on labelled requests and applying its fixed weights to a new one. The output is a probability of artificial traffic.
3. **Threshold:** drag the blocking threshold over the held-out score distribution. This request is allowed or blocked depending on where the line falls.
4. **Cost:** a confusion matrix, precision and recall at the chosen threshold, and the cost per 1,000 requests across every threshold. Change the price of blocking a genuine user and use the cheapest threshold.
5. **Explainability:** exact additive log-odds contributions from the average request to this one.

Use Next, Back, the stage tabs or the arrow keys. Play advances every 5.5 seconds. Edit request returns to the inputs. Reset restores the original request and settings. Technical details explains the actual calculation. The offline version works directly from a local file without a server or ML installation. In the full deck, arrow keys move through the stages before proceeding to the next slide.

## Published case and teaching choices

[Infobip's customer case](https://www.infobip.com/customer/cabify) describes Cabify using Infobip Signals, an ML service that identifies patterns and anomalies in SMS traffic and blocks artificial traffic (AIT, Artificial Inflation of Traffic). It reports 15.7% less AIT-related financial loss over one quarter. It does not publish the model family, features, training labels or thresholds. Case page checked 19 October 2026.

This is an independent educational baseline that illustrates a binary classification decision. It is **not Infobip Signals, Cabify's system or their data**. All 4,000 requests, signals and prices are synthetic and fictional. The four signals are illustrative teaching features, not claims about what Infobip uses. The 15.7% figure is a supplier-reported business result and is not reproduced or tested by this demo.

## Reproducible computation

- Fixed random seed 42. 4,000 synthetic requests, 18.6% artificial. Stratified split into 3,000 training and 1,000 held-out requests before fitting.
- Two complications create realistic overlap: "low and slow" bots that imitate genuine users, and genuine users with poor reception who retry and rarely complete the first code.
- Logistic regression with an intercept (L2, C = 1). Inputs: `ln(1 + requests per minute)`, share of codes entered (0 to 1), high-cost route (0/1), unfamiliar device (0/1). Fit once on training data.
- A request is blocked when its predicted probability is at least the threshold. The threshold is a business choice.
- Cost per 1,000 requests is `(blocked genuine × cost of blocking + missed bots × €1.50) / 1,000 held-out requests × 1,000`. The cost of blocking is selectable (€2, €5, €10). All prices are fictional.
- The breakdown is exact additive arithmetic in log-odds, without SHAP. The baseline is the training-set average request. Each term is `coefficient × (feature − training mean)`. Baseline plus all terms reconstructs this request's log-odds.
- Held-out metrics are synthetic demonstration results, not Infobip's measured accuracy. A high score is a risk estimate, not proof of fraud.

## Edit and rebuild

Editable Vue/SVG component: `theme/components/CabifyTrafficExplorer.vue`.
Computed coefficients and held-out scores: `data/cabify-demo.json`.
Generator: `tools/generate-cabify-demo.py` (Python 3.12+, NumPy 2.2.6 and scikit-learn 1.7.2).

```bash
python3 -m venv .venv-cabify
.venv-cabify/bin/python -m pip install -r tools/cabify-requirements.txt
.venv-cabify/bin/python tools/generate-cabify-demo.py
pnpm install
pnpm build:explorer
pnpm build
```

The generated standalone file includes the computed data, Vue runtime and fonts. No Python is needed to present it. `tools/build-cabify.mjs` regenerates the standalone HTML and its public assets.

## Company logo

No Cabify or Infobip logo is bundled. The company name is set in type, using Cabify's purple as an accent.
