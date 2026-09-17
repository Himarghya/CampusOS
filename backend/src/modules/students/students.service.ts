import prisma from '../../lib/prisma';
import { hashPassword } from '../../lib/auth';
import { AppError } from '../../middleware/errorHandler';
import { logAudit } from '../../middleware/audit';

export class StudentsService {
  static async listStudents(params: {
    search?: string;
    departmentId?: string;
    semester?: number;
    page?: number;
    limit?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.semester) where.currentSemester = Number(params.semester);
    if (params.search) {
      where.OR = [
        { rollNumber: { contains: params.search } },
        { user: { firstName: { contains: params.search } } },
        { user: { lastName: { contains: params.search } } },
        { user: { email: { contains: params.search } } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              isActive: true,
              avatarUrl: true,
            },
          },
          department: true,
          program: true,
          semester: true,
        },
        orderBy: { rollNumber: 'asc' },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return {
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getStudentById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, isActive: true } },
        department: true,
        program: true,
        semester: true,
        skills: true,
        projects: true,
        resumes: true,
        enrollments: {
          include: { course: true },
        },
      },
    });
    if (!student) throw new AppError('Student not found', 404, 'NOT_FOUND');
    return student;
  }

  static async createStudent(data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    departmentId: string;
    programId: string;
    academicYearId: string;
    currentSemester?: number;
    rollNumber: string;
    batch: string;
    cgpa?: number;
    req?: any;
  }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existingUser) throw new AppError('User with this email already exists', 409, 'EMAIL_EXISTS');

    const existingRoll = await prisma.student.findUnique({ where: { rollNumber: data.rollNumber } });
    if (existingRoll) throw new AppError('Student with this roll number already exists', 409, 'ROLL_EXISTS');

    const hashedPassword = await hashPassword(data.password || 'Student@123');

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'STUDENT',
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          departmentId: data.departmentId,
          programId: data.programId,
          academicYearId: data.academicYearId,
          currentSemester: data.currentSemester || 1,
          rollNumber: data.rollNumber,
          batch: data.batch,
          cgpa: data.cgpa || 0.0,
        },
        include: {
          user: true,
          department: true,
          program: true,
        },
      });

      return student;
    });

    await logAudit({
      req: data.req,
      actorId: data.req?.user?.userId,
      action: 'STUDENT_CREATED',
      entityType: 'Student',
      entityId: result.id,
      details: { rollNumber: result.rollNumber, name: `${result.user.firstName} ${result.user.lastName}` },
    });

    return result;
  }

  static async updateStudent(id: string, data: any) {
    const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
    if (!student) throw new AppError('Student not found', 404, 'NOT_FOUND');

    const updated = await prisma.$transaction(async (tx) => {
      if (data.firstName || data.lastName || data.phone || typeof data.isActive === 'boolean') {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            phone: data.phone !== undefined ? data.phone : undefined,
            isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
          },
        });
      }

      return tx.student.update({
        where: { id },
        data: {
          currentSemester: data.currentSemester !== undefined ? Number(data.currentSemester) : undefined,
          cgpa: data.cgpa !== undefined ? Number(data.cgpa) : undefined,
          activeBacklogs: data.activeBacklogs !== undefined ? Number(data.activeBacklogs) : undefined,
          guardianName: data.guardianName !== undefined ? data.guardianName : undefined,
          guardianPhone: data.guardianPhone !== undefined ? data.guardianPhone : undefined,
        },
        include: { user: true, department: true, program: true },
      });
    });

    return updated;
  }

  static async toggleActive(id: string) {
    const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
    if (!student) throw new AppError('Student not found', 404, 'NOT_FOUND');

    const updatedUser = await prisma.user.update({
      where: { id: student.userId },
      data: { isActive: !student.user.isActive },
    });

    return { id: student.id, isActive: updatedUser.isActive };
  }
}
