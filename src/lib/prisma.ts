import { PrismaClient } from '@/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

declare global { var prisma: PrismaClient | undefined }
let client: PrismaClient | undefined
function getClient(){if(client)return client;const connectionString=process.env.DATABASE_URL;if(!connectionString)throw new Error('DATABASE_URL is required');const adapter=new PrismaNeon({connectionString});client=globalThis.prisma??new PrismaClient({adapter});if(process.env.NODE_ENV!=='production')globalThis.prisma=client;return client}
export const prisma=new Proxy({} as PrismaClient,{get(_target,property){const value=Reflect.get(getClient() as object,property,getClient());return typeof value==='function'?value.bind(getClient()):value}})
