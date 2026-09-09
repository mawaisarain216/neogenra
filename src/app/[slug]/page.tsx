import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { RenderBlocks } from '@/lib/blocks'
export const dynamic='force-dynamic'
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const page=await prisma.page.findUnique({where:{slug}});if(!page||page.status!=='PUBLISHED')return {};return {title:page.seoTitle||page.title,description:page.seoDescription||page.description,alternates:page.canonicalUrl?{canonical:page.canonicalUrl}:undefined,robots:page.noIndex?{index:false,follow:false}:undefined,openGraph:page.ogImage?{images:[page.ogImage]}:undefined}}
export default async function CMSPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const page=await prisma.page.findUnique({where:{slug}});if(!page||page.status!=='PUBLISHED')notFound();const raw=page.content as any;const blocks=Array.isArray(raw)?raw:raw?.blocks;return <main className="page-shell"><header><p className="eyebrow">NEOGENRA / {page.slug}</p><h1 className="mt-4 text-5xl font-bold tracking-[-.06em] md:text-7xl">{page.title}</h1>{page.description&&<p className="mt-5 max-w-2xl text-lg text-white/55">{page.description}</p>}</header><div className="mt-16"><RenderBlocks blocks={blocks}/></div></main>}
