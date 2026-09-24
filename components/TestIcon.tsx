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
  // El trazo del eneagrama: la circunferencia, el triángulo 3-6-9 y la hexada.
  enneagram: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3l7.8 13.5H4.2z" />
      <path d="M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    </>
  ),
  couple: (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  // Las doce áreas se leen como un árbol: raíz, tronco, ramas y fruto.
  tree: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14 7.5 9.5M12 14l4.5-4.5" />
      <circle cx="12" cy="6" r="3.2" />
      <circle cx="6" cy="11" r="2.4" />
      <circle cx="18" cy="11" r="2.4" />
    </>
  ),
  money: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10" />
      <path d="M14.5 9.5c0-1.1-1.1-1.8-2.5-1.8s-2.5.7-2.5 1.8c0 2.6 5 1.6 5 4.2 0 1.1-1.1 1.8-2.5 1.8s-2.5-.7-2.5-1.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z" />
      <path d="M12 9.5v3.5" />
      <path d="M12 16h.01" />
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
