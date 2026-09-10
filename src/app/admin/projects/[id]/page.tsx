import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminEditor from '@/components/AdminEditor'

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const x = await prisma.project.findUnique({ where: { id } })
  if (!x) notFound()
  return <AdminEditor entity="project" id={x.id} title={`Edit: ${x.title}`} backHref="/admin/projects" fields={{
    slug: x.slug,
    title: x.title,
    client: x.client ?? '',
    category: x.category ?? '',
    excerpt: x.excerpt ?? '',
    content: JSON.stringify(x.content, null, 2),
    coverImage: x.coverImage ?? '',
    gallery: x.gallery ? JSON.stringify(x.gallery, null, 2) : '[]',
    status: x.status,
    featured: String(x.featured),
    seoTitle: x.seoTitle ?? '',
    seoDescription: x.seoDescription ?? '',
  }} />
}
