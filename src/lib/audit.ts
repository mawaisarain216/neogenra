import { prisma } from './prisma'
import { hashIp } from './security'
import type { AuditAction } from '@/generated/prisma/client'

export async function audit(input: { userId?: string; action: AuditAction; entity?: string; entityId?: string; request?: Request; metadata?: unknown }) {
  return prisma.auditLog.create({ data: {
    userId: input.userId,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    ipHash: hashIp(input.request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? input.request?.headers.get('x-real-ip')),
    metadata: input.metadata as any,
  }})
}
