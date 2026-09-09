import crypto from 'node:crypto'

export function hashToken(value: string) { return crypto.createHash('sha256').update(value).digest('hex') }
export function randomToken(bytes = 32) { return crypto.randomBytes(bytes).toString('base64url') }
export function hashIp(ip: string | null | undefined) {
  const salt = process.env.IP_HASH_SALT
  if (!salt) return undefined
  return crypto.createHash('sha256').update(`${salt}:${ip ?? 'unknown'}`).digest('hex')
}
export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b)
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb)
}
