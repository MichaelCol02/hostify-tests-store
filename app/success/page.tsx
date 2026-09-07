import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-8">
            <div className="inline-block w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="font-cormorant text-4xl font-bold text-verde mb-4">¡Compra confirmada!</h1>
          <p className="text-gray-600 text-lg mb-8">
            Tu acceso a los tests está activado. Ya puedes empezar a responder las preguntas completas.
          </p>

          <div className="space-y-4">
            <Link href="/dashboard" className="block btn-primary">
              Ver mi panel
            </Link>
            <Link href="/tests" className="block btn-secondary">
              Ver otros tests
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
