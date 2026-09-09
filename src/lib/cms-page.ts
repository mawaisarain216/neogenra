import { prisma } from '@/lib/prisma'
export async function getCmsPage(slug:string){try{return await prisma.page.findFirst({where:{slug,status:'PUBLISHED'}})}catch{return null}}
