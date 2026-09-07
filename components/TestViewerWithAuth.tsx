'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TestViewer from './TestViewer'
import AuthModal from './AuthModal'
import StripeCheckout from './StripeCheckout'

interface TestViewerWithAuthProps {
  testId: string
  testName: string
  testUrl: string
  freeQuestions: number
  price: number
}

export default function TestViewerWithAuth({
  testId,
  testName,
  testUrl,
  freeQuestions,
  price,
}: TestViewerWithAuthProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Check if user has purchased this test
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('test_id', testId)
          .eq('status', 'completed')
          .single()

        setHasAccess(!!purchase)
      }

      setLoading(false)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setHasAccess(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [testId])

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>
  }

  return (
    <>
      {!user ? (
        <div className="bg-white border-2 border-verde rounded-lg p-8 text-center">
          <h3 className="font-cormorant text-2xl font-bold text-verde mb-4">Inicia sesión</h3>
          <p className="text-gray-600 mb-6">
            Debes ingresar para acceder a los tests. Puedes probar gratis primero.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="btn-primary mb-4"
          >
            Ingresar o crear cuenta
          </button>
        </div>
      ) : hasAccess ? (
        <TestViewer
          testId={testId}
          testUrl={testUrl}
          freeQuestions={freeQuestions}
          isPaid={true}
          userHasAccess={true}
        />
      ) : (
        <>
          <TestViewer
            testId={testId}
            testUrl={testUrl}
            freeQuestions={freeQuestions}
            isPaid={true}
            userHasAccess={false}
          />
          <div className="mt-8 bg-verde/10 border-2 border-verde rounded-lg p-8 text-center">
            <h3 className="font-cormorant text-2xl font-bold text-verde mb-4">
              Desbloquea acceso completo
            </h3>
            <p className="text-gray-600 mb-6">
              Has visto todas las preguntas gratuitas. Compra acceso completo para ver tus resultados
              y plan de desarrollo personalizado.
            </p>
            <StripeCheckout
              testId={testId}
              testName={testName}
              price={price}
              userId={user.id}
              email={user.email || ''}
            />
          </div>
        </>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  )
}
