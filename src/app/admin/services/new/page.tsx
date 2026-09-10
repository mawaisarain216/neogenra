import AdminEditor from '@/components/AdminEditor'

export default function NewService() {
  return <AdminEditor entity="service" title="Create service" backHref="/admin/services" fields={{
    slug: 'new-service',
    title: '',
    shortDescription: '',
    content: '{"blocks":[]}',
    icon: '',
    sortOrder: '0',
    published: 'true',
  }} />
}
