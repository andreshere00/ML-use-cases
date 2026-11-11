import { euros, num } from '../format'
import { STATUS_LABEL, liveMAE, status, type Listing } from '../sim/engine'
import { ZONES } from '../sim/market'
import { TAG_LABEL, rounded, testMAE } from '../sim/valuation'
import { HomeIcon } from './Icons'
import { TAG_TONE } from './ValuationPanel'

const VISIBLE = 6

/**
 * Anuncios nuevos que llegan cada día: son las viviendas de prueba, que el modelo no ha visto.
 * Se valoran al publicarse y el error frente a su precio de referencia es el MAE "en directo".
 */
export function MarketFeed({ listings, day, w, k }: { listings: Listing[]; day: number; w: number; k: number }) {
  const sold = listings.filter((l) => status(l, day) === 'sold')
  const mae = liveMAE(listings)

  return (
    <section className="panel others" aria-labelledby="feed-title">
      <header className="others-head">
        <h2 id="feed-title">Nuevos anuncios</h2>
        <span className="others-live">
          <i aria-hidden="true" /> En directo
        </span>
      </header>

      <dl className="others-stats">
        <div>
          <dt>Publicados</dt>
          <dd>{listings.length}</dd>
        </div>
        <div>
          <dt>Vendidos</dt>
          <dd>{sold.length}</dd>
        </div>
        <div title={`Con las 120 viviendas de prueba: ${euros(Math.round(testMAE(w, k)))}`}>
          <dt>Error medio</dt>
          <dd>{num(mae / 1000, 1)} k€</dd>
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
                  Piso · {h.area} m² · {h.beds} dorm.
                </b>
                <span className="others-route">
                  {ZONES[h.zone].name}
                  {h.renovated ? ' · reformado' : ''}
                  {h.lift ? ' · ascensor' : ''}
                </span>
                <span className="others-route">
                  Valoración {euros(rounded(l.estimate))} · error {euros(Math.round(Math.abs(l.estimate - h.price)))}
                </span>
              </span>
              <span className="others-side">
                <span className="others-price">
                  <em>{euros(l.asking)}</em>
                </span>
                <span className={`badge badge-${TAG_TONE[l.tag]}`}>{TAG_LABEL[l.tag]}</span>
                <span className={`status status-${s}`}>{STATUS_LABEL[s]}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
