import { euros, mult, share } from '../format'
import { useI18n } from '../i18n'
import { acceptChance, type OtherRide, type RideStatus } from '../sim/riders'
import { ZONE_BY_ID } from '../sim/world'

const TONE: Record<RideStatus, string> = {
  searching: 'info',
  pickup: 'positive',
  ontrip: 'neutral',
  declined: 'negative',
  unserved: 'negative',
}

const VISIBLE = 6

/** Otros pasajeros pidiendo a la vez: muestra cómo el precio y la escasez afectan a todos, no solo a nosotros. */
export function OthersFeed({ rides, tick }: { rides: OtherRide[]; tick: number }) {
  const { t } = useI18n()
  const fresh = rides.filter((r) => r.createdTick === tick)
  const active = rides.filter((r) => r.status !== 'declined' && r.status !== 'unserved').length
  const recent = rides.filter((r) => tick - r.createdTick <= 1)
  const declined = recent.filter((r) => r.status === 'declined').length
  const avgAccept = recent.length ? recent.reduce((acc, r) => acc + acceptChance(r.m), 0) / recent.length : 1

  return (
    <section className="panel others" aria-labelledby="others-title">
      <header className="others-head">
        <h2 id="others-title">{t.others.title}</h2>
        <span className="others-live">
          <i aria-hidden="true" /> {t.others.live}
        </span>
      </header>

      <dl className="others-stats">
        <div>
          <dt>{t.others.fresh}</dt>
          <dd>{fresh.length}</dd>
        </div>
        <div>
          <dt>{t.others.active}</dt>
          <dd>{active}</dd>
        </div>
        <div>
          <dt>{t.others.accept}</dt>
          <dd>{share(avgAccept)}</dd>
        </div>
      </dl>

      {rides.length === 0 ? (
        <p className="hint">{t.others.empty}</p>
      ) : (
        <ul className="others-list" aria-live="polite" aria-relevant="additions">
          {rides.slice(0, VISIBLE).map((r) => {
            return (
              <li key={r.id} className="others-item">
                <span className="others-avatar" aria-hidden="true">
                  {r.name[0]}
                </span>
                <span className="others-main">
                  <b>{r.name}</b>
                  <span className="others-route">
                    {ZONE_BY_ID[r.pickupId].name} → {ZONE_BY_ID[r.destId].name}
                  </span>
                </span>
                <span className="others-side">
                  <span className={`badge badge-${TONE[r.status]}`}>{t.others.status[r.status]}</span>
                  <span className="others-price">
                    {r.productName} · {euros(r.price)}
                    {r.m > 1.045 && <em> · {mult(r.m)}</em>}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
      {declined > 0 && (
        <p className="hint">{t.others.declined(declined)}</p>
      )}
    </section>
  )
}
