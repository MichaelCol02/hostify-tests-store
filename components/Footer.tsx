export default function Footer() {
  return (
    <footer className="bg-verde text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-cormorant text-lg font-bold mb-4">Hostify</h3>
            <p className="text-sm opacity-90">Impulsamos la hospitalidad.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tests</h4>
            <ul className="text-sm space-y-2 opacity-90">
              <li><a href="#" className="hover:opacity-100">5 Niveles</a></li>
              <li><a href="#" className="hover:opacity-100">DISC</a></li>
              <li><a href="#" className="hover:opacity-100">HII</a></li>
              <li><a href="#" className="hover:opacity-100">5 Casas</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="text-sm space-y-2 opacity-90">
              <li><a href="#" className="hover:opacity-100">Términos</a></li>
              <li><a href="#" className="hover:opacity-100">Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-sm opacity-90">info@hostify.co</p>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2026 Hostify. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
