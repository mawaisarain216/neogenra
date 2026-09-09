import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    const user=await requireRole(['SUPER_ADMIN','ADMIN','EDITOR']); await requireCsrf(req); const {id}=await params; const revision=await prisma.revision.findUnique({where:{id}}); if(!revision) return NextResponse.json({error:'Not found'},{status:404}); const snapshot=revision.snapshot as Record<string,unknown>; const mutable=(s:any)=>{const {id,createdAt,updatedAt,...rest}=s; return rest}
    if(revision.pageId) { await prisma.page.update({where:{id:revision.pageId},data:mutable(snapshot) as any}) }
    else if(revision.projectId) { await prisma.project.update({where:{id:revision.projectId},data:mutable(snapshot) as any}) }
    else if(revision.articleId) { await prisma.article.update({where:{id:revision.articleId},data:mutable(snapshot) as any}) }
    else return NextResponse.json({error:'Unsupported revision'},{status:400})
    await audit({userId:user.id,action:'ROLLBACK',entity:revision.entity,entityId:revision.pageId??revision.projectId??revision.articleId??undefined,request:req,metadata:{revisionId:id,version:revision.version}})
    return NextResponse.json({ok:true})
  } catch(e) { const msg=(e as Error).message; return NextResponse.json({error:msg==='CSRF'?'Invalid security token':'Unauthorized'},{status:msg==='CSRF'?403:401}) }
}
