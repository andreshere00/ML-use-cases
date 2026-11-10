"""Calcula los datos ilustrativos que usa SpotifyClusteringExplorer.vue.

No se usan datos ni parámetros de Spotify. Ejecutar con el archivo de requisitos fijado.
Cada ajuste recursivo recibe las filas ORIGINALES de seis variables, estandarizadas globalmente.
Las vistas 2D son ajustes independientes, no una animación del optimizador de UMAP.
"""
import os
os.environ.setdefault('NUMBA_NUM_THREADS', '1')
os.environ.setdefault('OMP_NUM_THREADS', '1')
import json
from pathlib import Path
from importlib.metadata import version
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.manifold import trustworthiness
import umap
import hdbscan
import xgboost as xgb

ROOT = Path(__file__).resolve().parents[1]
SEED = 42
rng = np.random.default_rng(SEED)
features = [
    dict(name='Minutos / día', short='Minutos', unit='min'),
    dict(name='Sesiones / día', short='Sesiones', unit='sesiones'),
    dict(name='Tasa de saltos', short='Saltos', unit='%'),
    dict(name='Proporción de artistas nuevos', short='Descubrimiento', unit='%'),
    dict(name='Proporción de listas', short='Listas', unit='%'),
    dict(name='Escucha nocturna', short='Noche', unit='%'),
]
centres = np.array([[45,3,.24,.22,.80,.16], [125,7,.45,.72,.30,.34], [220,11,.12,.18,.56,.78]])
sd = np.array([8,.55,.035,.045,.045,.045])
chunks = []
for centre in centres:
    for sub in [-1,0,1]:
        offset = np.array([sub*6, sub*.4, sub*.018, sub*.13, -sub*.10, sub*.10])
        chunks.append(rng.normal(centre+offset, sd, (72,6)))
chunks.append(rng.uniform([15,1,.02,.02,.02,.02],[280,14,.72,.98,.98,.98],(36,6)))
X = np.vstack(chunks)
X[:,:2] = np.maximum(X[:,:2],.1)
X[:,2:] = np.clip(X[:,2:],.001,.999)
X = X[rng.permutation(len(X))].astype(np.float32)
scaler = StandardScaler().fit(X)
Z = scaler.transform(X)

def rounded(a):
    return np.round(a,5).tolist()

def embedding(ids, neighbours, seed):
    return umap.UMAP(n_neighbors=min(neighbours,len(ids)-1), min_dist=.1,
                     n_components=2, metric='euclidean', random_state=seed,
                     n_jobs=1, n_epochs=300).fit_transform(Z[ids])

def models(ids, labels):
    result = {}
    for label in sorted(set(labels)-{-1}):
        y = (labels == label).astype(int)
        train, test = train_test_split(np.arange(len(ids)),test_size=.25,
                                      stratify=y,random_state=SEED)
        model=xgb.XGBClassifier(n_estimators=90,max_depth=3,learning_rate=.08,
                    objective='binary:logistic',eval_metric='logloss',
                    tree_method='hist',n_jobs=1,random_state=SEED)
        model.fit(X[ids][train],y[train])
        matrix=xgb.DMatrix(X[ids])
        # XGBoost's native exact TreeSHAP. The last column is the base margin.
        contrib=model.get_booster().predict(matrix,pred_contribs=True)
        raw=model.get_booster().predict(matrix,output_margin=True)
        error=float(np.max(np.abs(contrib.sum(axis=1)-raw)))
        assert error < 1e-4, error
        probs=model.predict_proba(X[ids])[:,1]
        result[str(label)]={
            'probabilities':rounded(probs), 'shap':rounded(contrib[:,:-1]),
            'base':float(contrib[0,-1]),'meanAbs':rounded(np.abs(contrib[:,:-1]).mean(axis=0)),
            'metrics':dict(f1=round(float(f1_score(y[test],probs[test]>.5)),4),
                           auc=round(float(roc_auc_score(y[test],probs[test])),4),
                           trainN=len(train),testN=len(test)),
            'testIds':ids[test].tolist(),'maxAdditivityError':error,
        }
    return result

