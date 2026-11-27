import type { CatalogTest } from '@/lib/catalog'
import { FICHAS } from '@/lib/fichas'
import { colorVivo, marcaDe } from '@/lib/marcas'
import Portada from './Portada'

/** La historia del test en su ficha: para quién es, qué descubres, cómo se ve
 *  el resultado y en qué se basa. Los tests sin historia escrita muestran un
 *  bloque corto con lo que mide, para quién es y qué recibes. */
export default function FichaHistoria({ test }: { test: CatalogTest }) {
  const f = FICHAS[test.id]
  const marca = marcaDe(test.id, test.name)
  const color = colorVivo(marca)

  if (!f) {
    return (
      <section className="py-20">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {[
            { k: 'Qué mide', v: test.measures },
            { k: 'Para quién es', v: test.idealFor },
            { k: 'Qué recibes', v: test.deliver },
          ].map((b) => (
            <div key={b.k} className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-black/[0.05]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color }}>{b.k}</p>
              <p className="mt-3 text-[17px] leading-relaxed text-ink-700">{b.v}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      {/* 1 · Para quién es */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold leading-[1.12] sm:text-[2.6rem]">{f.dolor.titulo}</h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-500">
              {f.dolor.parrafos.map((p, i) =>
                i === 1 ? (
                  <p key={i} className="border-l-4 py-1 pl-5 font-display text-2xl font-semibold leading-snug tracking-tighter text-ink" style={{ borderColor: color }}>
                    {p}
                  </p>
                ) : (
                  <p key={i}>{p}</p>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Lo que vas a descubrir */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:gap-16">
          <div className="overflow-hidden rounded-[1.75rem] shadow-lift">
            <Portada id={test.id} nombre={test.name} className="aspect-[4/5]" escala={1.35} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>Lo que vas a descubrir</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{f.dolor.frase}</h2>
            <ol className="mt-8 space-y-4">
              {f.descubres.map((d, i) => (
                <li key={d} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white" style={{ background: color }}>
                    {i + 1}
                  </span>
                  <span className="pt-1 text-lg leading-snug text-ink-700">{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 3 · Así se ve tu resultado */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>Así se ve tu resultado</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {f.resultado.length} partes, al terminar.
            </h2>
            <p className="mt-4 text-lg text-ink-500">Todo esto llega apenas respondes la última pregunta. Lo puedes volver a abrir cuando quieras.</p>
          </div>
          <ol className="mt-10 divide-y divide-black/[0.06] overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/[0.05]">
            {f.resultado.map((r, i) => (
              <li key={r.t} className="flex items-center gap-4 p-4 sm:gap-6 sm:p-5">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-semibold sm:h-20 sm:w-28 sm:text-2xl"
                  style={{ background: `linear-gradient(135deg, ${marca.fondo[0]}, ${marca.fondo[1]})`, color: marca.tinta }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-snug">{r.t}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-500">{r.d}</p>
                </div>
                <span className="hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline" style={{ background: `${color}1A`, color }}>
                  Incluido
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 · En qué se basa */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>En qué se basa</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Un modelo serio, en palabras sencillas.</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl items-center gap-8 overflow-hidden rounded-[1.75rem] p-6 sm:grid-cols-[auto,1fr] sm:p-10" style={{ background: marca.profundo }}>
            <div
              aria-hidden="true"
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full font-display text-4xl font-semibold ring-4 ring-white/10 sm:h-40 sm:w-40 sm:text-5xl"
              style={{ background: `linear-gradient(135deg, ${marca.fondo[0]}, ${marca.fondo[1]})`, color: marca.tinta }}
            >
              {f.base.sello}
            </div>
            <div className="text-white">
              <p className="text-sm text-white/50">Basado en el trabajo de</p>
              <h3 className="mt-1 text-3xl font-semibold text-white">{f.base.autor}</h3>
              <p className="mt-1 text-[15px]" style={{ color: marca.acento }}>{f.base.quien}</p>
              <p className="mt-5 text-[17px] leading-relaxed text-white/75">{f.base.texto}</p>
              <p className="mt-5 text-sm text-white/50">
                Lectura de referencia: <span className="italic text-white/75">{f.base.libro}</span>
              </p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-ink-400">
            Preguntas e interpretación propias de Hostify, escritas desde cero. No es el cuestionario oficial del autor ni está
            afiliado a él. Es una herramienta de autoconocimiento, no un diagnóstico.
          </p>
        </div>
      </section>
    </>
  )
}
