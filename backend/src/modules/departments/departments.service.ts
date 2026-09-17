import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class DepartmentsService {
  static async listDepartments() {
    return prisma.department.findMany({
      include: {
        programs: true,
        _count: {
          select: {
            faculty: true,
            students: true,
            courses: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getDepartmentById(id: string) {
    const dept = await prisma.department.findUnique({
      where: { id },
      include: {
        programs: true,
        faculty: { include: { user: true } },
        courses: true,
      },
    });
    if (!dept) throw new AppError('Department not found', 404, 'NOT_FOUND');
    return dept;
  }

  static async createDepartment(data: {
    institutionId?: string;
    name: string;
    code: string;
  }) {
    let institutionId = data.institutionId;
    if (!institutionId) {
      const inst = await prisma.institution.findFirst();
      if (!inst) throw new AppError('Institution not found', 400, 'NO_INSTITUTION');
      institutionId = inst.id;
    }

    return prisma.department.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase().trim(),
        institutionId,
      },
    });
  }
}
