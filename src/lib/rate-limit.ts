import { prisma } from './prisma'
import { hashIp } from './security'

export async function enforceRateLimit(req:Request, scope:string, limit:number, windowMs:number){
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()??req.headers.get('x-real-ip')??'unknown'; const hashed=hashIp(ip); if(!hashed) return true
 const key=hashIp(`${scope}:${hashed}`)!; const since=new Date(Date.now()-windowMs)
 const count=await prisma.rateLimitEvent.count({where:{keyHash:key,createdAt:{gte:since}}})
 if(count>=limit)return false
 await prisma.rateLimitEvent.create({data:{keyHash:key}})
 return true
}
