import { prisma } from '@/lib/prisma'

export default async function Page() {
  const items = await prisma.testimonial.findMany({ orderBy: { updatedAt: 'desc' } })
  return <main className="admin-shell"><p className="eyebrow">CMS</p><h1>Testimonials</h1><div className="mt-8 grid gap-3">{items.map((x) => <div key={x.id} className="glass-panel flex justify-between"><span>{x.name}{x.company ? ` — ${x.company}` : ''}</span><span className="text-xs text-white/40">{x.published ? 'LIVE' : 'HIDDEN'}</span></div>)}</div>{!items.length && <div className="glass-panel mt-3">No testimonials yet.</div>}</main>
}
