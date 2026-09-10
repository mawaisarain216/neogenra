import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ArrowUpRight, Blocks, FileText, FolderKanban, Image as ImageIcon, MessageSquare, Plus, Sparkles, Users } from 'lucide-react'
import styles from './dashboard.module.css'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')
  const [pages, projects, services, articles, media, users, leads, audit] = await Promise.all([
    prisma.page.count(), prisma.project.count(), prisma.service.count(), prisma.article.count(), prisma.mediaAsset.count(), prisma.user.count(), prisma.lead.count(), prisma.auditLog.count(),
  ])
  const recent = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' }, take: 6, select: { id: true, title: true, slug: true, status: true, updatedAt: true } })
  const stats = [
    ['Pages', pages, FileText, '/admin/pages'], ['Projects', projects, FolderKanban, '/admin/projects'], ['Services', services, Sparkles, '/admin/services'], ['Insights', articles, MessageSquare, '/admin/articles'], ['Media', media, ImageIcon, '/admin/media'], ['Users', users, Users, '/admin/users'], ['Leads', leads, MessageSquare, '/admin/leads'], ['Audit events', audit, Blocks, '/admin/audit'],
  ] as const
  return <div className={styles.dashboard}>
    <section className={styles.hero}><div><div className={styles.eyebrow}><span/>CONTROL CENTER / {user.role.replace('_',' ')}</div><h1>Build. Publish.<br/><em>Move the business.</em></h1><p>Your command surface for content, brand, growth, publishing and the visual system.</p></div><div className={styles.heroActions}><Link href="/admin/builder" className={styles.primary}><Blocks size={17}/> Open Visual Builder <ArrowUpRight size={16}/></Link><Link href="/admin/pages/new" className={styles.secondary}><Plus size={16}/> New page</Link></div></section>
    <section className={styles.stats}>{stats.map(([label,value,Icon,href])=><Link href={href} key={label} className={styles.stat}><span className={styles.statIcon}><Icon size={16}/></span><span className={styles.statCopy}><small>{label}</small><strong>{value}</strong></span><ArrowUpRight size={14}/></Link>)}</section>
    <section className={styles.panelGrid}>
      <div className={styles.panel}><div className={styles.panelHead}><div><span className={styles.label}>CONTENT</span><h2>Recent pages</h2></div><Link href="/admin/pages">Manage all <ArrowUpRight size={14}/></Link></div><div className={styles.list}>{recent.length ? recent.map(page=><div className={styles.row} key={page.id}><div className={styles.mark}>N</div><div className={styles.rowCopy}><strong>{page.title}</strong><small>/{page.slug} · Updated {page.updatedAt.toLocaleDateString()}</small></div><span className={`${styles.status} ${styles[page.status.toLowerCase() as 'published'|'draft'|'review'|'archived']}`}>{page.status}</span><Link href={`/admin/builder?id=${page.id}`} className={styles.edit}>Edit</Link></div>) : <div className={styles.empty}>No pages yet. Create your first page and open it in the visual builder.</div>}</div></div>
      <div className={`${styles.panel} ${styles.actions}`}><span className={styles.label}>SHORTCUTS</span><h2>Do the next thing.</h2><div className={styles.actionGrid}><Link href="/admin/builder" className={styles.action}><Blocks/><span><strong>Visual Builder</strong><small>Design a page on canvas</small></span></Link><Link href="/admin/media" className={styles.action}><ImageIcon/><span><strong>Upload media</strong><small>Open the asset library</small></span></Link><Link href="/admin/projects/new" className={styles.action}><FolderKanban/><span><strong>New project</strong><small>Add a case study</small></span></Link><Link href="/admin/design" className={styles.action}><Sparkles/><span><strong>Design themes</strong><small>Choose a public template</small></span></Link></div></div>
    </section>
  </div>
}
