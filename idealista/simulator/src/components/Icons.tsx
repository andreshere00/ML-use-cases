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

export const InfoIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
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

export const HomeIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M3.5 11 12 4l8.5 7" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5.5h4V20" />
  </Icon>
)

export const BedIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M3 18.5V6M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-7V14" />
    <circle cx={7} cy={11} r={1.8} />
  </Icon>
)

export const AreaIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <rect x={4} y={4} width={16} height={16} rx={1.5} />
    <path d="M4 9h3M4 14h3M9 4v3M14 4v3" />
  </Icon>
)

export const LiftIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <rect x={5} y={3.5} width={14} height={17} rx={1.5} />
    <path d="m9 9.5 3-3 3 3M9 14.5l3 3 3-3" />
  </Icon>
)

export const SparkIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </Icon>
)

export const TagIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z" />
    <circle cx={8.5} cy={8.5} r={1.5} />
  </Icon>
)

export const EyeIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx={12} cy={12} r={3} />
  </Icon>
)

export const CheckIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)
