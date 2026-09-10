import AdminEditor from '@/components/AdminEditor'

export default function NewProject() {
  return <AdminEditor entity="project" title="Create project" backHref="/admin/projects" fields={{
    slug: 'new-project',
    title: '',
    client: '',
    category: '',
    excerpt: '',
    content: '{"blocks":[]}',
    coverImage: '',
    gallery: '[]',
    status: 'DRAFT',
    featured: 'false',
    seoTitle: '',
    seoDescription: '',
  }} />
}
