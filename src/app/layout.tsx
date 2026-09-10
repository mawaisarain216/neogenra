import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import './globals.css'
import './themes.css'
import './theme-library.css'
import './spatial-overrides.css'
import { prisma } from '@/lib/prisma'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollEffects from '@/components/visual/ScrollEffects'

const fallbackTitle = 'Neogenra — Brand × Creative × Digital × Growth × AI'
const fallbackDescription = 'Neogenra creates brands, digital experiences and growth systems for ambitious businesses.'

async function setting(key: string) {
  try {
    const item = await prisma.siteSetting.findUnique({ where: { key }, select: { value: true } })
    return typeof item?.value === 'string' ? item.value : ''
  } catch { return '' }
}

export async function generateMetadata(): Promise<Metadata> {
  const [title, description, url, ogImage] = await Promise.all([setting('site.title'), setting('site.description'), setting('site.url'), setting('site.ogImage')])
  const siteTitle = title || fallbackTitle
  const siteDescription = description || fallbackDescription
  const canonical = (() => { try { return new URL(url || 'https://neogenra.com') } catch { return new URL('https://neogenra.com') } })()
  return { metadataBase: canonical, title: { default: siteTitle, template: `%s — Neogenra` }, description: siteDescription, alternates: { canonical: canonical.toString() }, robots: { index: true, follow: true }, openGraph: { title: siteTitle, description: siteDescription, type: 'website', url: canonical.toString(), ...(ogImage ? { images: [{ url: ogImage }] } : {}) } }
}

async function getTheme() {
  const theme = await setting('design.theme')
  return ['obsidian', 'editorial', 'signal', 'swiss', 'aurora'].includes(theme) ? theme : 'obsidian'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const theme = await getTheme()
  const requestHeaders = await headers()
  const isAdmin = requestHeaders.get('x-neogenra-admin-route') === '1'
  return <html lang="en" data-site-theme={theme}><body>{isAdmin ? children : <><div className="noise"/><SiteHeader/><ScrollEffects/>{children}<SiteFooter/></>}</body></html>
}
