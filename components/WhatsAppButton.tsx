'use client'

import { useEffect, useState } from 'react'
import { WHATSAPP_NUMBER, whatsappLink } from '@/lib/contact'

export default function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false)

  // The label opens by itself once, then stays as a plain button so it never nags.
  // On phones it stays closed: expanded it covers the content next to it.
  useEffect(() => {
    if (window.innerWidth < 640) return
    const show = setTimeout(() => setExpanded(true), 2600)
    const hide = setTimeout(() => setExpanded(false), 8200)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  if (!WHATSAPP_NUMBER) return null

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      className="group fixed bottom-24 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3.5 pr-3.5 text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:brightness-105 sm:bottom-7 sm:right-7"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
      <span
        className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 ease-out ${
          expanded ? 'max-w-[13rem] pr-1 opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        ¿Dudas? Escríbenos
      </span>
    </a>
  )
}
