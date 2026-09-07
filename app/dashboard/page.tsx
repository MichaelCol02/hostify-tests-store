'use client'

import { useAuth, usePurchases } from '@/lib/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const allTests: Record<string, any> = {
  'checkbox-5-niveles': { name: 'Checkbox 5 Niveles', price: 49 },
  'disc': { name: 'DISC', price: 39 },
  '5-niveles-liderazgo': { name: '5 Niveles de Liderazgo', price: 59 },
  'hii': { name: 'Hospitality Intelligence Index', price: 49 },
  '5-casas': { name: 'Test 5 Casas', price: 35 },
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useAuth()
  const { purchases, loading: purchasesLoading } = usePurchases(user?.id)
  const router = useRouter()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/tests')
    }
  }, [user, userLoading, router])

  if (userLoading) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600">Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600">Redirigiendo...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <>
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-cormorant text-4xl font-bold text-verde mb-8">Mi Panel</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Tests comprados</h3>
              <p className="text-3xl font-bold text-verde">{purchases.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Inversión total</h3>
              <p className="text-3xl font-bold text-verde">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Email</h3>
              <p className="text-sm font-mono text-verde">{user.email}</p>
            </div>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow text-center mb-8">
              <h2 className="font-cormorant text-2xl font-bold text-gray-700 mb-4">
                Aún no has comprado tests
              </h2>
              <p className="text-gray-600 mb-6">
                Prueba gratis las primeras preguntas de cualquier test y compra acceso completo cuando quieras.
              </p>
              <Link href="/tests" className="btn-primary inline-block">
                Ver tests disponibles
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Mis tests comprados</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Test</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Comprado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => {
                    const test = allTests[purchase.test_id]
                    return (
                      <tr key={purchase.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {test?.name || purchase.test_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(purchase.purchased_at).toLocaleDateString('es-CO')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-verde">
                          ${purchase.amount}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            href={`/tests/${purchase.test_id}`}
                            className="text-verde hover:text-verde-light font-semibold"
                          >
                            Continuar test →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
