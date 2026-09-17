import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class NoticesService {
  static async listNotices(params: { audience?: string; category?: string; userId?: string }) {
    const where: any = {};
    if (params.category) where.category = params.category;
    if (params.audience) {
      where.targetAudience = { in: ['ALL', params.audience] };
    }

    return prisma.notice.findMany({
      where,
      include: {
        author: { select: { firstName: true, lastName: true, role: true, avatarUrl: true } },
        reads: params.userId ? { where: { userId: params.userId } } : false,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async getNoticeById(id: string) {
    const notice = await prisma.notice.findUnique({
      where: { id },
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
      },
    });
    if (!notice) throw new AppError('Notice not found', 404, 'NOT_FOUND');
    return notice;
  }

  static async createNotice(data: {
    authorId: string;
    title: string;
    content: string;
    category?: string;
    priority?: string;
    targetAudience?: string;
    departmentId?: string;
    courseId?: string;
    attachmentUrl?: string;
  }) {
    const inst = await prisma.institution.findFirst();
    if (!inst) throw new AppError('No institution found', 400, 'NO_INSTITUTION');

    return prisma.notice.create({
      data: {
        institutionId: inst.id,
        authorId: data.authorId,
        title: data.title,
        content: data.content,
        category: data.category || 'GENERAL',
        priority: data.priority || 'NORMAL',
        targetAudience: data.targetAudience || 'ALL',
        departmentId: data.departmentId,
        courseId: data.courseId,
        attachmentUrl: data.attachmentUrl,
      },
      include: { author: true },
    });
  }

  static async markAsRead(noticeId: string, userId: string) {
    return prisma.noticeRead.upsert({
      where: {
        noticeId_userId: {
          noticeId,
          userId,
        },
      },
      create: {
        noticeId,
        userId,
      },
      update: {
        readAt: new Date(),
      },
    });
  }
}
