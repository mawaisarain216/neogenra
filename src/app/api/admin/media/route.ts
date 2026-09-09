import {NextResponse} from 'next/server'
import {put} from '@vercel/blob'
import {z} from 'zod'
import {prisma} from '@/lib/prisma'
import {requireRole} from '@/lib/auth'
import {requireCsrf} from '@/lib/csrf'
import {audit} from '@/lib/audit'

const allowed=new Set(['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','application/pdf'])
const MAX=25*1024*1024
export async function GET(){try{await requireRole(['SUPER_ADMIN','ADMIN','EDITOR','AUTHOR']);const items=await prisma.mediaAsset.findMany({orderBy:{createdAt:'desc'},take:200});return NextResponse.json({items})}catch{return NextResponse.json({error:'Unauthorized'},{status:401})}}
export async function POST(req:Request){try{const user=await requireRole(['SUPER_ADMIN','ADMIN','EDITOR']);await requireCsrf(req);const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'File required'},{status:400});if(file.size>MAX)return NextResponse.json({error:'Maximum file size is 25MB'},{status:413});if(!allowed.has(file.type))return NextResponse.json({error:'Unsupported file type'},{status:415});if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.'},{status:503});const folder=z.string().regex(/^[a-zA-Z0-9/_-]{1,80}$/).optional().parse(form.get('folder')||'neogenra');const blob=await put(`${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'-')}`,file,{access:'public'});const item=await prisma.mediaAsset.create({data:{url:blob.url,publicId:blob.pathname,filename:file.name,mimeType:file.type,sizeBytes:file.size,folder}});await audit({userId:user.id,action:'MEDIA_UPLOAD',entity:'media',entityId:item.id,request:req});return NextResponse.json({item},{status:201})}catch(e){const m=(e as Error).message;return NextResponse.json({error:m==='CSRF'?'Invalid security token':'Upload failed'},{status:m==='CSRF'?403:400})}}
