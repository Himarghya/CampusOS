import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../lib/auth';
import { AppError } from './errorHandler';
import prisma from '../lib/prisma';

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        student: { select: { id: true, departmentId: true } },
        faculty: { select: { id: true, departmentId: true } },
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('User account is disabled or does not exist', 401, 'UNAUTHORIZED');
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
      studentId: user.student?.id,
      facultyId: user.faculty?.id,
      departmentId: user.student?.departmentId || user.faculty?.departmentId,
    };

    next();
  } catch (error) {
    next(error);
  }
}
