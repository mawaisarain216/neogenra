import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { CSSProperties, ReactNode } from 'react'
import type { BuilderBlock } from '@/lib/builder'
import { normalizeBlocks } from '@/lib/builder-tree'
import { getSiteDesign } from '@/lib/site-design'

type Block=Record<string,unknown>
const allowedStyle=['maxWidth','width','minWidth','minHeight','height','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin','marginTop','marginRight','marginBottom','marginLeft','gap','fontSize','fontWeight','lineHeight','letterSpacing','textAlign','background','color','borderRadius','border','boxShadow','opacity','display','gridTemplateColumns','alignItems','justifyContent','objectFit'] as const
function text(v:unknown){return typeof v==='string'?v:''}
function safeStyle(source:unknown):CSSProperties{const out:Record<string,string>={};if(!source||typeof source!=='object')return out as CSSProperties;for(const key of allowedStyle){const value=(source as Record<string,unknown>)[key];if(typeof value==='string'&&value.length<=120&&!/[;{}<>]/.test(value))out[key]=value}return out as CSSProperties}
function blockCss(block:BuilderBlock){const id=`block-${block.id.replace(/[^a-zA-Z0-9_-]/g,'')}`;const tablet=safeStyle(block.style?.tablet);const mobile=safeStyle(block.style?.mobile);const css=(style:CSSProperties)=>Object.entries(style).map(([k,v])=>`${k.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)}:${v}`).join(';');return {id,css:[Object.keys(tablet).length?`@media(min-width:768px) and (max-width:1023px){.${id}{${css(tablet)}}}`:'',Object.keys(mobile).length?`@media(max-width:767px){.${id}{${css(mobile)}}}`:''].join('')}}

