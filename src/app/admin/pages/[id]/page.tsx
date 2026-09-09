import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminEditor from '@/components/AdminEditor'
export default async function EditPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const x=await prisma.page.findUnique({where:{id}});if(!x)notFound();return <AdminEditor entity="page" id={x.id} title={`Edit: ${x.title}`} fields={{slug:x.slug,title:x.title,description:x.description??'',content:JSON.stringify(x.content),status:x.status,seoTitle:x.seoTitle??'',seoDescription:x.seoDescription??'',canonicalUrl:x.canonicalUrl??'',noIndex:String(x.noIndex),ogImage:x.ogImage??''}}/>}
