const DIMENSIONS = [
  { label: 'Conciencia personal', value: 86 },
  { label: 'Inteligencia relacional', value: 92 },
  { label: 'Experiencias memorables', value: 78 },
  { label: 'Cultura de servicio', value: 71 },
  { label: 'Liderazgo', value: 84 },
]

export default function ReportPreview() {
  const score = 82
  const circumference = 2 * Math.PI * 42

  return (
    <div className="relative mx-auto w-full max-w-3xl animate-float">
      <div aria-hidden="true" className="absolute inset-x-10 -bottom-10 h-40 rounded-full bg-brand/40 blur-3xl" />
      <div className="relative overflow-hidden rounded-4xl bg-white/[0.06] p-2 ring-1 ring-white/15 backdrop-blur-2xl">
        <div className="rounded-[1.6rem] bg-gradient-to-b from-white to-ink-100 p-6 text-ink sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep">Ejemplo de resultado</p>
              <p className="mt-1 font-display text-xl font-semibold tracking-tighter sm:text-2xl">Hospitality Intelligence Index</p>
            </div>
            <span className="hidden rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white sm:inline-flex">Nivel Anfitrión</span>
          </div>

          <div className="mt-8 grid items-center gap-8 sm:grid-cols-[auto,1fr]">
            <div className="relative mx-auto h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                <defs>
                  <linearGradient id="score-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8A55" />
                    <stop offset="100%" stopColor="#D94D1A" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#E8E8ED" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#score-ring)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - score / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-semibold tracking-tightest">{score}</span>
                <span className="text-[11px] text-ink-400">de 100</span>
              </div>
            </div>

            <ul className="space-y-3.5">
              {DIMENSIONS.map((d, i) => (
                <li key={d.label}>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-ink-500">{d.label}</span>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-300/50">
                    <div
                      className="h-full origin-left animate-bar-grow rounded-full bg-gradient-to-r from-[#FF8A55] to-brand-deep"
                      style={{ width: `${d.value}%`, animationDelay: `${400 + i * 120}ms` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
