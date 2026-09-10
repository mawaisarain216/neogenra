import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { audit } from '@/lib/audit'
import { z } from 'zod'

const status = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST', 'SPAM'])

export async function GET(req: Request) {
  try {
    await requireRole(['SUPER_ADMIN', 'ADMIN'])
    const url = new URL(req.url)
    const take = Math.min(Math.max(Number(url.searchParams.get('take') || 100), 1), 200)
    const items = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take })
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message === 'MFA_REQUIRED' ? 'MFA required' : 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireRole(['SUPER_ADMIN', 'ADMIN'])
    await requireCsrf(req)
    const body = await req.json()
    const id = z.string().min(1).parse(body.id)
    const nextStatus = status.parse(body.status)
    const item = await prisma.lead.update({ where: { id }, data: { status: nextStatus } })
    await audit({ userId: user.id, action: 'UPDATE', entity: 'lead', entityId: id, metadata: { status: nextStatus }, request: req })
    return NextResponse.json({ item })
  } catch (error) {
    const message = (error as Error).message
    const code = message === 'CSRF' ? 403 : message === 'MFA_REQUIRED' || message === 'UNAUTHORIZED' ? 401 : 400
    return NextResponse.json({ error: code === 403 ? 'Invalid security token' : code === 401 ? 'Unauthorized' : 'Invalid request' }, { status: code })
  }
}
