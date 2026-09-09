import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'

const json = z.unknown()
const schemas = {
  page: z.object({ slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title:z.string().min(1).max(160), description:z.string().max(500).optional().nullable(), content:json, status:z.enum(['DRAFT','REVIEW','PUBLISHED','ARCHIVED']).default('DRAFT'), seoTitle:z.string().max(160).optional().nullable(), seoDescription:z.string().max(320).optional().nullable(), canonicalUrl:z.string().url().optional().nullable(), noIndex:z.boolean().default(false), ogImage:z.string().url().optional().nullable() }),
  project: z.object({ slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title:z.string().min(1).max(160), client:z.string().max(160).optional().nullable(), category:z.string().max(100).optional().nullable(), excerpt:z.string().max(500).optional().nullable(), content:json, coverImage:z.string().url().optional().nullable(), gallery:json.optional().nullable(), status:z.enum(['DRAFT','REVIEW','PUBLISHED','ARCHIVED']).default('DRAFT'), featured:z.boolean().default(false), seoTitle:z.string().max(160).optional().nullable(), seoDescription:z.string().max(320).optional().nullable() }),
  service: z.object({ slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title:z.string().min(1).max(160), shortDescription:z.string().max(500).optional().nullable(), content:json, icon:z.string().max(80).optional().nullable(), sortOrder:z.number().int().min(0).max(10000).default(0), published:z.boolean().default(true) }),
  team: z.object({ slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name:z.string().min(1).max(120), role:z.string().min(1).max(120), bio:z.string().max(1000).optional().nullable(), image:z.string().url().optional().nullable(), socials:json.optional().nullable(), sortOrder:z.number().int().min(0).max(10000).default(0), published:z.boolean().default(true) }),
  testimonial: z.object({ name:z.string().min(1).max(120), company:z.string().max(160).optional().nullable(), quote:z.string().min(1).max(1000), image:z.string().url().optional().nullable(), sortOrder:z.number().int().min(0).max(10000).default(0), published:z.boolean().default(true) }),
  setting: z.object({ key:z.string().min(1).max(120).regex(/^[a-zA-Z0-9._-]+$/), value:json }),
  redirect: z.object({ fromPath:z.string().startsWith('/').max(500), toPath:z.string().min(1).max(500), statusCode:z.union([z.literal(301),z.literal(302),z.literal(307),z.literal(308)]).default(301), enabled:z.boolean().default(true) }),
  article: z.object({ slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title:z.string().min(1).max(180), excerpt:z.string().max(600).optional().nullable(), content:json, coverImage:z.string().url().optional().nullable(), status:z.enum(['DRAFT','REVIEW','PUBLISHED','ARCHIVED']).default('DRAFT'), category:z.string().max(100).optional().nullable(), tags:json.optional().nullable(), authorId:z.string().optional().nullable(), publishedAt:z.coerce.date().optional().nullable(), seoTitle:z.string().max(180).optional().nullable(), seoDescription:z.string().max(320).optional().nullable(), noIndex:z.boolean().default(false) }),
} as const

const roleMap: Record<string,string[]> = { page:['SUPER_ADMIN','ADMIN','EDITOR'], project:['SUPER_ADMIN','ADMIN','EDITOR','AUTHOR'], service:['SUPER_ADMIN','ADMIN','EDITOR'], team:['SUPER_ADMIN','ADMIN','EDITOR'], testimonial:['SUPER_ADMIN','ADMIN','EDITOR'], setting:['SUPER_ADMIN','ADMIN'], redirect:['SUPER_ADMIN','ADMIN'], article:['SUPER_ADMIN','ADMIN','EDITOR','AUTHOR'] }
const modelMap: Record<string, any> = { page: prisma.page, project: prisma.project, service: prisma.service, team: prisma.teamMember, testimonial: prisma.testimonial, setting: prisma.siteSetting, redirect: prisma.redirect, article: prisma.article }

