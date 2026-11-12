import { euros, mult, num } from '../format'
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

const PHASE_TEXT = {
  searching: 'Buscando un conductor cercano…',
  pickup: 'Tu conductor va de camino',
  ontrip: 'En viaje hacia tu destino',
  done: 'Has llegado',
}

const STEPS = [
  { id: 'searching', label: 'Buscando' },
  { id: 'pickup', label: 'Recogida' },
  { id: 'ontrip', label: 'En viaje' },
] as const

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
  const { phase, progress } = p.progress
  const stepIndex = phase === 'done' ? STEPS.length : STEPS.findIndex((s) => s.id === phase)
  const pickupName = ZONE_BY_ID[p.trip.pickupId].name
  const minutesLeft =
    phase === 'pickup'
      ? Math.max(1, Math.ceil(p.trip.waitMinutes * (1 - progress)))
      : phase === 'ontrip'
        ? Math.max(1, Math.ceil(p.trip.tripMinutes * (1 - progress)))
        : null
  const mNow = current(p.sim, p.trip.pickupId).m

  return (
    <section className="panel rider" aria-label="Viaje en curso">
      <h2 aria-live="polite">{PHASE_TEXT[phase]}</h2>
      <p className="muted">
        {pickupName} → {ZONE_BY_ID[p.trip.destId].name} · {p.trip.productName}
      </p>

      <ol className="stepper" aria-label="Progreso del viaje">
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'
          return (
            <li key={s.id} className={`trip-step trip-step-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <div className="step-bar">
                <div style={{ width: `${(state === 'done' ? 1 : state === 'current' ? progress : 0) * 100}%` }} />
              </div>
              <span>{s.label}</span>
            </li>
          )
        })}
      </ol>

      {minutesLeft !== null && (
        <p className="eta-big">
          <ClockIcon size={18} />
          {phase === 'pickup' ? `Llega en ${minutesLeft} min` : `Llegas en ${minutesLeft} min`}
        </p>
      )}

      <div className="price-lock">
        <LockIcon size={18} />
        <div>
          <b>{euros(p.trip.price)}</b>
          <span>Precio cerrado con {mult(p.trip.m)}. No cambia durante el viaje.</span>
        </div>
      </div>

      <dl className="receipt">
        <div>
          <dt>Multiplicador ahora en {pickupName}</dt>
          <dd>
            {mult(mNow)}{' '}
            <span className={mNow > p.trip.m ? 'delta up' : mNow < p.trip.m ? 'delta down' : 'delta'}>
              {mNow > p.trip.m + 0.005 ? '▲' : mNow < p.trip.m - 0.005 ? '▼' : '='}
            </span>
          </dd>
        </div>
        <div>
          <dt>Espera y trayecto estimados</dt>
          <dd>
            {p.trip.waitMinutes} + {p.trip.tripMinutes} min
          </dd>
        </div>
      </dl>

      <button className={`btn btn-block btn-large ${phase === 'done' ? 'btn-primary' : 'btn-secondary'}`} onClick={p.onClear}>
        {phase === 'done' ? 'Pedir otro viaje' : 'Cancelar viaje'}
      </button>
    </section>
  )
}

export function RiderPanel(p: Props) {
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
      <h2 id="rider-title">Pide un viaje</h2>

      <div className="route">
        <div className="route-fields">
          <ZoneSelect
            id="pickup"
            label="Recogida"
            value={p.pickupId}
            active={p.activeField === 'pickup'}
            marker="dot"
            onFocus={() => p.onActiveField('pickup')}
            onChange={p.onPickup}
          />
          <ZoneSelect
            id="dest"
            label="Destino"
            value={p.destId}
            active={p.activeField === 'dest'}
            marker="square"
            invalid={sameZone}
            onFocus={() => p.onActiveField('dest')}
            onChange={p.onDest}
          />
        </div>
        <button className="swap" onClick={swap} aria-label="Intercambiar recogida y destino" title="Intercambiar recogida y destino">
          <SwapIcon />
        </button>
      </div>

      {sameZone ? (
        <p id="route-error" className="field-error" role="alert">
          La recogida y el destino son la misma zona. Elige otro destino.
        </p>
      ) : (
        <p className="route-meta">
          <span>
            {num(km, 1)} km · {minutes} min de trayecto
          </span>
          <span className="map-tip">
            <MapIcon size={14} />
            Toca el mapa para elegir {p.activeField === 'pickup' ? 'la recogida' : 'el destino'}
          </span>
        </p>
      )}

      <div className={`notice ${surge ? 'notice-surge' : ''}`} role="status">
        {surge ? <BoltIcon /> : <InfoIcon />}
        <div>
          <b>
            {surge ? 'Tarifas más altas por la demanda' : 'Tarifa normal'} · {mult(zone.m)}
          </b>
          <span>
            {surge
              ? `Hay ${Math.round(zone.demand)} solicitudes para ${Math.round(zone.drivers)} conductores en ${pickup.name}.`
              : zone.ratio > 1
                ? `La demanda empieza a superar a los conductores en ${pickup.name}.`
                : `Hay conductores suficientes en ${pickup.name}.`}
          </span>
        </div>
      </div>

      <fieldset className="products">
        <legend>Elige un vehículo</legend>
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
                <span className="seats" aria-label={`${product.seats} plazas`}>
                  <PersonIcon size={12} />
                  {product.seats}
                </span>
              </span>
              <span className="product-eta">
                <ClockIcon size={14} />
                {driver ? `Llega en ${wait} min` : 'Sin conductores libres'}{' '}
                <span className="product-nearby">
                  {nearby === 0 ? 'ninguno en la zona' : nearby === 1 ? '1 libre en la zona' : `${nearby} libres en la zona`}
                </span>
              </span>
              <span>{product.description}</span>
            </span>
            <span className="product-price">
              <b>{euros(price)}</b>
              {surge && (
                <s>
                  <span className="visually-hidden">Sin recargo: </span>
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
          <span>Confirmar {selected.product.name}</span>
          <span className="cta-price">{euros(selected.price)}</span>
        </button>
        <p id="price-note" className="price-note">
          <LockIcon size={14} />
          Pagas este precio aunque la tarifa cambie durante el viaje.
        </p>
      </div>
    </section>
  )
}
