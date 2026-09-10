import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminEditor from '@/components/AdminEditor'

export default async function EditTestimonial({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const x = await prisma.testimonial.findUnique({ where: { id } })
  if (!x) notFound()
  return <AdminEditor entity="testimonial" id={x.id} title={`Edit testimonial`} backHref="/admin/testimonials" fields={{
    name: x.name,
    company: x.company ?? '',
    quote: x.quote,
    image: x.image ?? '',
    sortOrder: String(x.sortOrder),
    published: String(x.published),
  }} />
}
