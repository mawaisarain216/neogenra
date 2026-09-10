import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminEditor from '@/components/AdminEditor'

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const x = await prisma.service.findUnique({ where: { id } })
  if (!x) notFound()
  return <AdminEditor entity="service" id={x.id} title={`Edit: ${x.title}`} backHref="/admin/services" fields={{
    slug: x.slug,
    title: x.title,
    shortDescription: x.shortDescription ?? '',
    content: JSON.stringify(x.content, null, 2),
    icon: x.icon ?? '',
    sortOrder: String(x.sortOrder),
    published: String(x.published),
  }} />
}
