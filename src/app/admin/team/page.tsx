import { prisma } from '@/lib/prisma'

export default async function Page() {
  const items = await prisma.teamMember.findMany({ orderBy: { updatedAt: 'desc' } })
  return <main className="admin-shell"><p className="eyebrow">CMS</p><h1>Team</h1><div className="mt-8 grid gap-3">{items.map((x) => <div key={x.id} className="glass-panel flex justify-between"><span>{x.name}</span><span className="text-xs text-white/40">{x.published ? 'LIVE' : 'HIDDEN'}</span></div>)}</div>{!items.length && <div className="glass-panel mt-3">No team members yet.</div>}</main>
}
