'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollEffects from '@/components/visual/ScrollEffects'

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  if (isAdmin) return <>{children}</>
  return <><div className="noise"/><SiteHeader/><ScrollEffects/>{children}<SiteFooter/></>
}
