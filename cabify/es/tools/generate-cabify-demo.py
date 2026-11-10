"""Independent teaching baseline, not Infobip Signals or Cabify's production system.

Generates fully synthetic SMS-verification requests, fits a logistic regression on a
training split and exports the coefficients and held-out risk scores that the
explorer uses. No Cabify, Infobip or customer data is involved.
"""
from pathlib import Path
import json
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 4000
bot = rng.random(n) < 0.18                      # synthetic share of artificial traffic
# Two realistic complications create overlap: "low and slow" bots that imitate genuine users,
# and genuine users with poor reception who retry and rarely complete the first code.
stealth = bot & (rng.random(n) < .35)
noisy = ~bot & (rng.random(n) < .10)
burst = np.where(bot, rng.lognormal(np.log(14), .75, n), rng.lognormal(np.log(1.8), .6, n))
burst = np.where(stealth, rng.lognormal(np.log(3.2), .6, n), burst)
burst = np.where(noisy, rng.lognormal(np.log(5.5), .55, n), burst)
burst = np.clip(np.rint(burst), 1, 60)           # requests per minute from the same source
completion = np.where(bot, rng.normal(28, 24, n), rng.normal(86, 11, n))
completion = np.where(stealth, rng.normal(62, 22, n), completion)
completion = np.where(noisy, rng.normal(52, 26, n), completion)
completion = np.clip(np.rint(completion), 0, 100)  # % of sent codes that are actually entered
high_cost = np.where(bot, rng.random(n) < .55, rng.random(n) < .05).astype(float)
high_cost = np.where(stealth, rng.random(n) < .25, high_cost)
new_device = np.where(bot, rng.random(n) < .65, rng.random(n) < .24).astype(float)

X = np.column_stack([np.log1p(burst), completion / 100, high_cost, new_device])
y = bot.astype(int)
train, test = train_test_split(np.arange(n), test_size=.25, random_state=42, stratify=y)
model = LogisticRegression(C=1.0, max_iter=1000).fit(X[train], y[train])
p = model.predict_proba(X[test])[:, 1]
coef = model.coef_[0]
means = X[train].mean(axis=0)
baseline = float(model.intercept_[0] + coef @ means)

pred = p >= .5
tp = int((pred & (y[test] == 1)).sum()); fp = int((pred & (y[test] == 0)).sum())
fn = int((~pred & (y[test] == 1)).sum()); tn = int((~pred & (y[test] == 0)).sum())
out = dict(
    seed=42, n=n, trainN=len(train), testN=len(test),
    features=['burst', 'completion', 'highCost', 'newDevice'],
    intercept=float(model.intercept_[0]), coefficients=coef.tolist(), means=means.tolist(), baseline=baseline,
    prevalence=float(y.mean()),
    metrics=dict(auc=float(roc_auc_score(y[test], p)), precision=tp / max(1, tp + fp), recall=tp / max(1, tp + fn)),
    costs=dict(missedBot=1.5, blockedGenuine=5.0),
    scores=[[round(float(s), 4), int(l)] for s, l in zip(p, y[test])],
)
# The explorer recomputes scores in the browser; the exported coefficients must reproduce them.
z = model.intercept_[0] + X[test] @ coef
assert np.allclose(1 / (1 + np.exp(-z)), p, atol=1e-9)
assert abs(baseline - float(np.mean(model.intercept_[0] + X[train] @ coef))) < 1e-9
path = Path(__file__).resolve().parents[1] / 'data/cabify-demo.json'
path.write_text(json.dumps(out, separators=(',', ':')) + '\n')
print(f'{len(train)} training / {len(test)} held out; AUC {out["metrics"]["auc"]:.3f}; '
      f'at 0.5: precision {out["metrics"]["precision"]:.2f}, recall {out["metrics"]["recall"]:.2f} (TP {tp} FP {fp} FN {fn} TN {tn})')
