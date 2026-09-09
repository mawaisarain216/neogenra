import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import VisualBuilder from '@/components/builder/VisualBuilder'
export default async function BuilderPage({searchParams}:{searchParams:Promise<{id?:string}>}){const user=await getCurrentUser();if(!user)redirect('/admin/login');if(!['SUPER_ADMIN','ADMIN','EDITOR'].includes(user.role))notFound();const {id}=await searchParams;if(!id)notFound();const page=await prisma.page.findUnique({where:{id}});if(!page)notFound();return <VisualBuilder page={{id:page.id,title:page.title,slug:page.slug,content:page.content,status:page.status}}/>}
