import { WHATSAPP_NUMBER, whatsappLink } from '@/lib/contact'

const MENSAJE = 'Hola, tengo un hotel y quiero evaluar a mi equipo con los tests de Hostify.'

export default function TeamContactButton({ className = '' }: { className?: string }) {
  if (!WHATSAPP_NUMBER) return null
  return (
    <a
      href={whatsappLink(MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary py-3.5 ${className}`}
    >
      Hablar por WhatsApp
    </a>
  )
}
