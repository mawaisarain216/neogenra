import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { hashToken } from './security'
import { verifyMfaProof } from './mfa'

const SESSION_COOKIE = '__Host-neogenra_session'
const MFA_COOKIE = '__Host-neogenra_mfa'

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } })
  if (!session || session.expiresAt <= new Date() || !session.user.isActive) return null
  return session.user
}

export async function isMfaVerified() {
  const store = await cookies()
  const sessionToken = store.get(SESSION_COOKIE)?.value
  if (!sessionToken) return false
  const user = await getCurrentUser()
  if (!user) return false
  if (!user.mfaEnabled) return true
  const proof = store.get(MFA_COOKIE)?.value
  return !!proof && verifyMfaProof(sessionToken, proof)
}

export async function requireRole(roles: string[]) {
  const user = await getCurrentUser()
  if (!user || !roles.includes(user.role)) throw new Error('UNAUTHORIZED')
  if (user.mfaEnabled && !(await isMfaVerified())) throw new Error('MFA_REQUIRED')
  return user
}
