import Link from 'next/link'
import Logo from './Logo'
import { CATALOG } from '@/lib/catalog'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/[0.06] bg-ink-50">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
            Impulsamos la hospitalidad. Evaluaciones creadas para los equipos que hacen sentir a otros como en casa.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Tests</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATALOG.map((t) => (
              <li key={t.id}>
                <Link href={`/tests/${t.id}`} className="text-ink-500 transition hover:text-ink">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Hostify</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/precios" className="text-ink-500 transition hover:text-ink">Precios</Link></li>
            <li><Link href="/dashboard" className="text-ink-500 transition hover:text-ink">Mi panel</Link></li>
            <li><a href="mailto:michael2colmenares@gmail.com" className="text-ink-500 transition hover:text-ink">Contacto</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-black/[0.06] py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Hostify. Todos los derechos reservados.</p>
        <p>Pagos seguros con Stripe · Precios en USD</p>
      </div>
    </footer>
  )
}
