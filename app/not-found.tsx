import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-grow items-center justify-center px-5 py-24">
        <div className="text-center">
          <p className="font-display text-[8rem] font-semibold leading-none tracking-tightest text-gradient sm:text-[11rem]">404</p>
          <h1 className="mt-4 text-3xl font-semibold">Esta página no existe.</h1>
          <p className="mt-3 text-ink-500">Quizá cambió de lugar. Volvamos a lo importante.</p>
          <Link href="/" className="btn-primary mt-8 px-7 py-3.5">
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
