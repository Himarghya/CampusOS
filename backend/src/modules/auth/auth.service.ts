import prisma from '../../lib/prisma';
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../lib/auth';
import { AppError } from '../../middleware/errorHandler';
import { logAudit } from '../../middleware/audit';

export class AuthService {
  static async login(data: { email: string; password: string; req?: any }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
      include: {
        institution: true,
        student: {
          include: {
            department: true,
            program: true,
          }
        },
        faculty: {
          include: {
            department: true,
          }
        }
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact administration.', 403, 'ACCOUNT_DEACTIVATED');
    }

    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    await logAudit({
      req: data.req,
      actorId: user.id,
      institutionId: user.institutionId,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role },
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async register(data: {
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string;
    institutionCode?: string;
    req?: any;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new AppError('User with this email already exists', 409, 'EMAIL_EXISTS');
    }

    let institutionId: string | null = null;
    if (data.institutionCode) {
      const institution = await prisma.institution.findUnique({
        where: { code: data.institutionCode },
      });
      if (institution) {
        institutionId = institution.id;
      }
    } else {
      const defaultInst = await prisma.institution.findFirst();
      if (defaultInst) institutionId = defaultInst.id;
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        institutionId,
      },
      include: {
        institution: true,
      },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    await logAudit({
      req: data.req,
      actorId: user.id,
      institutionId: user.institutionId,
      action: 'USER_REGISTER',
      entityType: 'User',
      entityId: user.id,
    });

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async refreshToken(refreshToken: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            institution: true,
            student: true,
            faculty: true,
          }
        },
      },
    });

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Revoke old token and issue new pair (Rotation)
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    const payload = {
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
      institutionId: tokenRecord.user.institutionId,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: tokenRecord.user.id,
        token: newRefreshToken,
        expiresAt,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
    return { message: 'Logged out successfully' };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        institution: true,
        student: {
          include: {
            department: true,
            program: true,
            semester: true,
            academicYear: true,
          },
        },
        faculty: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const isValid = await verifyPassword(currentPass, user.password);
    if (!isValid) {
      throw new AppError('Incorrect current password', 400, 'INCORRECT_PASSWORD');
    }

    const hashedPassword = await hashPassword(newPass);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
