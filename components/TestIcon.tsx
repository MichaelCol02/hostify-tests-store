import type { TestIcon as IconName } from '@/lib/catalog'

const PATHS: Record<IconName, React.ReactNode> = {
  hospitality: (
    <>
      <path d="M4 20h16" />
      <path d="M6 20v-6a6 6 0 0 1 12 0v6" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1" />
    </>
  ),
  disc: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16" />
    </>
  ),
  voice: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  levels: (
    <>
      <path d="M4 20h16" />
      <path d="M6 20v-4M10 20v-7M14 20v-10M18 20V5" />
    </>
  ),
  houses: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
}

export default function TestIcon({ name, className = 'h-6 w-6' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
