import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'

const allowed = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'application/pdf',
])
const MAX = 25 * 1024 * 1024

export async function GET() {
  try {
    await requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'])
    const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR'])
    await requireCsrf(req)

    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'File required' }, { status: 400 })
    if (file.size > MAX) return NextResponse.json({ error: 'Maximum file size is 25MB' }, { status: 413 })
    if (!allowed.has(file.type)) return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })

    const folder = z
      .string()
      .regex(/^[a-zA-Z0-9/_-]{1,80}$/)
      .optional()
      .parse(form.get('folder') || 'neogenra')
    const altText = z.string().max(240).optional().parse(form.get('altText') || undefined)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 180) || 'upload'

    let blob
    try {
      // Current Vercel Blob stores can authenticate this call with short-lived
      // OIDC credentials. Static BLOB_READ_WRITE_TOKEN remains supported for
      // legacy stores, so do not hard-fail when that variable is absent.
      blob = await put(`${folder}/${crypto.randomUUID()}-${safeName}`, file, { access: 'public' })
    } catch (error) {
      console.error('Blob upload failed', error)
      return NextResponse.json(
        {
          error:
            'Media storage is not connected to this Vercel project. Connect a Vercel Blob store to the project, then redeploy.',
        },
        { status: 503 },
      )
    }

    const item = await prisma.mediaAsset.create({
      data: {
        url: blob.url,
        publicId: blob.pathname,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        folder,
        altText,
      },
    })

    await audit({ userId: user.id, action: 'MEDIA_UPLOAD', entity: 'media', entityId: item.id, request: req })
    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    const message = (error as Error).message
    return NextResponse.json(
      { error: message === 'CSRF' ? 'Invalid security token' : 'Upload failed' },
      { status: message === 'CSRF' ? 403 : 400 },
    )
  }
}
