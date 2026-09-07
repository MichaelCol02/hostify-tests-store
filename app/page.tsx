import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import TestCard from '@/components/TestCard'
import { Test } from '@/lib/types'

const tests: Test[] = [
  {
    id: 'checkbox-5-niveles',
    name: 'Checkbox 5 Niveles',
    description: 'Auditoría de nivel basada en 50 casillas. ¿Dónde estás hoy?',
    duration: '10-15 min',
    questions: 50,
    modules: ['Posición', 'Permiso', 'Producción', 'Desarrollo', 'Pináculo'],
    price: 49,
    image: '/tests/5niveles.jpg',
    url: 'https://checkbox5level.netlify.app/',
    freeQuestions: 5,
    isPaid: true,
  },
  {
    id: 'disc',
    name: 'DISC',
    description: 'Perfil conductual: Determinación, Influencia, Serenidad, Corrección.',
    duration: '20-25 min',
    questions: 28,
    modules: ['D', 'I', 'S', 'C'],
    price: 39,
    image: '/tests/disc.jpg',
    url: 'https://radiant-eclair-e24ff3.netlify.app/',
    freeQuestions: 8,
    isPaid: true,
  },
  {
    id: '5-niveles-liderazgo',
    name: '5 Niveles de Liderazgo',
    description: 'Evaluación de liderazgo con medición de voz y comunicación.',
    duration: '10-30 min',
    questions: 80,
    modules: ['Niveles', 'Voz', 'Comunicación'],
    price: 59,
    image: '/tests/liderazgo.jpg',
    url: 'https://5nivelesdeliderazgolvr.netlify.app/',
    freeQuestions: 10,
    isPaid: true,
  },
  {
    id: 'hii',
    name: 'Hospitality Intelligence Index',
    description: 'Mide tu desarrollo en la creación de experiencias memorables.',
    duration: '15-20 min',
    questions: 50,
    modules: ['Conciencia Personal', 'Inteligencia Relacional', 'Experiencias', 'Cultura', 'Liderazgo'],
    price: 49,
    image: '/tests/hii.jpg',
    url: 'https://admirable-tanuki-079b9d.netlify.app/',
    freeQuestions: 10,
    isPaid: true,
  },
  {
    id: '5-casas',
    name: 'Test 5 Casas',
    description: 'Descubre tu casa: Pioneros, Los que Ven, Puente, Mesa, Raíces.',
    duration: '15-20 min',
    questions: 40,
    modules: ['Ministerio', 'Propósito', 'Rol'],
    price: 35,
    image: '/tests/5casas.jpg',
    url: 'https://test5casas.netlify.app/',
    freeQuestions: 15,
    isPaid: true,
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSection />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-4xl font-bold text-verde mb-4">Nuestros Tests</h2>
            <p className="text-gray-600 text-lg">Elige el que se alinea con tu desarrollo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-cormorant text-4xl font-bold text-verde mb-12 text-center">¿Cómo funciona?</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Elige tu test', desc: 'Selecciona el que necesitas' },
                { step: '2', title: 'Prueba gratis', desc: 'Primeras preguntas sin pagar' },
                { step: '3', title: 'Compra acceso', desc: 'Desbloquea todas las preguntas' },
                { step: '4', title: 'Recibe tu plan', desc: 'Resultado + recomendaciones' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-verde text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
