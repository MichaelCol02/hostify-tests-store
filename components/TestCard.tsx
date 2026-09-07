import Link from 'next/link'
import { Test } from '@/lib/types'

export default function TestCard({ test }: { test: Test }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 card-shadow">
      <div className="mb-4">
        <h3 className="font-cormorant text-2xl font-bold text-verde mb-2">{test.name}</h3>
        <p className="text-gray-600 text-sm">{test.description}</p>
      </div>

      <div className="space-y-3 mb-6 text-sm text-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Duración</span>
          <span className="font-semibold">{test.duration}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Preguntas</span>
          <span className="font-semibold">{test.questions}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Versión gratis</span>
          <span className="font-semibold">{test.freeQuestions} preguntas</span>
        </div>
      </div>

      {test.modules.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Módulos</h4>
          <div className="flex flex-wrap gap-2">
            {test.modules.map((module) => (
              <span key={module} className="text-xs bg-verde/10 text-verde px-2 py-1 rounded">
                {module}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Precio</p>
            <p className="text-2xl font-bold text-verde">${test.price}</p>
          </div>
          <Link href={`/tests/${test.id}`} className="btn-primary">
            Empezar
          </Link>
        </div>
      </div>
    </div>
  )
}
