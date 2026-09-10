import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import './themes.css'
import './theme-library.css'
import './spatial-overrides.css'
import './site-design-overrides.css'
import './cms-blocks.css'
import './cms-contact.css'
import './neogenra-home.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollEffects from '@/components/visual/ScrollEffects'

export const metadata: Metadata = {
  title: { default: 'Neogenra — Creative, Digital & Growth', template: '%s — Neogenra' },
  description: 'Neogenra creates brands, digital experiences and growth systems for ambitious businesses.',
}

export default function RootLayout({children}:{children:ReactNode}) {
  return <html lang="en"><body><SiteHeader/><ScrollEffects/>{children}<SiteFooter/></body></html>
}