export async function RenderBlocks({blocks}:{blocks:unknown}){
 const tree=normalizeBlocks(blocks);const types=new Set<string>();const walk=(items:BuilderBlock[])=>items.forEach(b=>{types.add(b.type);if(b.children)walk(b.children);if(b.type==='columns'&&Array.isArray(b.props.children))(b.props.children as unknown[][]).forEach(c=>walk(normalizeBlocks(c)))});walk(tree)
 const [services,projects,team,testimonials,design]=await Promise.all([types.has('services')?prisma.service.findMany({where:{published:true},orderBy:{sortOrder:'asc'}}):Promise.resolve([]),types.has('projects')?prisma.project.findMany({where:{status:'PUBLISHED'},orderBy:[{featured:'desc'},{updatedAt:'desc'}]}):Promise.resolve([]),types.has('team')?prisma.teamMember.findMany({where:{published:true},orderBy:{sortOrder:'asc'}}):Promise.resolve([]),types.has('testimonials')?prisma.testimonial.findMany({where:{published:true},orderBy:{sortOrder:'asc'}}):Promise.resolve([]),getSiteDesign()])
 const styleNodes:ReactNode[]=[]
 const render=(items:BuilderBlock[]):ReactNode[]=>items.map((b,i)=>{const x=b.props as Block;const type=b.type;const {id,css}=blockCss(b);if(css)styleNodes.push(<style key={`style-${b.id}`}>{css}</style>);const style=safeStyle(b.style?.desktop);const common={key:b.id||String(i),className:id,style};
 if(type==='section')return <section {...common} className={`${id} cms-section`}><p className="eyebrow">{text(x.eyebrow)}</p><h2>{text(x.title)}</h2><p className="cms-lede">{text(x.body)}</p>{b.children&&<div>{render(b.children)}</div>}</section>
 if(type==='container')return <section {...common} className={`${id} cms-container`} style={{...style,maxWidth:style.maxWidth||design.layout.container,marginLeft:'auto',marginRight:'auto'}}>{b.children&&render(b.children)}</section>
 if(type==='columns'){const cols=Array.isArray(x.children)?x.children as unknown[][]:b.children?[b.children]:[[],[]];return <section {...common} className={`${id} cms-columns`} style={{...style,gridTemplateColumns:`repeat(${Math.max(1,Number(x.count)||2)},minmax(0,1fr))`}}>{cols.map((c,j)=><div key={j} className="cms-column">{render(normalizeBlocks(c))}</div>)}</section>}
 if(type==='hero')return <section {...common} className={`${id} cms-block-hero`}><p className="eyebrow">{text(x.kicker)}</p><h1>{text(x.title)}</h1><p className="cms-lede">{text(x.body)}</p>{text(x.href)&&<Link href={text(x.href)} className="magnetic-cta">{text(x.cta)||'Explore'}</Link>}{b.children&&<div>{render(b.children)}</div>}</section>
 if(type==='richText')return <section {...common} className={`${id} cms-richtext`}>{text(x.body)}</section>
 if(type==='image'&&text(x.src))return <figure {...common} className={`${id} cms-media`}><Image src={text(x.src)} alt={text(x.alt)} width={1800} height={1100} className="cms-image"/><figcaption>{text(x.caption)}</figcaption></figure>
 if(type==='video'&&text(x.src))return <figure {...common} className={`${id} cms-media`}><video src={text(x.src)} poster={text(x.poster)||undefined} controls className="cms-image"/><figcaption>{text(x.title)}</figcaption></figure>
 if(type==='stats'&&Array.isArray(x.items))return <section {...common} className={`${id} cms-stats`}>{(x.items as Block[]).map((s,j)=><div key={j}><strong>{text(s.value)}</strong><p>{text(s.label)}</p></div>)}</section>
 if(type==='services')return <section {...common} className={`${id} cms-collection`}><h2>{text(x.title)||'Services'}</h2><div className="cms-list">{services.slice(0,Number(x.limit)||6).map(s=><div key={s.id}><h3>{s.title}</h3><p>{s.shortDescription}</p></div>)}</div></section>
 if(type==='projects')return <section {...common} className={`${id} cms-collection`}><h2>{text(x.title)||'Selected work'}</h2><div className="cms-project-grid">{projects.slice(0,Number(x.limit)||6).map(p=><Link href={`/work/${p.slug}`} key={p.id}><span>{p.category||'Project'}</span><h3>{p.title}</h3><p>{p.excerpt}</p></Link>)}</div></section>
 if(type==='team')return <section {...common} className={`${id} cms-collection`}><h2>{text(x.title)||'Team'}</h2><div className="cms-project-grid">{team.slice(0,Number(x.limit)||6).map(p=><div key={p.id}><h3>{p.name}</h3><p>{p.role}</p></div>)}</div></section>
 if(type==='testimonials')return <section {...common} className={`${id} cms-collection`}><h2>{text(x.title)||'Client voices'}</h2><div className="cms-project-grid">{testimonials.slice(0,Number(x.limit)||3).map(t=><blockquote key={t.id}><p>“{t.quote}”</p><footer>{t.name}{t.company?` · ${t.company}`:''}</footer></blockquote>)}</div></section>
 if(type==='spacer')return <div key={b.id||i} className={id} style={{height:Math.min(Math.max(Number(x.height)||80,0),800)}}/>
 if(type==='cta')return <section {...common} className={`${id} cms-cta`}><p className="eyebrow">{text(x.kicker)}</p><h2>{text(x.title)}</h2>{text(x.href)&&<Link href={text(x.href)} className="magnetic-cta">{text(x.cta)||'Start a project'}</Link>}</section>
 if(type==='contactForm')return <section {...common} className={`${id} cms-cta`}><h2>{text(x.title)||'Tell us what you are building.'}</h2><Link href="/contact" className="magnetic-cta">Open contact form</Link></section>
 if(type==='scene3d')return <section {...common} className={`${id} cms-scene3d`}><div><p className="eyebrow">{text(x.eyebrow)||'NEOGENRA / LAB'}</p><h2>{text(x.title)||'A living idea engine'}</h2><p>{text(x.caption)||'Move your pointer across the scene.'}</p></div><div className="scene-object" aria-hidden="true"><div className="scene-ring ring-one"/><div className="scene-ring ring-two"/><div className="scene-core"><i/><i/><i/><i/><i/><i/></div></div></section>
 if(type==='marquee'&&Array.isArray(x.items))return <div key={b.id||i} className={id} style={{...style,'--marquee-speed':`${Math.max(8,Math.min(80,Number(x.speed)||24))}s`} as CSSProperties}><div className="cms-marquee-track">{[...x.items,...x.items].map((item:any,j)=><span key={j}>{text(item)}<b>✦</b></span>)}</div></div>
 return null})
 const rendered=render(tree)
 return <>{styleNodes}<div className="space-y-16">{rendered}</div></>
}
