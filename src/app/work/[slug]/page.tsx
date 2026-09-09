import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { RenderBlocks } from '@/lib/blocks'
export const dynamic='force-dynamic'
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=await prisma.project.findUnique({where:{slug}});if(!p)return {};return {title:p.seoTitle||p.title,description:p.seoDescription||p.excerpt||undefined}}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=await prisma.project.findUnique({where:{slug,status:'PUBLISHED'}});if(!p)notFound();return <main className="px-6 pb-32 pt-40"><div className="mx-auto max-w-6xl"><p className="eyebrow">{p.category||'Selected work'}</p><h1 className="mt-4 text-6xl font-bold tracking-[-.06em] md:text-8xl">{p.title}</h1>{p.client&&<p className="mt-5 text-white/45">Client · {p.client}</p>}<p className="mt-8 max-w-3xl text-xl leading-8 text-white/55">{p.excerpt}</p><div className="mt-16"><RenderBlocks blocks={(p.content as any)?.blocks||p.content}/></div></div></main>}
