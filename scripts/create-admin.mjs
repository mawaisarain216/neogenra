import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
const email=(process.env.ADMIN_EMAIL||'').trim().toLowerCase(); const password=process.env.ADMIN_PASSWORD||''
if(!email||!password){console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD');process.exit(1)}
if(password.length<14){console.error('ADMIN_PASSWORD must be at least 14 characters');process.exit(1)}
const prisma=new PrismaClient({adapter:new PrismaNeon({connectionString:process.env.DATABASE_URL})}); try { const passwordHash=await bcrypt.hash(password,12); const user=await prisma.user.upsert({where:{email},update:{passwordHash,isActive:true,role:'SUPER_ADMIN'},create:{email,passwordHash,name:'Neogenra Admin',role:'SUPER_ADMIN'}}); console.log(`Admin ready: ${user.email}`) } finally { await prisma.$disconnect() }
