import Link from 'next/link'
import { prisma } from '@/lib/prisma'
export default async function Articles(){
 const items=await prisma.article.findMany({orderBy:{updatedAt:'desc'},include:{author:{select:{name:true,email:true}}},take:100})
 return <main className="admin-page"><div className="admin-heading"><div><p className="eyebrow">PUBLISHING</p><h1>Insights</h1><p>Manage articles, authors, categories, SEO and publication state.</p></div><Link className="admin-primary" href="/admin/articles/new">New article</Link></div><div className="admin-list">{items.map(x=><div className="glass-panel admin-list-row" key={x.id}><div><strong>{x.title}</strong><div className="text-xs text-white/40">/insights/{x.slug} · {x.status} · {x.author?.name||x.author?.email||'Unassigned'}</div></div><Link className="admin-secondary" href={`/admin/articles/new?id=${x.id}`}>Edit</Link></div>)}{!items.length&&<div className="glass-panel">No articles yet.</div>}</div></main>
}
