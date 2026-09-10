import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { headers } from 'next/headers'
import './globals.css'
import './themes.css'
import './theme-library.css'
import './spatial-overrides.css'
import './site-design-overrides.css'
import './cms-blocks.css'
import './cms-contact.css'
import { getSiteDesign, designCssVariables } from '@/lib/site-design'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollEffects from '@/components/visual/ScrollEffects'
const fallbackTitle='Neogenra — Brand × Creative × Digital × Growth × AI';const fallbackDescription='Neogenra creates brands, digital experiences and growth systems for ambitious businesses.'
async function setting(key:string){try{const {prisma}=await import('@/lib/prisma');const item=await prisma.siteSetting.findUnique({where:{key},select:{value:true}});return typeof item?.value==='string'?item.value:''}catch{return ''}}
export async function generateMetadata():Promise<Metadata>{const [title,description,url,ogImage,design]=await Promise.all([setting('site.title'),setting('site.description'),setting('site.url'),setting('site.ogImage'),getSiteDesign()]);const siteTitle=title||fallbackTitle;const siteDescription=description||fallbackDescription;const canonical=(()=>{try{return new URL(url||'https://neogenra.com')}catch{return new URL('https://neogenra.com')}})();const image=ogImage||design.seo.ogImage;return {metadataBase:canonical,title:{default:siteTitle,template:`%s — Neogenra`},description:siteDescription,alternates:{canonical:canonical.toString()},robots:{index:true,follow:true},...(design.seo.favicon?{icons:{icon:design.seo.favicon}}:{}),openGraph:{title:siteTitle,description:siteDescription,type:'website',url:canonical.toString(),...(image?{images:[{url:image}]}:{})}}}
export default async function RootLayout({children}:{children:ReactNode}){const design=await getSiteDesign();const requestHeaders=await headers();const isAdmin=requestHeaders.get('x-neogenra-admin-route')==='1';const vars=designCssVariables(design) as CSSProperties;return <html lang="en" data-site-theme="cms" data-motion={design.motion.enabled?'on':'off'} data-glass={design.effects.glass?'on':'off'} data-noise={design.effects.noise?'on':'off'}><body style={vars}>{isAdmin?children:<>{design.effects.noise&&<div className="noise"/>}<SiteHeader/><ScrollEffects/>{children}{design.footer.show&&<SiteFooter/>}</>}</body></html>}
