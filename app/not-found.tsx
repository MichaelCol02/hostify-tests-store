import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="font-cormorant text-6xl font-bold text-verde mb-4">404</h1>
          <p className="text-gray-600 text-lg mb-8">Página no encontrada</p>
          <Link href="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
