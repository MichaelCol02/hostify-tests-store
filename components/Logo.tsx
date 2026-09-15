import { useId } from 'react'

type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, { mark: string; text: string }> = {
  sm: { mark: 'h-6 w-6', text: 'text-lg' },
  md: { mark: 'h-7 w-7', text: 'text-xl' },
  lg: { mark: 'h-10 w-10', text: 'text-3xl' },
}

// Vector recreation of the Hostify isotype from the brand manual; replace with the official SVG when available.
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8A55" />
          <stop offset="55%" stopColor="#FF6B2C" />
          <stop offset="100%" stopColor="#D94D1A" />
        </linearGradient>
      </defs>
      <rect x="4" y="3" width="10" height="34" rx="5" fill={`url(#${id})`} />
      <rect x="26" y="3" width="10" height="34" rx="5" fill={`url(#${id})`} />
      <path d="M9 27.5 31 12.5" stroke={`url(#${id})`} strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ size = 'md', tone = 'dark' }: { size?: Size; tone?: 'dark' | 'light' }) {
  const s = SIZES[size]
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={s.mark} />
      <span className={`font-display font-semibold leading-none tracking-tighter ${s.text} ${tone === 'light' ? 'text-white' : 'text-ink'}`}>
        Host<span className="text-gradient">ify</span>
      </span>
    </span>
  )
}
