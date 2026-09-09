import AdminEditor from '@/components/AdminEditor'
export default function Redirects(){return <AdminEditor entity="redirect" title="Redirect manager" fields={{fromPath:'/old-path',toPath:'/new-path',statusCode:'301',enabled:'true'}}/>}
