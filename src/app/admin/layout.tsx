import type {ReactNode} from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLogout from '@/components/AdminLogout'

const links=[['/admin','Dashboard'],['/admin/pages','Pages'],['/admin/projects','Projects'],['/admin/services','Services'],['/admin/team','Team'],['/admin/testimonials','Testimonials'],['/admin/articles','Insights'],['/admin/media','Media'],['/admin/users','Users'],['/admin/revisions','Revisions'],['/admin/audit','Audit log'],['/admin/redirects','Redirects'],['/admin/settings','Settings'],['/admin/design','Design system'],['/admin/seo','SEO'],['/admin/leads','Leads'],['/admin/navigation','Navigation'],['/admin/templates','Templates']]
export default async function AdminLayout({children}:{children:ReactNode}){ const user=await getCurrentUser(); if(!user) redirect('/admin/login'); return <div className="admin-layout"><aside className="admin-sidebar"><div className="text-xl font-bold">NEOGENRA</div><div className="mt-1 text-xs text-white/35">CONTROL CENTER</div><nav className="mt-8 grid gap-1">{links.map(([href,label])=><Link key={href} href={href} className="rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/10 hover:text-white">{label}</Link>)}</nav><div className="mt-auto pt-8 text-xs text-white/40">{user.email}<br/>{user.role}<AdminLogout/></div></aside><div className="admin-content">{children}</div></div> }
