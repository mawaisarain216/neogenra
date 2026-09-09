import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { CSSProperties, ReactNode } from 'react'
import type { BuilderBlock } from '@/lib/builder'
import { normalizeBlocks } from '@/lib/builder-tree'

type Block=Record<string,unknown>
function text(v:unknown){return typeof v==='string'?v:''}
const allowedStyle=['maxWidth','width','minHeight','padding','margin','gap','fontSize','lineHeight','letterSpacing','textAlign','background','color','borderRadius','boxShadow','display'] as const
function safeStyle(block:BuilderBlock):CSSProperties{const source=(block.style?.desktop||{}) as Record<string,unknown>;const out:Record<string,string>={};for(const key of allowedStyle){const value=source[key];if(typeof value==='string'&&value.length<=120&&!/[;{}<>]/.test(value))out[key]=value}return out as CSSProperties}

export async function RenderBlocks({blocks}:{blocks:unknown}){
 const tree=normalizeBlocks(blocks)
 const types=new Set<string>(); const walk=(items:BuilderBlock[])=>items.forEach(b=>{types.add(b.type);if(b.children)walk(b.children);if(b.type==='columns'&&Array.isArray(b.props.children))(b.props.children as unknown[][]).forEach(c=>walk(normalizeBlocks(c)))})
 walk(tree)
 const [services,projects,team,testimonials]=await Promise.all([
  types.has('services')?prisma.service.findMany({where:{published:true},orderBy:{sortOrder:'asc'}}):Promise.resolve([]),
  types.has('projects')?prisma.project.findMany({where:{status:'PUBLISHED'},orderBy:[{featured:'desc'},{updatedAt:'desc'}]}):Promise.resolve([]),
  types.has('team')?prisma.teamMember.findMany({where:{published:true},orderBy:{sortOrder:'asc'}}):Promise.resolve([]),
  types.has('testimonials')?prisma.testimonial.findMany({where:{published:true},orderBy:{sortOrder:'asc'}}):Promise.resolve([]),
 ])
 const render=(items:BuilderBlock[]):ReactNode[]=>items.map((b,i)=>{const x=b.props as Block;const type=b.type;const style=safeStyle(b);if(type==='section')return <section key={b.id||i} style={style} className="glass rounded-[2rem] p-8 md:p-14"><p className="eyebrow">{text(x.eyebrow)}</p><h2 className="mt-3 text-4xl font-bold tracking-[-.05em]">{text(x.title)}</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-white/55">{text(x.body)}</p>{b.children&&<div className="mt-8">{render(b.children)}</div>}</section>
 if(type==='container')return <section key={b.id||i} style={{...style,maxWidth:style.maxWidth||'1200px',marginLeft:'auto',marginRight:'auto'}} className="px-6">{b.children&&render(b.children)}</section>
 if(type==='columns'){const cols=Array.isArray(x.children)?x.children as unknown[][]:b.children?[b.children]:[[],[]];return <section key={b.id||i} style={style} className="grid gap-6 md:grid-cols-2">{cols.map((c,j)=><div key={j} className="min-h-24 rounded-3xl border border-dashed border-white/10 p-5">{render(normalizeBlocks(c))}</div>)}</section>}
 if(type==='hero')return <section key={b.id||i} style={style} className="glass rounded-[2rem] p-8 md:p-16"><p className="eyebrow">{text(x.kicker)}</p><h1 className="mt-4 text-5xl font-bold tracking-[-.06em] md:text-7xl">{text(x.title)}</h1><p className="mt-6 max-w-2xl text-lg text-white/55">{text(x.body)}</p>{text(x.href)&&<Link href={text(x.href)} className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-black">{text(x.cta)||'Explore'}</Link>}{b.children&&<div className="mt-10">{render(b.children)}</div>}</section>
 if(type==='richText')return <section key={b.id||i} style={style} className="max-w-3xl whitespace-pre-wrap text-lg leading-8 text-white/70">{text(x.body)}</section>
 if(type==='image'&&text(x.src))return <figure key={b.id||i} style={style} className="overflow-hidden rounded-[2rem]"><Image src={text(x.src)} alt={text(x.alt)} width={1600} height={1000} className="h-auto w-full"/><figcaption className="mt-3 text-sm text-white/35">{text(x.caption)}</figcaption></figure>
 if(type==='video'&&text(x.src))return <figure key={b.id||i} style={style} className="overflow-hidden rounded-[2rem]"><video src={text(x.src)} poster={text(x.poster)||undefined} controls className="w-full"/><figcaption className="mt-3 text-sm text-white/35">{text(x.title)}</figcaption></figure>
 if(type==='stats'&&Array.isArray(x.items))return <section key={b.id||i} style={style} className="grid gap-4 md:grid-cols-3">{(x.items as Block[]).map((s,j)=><div key={j} className="glass rounded-3xl p-7"><strong className="text-4xl">{text(s.value)}</strong><p className="mt-2 text-white/45">{text(s.label)}</p></div>)}</section>
 if(type==='services')return <section key={b.id||i} style={style}><h2 className="section-title mb-8">{text(x.title)||'Services'}</h2><div className="divide-y divide-white/10">{services.slice(0,Number(x.limit)||6).map((s:any)=><div key={s.id} className="grid gap-3 py-6 md:grid-cols-[260px_1fr]"><h3 className="text-2xl font-semibold">{s.title}</h3><p className="text-white/50">{s.shortDescription}</p></div>)}</div></section>
 if(type==='projects')return <section key={b.id||i} style={style}><h2 className="section-title mb-8">{text(x.title)||'Selected work'}</h2><div className="grid gap-4 md:grid-cols-2">{projects.slice(0,Number(x.limit)||6).map((p:any)=><Link href={`/work/${p.slug}`} key={p.id} className="glass rounded-3xl p-7"><span className="text-xs uppercase tracking-[.2em] text-white/35">{p.category||'Project'}</span><h3 className="mt-12 text-3xl font-semibold">{p.title}</h3><p className="mt-3 text-white/45">{p.excerpt}</p></Link>)}</div></section>
 if(type==='team')return <section key={b.id||i} style={style}><h2 className="section-title mb-8">{text(x.title)||'Meet the team'}</h2><div className="grid gap-4 md:grid-cols-3">{team.slice(0,Number(x.limit)||6).map((p:any)=><div className="glass rounded-3xl p-7" key={p.id}><h3 className="text-2xl font-semibold">{p.name}</h3><p className="mt-2 text-white/45">{p.role}</p></div>)}</div></section>
 if(type==='testimonials')return <section key={b.id||i} style={style}><h2 className="section-title mb-8">{text(x.title)||'Client voices'}</h2><div className="grid gap-4 md:grid-cols-3">{testimonials.slice(0,Number(x.limit)||3).map((t:any)=><blockquote className="glass rounded-3xl p-7" key={t.id}><p className="text-lg leading-7">“{t.quote}”</p><footer className="mt-6 text-sm text-white/45">{t.name}{t.company?` · ${t.company}`:''}</footer></blockquote>)}</div></section>
 if(type==='spacer')return <div key={b.id||i} style={{height:Math.min(Math.max(Number(x.height)||80,0),800)}}/>
 if(type==='cta')return <section key={b.id||i} style={style} className="rounded-[2rem] bg-white p-8 text-black md:p-14"><p className="text-sm uppercase tracking-[.2em] opacity-50">{text(x.kicker)}</p><h2 className="mt-3 text-4xl font-bold tracking-[-.05em]">{text(x.title)}</h2>{text(x.href)&&<Link href={text(x.href)} className="mt-7 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white">{text(x.cta)||'Start a project'}</Link>}</section>
 if(type==='contactForm')return <section key={b.id||i} style={style} id="contact" className="glass rounded-[2rem] p-8 md:p-12"><h2 className="text-3xl font-semibold">{text(x.title)||'Tell us what you are building.'}</h2><p className="mt-3 text-white/45">Use the contact page to submit a secure project brief.</p><Link href="/contact" className="mt-6 inline-block rounded-full bg-white px-5 py-3 font-semibold text-black">Open contact form</Link></section>
 if(type==='scene3d')return <section key={b.id||i} style={style} className="cms-scene3d"><div className="scene-copy"><p className="eyebrow">{text(x.eyebrow)||'NEOGENRA / LAB'}</p><h2>{text(x.title)||'A living idea engine'}</h2><p>{text(x.caption)||'Move your pointer across the scene.'}</p></div><div className="scene-object" aria-hidden="true"><div className="scene-ring ring-one"/><div className="scene-ring ring-two"/><div className="scene-core"><i/><i/><i/><i/><i/><i/></div></div></section>
 if(type==='marquee'&&Array.isArray(x.items))return <div key={b.id||i} className="cms-marquee" style={{...style,'--marquee-speed':`${Math.max(8,Math.min(80,Number(x.speed)||24))}s`} as CSSProperties}><div className="cms-marquee-track">{[...x.items,...x.items].map((item:any,j)=><span key={j}>{text(item)}<b>✦</b></span>)}</div></div>
 return null})
 return <div className="space-y-16">{render(tree)}</div>
}
