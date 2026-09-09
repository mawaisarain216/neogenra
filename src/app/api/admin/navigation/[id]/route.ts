import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'
const schema=z.object({label:z.string().min(1).max(80).optional(),href:z.string().min(1).max(500).optional(),parentId:z.string().min(1).nullable().optional(),sortOrder:z.number().int().min(0).max(10000).optional(),enabled:z.boolean().optional(),openInNewTab:z.boolean().optional()})
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{const user=await requireRole(['SUPER_ADMIN','ADMIN']);await requireCsrf(req);const {id}=await params;const item=await prisma.navigationItem.update({where:{id},data:schema.parse(await req.json())});await audit({userId:user.id,action:'UPDATE',entity:'navigation',entityId:id,request:req});return NextResponse.json({item})}catch(e){const m=(e as Error).message;return NextResponse.json({error:m==='CSRF'?'Invalid security token':'Invalid request'},{status:m==='CSRF'?403:400})}}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){try{const user=await requireRole(['SUPER_ADMIN','ADMIN']);await requireCsrf(req);const {id}=await params;await prisma.navigationItem.delete({where:{id}});await audit({userId:user.id,action:'DELETE',entity:'navigation',entityId:id,request:req});return NextResponse.json({ok:true})}catch(e){const m=(e as Error).message;return NextResponse.json({error:m==='CSRF'?'Invalid security token':'Invalid request'},{status:m==='CSRF'?403:400})}}
