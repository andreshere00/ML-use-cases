import { euros, mult, num } from '../format'
import { acceptChance, type OtherRide, type RideStatus } from '../sim/riders'
import { ZONE_BY_ID } from '../sim/world'

const STATUS: Record<RideStatus, { label: string; tone: string }> = {
  searching: { label: 'Buscando', tone: 'info' },
  pickup: { label: 'Recogida', tone: 'positive' },
  ontrip: { label: 'En viaje', tone: 'neutral' },
  declined: { label: 'Rechaza el precio', tone: 'negative' },
  unserved: { label: 'Sin conductor', tone: 'negative' },
}

const VISIBLE = 6

/** Otros pasajeros pidiendo a la vez: muestra cómo el precio y la escasez afectan a todos, no solo a nosotros. */
export function OthersFeed({ rides, tick }: { rides: OtherRide[]; tick: number }) {
  const fresh = rides.filter((r) => r.createdTick === tick)
  const active = rides.filter((r) => r.status !== 'declined' && r.status !== 'unserved').length
  const recent = rides.filter((r) => tick - r.createdTick <= 1)
  const declined = recent.filter((r) => r.status === 'declined').length
  const avgAccept = recent.length ? recent.reduce((acc, r) => acc + acceptChance(r.m), 0) / recent.length : 1

  return (
    <section className="panel others" aria-labelledby="others-title">
      <header className="others-head">
        <h2 id="others-title">Otros pasajeros</h2>
        <span className="others-live">
          <i aria-hidden="true" /> En directo
        </span>
      </header>

      <dl className="others-stats">
        <div>
          <dt>Nuevas</dt>
          <dd>{fresh.length}</dd>
        </div>
        <div>
          <dt>Activas</dt>
          <dd>{active}</dd>
        </div>
        <div>
          <dt>Aceptan</dt>
          <dd>{num(avgAccept * 100)} %</dd>
        </div>
      </dl>

      {rides.length === 0 ? (
        <p className="hint">Aún no hay más solicitudes.</p>
      ) : (
        <ul className="others-list" aria-live="polite" aria-relevant="additions">
          {rides.slice(0, VISIBLE).map((r) => {
            const s = STATUS[r.status]
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
                  <span className={`badge badge-${s.tone}`}>{s.label}</span>
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
        <p className="hint">
          {declined === 1 ? 'Una persona ha' : `${declined} personas han`} descartado el viaje por el precio: es la
          elasticidad del algoritmo 3 en acción.
        </p>
      )}
    </section>
  )
}
