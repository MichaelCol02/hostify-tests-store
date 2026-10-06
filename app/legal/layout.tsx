import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BORRADOR } from '@/lib/legal'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow pb-28 pt-12 sm:pt-16">
        <div className="container-x max-w-3xl">
          {BORRADOR && (
            <p className="mb-10 rounded-3xl bg-amber-50 px-5 py-4 text-sm text-amber-900 ring-1 ring-amber-200">
              <strong className="font-semibold">Borrador.</strong> Faltan los datos de la empresa y la revisión de un
              abogado. No uses este texto como documento definitivo todavía.
            </p>
          )}
          <article className="prose-hostify">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  )
}
