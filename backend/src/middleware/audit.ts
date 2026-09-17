import { Request } from 'express';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';

export async function logAudit(options: {
  req?: Request;
  actorId?: string;
  institutionId?: string | null;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
}) {
  try {
    const ip = options.req?.ip || options.req?.socket?.remoteAddress;
    const userAgent = options.req?.headers['user-agent'];

    await prisma.auditLog.create({
      data: {
        actorId: options.actorId,
        institutionId: options.institutionId || undefined,
        action: options.action,
        entityType: options.entityType,
        entityId: options.entityId,
        details: options.details ? JSON.stringify(options.details) : undefined,
        ipAddress: ip,
        userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      },
    });
  } catch (error) {
    logger.error({ msg: 'Failed to record audit log', error });
  }
}
