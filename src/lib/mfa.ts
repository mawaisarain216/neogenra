import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

function key() {
  const raw = process.env.APP_ENCRYPTION_KEY || ''
  if (!/^[0-9a-fA-F]{64}$/.test(raw)) throw new Error('APP_ENCRYPTION_KEY must be 64 hex characters')
  return Buffer.from(raw, 'hex')
}

export function encryptSecret(secret: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const data = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${data.toString('base64url')}`
}

export function decryptSecret(value: string) {
  const [ivS, tagS, dataS] = value.split('.')
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivS, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagS, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(dataS, 'base64url')), decipher.final()]).toString('utf8')
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
export function base32(bytes = 20) {
  let bits = ''
  for (const b of randomBytes(bytes)) bits += b.toString(2).padStart(8, '0')
  let out = ''
  for (let i = 0; i < bits.length; i += 5) out += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)]
  return out
}

function decode(s: string) {
  const bits = s.replace(/=+$/, '').toUpperCase().split('').map(c => alphabet.indexOf(c).toString(2).padStart(5, '0')).join('')
  const out = []
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2))
  return Buffer.from(out)
}

export function totp(secret: string, at = Date.now()) {
  const counter = Math.floor(at / 1000 / 30)
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const mac = createHmac('sha1', decode(secret)).update(buf).digest()
  const offset = mac[mac.length - 1] & 15
  const n = (mac[offset] & 127) << 24 | (mac[offset + 1] & 255) << 16 | (mac[offset + 2] & 255) << 8 | (mac[offset + 3] & 255)
  return String(n % 1000000).padStart(6, '0')
}

export function verifyTotp(secret: string, code: string) {
  const clean = code.replace(/\s/g, '')
  if (!/^\d{6}$/.test(clean)) return false
  for (const drift of [-1, 0, 1]) {
    const expected = totp(secret, Date.now() + drift * 30000)
    if (timingSafeEqual(Buffer.from(expected), Buffer.from(clean))) return true
  }
  return false
}

export function otpauth(secret: string, email: string) {
  return `otpauth://totp/Neogenra:${encodeURIComponent(email)}?secret=${secret}&issuer=Neogenra&algorithm=SHA1&digits=6&period=30`
}

export function mfaProof(sessionToken: string) {
  return createHmac('sha256', key()).update(`neogenra:mfa:${sessionToken}`).digest('base64url')
}

export function verifyMfaProof(sessionToken: string, proof: string) {
  const expected = mfaProof(sessionToken)
  const a = Buffer.from(expected)
  const b = Buffer.from(proof)
  return a.length === b.length && timingSafeEqual(a, b)
}
