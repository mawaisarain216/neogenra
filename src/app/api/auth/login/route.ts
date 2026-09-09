import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashToken, randomToken } from '@/lib/security'
import bcrypt from 'bcryptjs'
import { audit } from '@/lib/audit'
import { enforceRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  if (!(await enforceRateLimit(req, 'login', 20, 15 * 60 * 1000))) return NextResponse.redirect(new URL('/admin/login?error=rate', req.url))

  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    } catch {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const form = await req.formData()
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')
  if (!email || !password || email.length > 254 || password.length > 200) return NextResponse.redirect(new URL('/admin/login?error=invalid', req.url))

  const configuredEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const configuredPassword = process.env.ADMIN_PASSWORD || ''
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user && configuredEmail && configuredPassword && email === configuredEmail && password === configuredPassword) {
    const passwordHash = await bcrypt.hash(configuredPassword, 12)
    user = await prisma.user.create({
      data: {
        email: configuredEmail,
        name: 'Neogenra Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    })
  }

  if (user && configuredEmail && configuredPassword && email === configuredEmail && password === configuredPassword && user.role !== 'SUPER_ADMIN') {
    const passwordHash = await bcrypt.hash(configuredPassword, 12)
    user = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, role: 'SUPER_ADMIN', isActive: true, failedLoginCount: 0, lockedUntil: null },
    })
  }

  const locked = user?.lockedUntil && user.lockedUntil > new Date()
  const valid = !!user && user.isActive && !locked && !!user.passwordHash && await bcrypt.compare(password, user.passwordHash)

  if (!valid) {
    if (user) {
      const count = user.failedLoginCount + 1
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: count, lockedUntil: count >= 8 ? new Date(Date.now() + 15 * 60 * 1000) : null },
      })
    }
    return NextResponse.redirect(new URL('/admin/login?error=invalid', req.url))
  }

  if (!user) return NextResponse.redirect(new URL('/admin/login?error=invalid', req.url))

  const authenticatedUser = user
  const raw = randomToken()
  await prisma.$transaction([
    prisma.session.create({ data: { tokenHash: hashToken(raw), userId: authenticatedUser.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8) } }),
    prisma.user.update({ where: { id: authenticatedUser.id }, data: { failedLoginCount: 0, lockedUntil: null } }),
  ])

  await audit({ userId: authenticatedUser.id, action: 'LOGIN', entity: 'Session', request: req })
  const res = NextResponse.redirect(new URL('/admin', req.url))
  res.cookies.set('__Host-neogenra_session', raw, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
  return res
}
