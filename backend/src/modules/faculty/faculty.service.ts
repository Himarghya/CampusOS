import prisma from '../../lib/prisma';
import { hashPassword } from '../../lib/auth';
import { AppError } from '../../middleware/errorHandler';

export class FacultyService {
  static async listFaculty(params: { departmentId?: string; search?: string }) {
    const where: any = {};
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.search) {
      where.OR = [
        { employeeCode: { contains: params.search } },
        { user: { firstName: { contains: params.search } } },
        { user: { lastName: { contains: params.search } } },
      ];
    }

    return prisma.faculty.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, isActive: true } },
        department: true,
        courseAssignments: { include: { course: true } },
      },
      orderBy: { employeeCode: 'asc' },
    });
  }

  static async getFacultyById(id: string) {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        courseAssignments: { include: { course: true } },
      },
    });
    if (!faculty) throw new AppError('Faculty not found', 404, 'NOT_FOUND');
    return faculty;
  }

  static async createFaculty(data: {
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
    employeeCode: string;
    designation: string;
    specialization?: string;
    cabinNumber?: string;
    phone?: string;
  }) {
    const hashedPassword = await hashPassword('Faculty@123');

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          role: data.designation.includes('HOD') ? 'DEPT_HEAD' : 'FACULTY',
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      return tx.faculty.create({
        data: {
          userId: user.id,
          departmentId: data.departmentId,
          employeeCode: data.employeeCode,
          designation: data.designation,
          specialization: data.specialization,
          cabinNumber: data.cabinNumber,
        },
        include: { user: true, department: true },
      });
    });
  }
}
