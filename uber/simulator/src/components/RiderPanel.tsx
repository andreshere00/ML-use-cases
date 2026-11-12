import { euros, mult, num } from '../format'
import { useI18n } from '../i18n'
import { current, type SimState } from '../sim/engine'
import { baseFare, tripKm, tripMinutes } from '../sim/fare'
import type { PickupEstimate } from '../sim/traffic'
import { ZONES, ZONE_BY_ID } from '../sim/world'
import type { Trip, TripProgress } from '../trip'
import { BoltIcon, ClockIcon, InfoIcon, LockIcon, MapIcon, PersonIcon, SwapIcon } from './Icons'
import { VehicleArt } from './VehicleArt'

interface Props {
  sim: SimState
  pickupId: string
  destId: string
  activeField: 'pickup' | 'dest'
  trip: Trip | null
  progress: TripProgress | null
  /** Espera de cada vehículo según el conductor libre más cercano. */
  estimates: PickupEstimate[]
  productId: string
  onProduct: (id: string) => void
  onPickup: (id: string) => void
  onDest: (id: string) => void
  onActiveField: (field: 'pickup' | 'dest') => void
  onRequest: (trip: Trip) => void
  onClear: () => void
}

const STEPS = ['searching', 'pickup', 'ontrip'] as const

function ZoneSelect(props: {
  id: string
  label: string
  value: string
  active: boolean
  marker: 'dot' | 'square'
  invalid?: boolean
  onFocus: () => void
  onChange: (id: string) => void
}) {
  return (
    <div className={`field ${props.active ? 'active' : ''} ${props.invalid ? 'invalid' : ''}`}>
      <span className={props.marker} aria-hidden="true" />
      <label className="field-label" htmlFor={props.id}>
        {props.label}
      </label>
      <select
        id={props.id}
        value={props.value}
        aria-invalid={props.invalid || undefined}
        aria-describedby={props.invalid ? 'route-error' : undefined}
        onFocus={props.onFocus}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {ZONES.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function TripView(p: Props & { trip: Trip; progress: TripProgress }) {
  const { t } = useI18n()
  const { phase, progress } = p.progress
  const stepIndex = phase === 'done' ? STEPS.length : STEPS.findIndex((s) => s === phase)
  const pickupName = ZONE_BY_ID[p.trip.pickupId].name
  const minutesLeft =
    phase === 'pickup'
      ? Math.max(1, Math.ceil(p.trip.waitMinutes * (1 - progress)))
      : phase === 'ontrip'
        ? Math.max(1, Math.ceil(p.trip.tripMinutes * (1 - progress)))
        : null
  const mNow = current(p.sim, p.trip.pickupId).m

  return (
    <section className="panel rider" aria-label={t.rider.tripInProgress}>
      <h2 aria-live="polite">{t.rider.phase[phase]}</h2>
      <p className="muted">
        {pickupName} → {ZONE_BY_ID[p.trip.destId].name} · {p.trip.productName}
      </p>

      <ol className="stepper" aria-label={t.rider.progress}>
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'
          return (
            <li key={s} className={`trip-step trip-step-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <div className="step-bar">
                <div style={{ width: `${(state === 'done' ? 1 : state === 'current' ? progress : 0) * 100}%` }} />
              </div>
              <span>{t.rider.steps[s]}</span>
            </li>
          )
        })}
      </ol>

      {minutesLeft !== null && (
        <p className="eta-big">
          <ClockIcon size={18} />
          {phase === 'pickup' ? t.rider.driverArrives(minutesLeft) : t.rider.youArrive(minutesLeft)}
        </p>
      )}

      <div className="price-lock">
        <LockIcon size={18} />
        <div>
          <b>{euros(p.trip.price)}</b>
          <span>{t.rider.priceLocked(mult(p.trip.m))}</span>
        </div>
      </div>

      <dl className="receipt">
        <div>
          <dt>{t.rider.multiplierNow(pickupName)}</dt>
          <dd>
            {mult(mNow)}{' '}
            <span className={mNow > p.trip.m ? 'delta up' : mNow < p.trip.m ? 'delta down' : 'delta'}>
              {mNow > p.trip.m + 0.005 ? '▲' : mNow < p.trip.m - 0.005 ? '▼' : '='}
            </span>
          </dd>
        </div>
        <div>
          <dt>{t.rider.waitAndTrip}</dt>
          <dd>
            {p.trip.waitMinutes} + {p.trip.tripMinutes} min
          </dd>
        </div>
      </dl>

      <button className={`btn btn-block btn-large ${phase === 'done' ? 'btn-primary' : 'btn-secondary'}`} onClick={p.onClear}>
        {phase === 'done' ? t.rider.another : t.rider.cancel}
      </button>
    </section>
  )
}

export function RiderPanel(p: Props) {
  const { t } = useI18n()
  if (p.trip && p.progress) return <TripView {...p} trip={p.trip} progress={p.progress} />

  const pickup = ZONE_BY_ID[p.pickupId]
  const dest = ZONE_BY_ID[p.destId]
  const zone = current(p.sim, p.pickupId)
  const km = tripKm(pickup, dest)
  const minutes = tripMinutes(km, p.sim.rain)
  const surge = zone.m > 1.045
  const sameZone = p.pickupId === p.destId
  const options = p.estimates.map(({ product, driver, minutes: wait, nearby }) => {
    const base = baseFare(product, km, minutes)
    return { product, base, price: base * zone.m, wait, nearby, driver }
  })
  const selected = options.find((o) => o.product.id === p.productId)!
  const swap = () => {
    p.onPickup(p.destId)
    p.onDest(p.pickupId)
  }

  return (
    <section className="panel rider" aria-labelledby="rider-title">
      <h2 id="rider-title">{t.rider.title}</h2>

      <div className="route">
        <div className="route-fields">
          <ZoneSelect
            id="pickup"
            label={t.rider.pickup}
            value={p.pickupId}
            active={p.activeField === 'pickup'}
            marker="dot"
            onFocus={() => p.onActiveField('pickup')}
            onChange={p.onPickup}
          />
          <ZoneSelect
            id="dest"
            label={t.rider.dest}
            value={p.destId}
            active={p.activeField === 'dest'}
            marker="square"
            invalid={sameZone}
            onFocus={() => p.onActiveField('dest')}
            onChange={p.onDest}
          />
        </div>
        <button className="swap" onClick={swap} aria-label={t.rider.swap} title={t.rider.swap}>
          <SwapIcon />
        </button>
      </div>

      {sameZone ? (
        <p id="route-error" className="field-error" role="alert">
          {t.rider.sameZone}
        </p>
      ) : (
        <p className="route-meta">
          <span>
            {t.rider.route(num(km, 1), minutes)}
          </span>
          <span className="map-tip">
            <MapIcon size={14} />
            {t.rider.mapTip(p.activeField === 'pickup')}
          </span>
        </p>
      )}

      <div className={`notice ${surge ? 'notice-surge' : ''}`} role="status">
        {surge ? <BoltIcon /> : <InfoIcon />}
        <div>
          <b>
            {surge ? t.rider.surgeTitle : t.rider.normalTitle} · {mult(zone.m)}
          </b>
          <span>
            {surge
              ? t.rider.surgeBody(Math.round(zone.demand), Math.round(zone.drivers), pickup.name)
              : zone.ratio > 1
                ? t.rider.risingBody(pickup.name)
                : t.rider.enoughBody(pickup.name)}
          </span>
        </div>
      </div>

      <fieldset className="products">
        <legend>{t.rider.chooseVehicle}</legend>
        {options.map(({ product, base, price, wait, nearby, driver }) => (
          <label key={product.id} className={`product ${product.id === p.productId ? 'selected' : ''}`}>
            <input
              type="radio"
              name="product"
              className="visually-hidden"
              value={product.id}
              checked={product.id === p.productId}
              onChange={() => p.onProduct(product.id)}
            />
            <span className="product-icon">
              <VehicleArt id={product.id} />
            </span>
            <span className="product-text">
              <span className="product-name">
                <b>{product.name}</b>
                <span className="seats" aria-label={t.rider.seats(product.seats)}>
                  <PersonIcon size={12} />
                  {product.seats}
                </span>
              </span>
              <span className="product-eta">
                <ClockIcon size={14} />
                {driver ? t.rider.arrivesIn(wait) : t.rider.noDrivers}{' '}
                <span className="product-nearby">
                  {t.rider.nearby(nearby)}
                </span>
              </span>
              <span>{t.product[product.id]}</span>
            </span>
            <span className="product-price">
              <b>{euros(price)}</b>
              {surge && (
                <s>
                  <span className="visually-hidden">{t.rider.withoutSurge}</span>
                  {euros(base)}
                </s>
              )}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="cta">
        <button
          className="btn btn-primary btn-block btn-large"
          disabled={sameZone || !selected.driver}
          aria-describedby={sameZone ? 'route-error' : 'price-note'}
          onClick={() =>
            selected.driver &&
            p.onRequest({
              pickupId: p.pickupId,
              destId: p.destId,
              productName: selected.product.name,
              price: selected.price,
              m: zone.m,
              waitMinutes: selected.wait,
              tripMinutes: minutes,
              startedAt: performance.now(),
              driver: {
                id: selected.driver.car.id,
                from: selected.driver.car.pos,
                horizontal: selected.driver.car.horizontal,
              },
            })
          }
        >
          <span>{t.rider.confirm(selected.product.name)}</span>
          <span className="cta-price">{euros(selected.price)}</span>
        </button>
        <p id="price-note" className="price-note">
          <LockIcon size={14} />
          {t.rider.priceNote}
        </p>
      </div>
    </section>
  )
}
