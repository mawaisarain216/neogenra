'use client'

import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

const work = [
  { n: '01', client: 'Apex House', type: 'Brand / Digital', title: 'A new visual language for a business built to move faster.', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85' },
  { n: '02', client: 'Northline', type: 'Strategy / Experience', title: 'Turning a complex offer into an experience people understand.', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1800&q=85' },
  { n: '03', client: 'Forma', type: 'Commerce / Growth', title: 'Designing the system behind a category-defining launch.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85' },
]

const services = ['Brand strategy', 'Visual identity', 'Digital experiences', 'Content systems', 'Growth & performance', 'AI & emerging technology']

export default function NeogenraHome() {
  const stage = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--px', `${((e.clientX-r.left)/r.width-.5)*2}`)
      el.style.setProperty('--py', `${((e.clientY-r.top)/r.height-.5)*2}`)
    }
    const onLeave = () => { el.style.setProperty('--px','0'); el.style.setProperty('--py','0') }
    el.addEventListener('pointermove', onMove); el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  }, [])

  return <main className="ng-home">
    <section ref={stage} className="ng-hero">
      <div className="ng-hero-art" aria-hidden="true"><div className="ng-sphere"/><div className="ng-ring ng-ring-a"/><div className="ng-ring ng-ring-b"/><div className="ng-cross"/></div>
      <div className="ng-hero-top"><span>Independent creative company</span><span>Pakistan · Worldwide</span></div>
      <div className="ng-hero-copy">
        <p className="ng-overline">Neogenra® — 01 / 06</p>
        <h1>We make<br/><i>brands</i><br/>matter.</h1>
        <p className="ng-hero-lead">Strategy, identity and digital experiences for ambitious companies that refuse to look like everyone else.</p>
      </div>
      <div className="ng-hero-bottom"><span>Scroll to explore</span><ArrowDownRight size={22}/><span className="ng-hero-index">Selected / 2026</span></div>
    </section>

    <section className="ng-intro ng-section">
      <div className="ng-section-label">02 / Point of view</div>
      <div className="ng-intro-copy"><p className="ng-display">The best work doesn't decorate a business. <i>It changes how the business is seen.</i></p><div className="ng-rule"/><div className="ng-two-col"><p>Neogenra is a digital creative company built at the intersection of sharp strategy, expressive design and technology.</p><p>We turn ambitious ideas into identities, experiences and systems with enough character to be remembered — and enough intelligence to perform.</p></div></div>
    </section>

    <section className="ng-work ng-section">
      <div className="ng-section-head"><div className="ng-section-label">03 / Selected work</div><Link href="/work" className="ng-text-link">View all work <ArrowUpRight size={17}/></Link></div>
      <div className="ng-work-list">{work.map((item, i) => <Link href="/work" className={`ng-project ${i===1?'ng-project-offset':''}`} key={item.n}>
        <div className="ng-project-image"><img src={item.image} alt=""/><span className="ng-project-number">{item.n}</span></div>
        <div className="ng-project-meta"><div><span>{item.client}</span><span>{item.type}</span></div><h2>{item.title}</h2><MoveUpRight size={22}/></div>
      </Link>)}</div>
    </section>

    <section className="ng-services ng-section">
      <div className="ng-section-label">04 / What we do</div>
      <div className="ng-services-layout"><h2 className="ng-display">Built to<br/><i>move.</i></h2><div className="ng-service-list">{services.map((s,i)=><Link href="/services" key={s}><span>0{i+1}</span><strong>{s}</strong><ArrowUpRight size={19}/></Link>)}</div></div>
    </section>

    <section className="ng-statement ng-section"><div className="ng-section-label">05 / The difference</div><p>Less noise.<br/><i>More signal.</i><br/>More <b>meaning.</b></p><Link href="/about" className="ng-circle-link">About<br/>Neogenra <ArrowUpRight size={18}/></Link></section>

    <section className="ng-contact ng-section"><div className="ng-section-label">06 / Start something</div><div className="ng-contact-main"><p className="ng-overline">Have an ambition worth building?</p><h2>Let's make<br/><i>something</i><br/>matter.</h2><Link href="/contact" className="ng-big-link">Start a conversation <ArrowUpRight size={24}/></Link></div><div className="ng-contact-footer"><span>hello@neogenra.com</span><span>© 2026 Neogenra</span></div></section>
  </main>
}
