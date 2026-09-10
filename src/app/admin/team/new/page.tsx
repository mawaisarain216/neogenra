import AdminEditor from '@/components/AdminEditor'

export default function NewTeamMember() {
  return <AdminEditor entity="team" title="Create team member" backHref="/admin/team" fields={{
    slug: 'new-team-member',
    name: '',
    role: '',
    bio: '',
    image: '',
    socials: '{}',
    sortOrder: '0',
    published: 'true',
  }} />
}
