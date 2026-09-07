'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="font-cormorant text-4xl font-bold text-verde mb-4">Oops...</h1>
        <p className="text-gray-600 mb-6">
          Algo salió mal. Por favor intenta de nuevo.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="btn-primary w-full"
          >
            Intentar de nuevo
          </button>
          <Link href="/" className="btn-secondary block w-full">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
