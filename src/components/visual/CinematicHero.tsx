'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { SiteDesign } from '@/lib/site-design'

export default function CinematicHero({ design }: { design: SiteDesign }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  useEffect(() => { const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const dpr=Math.min(window.devicePixelRatio||1,2);let raf=0,width=0,height=0,last=performance.now();const particles=Array.from({length:90},(_,i)=>({x:Math.random(),y:Math.random(),z:Math.random(),speed:.08+Math.random()*.22,size:.5+Math.random()*2,phase:i*.37}));const resize=()=>{const r=canvas.getBoundingClientRect();width=r.width;height=r.height;canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};resize();const ro=new ResizeObserver(resize);ro.observe(canvas);const draw=(now:number)=>{const dt=Math.min((now-last)/1000,.05);last=now;ctx.clearRect(0,0,width,height);const mx=pointer.current.active?pointer.current.x:.5;const my=pointer.current.active?pointer.current.y:.5;for(const p of particles){if(!reduced&&design.motion.enabled)p.y-=dt*p.speed*.02;if(p.y<-.03)p.y=1.03;const depth=.25+p.z*.95;const x=p.x*width+(mx-.5)*p.z*26;const y=p.y*height+(my-.5)*p.z*18;const r=p.size*depth;const alpha=.08+p.z*.3;ctx.beginPath();ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}if(!reduced&&design.motion.enabled)raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},[design.motion.enabled])
  return <section className="cinematic-hero" style={{minHeight:'calc(100svh - 0px)'}} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();pointer.current={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height,active:true};e.currentTarget.style.setProperty('--mx',`${pointer.current.x*100}%`);e.currentTarget.style.setProperty('--my',`${pointer.current.y*100}%`)}} onPointerLeave={e=>{pointer.current.active=false;e.currentTarget.style.setProperty('--mx','50%');e.currentTarget.style.setProperty('--my','50%')}}>
    <canvas ref={canvasRef} className="hero-particles" aria-hidden="true"/><div className="hero-radial" aria-hidden="true"/><div className="hero-grid" aria-hidden="true"/>
    <div className="hero-3d-stage" aria-hidden="true"><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="hero-prism"><span/><span/><span/><span/><span/><span/></div></div>
    <div className="cinematic-hero-copy"><div className="hero-kicker"><span className="pulse-dot" style={{background:design.colors.accent}}/>{design.brand.tagline}</div><h1>{design.header.style==='editorial'?<>Ideas that become <em>impossible</em> to ignore.</>:<>Make the <em>ordinary</em> impossible to ignore.</>}</h1><p>{design.brand.footerTagline}</p><div className="hero-actions"><Link href={design.header.ctaHref} className="magnetic-cta" style={{background:design.colors.primary,color:design.colors.background}}>{design.header.ctaLabel}<ArrowUpRight size={18}/></Link><Link href="/work" className="hero-secondary">Explore selected work <span>↗</span></Link></div></div>
    <div className="hero-meta"><span>BRAND</span><span>DIGITAL</span><span>CONTENT</span><span>GROWTH</span><span>AI</span></div>
  </section>
}
