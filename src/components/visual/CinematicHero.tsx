'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function CinematicHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let width = 0
    let height = 0
    let last = performance.now()
    const particles = Array.from({ length: 90 }, (_, i) => ({
      x: Math.random(), y: Math.random(), z: Math.random(), speed: 0.08 + Math.random() * 0.22,
      size: 0.5 + Math.random() * 2, phase: i * 0.37,
    }))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)
      const mx = pointer.current.active ? pointer.current.x : 0.5
      const my = pointer.current.active ? pointer.current.y : 0.5
      for (const p of particles) {
        if (!reduced) p.y -= dt * p.speed * 0.02
        if (p.y < -0.03) p.y = 1.03
        const depth = 0.25 + p.z * 0.95
        const x = p.x * width + (mx - 0.5) * p.z * 26
        const y = p.y * height + (my - 0.5) * p.z * 18
        const r = p.size * depth
        const alpha = 0.08 + p.z * 0.3
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <section
      className="cinematic-hero"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        pointer.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, active: true }
        e.currentTarget.style.setProperty('--mx', `${pointer.current.x * 100}%`)
        e.currentTarget.style.setProperty('--my', `${pointer.current.y * 100}%`)
      }}
      onPointerLeave={(e) => {
        pointer.current.active = false
        e.currentTarget.style.setProperty('--mx', '50%')
        e.currentTarget.style.setProperty('--my', '50%')
      }}
    >
      <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
      <div className="hero-radial" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-3d-stage" aria-hidden="true">
        <div className="hero-orbit orbit-a" />
        <div className="hero-orbit orbit-b" />
        <div className="hero-prism">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="cinematic-hero-copy">
        <div className="hero-kicker"><span className="pulse-dot" /> Independent creative growth studio</div>
        <h1>Ideas that become <em>impossible</em> to ignore.</h1>
        <p>Brand systems, digital experiences, content and growth — engineered as one connected creative force.</p>
        <div className="hero-actions">
          <Link href="/contact" className="magnetic-cta">Start a project <ArrowUpRight size={18} /></Link>
          <Link href="/work" className="hero-secondary">Explore selected work <span>↗</span></Link>
        </div>
      </div>
      <div className="hero-meta"><span>BRAND</span><span>DIGITAL</span><span>CONTENT</span><span>GROWTH</span><span>AI</span></div>
    </section>
  )
}
