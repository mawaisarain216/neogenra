import type { ReactNode } from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLogout from '@/components/AdminLogout'
import styles from './admin-pro.module.css'

const sections = [
  { label: 'Workspace', items: [['/admin', 'Overview'], ['/admin/builder', 'Visual Builder'], ['/admin/pages', 'Pages'], ['/admin/projects', 'Projects'], ['/admin/services', 'Services'], ['/admin/articles', 'Insights']] },
  { label: 'Brand', items: [['/admin/media', 'Media Library'], ['/admin/team', 'Team'], ['/admin/testimonials', 'Testimonials'], ['/admin/navigation', 'Navigation'], ['/admin/templates', 'Templates'], ['/admin/design', 'Design System']] },
  { label: 'Operations', items: [['/admin/leads', 'Leads'], ['/admin/seo', 'SEO'], ['/admin/settings', 'Settings'], ['/admin/users', 'Users'], ['/admin/revisions', 'Revisions'], ['/admin/audit', 'Audit Log'], ['/admin/redirects', 'Redirects']] },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers()
  const isLoginPage = requestHeaders.get('x-neogenra-admin-login') === '1'

  // /admin/login is intentionally outside the authenticated shell, while every
  // other /admin route remains protected by the server-side session check.
  if (isLoginPage) return children

  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  return (
    <div className={`${styles.shell} admin-app-shell`}>
      <aside className="admin-sidebar-pro">
        <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">N</span><span><strong>NEOGENRA</strong><small>CONTROL CENTER</small></span></Link>
        <div className="admin-sidebar-scroll">
          {sections.map(section => <div className="admin-nav-section" key={section.label}>
            <div className="admin-nav-label">{section.label}</div>
            {section.items.map(([href, label]) => <Link key={href} href={href} className="admin-nav-link"><span className="admin-nav-dot" />{label}</Link>)}
          </div>)}
        </div>
        <div className="admin-account-card"><div className="admin-avatar">{user.email.slice(0, 1).toUpperCase()}</div><div className="admin-account-copy"><strong>{user.email}</strong><span>{user.role}</span></div><AdminLogout /></div>
      </aside>
      <main className="admin-main-pro">
        <header className="admin-topbar-pro"><div><span className="admin-status-dot" />Production workspace</div><div className="admin-top-actions"><Link href="/" target="_blank">View site ↗</Link></div></header>
        {children}
      </main>
    </div>
  )
}
