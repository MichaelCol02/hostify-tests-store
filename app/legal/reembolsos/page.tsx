import type { Metadata } from 'next'
import { EMPRESA, DIAS_REEMBOLSO } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Política de reembolsos — Hostify Tests',
  description: 'Cuándo procede una devolución y cómo solicitarla.',
}

export default function ReembolsosPage() {
  return (
    <>
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tightest sm:text-5xl">Política de reembolsos</h1>
      <p className="mt-4 text-sm text-ink-400">Última actualización: octubre de 2026</p>

      <h2>1. Qué estás comprando</h2>
      <p>
        Compras créditos digitales de acceso inmediato. El crédito se consume cuando abres un test, y en ese momento
        recibes el contenido completo.
      </p>

      <h2>2. Cuándo devolvemos el dinero</h2>
      {DIAS_REEMBOLSO > 0 ? (
        <p>
          Puedes pedir la devolución dentro de los {DIAS_REEMBOLSO} días siguientes a la compra, siempre que no hayas
          usado los créditos. Si ya usaste alguno, se devuelve el valor de los créditos no utilizados.
        </p>
      ) : (
        <p>
          Devolvemos el dinero cuando <strong>el problema es nuestro</strong>: te cobraron y no recibiste los créditos,
          el test no abrió por una falla de la plataforma, o hubo un cobro duplicado. En esos casos la devolución es
          total y no tienes que justificar nada más allá de contarnos qué pasó.
        </p>
      )}

      <h2>3. Cuándo no procede</h2>
      <ul>
        <li>Cuando ya realizaste el test y recibiste tu resultado.</li>
        <li>Cuando el resultado no te gustó: el informe refleja tus respuestas, no una promesa de resultado.</li>
        <li>Cuando compraste por error un paquete mayor y ya usaste créditos de él (se evalúa la parte no usada).</li>
      </ul>

      <h2>4. Cómo solicitarla</h2>
      <p>
        Escríbenos a {EMPRESA.correo} o por WhatsApp al {EMPRESA.whatsapp} dentro de los 30 días siguientes al cobro,
        indicando el correo con el que compraste y la fecha. Respondemos en un máximo de cinco (5) días hábiles.
      </p>

      <h2>5. Cómo se devuelve</h2>
      <p>
        La devolución se hace por el mismo medio de pago, a través de Stripe. El tiempo en que el dinero aparece en tu
        extracto depende de tu banco, normalmente entre 5 y 10 días hábiles.
      </p>

      <h2>6. Derecho de retracto</h2>
      <p>
        El Estatuto del Consumidor (Ley 1480 de 2011) contempla el derecho de retracto en ventas a distancia. Tratándose
        de contenido digital que se ejecuta de inmediato, ese derecho se entiende agotado una vez abres el test. Si no
        has abierto ningún test, puedes ejercerlo dentro de los cinco (5) días hábiles siguientes a la compra.
      </p>
    </>
  )
}
