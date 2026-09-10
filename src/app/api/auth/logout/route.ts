import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/security'
import { audit } from '@/lib/audit'
import { requireCsrf } from '@/lib/csrf'

export async function POST(req: Request) {
  try {
    await requireCsrf(req)
    const store = await cookies()
    const raw = store.get('__Host-neogenra_session')?.value
    if (raw) {
      const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(raw) } })
      if (session) {
        await audit({ userId: session.userId, action: 'LOGOUT', entity: 'Session', entityId: session.id, request: req })
        await prisma.session.delete({ where: { id: session.id } })
      }
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set('__Host-neogenra_session', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
    res.cookies.set('__Host-neogenra_mfa', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
    return res
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
  }
}
