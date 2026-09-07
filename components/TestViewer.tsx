'use client'

import { useState, useEffect } from 'react'

interface TestViewerProps {
  testId: string
  testUrl: string
  freeQuestions: number
  isPaid: boolean
  userHasAccess?: boolean
}

export default function TestViewer({
  testId,
  testUrl,
  freeQuestions,
  isPaid,
  userHasAccess = false,
}: TestViewerProps) {
  const [showPaywall, setShowPaywall] = useState(!userHasAccess && isPaid)
  const [questionCount, setQuestionCount] = useState(0)

  return (
    <div className="relative">
      {showPaywall && questionCount >= freeQuestions && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur flex items-center justify-center rounded-lg z-10">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
            <h3 className="font-cormorant text-2xl font-bold text-verde mb-4">
              Acceso completo disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Has visto la versión gratis ({freeQuestions} preguntas).
              Accede a todas las preguntas y resultados completos.
            </p>
            <button className="btn-primary w-full mb-3">
              Desbloquear por $49
            </button>
            <button className="btn-secondary w-full text-sm">
              Seguir gratis
            </button>
          </div>
        </div>
      )}

      <iframe
        src={testUrl}
        title="Test"
        className="w-full h-screen rounded-lg"
        style={{ minHeight: '600px' }}
      />

      <div className="mt-4 text-sm text-gray-600">
        <p>Versión gratis: primeras {freeQuestions} preguntas disponibles</p>
      </div>
    </div>
  )
}
