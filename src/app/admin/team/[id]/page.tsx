import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminEditor from '@/components/AdminEditor'

export default async function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const x = await prisma.teamMember.findUnique({ where: { id } })
  if (!x) notFound()
  return <AdminEditor entity="team" id={x.id} title={`Edit: ${x.name}`} backHref="/admin/team" fields={{
    slug: x.slug,
    name: x.name,
    role: x.role,
    bio: x.bio ?? '',
    image: x.image ?? '',
    socials: x.socials ? JSON.stringify(x.socials, null, 2) : '{}',
    sortOrder: String(x.sortOrder),
    published: String(x.published),
  }} />
}
