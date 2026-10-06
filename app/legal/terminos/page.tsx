import type { Metadata } from 'next'
import { EMPRESA, DIAS_REEMBOLSO } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Términos y condiciones — Hostify Tests',
  description: 'Condiciones de uso de la plataforma de tests de Hostify.',
}

export default function TerminosPage() {
  return (
    <>
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tightest sm:text-5xl">Términos y condiciones</h1>
      <p className="mt-4 text-sm text-ink-400">Última actualización: octubre de 2026</p>

      <h2>1. Quién presta el servicio</h2>
      <p>
        {EMPRESA.razonSocial}, identificada con NIT {EMPRESA.nit}, domiciliada en {EMPRESA.ciudad}, {EMPRESA.pais},
        opera la plataforma {EMPRESA.sitio} (en adelante, “Hostify Tests”). Contacto: {EMPRESA.correo} · WhatsApp{' '}
        {EMPRESA.whatsapp}.
      </p>

      <h2>2. Qué se vende</h2>
      <p>
        Hostify Tests vende <strong>créditos</strong>. Cada crédito permite abrir un test completo. Al comenzar un test
        se descuenta el crédito y el test queda disponible durante 24 horas, aunque cierres la ventana. El test de
        pareja consume dos créditos porque cubre a dos personas.
      </p>
      <p>
        Los créditos no vencen, no son transferibles a otra cuenta y no son canjeables por dinero. Los precios están
        expresados en dólares de los Estados Unidos (USD) y pueden cambiar sin aviso; el precio aplicable es el que se
        muestra al momento de la compra.
      </p>

      <h2>3. Tu cuenta</h2>
      <p>
        Puedes comprar sin registrarte: la cuenta se crea con el correo que indiques al pagar. Eres responsable de la
        veracidad de ese correo y de mantener tu contraseña en reserva. El enlace de regreso del pago permite ingresar
        una sola vez y solo durante la hora siguiente a la compra.
      </p>

      <h2>4. Resultados de los tests</h2>
      <p>
        Los tests son instrumentos de autoconocimiento y desarrollo. <strong>No son un diagnóstico médico ni
        psicológico</strong>, no reemplazan la valoración de un profesional de la salud y no deben usarse como único
        criterio para decisiones laborales, clínicas o legales. Sus resultados dependen de la sinceridad de quien
        responde.
      </p>

      <h2>5. Pagos</h2>
      <p>
        Los pagos se procesan a través de Stripe. Hostify Tests no recibe, almacena ni procesa los datos de tu tarjeta:
        esa información la maneja directamente la pasarela de pagos.
      </p>

      <h2>6. Devoluciones</h2>
      <p>
        {DIAS_REEMBOLSO > 0
          ? `Puedes solicitar la devolución del dinero dentro de los ${DIAS_REEMBOLSO} días siguientes a la compra, siempre que no hayas utilizado los créditos adquiridos.`
          : 'Por tratarse de contenido digital de acceso inmediato, las compras no admiten devolución una vez utilizado el crédito. Si tuviste un problema técnico que te impidió realizar el test, escríbenos y lo resolvemos.'}{' '}
        Consulta la <a href="/legal/reembolsos">política de reembolsos</a>.
      </p>

      <h2>7. Uso adecuado</h2>
      <p>
        No está permitido revender los tests, copiar su contenido, automatizar respuestas, intentar acceder a cuentas
        ajenas ni eludir el cobro. El incumplimiento permite suspender la cuenta sin devolución.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Los tests, sus preguntas, sus informes y la marca Hostify son propiedad de {EMPRESA.razonSocial}. Puedes usar tu
        resultado personal libremente; no puedes reproducir los instrumentos con fines comerciales sin autorización
        escrita.
      </p>

      <h2>9. Disponibilidad</h2>
      <p>
        Procuramos que el servicio esté disponible de forma continua, pero puede interrumpirse por mantenimiento o por
        fallas de terceros. No garantizamos disponibilidad ininterrumpida.
      </p>

      <h2>10. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Colombia. Las controversias se resolverán ante los
        jueces competentes de {EMPRESA.ciudad}.
      </p>
    </>
  )
}
