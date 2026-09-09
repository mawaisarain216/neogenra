import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { hashToken } from './security'

export async function getCurrentUser() {
  const token = (await cookies()).get('__Host-neogenra_session')?.value
  if (!token) return null
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } })
  if (!session || session.expiresAt <= new Date() || !session.user.isActive) return null
  return session.user
}

export async function requireRole(roles: string[]) {
  const user = await getCurrentUser()
  if (!user || !roles.includes(user.role)) throw new Error('UNAUTHORIZED')
  return user
}
