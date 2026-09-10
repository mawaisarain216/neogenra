import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function Projects() {
  const items = await prisma.project.findMany({ orderBy: { updatedAt: 'desc' } })
  return <main className="admin-shell">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">CMS / WORK</p><h1 className="mt-2 text-5xl font-bold tracking-[-.06em]">Projects</h1><p className="mt-2 text-sm text-white/40">Manage case studies, proof points, galleries and publishing state.</p></div>
        <Link href="/admin/projects/new" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"><Plus size={15} className="mr-1 inline"/>New project</Link>
      </div>
      <div className="mt-8 grid gap-3">
        {items.map(x => <Link href={`/admin/projects/${x.id}`} key={x.id} className="group rounded-[1.4rem] border border-white/10 bg-white/[.025] p-5 transition hover:border-white/25 hover:bg-white/[.045]">
          <div className="flex items-center justify-between gap-5"><div><span className="text-[10px] uppercase tracking-[.18em] text-white/35">{x.category || 'Case study'}</span><h2 className="mt-2 text-xl font-semibold">{x.title}</h2><p className="mt-1 text-sm text-white/40">{x.client || 'Internal / studio work'}{x.featured ? ' · Featured' : ''}</p></div><div className="flex items-center gap-3 text-xs text-white/40"><span>{x.status}</span><ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"/></div></div>
        </Link>)}
        {!items.length && <div className="rounded-[1.4rem] border border-dashed border-white/15 p-10 text-center text-white/35">No projects yet. Create the first case study.</div>}
      </div>
    </div>
  </main>
}
