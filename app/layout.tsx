import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Manrope } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import WhatsAppButton from '@/components/WhatsAppButton'

// Inter Tight stands in for Neue Montreal (brand display face, not freely licensed); Manrope is the brand body face.
const display = Inter_Tight({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })
const body = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: 'Hostify Tests — Evaluaciones para la hospitalidad',
  description: 'Tests de liderazgo, perfil conductual e inteligencia de hospitalidad. Resultados al instante. Desde $1.50 por test.',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">{children}</div>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}
