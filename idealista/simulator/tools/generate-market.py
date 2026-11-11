"""Exporta el mercado sintético del caso idealista (semilla 42) para el simulador.

Reproduce `idealista/es/tools/generate-idealista-demo.py` y el notebook 01, pero guarda también
las 120 viviendas de prueba: el simulador las publica como anuncios nuevos que el modelo no ha visto.
"""
from pathlib import Path
import json
import numpy as np
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 480
area = rng.integers(45, 141, n)
beds = rng.integers(1, 5, n)
zone = rng.integers(0, 3, n)
renovated = rng.integers(0, 2, n)
lift = rng.integers(0, 2, n)
y = np.rint(20000 + 2000*area + 12000*beds + 60000*(zone == 1) + 120000*(zone == 2)
            + 25000*renovated + 15000*lift + rng.normal(0, 12000, n))
train, test = train_test_split(np.arange(n), test_size=.25, random_state=42)

def row(i):
    return [int(i + 1), int(area[i]), int(beds[i]), int(zone[i]), int(renovated[i]), int(lift[i]), int(y[i])]

out = dict(
    seed=42,
    columns=['id', 'area', 'beds', 'zone', 'renovated', 'lift', 'price'],
    train=[row(i) for i in train],
    test=[row(i) for i in test],
)
p = Path(__file__).resolve().parents[1] / 'src/data/market.json'
p.write_text(json.dumps(out, separators=(',', ':')) + '\n')
print(f'{len(train)} viviendas de entrenamiento / {len(test)} de prueba → {p}')
