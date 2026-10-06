import type { Metadata } from 'next'
import { EMPRESA } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Política de tratamiento de datos — Hostify Tests',
  description: 'Cómo tratamos tus datos personales, conforme a la Ley 1581 de 2012.',
}

export default function PrivacidadPage() {
  return (
    <>
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tightest sm:text-5xl">Política de tratamiento de datos</h1>
      <p className="mt-4 text-sm text-ink-400">Ley 1581 de 2012 y Decreto 1377 de 2013 · Última actualización: octubre de 2026</p>

      <h2>1. Responsable</h2>
      <p>
        {EMPRESA.razonSocial}, NIT {EMPRESA.nit}, domiciliada en {EMPRESA.ciudad}, {EMPRESA.pais}. Correo de contacto
        para asuntos de datos personales: {EMPRESA.correo}. WhatsApp: {EMPRESA.whatsapp}.
      </p>

      <h2>2. Qué datos recogemos</h2>
      <ul>
        <li><strong>De tu cuenta:</strong> nombre y correo electrónico.</li>
        <li><strong>De tus compras:</strong> fecha, paquete adquirido, monto e identificador de la transacción. Los datos de tu tarjeta los recibe Stripe, no nosotros.</li>
        <li><strong>De tu actividad:</strong> qué tests abriste y cuándo.</li>
        <li><strong>De tus respuestas:</strong> las respuestas de cada test se almacenan en el sistema propio de ese test para generar tu informe.</li>
      </ul>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Crear y mantener tu cuenta y tus créditos.</li>
        <li>Procesar el pago y entregarte el acceso comprado.</li>
        <li>Generar y entregarte tu resultado.</li>
        <li>Atender tus solicitudes y darte soporte.</li>
      </ul>
      <p>No vendemos tus datos. No los usamos para publicidad de terceros.</p>

      <h2>4. Con quién los compartimos</h2>
      <ul>
        <li><strong>Stripe:</strong> procesa los pagos.</li>
        <li><strong>Supabase:</strong> almacena las cuentas y los créditos.</li>
        <li><strong>Netlify:</strong> aloja el sitio.</li>
        <li><strong>Google:</strong> almacena las respuestas de los tests.</li>
      </ul>
      <p>
        Algunos de estos proveedores están fuera de Colombia, por lo que al usar la plataforma autorizas la
        transferencia internacional de tus datos para las finalidades descritas.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Puedes conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización; ser informado sobre su
        uso; presentar quejas ante la Superintendencia de Industria y Comercio; y revocar la autorización o solicitar
        la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.
      </p>
      <p>
        Para ejercerlos, escribe a {EMPRESA.correo} indicando tu nombre, tu solicitud y un correo de contacto.
        Responderemos las consultas en un máximo de diez (10) días hábiles y los reclamos en quince (15) días hábiles,
        conforme a la ley.
      </p>

      <h2>6. Conservación</h2>
      <p>
        Conservamos tus datos mientras tengas cuenta activa y, después, durante el tiempo necesario para cumplir
        obligaciones legales y contables.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas razonables: el acceso a los datos está restringido por cuenta, las contraseñas se
        guardan cifradas y los pagos ocurren fuera de nuestros servidores. Ningún sistema es infalible, por lo que no
        podemos garantizar seguridad absoluta.
      </p>

      <h2>8. Menores de edad</h2>
      <p>La plataforma está dirigida a mayores de 18 años.</p>
    </>
  )
}
