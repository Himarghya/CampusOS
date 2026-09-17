import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { logAudit } from '../../middleware/audit';

export class RequestsService {
  static async listRequests(params: { userId?: string; status?: string }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.status) where.status = params.status;

    return prisma.request.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createRequest(data: {
    userId: string;
    type: string;
    title: string;
    description: string;
    reason?: string;
    documentUrl?: string;
  }) {
    return prisma.request.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        description: data.description,
        reason: data.reason,
        documentUrl: data.documentUrl,
        status: 'PENDING',
      },
      include: { user: true },
    });
  }

  static async updateStatus(id: string, data: {
    status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
    adminRemarks?: string;
    reviewerId?: string;
    req?: any;
  }) {
    const reqRecord = await prisma.request.findUnique({ where: { id } });
    if (!reqRecord) throw new AppError('Request not found', 404, 'NOT_FOUND');

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.request.update({
        where: { id },
        data: {
          status: data.status,
          adminRemarks: data.adminRemarks,
          reviewedById: data.reviewerId,
          reviewedAt: new Date(),
        },
        include: { user: true },
      });

      // Create in-app notification for the requester
      await tx.notification.create({
        data: {
          userId: res.userId,
          title: `Request ${data.status.replace('_', ' ')}`,
          message: `Your request "${res.title}" was ${data.status.toLowerCase().replace('_', ' ')} by administration.`,
          type: data.status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        },
      });

      return res;
    });

    await logAudit({
      req: data.req,
      actorId: data.reviewerId,
      action: 'REQUEST_STATUS_UPDATED',
      entityType: 'Request',
      entityId: id,
      details: { newStatus: data.status, title: updated.title },
    });

    return updated;
  }
}
