'use client'

import Link from 'next/link'
import { LogoMark } from '@/components/Logo'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-8 text-4xl font-semibold tracking-tightest">Algo no salió bien.</h1>
        <p className="mt-3 text-ink-500">Fue un error de nuestra parte. Intenta de nuevo en un momento.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => reset()} className="btn-primary px-7 py-3.5">
            Intentar de nuevo
          </button>
          <Link href="/" className="btn-ghost px-7 py-3.5">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
