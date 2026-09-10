import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import './globals.css'
import './themes.css'
import './theme-library.css'
import { prisma } from '@/lib/prisma'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollEffects from '@/components/visual/ScrollEffects'

export const metadata: Metadata = { metadataBase:new URL('https://neogenra.com'), title:{default:'Neogenra — Brand × Creative × Digital × Growth × AI',template:'%s — Neogenra'}, description:'Neogenra creates brands, digital experiences and growth systems for ambitious businesses.', robots:{index:true,follow:true}, openGraph:{title:'Neogenra — Brand × Creative × Digital × Growth × AI',description:'Creative, digital and growth systems for ambitious businesses',type:'website'} }
async function getTheme(){try{const setting=await prisma.siteSetting.findUnique({where:{key:'design.theme'},select:{value:true}});return typeof setting?.value==='string'&&['obsidian','editorial','signal','swiss','aurora'].includes(setting.value)?setting.value:'obsidian'}catch{return'obsidian'}}
export default async function RootLayout({children}:{children:ReactNode}){const theme=await getTheme();const requestHeaders=await headers();const isAdmin=requestHeaders.get('x-neogenra-admin-route')==='1';return <html lang="en" data-site-theme={theme}><body>{isAdmin?children:<><div className="noise"/><SiteHeader/><ScrollEffects/>{children}<SiteFooter/></>}</body></html>}
