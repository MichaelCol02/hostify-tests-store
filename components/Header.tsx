import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-verde rounded-full flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
          <span className="font-cormorant text-xl font-bold text-verde">Hostify Tests</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/tests" className="text-gray-600 hover:text-verde">Tests</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-verde">Mi panel</Link>
          <Link href="/" className="btn-primary text-sm">
            Ingresar
          </Link>
        </div>
      </nav>
    </header>
  )
}
