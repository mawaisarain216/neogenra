import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'
const schema=z.object({label:z.string().min(1).max(80),href:z.string().min(1).max(500),parentId:z.string().min(1).nullable().optional(),sortOrder:z.number().int().min(0).max(10000).default(0),enabled:z.boolean().default(true),openInNewTab:z.boolean().default(false)})
export async function GET(){try{await requireRole(['SUPER_ADMIN','ADMIN','EDITOR']);return NextResponse.json({items:await prisma.navigationItem.findMany({orderBy:{sortOrder:'asc'}})})}catch{return NextResponse.json({error:'Unauthorized'},{status:401})}}
export async function POST(req:Request){try{const user=await requireRole(['SUPER_ADMIN','ADMIN']);await requireCsrf(req);const item=await prisma.navigationItem.create({data:schema.parse(await req.json())});await audit({userId:user.id,action:'CREATE',entity:'navigation',entityId:item.id,request:req});return NextResponse.json({item},{status:201})}catch(e){const m=(e as Error).message;return NextResponse.json({error:m==='CSRF'?'Invalid security token':'Invalid request'},{status:m==='CSRF'?403:400})}}
