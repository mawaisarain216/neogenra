import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import './themes.css'
import './theme-library.css'
import { prisma } from '@/lib/prisma'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  metadataBase: new URL('https://neogenra.com'),
  title: { default: 'Neogenra — Brand × Creative × Digital × Growth × AI', template: '%s — Neogenra' },
  description: 'Neogenra creates brands, digital experiences and growth systems for ambitious businesses.',
  robots: { index: true, follow: true },
  openGraph: { title: 'Neogenra — Brand × Creative × Digital × Growth × AI', description: 'Creative, digital and growth systems for ambitious businesses', type: 'website' },
}

async function getTheme() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'design.theme' }, select: { value: true } })
    return typeof setting?.value === 'string' && ['obsidian','editorial','signal','swiss','aurora'].includes(setting.value) ? setting.value : 'obsidian'
  } catch { return 'obsidian' }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const theme = await getTheme()
  return <html lang="en" data-site-theme={theme}><body><SiteChrome>{children}</SiteChrome></body></html>
}