def node(ids, coords, size, min_samples, key, parent=None):
    clusterer=hdbscan.HDBSCAN(min_cluster_size=size,min_samples=min_samples,
                             cluster_selection_method='eom').fit(coords)
    labels=clusterer.labels_
    lo=coords.min(axis=0); span=np.maximum(coords.max(axis=0)-lo,1e-6)
    pos=.06+.88*(coords-lo)/span
    clusters=[]
    for label in sorted(set(labels)-{-1}):
        member=ids[labels==label]
        clusters.append(dict(label=int(label),name=f'C{int(label)+1}',n=len(member),
                             memberIds=member.tolist(),child=None))
    return dict(id=key,parent=parent,ids=ids.tolist(),positions=rounded(pos),
                labels=labels.tolist(),strength=rounded(clusterer.probabilities_),
                clusters=clusters,noise=int((labels==-1).sum()),
                trustworthiness=round(float(trustworthiness(Z[ids],coords,n_neighbors=10)),4),
                models=models(ids,labels),
                parameters=dict(min_cluster_size=size,min_samples=min_samples,
                                n_neighbors=45 if parent is None else 15,min_dist=.1,
                                n_components=2,metric='euclidean'))

root_ids=np.arange(len(X))
root_embedding=embedding(root_ids,45,SEED)
presets=[]
for name,size in [('Fina',45),('Equilibrada',100),('Gruesa',150)]:
    root=node(root_ids,root_embedding,size,12,'root')
    nodes={'root':root}
    for cluster in root['clusters']:
        ids=np.array(cluster['memberIds'])
        if len(ids)<60:
            continue
        key=f'root/{cluster["label"]}'
        coords=embedding(ids,15,SEED+cluster['label']+1)
        child=node(ids,coords,18,7,key,'root')
        nodes[key]=child
        cluster['child']=key
    presets.append(dict(id=name.lower(),name=name,nodes=nodes))
    print(name, 'root:',[(c['name'],c['n']) for c in root['clusters']],
          'noise:',root['noise'], 'child clusters:',
          {k:len(n['clusters']) for k,n in nodes.items() if k!='root'},flush=True)

data=dict(schemaVersion=1,seed=SEED,n=len(X),d=6,features=features,values=rounded(X),
          scaler=dict(mean=rounded(scaler.mean_),scale=rounded(scaler.scale_)),
          presets=presets,
          modelParameters=dict(n_estimators=90,max_depth=3,learning_rate=.08,trainFraction=.75),
          provenance=dict(kind='Demostración sintética',
              companySource='https://engineering.atspotify.com/2023/12/recursive-embedding-and-clustering',
              disclaimer='Variables de oyentes y parámetros ilustrativos. Sin datos de usuarios de Spotify ni configuración interna.',
              shap='TreeSHAP nativo exacto de XGBoost, log-odds bruto, fondo dependiente de la ruta del árbol.',
              evaluation='F1 y AUC miden la fidelidad del modelo sustituto en datos reservados respecto a las etiquetas descubiertas, no la validez de los clusters.',
              recursion='Los ajustes UMAP hijos usan las mismas seis variables originales y el escalador global. Profundidad máxima: un ajuste recursivo.',
              versions={p:version(p) for p in ['numpy','scikit-learn','umap-learn','hdbscan','xgboost']},
              sources=['https://umap-learn.readthedocs.io/en/latest/parameters.html',
                       'https://hdbscan.readthedocs.io/en/latest/parameter_selection.html',
                       'https://xgboost.readthedocs.io/en/stable/python/python_api.html#xgboost.Booster.predict']))
out=ROOT/'data'/'spotify-demo.json';out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(data,separators=(',',':'),allow_nan=False)+'\n')
print('Saved',out,len(out.read_bytes()),'bytes',flush=True)
