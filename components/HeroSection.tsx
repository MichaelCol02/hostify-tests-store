import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-verde via-verde-light to-marron py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="font-cormorant text-5xl md:text-6xl font-bold mb-6">
          Evalúa tu liderazgo y hospitalidad
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
          5 tests especializados para líderes y profesionales en hospitalidad. Resultados inmediatos y plan de desarrollo personalizado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tests" className="btn-primary bg-white text-verde hover:bg-gray-100">
            Ver todos los tests
          </Link>
          <button className="btn-secondary border-white text-white hover:bg-white/10">
            Prueba gratis
          </button>
        </div>
      </div>
    </section>
  )
}