async function guard(entity:string, req:Request) { const roles=roleMap[entity]; if(!roles) throw new Error('NOT_FOUND'); const user=await requireRole(roles); await requireCsrf(req); return user }

export async function GET(req:Request, {params}:{params:Promise<{entity:string}>}) {
  const {entity}=await params; const model=modelMap[entity]; if(!model) return NextResponse.json({error:'Not found'},{status:404})
  try { await requireRole(roleMap[entity]); const url=new URL(req.url); const take=Math.min(Number(url.searchParams.get('take')||50),100); const skip=Math.max(Number(url.searchParams.get('skip')||0),0); const items=await model.findMany({take,skip,orderBy:{updatedAt:'desc'}}); return NextResponse.json({items}) } catch { return NextResponse.json({error:'Unauthorized'},{status:401}) }
}

export async function POST(req:Request,{params}:{params:Promise<{entity:string}>}) {
  const {entity}=await params; const model=modelMap[entity]; const schema=schemas[entity as keyof typeof schemas]; if(!model||!schema) return NextResponse.json({error:'Not found'},{status:404})
  try { const user=await guard(entity,req); const parsed=schema.parse(await req.json()); const item=await model.create({data:parsed}); await audit({userId:user.id,action:'CREATE',entity,entityId:item.id,request:req}); return NextResponse.json({item},{status:201}) } catch(e) { const status=(e as Error).message==='UNAUTHORIZED'?401:(e as Error).message==='CSRF'?403:400; return NextResponse.json({error:status===400?'Invalid request':'Unauthorized'},{status}) }
}

export async function PATCH(req:Request,{params}:{params:Promise<{entity:string}>}) {
  const {entity}=await params; const model=modelMap[entity]; const schema=schemas[entity as keyof typeof schemas]; if(!model||!schema) return NextResponse.json({error:'Not found'},{status:404})
  try { const user=await guard(entity,req); const body=await req.json(); const id=z.string().min(1).parse(body.id); const parsed=schema.partial().parse(body.data); const before=(['page','project','article'].includes(entity))?await model.findUnique({where:{id}}):null; const item=await model.update({where:{id},data:parsed}); if(before) { const where=entity==='page'?{pageId:id}:entity==='project'?{projectId:id}:{articleId:id}; const count=await prisma.revision.count({where}); await prisma.revision.create({data:{entity,snapshot:before,version:count+1,createdById:user.id,...(entity==='page'?{pageId:id}:entity==='project'?{projectId:id}:{articleId:id})}}) } const action = (entity === 'page' || entity === 'project') && 'status' in parsed && parsed.status === 'PUBLISHED' ? 'PUBLISH' : 'UPDATE'; await audit({userId:user.id,action,entity,entityId:id,request:req}); return NextResponse.json({item}) } catch(e) { const msg=(e as Error).message; return NextResponse.json({error:msg==='UNAUTHORIZED'?'Unauthorized':msg==='CSRF'?'Invalid security token':'Invalid request'},{status:msg==='UNAUTHORIZED'?401:msg==='CSRF'?403:400}) }
}

export async function DELETE(req:Request,{params}:{params:Promise<{entity:string}>}) {
  const {entity}=await params; const model=modelMap[entity]; if(!model) return NextResponse.json({error:'Not found'},{status:404})
  try { const user=await guard(entity,req); const id=z.string().min(1).parse(new URL(req.url).searchParams.get('id')); await model.delete({where:{id}}); await audit({userId:user.id,action:'DELETE',entity,entityId:id,request:req}); return NextResponse.json({ok:true}) } catch(e) { const msg=(e as Error).message; return NextResponse.json({error:msg==='UNAUTHORIZED'?'Unauthorized':msg==='CSRF'?'Invalid security token':'Invalid request'},{status:msg==='UNAUTHORIZED'?401:msg==='CSRF'?403:400}) }
}
