import Header from '@/components/Header'
import Footer from '@/components/Footer'
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

export default function TestsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="bg-verde text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-cormorant text-4xl font-bold mb-4">Todos nuestros tests</h1>
            <p className="text-lg opacity-90">Encuentra el que se alinea con tu desarrollo profesional</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
