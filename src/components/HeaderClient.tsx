'use client'

import Link from 'next/link'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

const links = [['Work','/work'],['Services','/services'],['About','/about'],['Insights','/insights']]

export default function HeaderClient(){
  const [open,setOpen]=useState(false)
  return <header className="ng-header">
    <nav className="ng-nav">
      <Link href="/" className="ng-logo">neo<span>genra</span><sup>®</sup></Link>
      <div className="ng-nav-links">{links.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</div>
      <Link href="/contact" className="ng-nav-cta">Start a project <ArrowUpRight size={15}/></Link>
      <button className="ng-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button>
    </nav>
    {open&&<div className="ng-mobile-menu">{links.concat([['Start a project','/contact']]).map(([label,href])=><Link onClick={()=>setOpen(false)} href={href} key={href}>{label}<ArrowUpRight size={18}/></Link>)}</div>}
  </header>
}
