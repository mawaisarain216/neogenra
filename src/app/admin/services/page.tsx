import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function Services() {
  const items = await prisma.service.findMany({ orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }] })
  return <main className="admin-shell"><div className="mx-auto max-w-6xl">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">CMS / CAPABILITIES</p><h1 className="mt-2 text-5xl font-bold tracking-[-.06em]">Services</h1><p className="mt-2 text-sm text-white/40">Control the capabilities shown across the public site.</p></div><Link href="/admin/services/new" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"><Plus size={15} className="mr-1 inline"/>New service</Link></div>
    <div className="mt-8 grid gap-3">{items.map(x => <Link href={`/admin/services/${x.id}`} key={x.id} className="group rounded-[1.4rem] border border-white/10 bg-white/[.025] p-5 transition hover:border-white/25 hover:bg-white/[.045]"><div className="flex items-center justify-between gap-5"><div><span className="text-[10px] uppercase tracking-[.18em] text-white/35">#{String(x.sortOrder).padStart(2,'0')}</span><h2 className="mt-2 text-xl font-semibold">{x.title}</h2><p className="mt-1 text-sm text-white/40">{x.shortDescription || 'No short description yet.'}</p></div><div className="flex items-center gap-3 text-xs text-white/40"><span>{x.published ? 'LIVE' : 'HIDDEN'}</span><ArrowUpRight size={15}/></div></div></Link>)}{!items.length && <div className="rounded-[1.4rem] border border-dashed border-white/15 p-10 text-center text-white/35">No services yet.</div>}</div>
  </div></main>
}
