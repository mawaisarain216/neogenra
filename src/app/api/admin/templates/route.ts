import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'
const schema=z.object({name:z.string().min(1).max(120),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),type:z.enum(['PAGE','SECTION','HEADER','FOOTER']),description:z.string().max(500).optional().nullable(),content:z.unknown(),isGlobal:z.boolean().default(false)})
export async function GET(){try{await requireRole(['SUPER_ADMIN','ADMIN','EDITOR']);return NextResponse.json({items:await prisma.builderTemplate.findMany({orderBy:{updatedAt:'desc'}})})}catch{return NextResponse.json({error:'Unauthorized'},{status:401})}}
export async function POST(req:Request){try{const user=await requireRole(['SUPER_ADMIN','ADMIN','EDITOR']);await requireCsrf(req);const parsed=schema.parse(await req.json()); const data={...parsed, content: parsed.content as any}; const item=await prisma.builderTemplate.create({data});await audit({userId:user.id,action:'CREATE',entity:'template',entityId:item.id,request:req});return NextResponse.json({item},{status:201})}catch(e){const m=(e as Error).message;return NextResponse.json({error:m==='CSRF'?'Invalid security token':'Invalid request'},{status:m==='CSRF'?403:400})}}
