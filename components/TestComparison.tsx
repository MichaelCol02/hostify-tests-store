import Link from 'next/link'
import { CATALOG } from '@/lib/catalog'
import { formatPrecio, getTestPrice } from '@/lib/pricing'
import TestIcon from './TestIcon'

export default function TestComparison() {
  return (
    <div className="overflow-x-auto rounded-4xl bg-white shadow-soft ring-1 ring-black/[0.05]">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-black/[0.06] text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">
            <th scope="col" className="px-6 py-5">Test</th>
            <th scope="col" className="px-6 py-5">Qué mide</th>
            <th scope="col" className="px-6 py-5">Ideal para</th>
            <th scope="col" className="px-6 py-5">Qué recibes</th>
            <th scope="col" className="px-6 py-5 text-right">Duración</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.06]">
          {CATALOG.map((t) => (
            <tr key={t.id} className="align-top transition hover:bg-ink-50">
              <th scope="row" className="px-6 py-5 font-semibold">
                <Link href={`/tests/${t.id}`} className="flex items-center gap-3 hover:text-brand-deep">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                    <TestIcon name={t.icon} className="h-4 w-4" />
                  </span>
                  {t.name}
                </Link>
              </th>
              <td className="px-6 py-5 text-sm text-ink-500">{t.measures}</td>
              <td className="px-6 py-5 text-sm text-ink-500">{t.idealFor}</td>
              <td className="px-6 py-5 text-sm text-ink-500">{t.deliver}</td>
              <td className="whitespace-nowrap px-6 py-5 text-right text-sm text-ink-500">
                {t.duration}
                <span className="mt-1 block font-display text-base font-semibold tracking-tighter text-ink">
                  {formatPrecio(getTestPrice(t.credits))}
                  {t.people > 1 && <span className="ml-1 text-xs font-normal text-ink-400">para los dos</span>}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
