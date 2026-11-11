// Ilustraciones laterales de cada producto, en la línea de las imágenes de la app:
// UberX compacto claro, Comfort tipo SUV gris y Black berlina negra.

interface Shape {
  body: string
  windows: string[]
  wheels: [number, number]
  color: string
  shade: string
}

const SHAPES: Record<string, Shape> = {
  x: {
    body: 'M5 25V19.5C5 16.6 6.6 15.4 9.4 15L18 13.8 23.6 8.3C24.6 7.4 25.9 7 27.3 7H41.5C43.4 7 45 7.8 46.2 9.2L50.6 14.4 57.4 15.4C60.6 15.9 62 17.6 62 20.4V25C62 26.1 61.1 27 60 27H7C5.9 27 5 26.1 5 25Z',
    windows: ['M25.4 9.3H35.4V14H20.9Z', 'M37.6 9.3H41.6C42.7 9.3 43.6 9.8 44.3 10.6L47.4 14H37.6Z'],
    wheels: [17.5, 50],
    color: '#e3e6ea',
    shade: '#b9bec6',
  },
  comfort: {
    body: 'M4 25V17.6C4 14.9 5.6 13.4 8.3 13.1L16.4 12.3 20.8 5.9C21.6 4.8 22.8 4.2 24.1 4.2H45.2C46.9 4.2 48.4 5 49.4 6.3L54.2 12.4 57.8 12.9C60.6 13.3 62 15 62 17.7V25C62 26.1 61.1 27 60 27H6C4.9 27 4 26.1 4 25Z',
    windows: ['M22.6 6.6H33.6V12.3H18.6Z', 'M35.8 6.6H45.2C46.1 6.6 46.9 7 47.4 7.7L51.3 12.3H35.8Z'],
    wheels: [17, 50.5],
    color: '#7d848e',
    shade: '#5b6169',
  },
  black: {
    body: 'M2.5 24.5V20.6C2.5 18 4.2 16.6 7 16.3L17.6 15.2 24.2 9.6C25.3 8.7 26.6 8.2 28 8.2H41.4C43.2 8.2 44.8 8.9 46 10.2L51.2 15.4 60.2 16.4C62.6 16.7 63.5 18.2 63.5 20.4V24.5C63.5 25.9 62.4 27 61 27H5C3.6 27 2.5 25.9 2.5 24.5Z',
    windows: ['M27 10.4H36.4V15.2H21.8Z', 'M38.6 10.4H41.6C42.6 10.4 43.5 10.8 44.2 11.5L47.8 15.2H38.6Z'],
    wheels: [16, 51.5],
    color: '#16181b',
    shade: '#000',
  },
}

export function VehicleArt({ id }: { id: string }) {
  const s = SHAPES[id] ?? SHAPES.x
  return (
    <svg viewBox="0 0 66 34" width="66" height="34" aria-hidden="true" focusable="false">
      <ellipse cx={33} cy={30.5} rx={29} ry={2.2} fill="#000" opacity={0.12} />
      <path d={s.body} fill={s.color} stroke={s.shade} strokeWidth={1} />
      {/* Línea de cintura y tirador: dan volumen sin recargar el dibujo. */}
      <path d="M8 19.5H58" stroke={s.shade} strokeWidth={0.8} opacity={0.7} fill="none" />
      {s.windows.map((d) => (
        <path key={d} d={d} fill={id === 'black' ? '#4a525d' : '#2a2f36'} />
      ))}
      <rect x={38} y={17} width={4} height={1.2} rx={0.6} fill={s.shade} />
      {/* Faros delantero y trasero. */}
      <rect x={58.6} y={17.4} width={3} height={1.8} rx={0.9} fill="#ffd877" />
      <rect x={4.6} y={18} width={2.2} height={1.8} rx={0.9} fill="#e0413a" />
      {s.wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={27} r={5.2} fill="#111" />
          <circle cx={cx} cy={27} r={2.4} fill="#9aa1aa" />
        </g>
      ))}
    </svg>
  )
}
