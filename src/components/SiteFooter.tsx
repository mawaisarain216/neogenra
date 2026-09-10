import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function SiteFooter(){
  return <footer className="ng-footer">
    <div className="ng-footer-top"><span>Neogenra®</span><span>Independent creative company<br/>Pakistan · Worldwide</span><span><Link href="mailto:hello@neogenra.com">hello@neogenra.com</Link></span></div>
    <div className="ng-footer-brand"><h2>Make<br/><i>it matter.</i></h2><Link href="/contact" className="ng-footer-circle">Start<br/>a project <ArrowUpRight size={20}/></Link></div>
    <div className="ng-footer-bottom"><span>© 2026 Neogenra. All rights reserved.</span><div><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div></div>
  </footer>
}
