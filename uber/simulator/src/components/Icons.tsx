// Iconos de línea a 20 px. Son decorativos: el texto del botón da el nombre accesible.
import type { ReactNode } from 'react'

function Icon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const PlayIcon = () => (
  <Icon>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
  </Icon>
)

export const PauseIcon = () => (
  <Icon>
    <rect x={6} y={4.5} width={4} height={15} rx={1} fill="currentColor" stroke="none" />
    <rect x={14} y={4.5} width={4} height={15} rx={1} fill="currentColor" stroke="none" />
  </Icon>
)

export const RainIcon = () => (
  <Icon>
    <path d="M7 15a4.5 4.5 0 1 1 1.6-8.7A5.5 5.5 0 0 1 19 9a3.5 3.5 0 0 1-1 6z" />
    <path d="M8.5 18l-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5" />
  </Icon>
)

export const ConcertIcon = () => (
  <Icon>
    <path d="M9 18V5.5l11-2V16" />
    <circle cx={6.5} cy={18} r={2.5} />
    <circle cx={17.5} cy={16} r={2.5} />
  </Icon>
)

export const ResetIcon = () => (
  <Icon>
    <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
    <path d="M3.5 3.5V8H8" />
  </Icon>
)

export const ClockIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <circle cx={12} cy={12} r={8.5} />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)

export const PersonIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <circle cx={12} cy={7.5} r={4} fill="currentColor" stroke="none" />
    <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" fill="currentColor" stroke="none" />
  </Icon>
)

export const SwapIcon = () => (
  <Icon>
    <path d="M8 4v16M8 4 4.5 7.5M8 4l3.5 3.5M16 20V4M16 20l-3.5-3.5M16 20l3.5-3.5" />
  </Icon>
)

export const BoltIcon = () => (
  <Icon>
    <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z" fill="currentColor" />
  </Icon>
)

export const InfoIcon = () => (
  <Icon>
    <circle cx={12} cy={12} r={8.5} />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
)

export const MapIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z" />
    <path d="M9 4v14M15 6v14" />
  </Icon>
)

export const LockIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <rect x={5} y={10.5} width={14} height={10} rx={2} />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Icon>
)

export const GlobeIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Icon>
)

export const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const CheckIcon = () => (
  <Icon>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)
