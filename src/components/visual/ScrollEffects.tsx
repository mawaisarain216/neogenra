'use client'

import { useEffect } from 'react'

export default function ScrollEffects() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (reduced) { items.forEach((el) => el.classList.add('is-visible')); return }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return null
}
