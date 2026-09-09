import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { enforceRateLimit } from '@/lib/rate-limit'

const schema=z.object({name:z.string().min(2).max(120),email:z.string().email().max(254).optional().or(z.literal('')),phone:z.string().max(40).optional(),company:z.string().max(160).optional(),service:z.string().max(120).optional(),message:z.string().min(10).max(5000),website:z.string().max(1).optional()})
export async function POST(req:Request){ try { if(!(await enforceRateLimit(req,'contact',5,60*60*1000))) return NextResponse.json({error:'Too many requests'},{status:429}); const body=schema.parse(await req.json()); if(body.website) return NextResponse.json({ok:true}); const lead=await prisma.lead.create({data:{name:body.name,email:body.email||null,phone:body.phone||null,company:body.company||null,service:body.service||null,message:body.message,source:'website-contact'}}); return NextResponse.json({ok:true,id:lead.id},{status:201}) } catch { return NextResponse.json({error:'Invalid request'},{status:400}) } }
