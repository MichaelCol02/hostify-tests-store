import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AccesoRecurso from '@/components/AccesoRecurso'
import { PRODUCTOS, getProducto } from '@/lib/productos'

export const revalidate = 600

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ id: p.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const producto = getProducto(params.id)
  if (!producto) return {}
  return { title: `${producto.nombre} — Hostify Tests`, description: producto.descripcion }
}

export default function KitPage({ params }: { params: { id: string } }) {
  const producto = getProducto(params.id)
  if (!producto) notFound()

  return (
    <>
      <Header />
      <main className="flex-grow px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Recurso profesional</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tightest sm:text-5xl">{producto.nombre}</h1>
          <p className="mt-4 text-lg text-ink-500">{producto.descripcion}</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-4xl bg-white p-7 shadow-soft ring-1 ring-black/[0.05]">
              <h2 className="text-lg font-semibold">Para quién es</h2>
              <ul className="mt-4 space-y-3 text-[15px] text-ink-700">
                {producto.paraQuien.map((linea) => (
                  <li key={linea} className="flex gap-2.5">
                    <Punto />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-4xl bg-white p-7 shadow-soft ring-1 ring-black/[0.05]">
              <h2 className="text-lg font-semibold">Qué incluye</h2>
              <ul className="mt-4 space-y-3 text-[15px] text-ink-700">
                {producto.incluye.map((linea) => (
                  <li key={linea} className="flex gap-2.5">
                    <Punto />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <AccesoRecurso producto={producto} />
          </div>

          {producto.despuesDe && (
            <p className="mt-8 text-center text-sm text-ink-500">
              ¿Todavía no has hecho el test?{' '}
              <Link href={`/tests/${producto.despuesDe}`} className="font-medium text-brand-deep hover:underline">
                Empieza por ahí
              </Link>
              : el kit se entiende mejor cuando ya conoces tu propia armadura.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function Punto() {
  return (
    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 5.2 4.1 7.3 8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
