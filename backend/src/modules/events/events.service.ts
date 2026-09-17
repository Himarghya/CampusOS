import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class EventsService {
  static async listEvents(userId?: string) {
    return prisma.event.findMany({
      include: {
        registrations: userId ? { where: { userId } } : false,
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  static async getEventById(id: string, userId?: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: userId ? { where: { userId } } : false,
        _count: { select: { registrations: true } },
      },
    });
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');
    return event;
  }

  static async createEvent(data: {
    title: string;
    description: string;
    category?: string;
    venue: string;
    startDate: string;
    endDate: string;
    capacity?: number;
    bannerUrl?: string;
  }) {
    const inst = await prisma.institution.findFirst();
    if (!inst) throw new AppError('No institution found', 400, 'NO_INSTITUTION');

    return prisma.event.create({
      data: {
        institutionId: inst.id,
        title: data.title,
        description: data.description,
        category: data.category || 'WORKSHOP',
        venue: data.venue,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: Number(data.capacity) || 100,
        bannerUrl: data.bannerUrl,
      },
    });
  }

  static async registerForEvent(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');
    if (!event.isRegistrationOpen) throw new AppError('Event registration is closed', 400, 'REGISTRATION_CLOSED');
    if (event._count.registrations >= event.capacity) {
      throw new AppError('Event is already full', 400, 'EVENT_FULL');
    }

    return prisma.$transaction(async (tx) => {
      const reg = await tx.eventRegistration.create({
        data: {
          eventId,
          userId,
          status: 'REGISTERED',
        },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      });

      return reg;
    });
  }

  static async cancelRegistration(eventId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.eventRegistration.delete({
        where: {
          eventId_userId: {
            eventId,
            userId,
          },
        },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { registeredCount: { decrement: 1 } },
      });

      return { message: 'Registration cancelled' };
    });
  }
}
