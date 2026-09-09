import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  type: z.enum(['PAGE', 'SECTION', 'HEADER', 'FOOTER']).optional(),
  description: z.string().max(500).nullable().optional(),
  content: z.unknown().optional(),
  isGlobal: z.boolean().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR'])
    await requireCsrf(req)
    const { id } = await params
    const parsed = schema.parse(await req.json())
    const data = {
      ...parsed,
      ...(parsed.content !== undefined ? { content: parsed.content as any } : {}),
    }
    const item = await prisma.builderTemplate.update({ where: { id }, data })
    await audit({ userId: user.id, action: 'UPDATE', entity: 'template', entityId: id, request: req })
    return NextResponse.json({ item })
  } catch (e) {
    const m = (e as Error).message
    return NextResponse.json(
      { error: m === 'CSRF' ? 'Invalid security token' : 'Invalid request' },
      { status: m === 'CSRF' ? 403 : 400 },
    )
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(['SUPER_ADMIN', 'ADMIN'])
    await requireCsrf(req)
    const { id } = await params
    await prisma.builderTemplate.delete({ where: { id } })
    await audit({ userId: user.id, action: 'DELETE', entity: 'template', entityId: id, request: req })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const m = (e as Error).message
    return NextResponse.json(
      { error: m === 'CSRF' ? 'Invalid security token' : 'Invalid request' },
      { status: m === 'CSRF' ? 403 : 400 },
    )
  }
}
