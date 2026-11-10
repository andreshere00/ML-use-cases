"""Independent teaching baseline, not idealista's proprietary AVM."""
from pathlib import Path
import json
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
rng=np.random.default_rng(42)
n=480
area=rng.integers(45,141,n)
beds=rng.integers(1,5,n)
zone=rng.integers(0,3,n)
renovated=rng.integers(0,2,n)
lift=rng.integers(0,2,n)
X=np.column_stack([area,beds,zone==1,zone==2,renovated,lift]).astype(float)
y=np.rint(20000+2000*area+12000*beds+60000*(zone==1)+120000*(zone==2)+25000*renovated+15000*lift+rng.normal(0,12000,n))
train,test=train_test_split(np.arange(n),test_size=.25,random_state=42)
model=LinearRegression().fit(X[train],y[train])
rows=[dict(id=int(i+1),area=int(area[i]),beds=int(beds[i]),zone=int(zone[i]),renovated=int(renovated[i]),lift=int(lift[i]),price=int(y[i])) for i in train]
def comp_price(i):
    pool=[r for r in rows if r['zone']==zone[i]]
    def distance(r):
        return ((r['area']-area[i])/30)**2+((r['beds']-beds[i])/2)**2+.25*(r['renovated']!=renovated[i])+.25*(r['lift']!=lift[i])
    return float(np.mean([r['price'] for r in sorted(pool,key=lambda r:(distance(r),r['id']))[:6]]))
pred=model.predict(X[test]); comps=np.array([comp_price(i) for i in test]); blended=.5*pred+.5*comps
out=dict(seed=42,n=n,trainN=len(train),testN=len(test),zones=['Zone A','Zone B','Zone C'],features=['area','beds','zoneB','zoneC','renovated','lift'],intercept=float(model.intercept_),coefficients=model.coef_.tolist(),means=X[train].mean(axis=0).tolist(),baseline=float(model.predict(X[train]).mean()),rows=rows,metrics=dict(regressionMAE=float(mean_absolute_error(y[test],pred)),comparablesMAE=float(mean_absolute_error(y[test],comps)),blendMAE=float(mean_absolute_error(y[test],blended))),blendWeight=.5,comparableCount=6)
assert abs(out['baseline']-(out['intercept']+sum(a*b for a,b in zip(out['coefficients'],out['means']))))<1e-6
p=Path(__file__).resolve().parents[1]/'data/idealista-demo.json';p.write_text(json.dumps(out,separators=(',',':'))+'\n')
print(f'{len(train)} training properties / {len(test)} held out; blend MAE €{out["metrics"]["blendMAE"]:,.0f}')
