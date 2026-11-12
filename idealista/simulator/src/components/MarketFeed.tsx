import { euros, keur } from '../format'
import { useT } from '../i18n'
import { liveMAE, status, type Listing } from '../sim/engine'
import { rounded, testMAE } from '../sim/valuation'
import { HomeIcon } from './Icons'
import { TAG_TONE } from './ValuationPanel'

const VISIBLE = 6

/**
 * Anuncios nuevos que llegan cada día: son las viviendas de prueba, que el modelo no ha visto.
 * Se valoran al publicarse y el error frente a su precio de referencia es el MAE "en directo".
 */
export function MarketFeed({ listings, day, w, k }: { listings: Listing[]; day: number; w: number; k: number }) {
  const t = useT()
  const sold = listings.filter((l) => status(l, day) === 'sold')
  const mae = liveMAE(listings)

  return (
    <section className="panel others" aria-labelledby="feed-title">
      <header className="others-head">
        <h2 id="feed-title">{t.newListings}</h2>
        <span className="others-live">
          <i aria-hidden="true" /> {t.live}
        </span>
      </header>

      <dl className="others-stats">
        <div>
          <dt>{t.listed}</dt>
          <dd>{listings.length}</dd>
        </div>
        <div>
          <dt>{t.sold}</dt>
          <dd>{sold.length}</dd>
        </div>
        <div title={t.testMaeTitle(Math.round(testMAE(w, k)))}>
          <dt>{t.meanError}</dt>
          <dd>{keur(mae, 1)}</dd>
        </div>
      </dl>

      <ul className="others-list" aria-live="polite" aria-relevant="additions">
        {listings.slice(0, VISIBLE).map((l) => {
          const s = status(l, day)
          const h = l.home
          return (
            <li key={h.id} className="others-item">
              <span className={`others-avatar zone-${h.zone}`} aria-hidden="true">
                <HomeIcon size={16} />
              </span>
              <span className="others-main">
                <b>
                  {t.flat} · {h.area} m² · {h.beds} {t.beds}
                </b>
                <span className="others-route">
                  {t.zoneName[h.zone]}
                  {h.renovated ? ` · ${t.renovated}` : ''}
                  {h.lift ? ` · ${t.lift}` : ''}
                </span>
                <span className="others-route">
                  {t.feedValuation(rounded(l.estimate), Math.round(Math.abs(l.estimate - h.price)))}
                </span>
              </span>
              <span className="others-side">
                <span className="others-price">
                  <em>{euros(l.asking)}</em>
                </span>
                <span className={`badge badge-${TAG_TONE[l.tag]}`}>{t.tag[l.tag]}</span>
                <span className={`status status-${s}`}>{t.status[s]}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
