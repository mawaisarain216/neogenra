import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import VisualBuilder from '@/components/builder/VisualBuilder'
import { ArrowRight, Blocks, FileText, Plus } from 'lucide-react'
import styles from './chooser.module.css'

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')
  if (!['SUPER_ADMIN','ADMIN','EDITOR'].includes(user.role)) notFound()
  const { id } = await searchParams
  if (id) {
    const page = await prisma.page.findUnique({ where: { id } })
    if (!page) notFound()
    return <VisualBuilder page={{ id:page.id, title:page.title, slug:page.slug, content:page.content, status:page.status }} />
  }
  const pages = await prisma.page.findMany({ orderBy:{updatedAt:'desc'}, take:20, select:{id:true,title:true,slug:true,status:true,updatedAt:true} })
  return <div className={styles.chooser}><div className={styles.hero}><span className={styles.icon}><Blocks size={20}/></span><div><div className={styles.label}>VISUAL STUDIO</div><h1>Choose a page to design.</h1><p>The builder edits real CMS pages. Pick one below, or create a new page first.</p></div></div><div className={styles.actions}><Link href="/admin/pages/new"><Plus size={16}/> New page</Link><Link href="/admin/pages"><FileText size={16}/> Manage pages</Link></div><div className={styles.list}>{pages.length?pages.map(page=><Link href={`/admin/builder?id=${page.id}`} className={styles.item} key={page.id}><span><strong>{page.title}</strong><small>/{page.slug} · {page.status}</small></span><ArrowRight size={16}/></Link>):<div className={styles.empty}>No pages exist yet. Create a page, then return here to build it visually.</div>}</div></div>
}
