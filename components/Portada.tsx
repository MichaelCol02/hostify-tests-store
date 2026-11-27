import type { ReactNode } from 'react'
import { esClara, marcaDe, type Fuente, type Marca, type Motivo } from '@/lib/marcas'

const FUENTE: Record<Fuente, string> = {
  anton: 'var(--font-anton), Impact, sans-serif',
  serif: 'var(--font-serif), Georgia, serif',
  script: 'var(--font-script), cursive',
  archivo: 'var(--font-archivo), system-ui, sans-serif',
}

/** La carátula de un test. Es decorativa: el nombre real va como texto aparte,
 *  para lectores de pantalla y buscadores. */
export default function Portada({
  id,
  nombre,
  className = '',
  escala = 1,
}: {
  id: string
  nombre: string
  className?: string
  /** Agranda o achica el título, por ejemplo en la ficha grande. */
  escala?: number
}) {
  const m = marcaDe(id, nombre)
  const clara = esClara(m)
  return (
    <div
      aria-hidden="true"
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${m.fondo[0]} 0%, ${m.fondo[1]} 100%)`, containerType: 'inline-size' }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
        <Dibujo m={m} />
      </svg>
      {/* Luz suave y viñeta, para darle profundidad como una foto. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            clara
              ? 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.55), transparent 60%)'
              : 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.16), transparent 55%), radial-gradient(ellipse at 50% 120%, rgba(0,0,0,.28), transparent 60%)',
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center px-[6cqw] text-center" style={{ color: m.tinta }}>
        {m.lineas.map((l, i) => (
          <span
            key={i}
            className="block whitespace-nowrap"
            style={{
              fontFamily: FUENTE[l.f],
              fontSize: `${l.s * escala}cqw`,
              fontStyle: l.i ? 'italic' : 'normal',
              color: l.c ?? m.tinta,
              letterSpacing: l.ls ? `${l.ls}em` : l.f === 'anton' ? '0.01em' : undefined,
              lineHeight: l.f === 'script' ? 1.05 : l.f === 'serif' ? 1.1 : 0.95,
              marginTop: i === 0 ? 0 : l.f === 'script' ? '-0.15em' : '0.08em',
              textShadow: clara ? 'none' : '0 2px 18px rgba(0,0,0,.18)',
            }}
          >
            {l.t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------- Los símbolos de cada test, dibujados en un lienzo de 160 x 100 ----------

const CORAZON = 'M0,-2 C-3,-7 -10,-5 -10,0 C-10,5 -4,8 0,12 C4,8 10,5 10,0 C10,-5 3,-7 0,-2Z'

function puntosEneagrama(cx: number, cy: number, r: number) {
  // El 9 arriba y los demás en el sentido del reloj, cada 40°.
  return Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 40) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
  })
}

function Eneagrama({ cx, cy, r, color, o = 0.35 }: { cx: number; cy: number; r: number; color: string; o?: number }) {
  const p = puntosEneagrama(cx, cy, r)
  const ruta = (ks: number[]) => ks.map((k, i) => `${i ? 'L' : 'M'}${p[k][0].toFixed(2)},${p[k][1].toFixed(2)}`).join(' ') + 'Z'
  return (
    <g fill="none" stroke={color} strokeWidth={0.5} opacity={o}>
      <circle cx={cx} cy={cy} r={r} />
      <path d={ruta([9, 3, 6].map((k) => k % 9))} />
      <path d={ruta([1, 4, 2, 8, 5, 7])} />
      {p.slice(0, 9).map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={1.1} fill={color} stroke="none" />
      ))}
    </g>
  )
}

function Dibujo({ m }: { m: Marca }) {
  const a = m.acento
  const dibujos: Record<Motivo, () => ReactNode> = {
    corazones: () => (
      <g fill="none" stroke={a} strokeWidth={0.35}>
        {[1.4, 2.4, 3.5, 4.8, 6.3, 8].map((s, i) => (
          <path key={i} d={CORAZON} transform={`translate(132 58) scale(${s})`} opacity={0.55 - i * 0.07} vectorEffect="non-scaling-stroke" strokeWidth={1} />
        ))}
        {[1, 1.8, 2.8].map((s, i) => (
          <path key={'b' + i} d={CORAZON} transform={`translate(18 14) scale(${s})`} opacity={0.35 - i * 0.08} vectorEffect="non-scaling-stroke" strokeWidth={1} />
        ))}
      </g>
    ),
    anillos: () => (
      <g fill="none" stroke={a}>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={0.5 - i * 0.08} strokeWidth={0.4 + i * 0.1}>
            <circle cx={62} cy={50} r={24 + i * 9} />
            <circle cx={98} cy={50} r={24 + i * 9} />
          </g>
        ))}
      </g>
    ),
    raices: () => (
      <g fill="none" stroke={a}>
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={80} cy={128} r={18 + i * 11} strokeWidth={0.45} opacity={0.42 - i * 0.025} />
        ))}
        {[-60, -35, -12, 12, 35, 60].map((g, i) => (
          <path key={'r' + i} d={`M80,128 Q${80 + g * 0.6},70 ${80 + g * 1.6},${12 + Math.abs(g) * 0.2}`} strokeWidth={0.35} opacity={0.25} />
        ))}
      </g>
    ),
    arcoiris: () => {
      const colores = ['#E5466F', '#F59E0B', '#0E9F8E', '#2F6FEB', '#7357F6', '#2F9E5B', '#FF6B2C', '#14213D']
      return (
        <g fill="none" strokeLinecap="round">
          {colores.slice(0, 4).map((c, i) => {
            const r = 44 - i * 8
            return <path key={i} d={`M-4,${-4 + r} A${r},${r} 0 0 0 ${-4 + r},-4`} stroke={c} strokeWidth={6} opacity={0.9} />
          })}
          {colores.slice(4).map((c, i) => {
            const r = 44 - i * 8
            return <path key={'b' + i} d={`M${164 - r},104 A${r},${r} 0 0 1 164,${104 - r}`} stroke={c} strokeWidth={6} opacity={0.9} />
          })}
        </g>
      )
    },
    rueda: () => (
      <g transform="translate(128 50)">
        {Array.from({ length: 12 }, (_, i) => {
          const a0 = (i * 30 * Math.PI) / 180
          const a1 = ((i + 1) * 30 * Math.PI) / 180
          const r = 40 + (i % 3) * 9
          return (
            <path
              key={i}
              d={`M0,0 L${r * Math.cos(a0)},${r * Math.sin(a0)} A${r},${r} 0 0 1 ${r * Math.cos(a1)},${r * Math.sin(a1)}Z`}
              fill={a}
              opacity={0.06 + (i % 4) * 0.04}
              stroke={a}
              strokeWidth={0.3}
              strokeOpacity={0.4}
            />
          )
        })}
        <circle r={9} fill="none" stroke={a} strokeWidth={0.4} opacity={0.6} />
      </g>
    ),
    barras: () => (
      <g>
        {Array.from({ length: 9 }, (_, i) => {
          const h = 10 + i * i * 0.9
          return <rect key={i} x={96 + i * 7.2} y={100 - h} width={4.6} height={h} rx={1} fill={a} opacity={0.1 + i * 0.03} />
        })}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={'m' + i} cx={22} cy={86 - i * 3.4} rx={11} ry={3} fill="none" stroke={a} strokeWidth={0.45} opacity={0.5 - i * 0.06} />
        ))}
        <path d="M6,78 C40,74 70,60 96,48 S140,18 158,8" fill="none" stroke={a} strokeWidth={0.6} opacity={0.55} strokeDasharray="1.5 1.5" />
      </g>
    ),
    grietas: () => (
      <g fill="none" stroke={a} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-2,22 L18,26 L27,18 L44,30 L52,24 L66,34" strokeWidth={0.7} opacity={0.75} />
        <path d="M27,18 L30,6 L40,-2" strokeWidth={0.45} opacity={0.55} />
        <path d="M96,104 L102,86 L118,80 L122,66 L138,60 L150,46 L164,44" strokeWidth={0.75} opacity={0.8} />
        <path d="M122,66 L132,74 L146,74 L162,84" strokeWidth={0.45} opacity={0.55} />
        <path d="M102,86 L92,78" strokeWidth={0.4} opacity={0.5} />
        <path d="M-4,84 L10,80 L16,90 L30,92" strokeWidth={0.5} opacity={0.5} />
      </g>
    ),
    rayos: () => (
      <g stroke={a}>
        {Array.from({ length: 36 }, (_, i) => {
          const g = (i * 10 * Math.PI) / 180
          return <line key={i} x1={80 + 14 * Math.cos(g)} y1={50 + 14 * Math.sin(g)} x2={80 + 120 * Math.cos(g)} y2={50 + 120 * Math.sin(g)} strokeWidth={i % 2 ? 0.25 : 0.5} opacity={i % 2 ? 0.2 : 0.35} />
        })}
      </g>
    ),
    cuadrantes: () => (
      <g>
        <defs>
          <filter id="difuso" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g filter="url(#difuso)" opacity={0.95}>
          <circle cx={30} cy={22} r={34} fill="#E5463B" />
          <circle cx={130} cy={22} r={34} fill="#F5B800" />
          <circle cx={30} cy={82} r={34} fill="#2F6FEB" />
          <circle cx={130} cy={82} r={34} fill="#2F9E5B" />
        </g>
        <g stroke="#fff" strokeWidth={0.3} opacity={0.35}>
          <line x1={80} y1={0} x2={80} y2={100} />
          <line x1={0} y1={50} x2={160} y2={50} />
        </g>
      </g>
    ),
    escalones: () => (
      <g fill="none" stroke={a} strokeLinejoin="round">
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M${78 + k * 4},${104} ${[0, 1, 2, 3, 4].map((i) => `V${92 - i * 15 - k * 4} H${94 + i * 15 + k * 4}`).join(' ')} V-4`}
            strokeWidth={0.5}
            opacity={0.55 - k * 0.15}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={86 + i * 15} cy={88 - i * 15} r={1.2} fill={a} stroke="none" opacity={0.7} />
        ))}
      </g>
    ),
    checks: () => (
      <g>
        {Array.from({ length: 5 }, (_, f) =>
          Array.from({ length: 16 }, (_, c) => {
            const x = 2 + c * 10
            const y = 4 + f * 21
            const lleno = (c * 7 + f * 3) % 5 === 0
            if (c > 1 && c < 14 && f > 0 && f < 4) return null
            return (
              <g key={`${f}-${c}`}>
                <rect x={x} y={y} width={6.5} height={6.5} rx={1.6} fill={lleno ? a : 'none'} stroke={a} strokeWidth={0.4} opacity={lleno ? 0.85 : 0.4} />
                {lleno && <path d={`M${x + 1.6},${y + 3.3} l1.4,1.4 l2.4,-2.8`} stroke="#fff" strokeWidth={0.7} fill="none" strokeLinecap="round" />}
              </g>
            )
          }),
        )}
      </g>
    ),
    casas: () => (
      <g fill="none" stroke={a} strokeLinejoin="round">
        {[0, 1, 2, 3, 4].map((i) => {
          const w = 12 + i * 4
          const x = 6 + i * 31 + (4 - i) * 2
          const base = 98
          const h = w * 0.8
          return (
            <path
              key={i}
              d={`M${x},${base} V${base - h} L${x + w / 2},${base - h - w * 0.55} L${x + w},${base - h} V${base}`}
              strokeWidth={0.5}
              opacity={0.3 + i * 0.1}
            />
          )
        })}
        <line x1={0} y1={98} x2={160} y2={98} strokeWidth={0.4} opacity={0.4} />
      </g>
    ),
    eneagrama: () => <Eneagrama cx={80} cy={50} r={46} color={a} o={0.4} />,
    'eneagrama-doble': () => (
      <g>
        <Eneagrama cx={52} cy={50} r={40} color={a} o={0.35} />
        <Eneagrama cx={108} cy={50} r={40} color="#B7A6FF" o={0.35} />
      </g>
    ),
  }
  return <>{dibujos[m.motivo]()}</>
}
