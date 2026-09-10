'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, BarChart3, Blocks, BookOpen, BriefcaseBusiness, ChevronLeft, ChevronRight, FileText, FolderKanban, Gauge, Globe2, Image, LayoutDashboard, Library, Menu, MessageSquare, Palette, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings2, ShieldCheck, Sparkles, Users, X } from 'lucide-react'
import AdminLogout from '@/components/AdminLogout'
import styles from '@/app/admin/admin-pro.module.css'

type Props = { user: { email: string; role: string }; children: ReactNode }

type NavItem = { label: string; href: string; icon: typeof Gauge; description?: string }
type NavGroup = { label: string; items: NavItem[] }

const groups: NavGroup[] = [
  { label: 'Command', items: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, description: 'Workspace health and activity' },
    { label: 'Visual Builder', href: '/admin/builder', icon: Blocks, description: 'Build pages visually' },
    { label: 'Pages', href: '/admin/pages', icon: FileText, description: 'Site pages and publishing' },
    { label: 'Projects', href: '/admin/projects', icon: BriefcaseBusiness, description: 'Case studies and work' },
    { label: 'Services', href: '/admin/services', icon: Sparkles, description: 'Capabilities and offerings' },
    { label: 'Insights', href: '/admin/articles', icon: BookOpen, description: 'Articles and thought leadership' },
  ]},
  { label: 'Brand', items: [
    { label: 'Media Library', href: '/admin/media', icon: Image, description: 'Images, video and documents' },
    { label: 'Team', href: '/admin/team', icon: Users, description: 'People and profiles' },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, description: 'Client proof' },
    { label: 'Navigation', href: '/admin/navigation', icon: Library, description: 'Menus and hierarchy' },
    { label: 'Templates', href: '/admin/templates', icon: FolderKanban, description: 'Reusable builder templates' },
    { label: 'Design System', href: '/admin/design', icon: Palette, description: 'Choose the public visual system' },
  ]},
  { label: 'Operations', items: [
    { label: 'Leads', href: '/admin/leads', icon: BarChart3, description: 'Inbound project enquiries' },
    { label: 'SEO', href: '/admin/seo', icon: Globe2, description: 'Search and metadata' },
    { label: 'Settings', href: '/admin/settings', icon: Settings2, description: 'Global configuration' },
    { label: 'Users', href: '/admin/users', icon: ShieldCheck, description: 'Access and roles' },
    { label: 'Revisions', href: '/admin/revisions', icon: Activity, description: 'Restore previous versions' },
    { label: 'Audit Log', href: '/admin/audit', icon: Gauge, description: 'Security and change history' },
    { label: 'Redirects', href: '/admin/redirects', icon: ArrowUpRight, description: 'URL routing' },
  ]},
]

export default function AdminShell({ user, children }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => setMobileOpen(false), [pathname])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandOpen(true) }
      if (event.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const flat = useMemo(() => groups.flatMap(group => group.items), [])
  const results = useMemo(() => flat.filter(item => `${item.label} ${item.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8), [flat, query])
  const current = flat.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`)))

  return <div className={`${styles.app} admin-app-shell`}>
    {mobileOpen && <button aria-label="Close navigation" className={styles.scrim} onClick={() => setMobileOpen(false)} />}
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.brandRow}>
        <Link href="/admin" className={styles.brand} aria-label="Neogenra Control Center">
          <span className={styles.brandMark}>N</span>
          <span className={styles.brandText}><strong>NEOGENRA</strong><small>CONTROL CENTER</small></span>
        </Link>
        <button className={styles.iconButton} onClick={() => setMobileOpen(false)} aria-label="Close sidebar"><X size={17}/></button>
      </div>
      <button className={styles.workspace} onClick={() => setCommandOpen(true)}>
        <span className={styles.workspaceDot}/><span className={styles.workspaceCopy}><strong>Production</strong><small>Primary workspace</small></span><Search size={15}/>
      </button>
      <nav className={styles.nav} aria-label="Admin navigation">
        {groups.map(group => <div className={styles.navGroup} key={group.label}>
          <div className={styles.navLabel}>{group.label}</div>
          {group.items.map(item => { const Icon = item.icon; const active = current?.href === item.href; return <Link key={item.href} href={item.href} className={`${styles.navItem} ${active ? styles.active : ''}`} title={collapsed ? item.label : item.description}>
            <Icon size={17}/><span className={styles.navItemText}>{item.label}</span>{active && <span className={styles.activeMark}/>} 
          </Link> })}
        </div>)}
      </nav>
      <div className={styles.sidebarBottom}>
        <Link href="/" target="_blank" className={styles.viewSite}><Globe2 size={16}/><span>View live site</span><ArrowUpRight size={14}/></Link>
        <div className={styles.account}>
          <div className={styles.avatar}>{user.email.slice(0,1).toUpperCase()}</div>
          <div className={styles.accountText}><strong>{user.email}</strong><small>{user.role.replace('_',' ')}</small></div>
          <AdminLogout />
        </div>
        <button className={styles.collapseButton} onClick={() => setCollapsed(value => !value)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <PanelLeftOpen size={16}/> : <><PanelLeftClose size={16}/><span>Collapse navigation</span></>}</button>
      </div>
    </aside>

    <main className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}><button className={styles.mobileMenu} onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={19}/></button><div><div className={styles.breadcrumb}><span>Workspace</span><span>/</span><strong>{current?.label || 'Overview'}</strong></div><div className={styles.context}>{current?.description || 'Operate the Neogenra digital experience.'}</div></div></div>
        <div className={styles.topbarActions}><button className={styles.searchButton} onClick={() => setCommandOpen(true)}><Search size={15}/><span>Search anything</span><kbd>⌘K</kbd></button><Link href="/admin/builder" className={styles.createButton}><Plus size={16}/><span>Create</span></Link></div>
      </header>
      <div className={styles.content}>{children}</div>
    </main>

    {commandOpen && <div className={styles.commandBackdrop} onMouseDown={() => setCommandOpen(false)}><div className={styles.command} onMouseDown={event => event.stopPropagation()}>
      <div className={styles.commandSearch}><Search size={18}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search pages, tools and settings…"/><button onClick={() => setCommandOpen(false)}><X size={16}/></button></div>
      <div className={styles.commandHint}>Quick navigation <span>Enter</span></div>
      <div className={styles.commandResults}>{results.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setCommandOpen(false)} className={styles.commandItem}><Icon size={17}/><span><strong>{item.label}</strong><small>{item.description}</small></span><ArrowUpRight size={14}/></Link> })}</div>
      {results.length === 0 && <div className={styles.emptySearch}>No matching workspace tools.</div>}
    </div></div>}
  </div>
}
