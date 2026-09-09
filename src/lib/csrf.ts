import { cookies, headers } from 'next/headers'
import { randomToken, safeEqual } from './security'

const COOKIE = '__Host-neogenra_csrf'

export async function ensureCsrfToken() {
  const store = await cookies()
  const existing = store.get(COOKIE)?.value
  if (existing) return existing
  const token = randomToken(32)
  store.set(COOKIE, token, { httpOnly: false, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
  return token
}

export async function requireCsrf(req: Request) {
  const header = req.headers.get('x-csrf-token')
  const cookie = (await cookies()).get(COOKIE)?.value
  if (!header || !cookie || !safeEqual(header, cookie)) throw new Error('CSRF')
  const origin = req.headers.get('origin')
  const host = (await headers()).get('host')
  if (origin && host) {
    try { if (new URL(origin).host !== host) throw new Error('ORIGIN') } catch { throw new Error('ORIGIN') }
  }
}
