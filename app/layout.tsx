import type { Metadata, Viewport } from 'next'
import { Anton, Archivo_Black, Caveat, DM_Serif_Display, Inter_Tight, Manrope } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import WhatsAppButton from '@/components/WhatsAppButton'
import BarraCampana from '@/components/BarraCampana'
import { CREDIT_PACKS, textosPrecio } from '@/lib/pricing'

// Inter Tight stands in for Neue Montreal (brand display face, not freely licensed); Manrope is the brand body face.
const display = Inter_Tight({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })
const body = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' })
// Las tipografias de las portadas: cada test combina dos de estas (lib/marcas.ts).
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton', display: 'swap' })
const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const script = Caveat({ subsets: ['latin'], weight: '700', variable: '--font-script', display: 'swap' })
const archivo = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--font-archivo', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://hostifycol.netlify.app'),
  title: 'Hostify Tests — Evaluaciones para la hospitalidad',
  openGraph: { type: 'website', locale: 'es_CO', siteName: 'Hostify Tests' },
  description: `Tests de liderazgo, perfil conductual e inteligencia de hospitalidad. Resultados al instante. Desde ${textosPrecio(CREDIT_PACKS).porPersonaEquipo} por test.`,
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${anton.variable} ${serif.variable} ${script.variable} ${archivo.variable}`}>
      <body>
        <AuthProvider>
          <BarraCampana />
          <div className="flex min-h-screen flex-col">{children}</div>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}
