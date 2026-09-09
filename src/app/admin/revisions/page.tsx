import { prisma } from '@/lib/prisma'

export default async function Revisions() {
  const items = await prisma.revision.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      createdBy: { select: { name: true, email: true } },
      page: { select: { title: true } },
      project: { select: { title: true } },
      article: { select: { title: true } },
    },
  })

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">CONTENT GOVERNANCE</p>
          <h1>Revisions</h1>
          <p>Every page, project and article snapshot can be restored through the protected rollback API.</p>
        </div>
      </div>
      <div className="admin-list">
        {items.map((x) => (
          <div className="glass-panel admin-list-row" key={x.id}>
            <div>
              <strong>{x.page?.title || x.project?.title || x.article?.title || x.entity}</strong>
              <div className="text-xs text-white/40">
                Version {x.version} · {x.createdAt.toISOString()} · {x.createdBy?.name || x.createdBy?.email || 'system'}
              </div>
            </div>
            <span className="text-xs text-white/40">{x.entity}</span>
          </div>
        ))}
        {!items.length && <div className="glass-panel">No revisions yet.</div>}
      </div>
    </main>
  )
}
