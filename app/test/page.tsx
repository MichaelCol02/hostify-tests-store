export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-verde">✅ Servidor funcionando</h1>
      <p className="mt-4 text-gray-600">La plataforma está corriendo correctamente en localhost:3003</p>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">Configuración:</h2>
        <ul className="list-disc space-y-2 ml-6">
          <li>✅ Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...</li>
          <li>✅ Stripe Publishable: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20)}...</li>
          <li>✅ App URL: {process.env.NEXT_PUBLIC_APP_URL}</li>
        </ul>
      </div>

      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">← Volver al inicio</a>
      </div>
    </div>
  )
}
