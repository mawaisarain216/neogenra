import AdminEditor from '@/components/AdminEditor'

export default function NewTestimonial() {
  return <AdminEditor entity="testimonial" title="Create testimonial" backHref="/admin/testimonials" fields={{
    name: '',
    company: '',
    quote: '',
    image: '',
    sortOrder: '0',
    published: 'true',
  }} />
}
