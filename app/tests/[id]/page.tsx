import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestViewerWithAuth from '@/components/TestViewerWithAuth'

const testsData: Record<string, any> = {
  'checkbox-5-niveles': {
    name: 'Checkbox 5 Niveles',
    description: 'Auditoría de nivel basada en 50 casillas de liderazgo.',
    url: 'https://checkbox5level.netlify.app/',
    price: 49,
    freeQuestions: 5,
    isPaid: true,
  },
  'disc': {
    name: 'DISC',
    description: 'Perfil conductual basado en 4 registros de conducta.',
    url: 'https://radiant-eclair-e24ff3.netlify.app/',
    price: 39,
    freeQuestions: 8,
    isPaid: true,
  },
  '5-niveles-liderazgo': {
    name: '5 Niveles de Liderazgo',
    description: 'Evaluación completa de liderazgo con medición de voz.',
    url: 'https://5nivelesdeliderazgolvr.netlify.app/',
    price: 59,
    freeQuestions: 10,
    isPaid: true,
  },
  'hii': {
    name: 'Hospitality Intelligence Index',
    description: 'Evalúa tu inteligencia de hospitalidad en 5 dimensiones.',
    url: 'https://admirable-tanuki-079b9d.netlify.app/',
    price: 49,
    freeQuestions: 10,
    isPaid: true,
  },
  '5-casas': {
    name: 'Test 5 Casas',
    description: 'Descubre tu casa ministerial según tu propósito.',
    url: 'https://test5casas.netlify.app/',
    price: 35,
    freeQuestions: 15,
    isPaid: true,
  },
}

export default function TestPage({ params }: { params: { id: string } }) {
  const test = testsData[params.id]

  if (!test) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-cormorant text-4xl font-bold text-verde mb-2">{test.name}</h1>
            <p className="text-gray-600 mb-2">{test.description}</p>
            <p className="text-sm text-gray-500">
              Versión gratis: Primeras {test.freeQuestions} preguntas · Precio completo: ${test.price}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8">
            <TestViewerWithAuth
              testId={params.id}
              testName={test.name}
              testUrl={test.url}
              freeQuestions={test.freeQuestions}
              price={test.price}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
