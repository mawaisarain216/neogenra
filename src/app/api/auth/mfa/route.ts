import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { requireCsrf } from '@/lib/csrf'
import { decryptSecret, mfaProof, verifyTotp } from '@/lib/mfa'
import { audit } from '@/lib/audit'

const SESSION_COOKIE = '__Host-neogenra_session'
const MFA_COOKIE = '__Host-neogenra_mfa'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.mfaEnabled || !user.mfaSecretEnc) return NextResponse.json({ error: 'MFA verification is not available' }, { status: 401 })
    await requireCsrf(req)

    const body = await req.json().catch(() => ({}))
    const code = String(body.code || '').trim()
    if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: 'Enter the 6-digit authenticator code' }, { status: 400 })
    if (!verifyTotp(decryptSecret(user.mfaSecretEnc), code)) return NextResponse.json({ error: 'Invalid authenticator code' }, { status: 401 })

    const raw = (await cookies()).get(SESSION_COOKIE)?.value
    if (!raw) return NextResponse.json({ error: 'Session expired' }, { status: 401 })

    const response = NextResponse.json({ ok: true, redirect: '/admin' })
    response.cookies.set(MFA_COOKIE, mfaProof(raw), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
    await audit({ userId: user.id, action: 'LOGIN', entity: 'MFA', request: req })
    return response
  } catch (error) {
    const message = (error as Error).message
    return NextResponse.json({ error: message === 'CSRF' ? 'Invalid security token' : 'MFA verification failed' }, { status: message === 'CSRF' ? 403 : 400 })
  }
}
