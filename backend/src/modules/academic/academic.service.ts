import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class AcademicService {
  // Academic Years
  static async getAcademicYears() {
    return prisma.academicYear.findMany({ orderBy: { startDate: 'desc' } });
  }

  static async createAcademicYear(data: { year: string; startDate: string; endDate: string; isCurrent?: boolean }) {
    const inst = await prisma.institution.findFirst();
    if (!inst) throw new AppError('No institution found', 400, 'NO_INSTITUTION');

    if (data.isCurrent) {
      await prisma.academicYear.updateMany({
        where: { institutionId: inst.id },
        data: { isCurrent: false },
      });
    }

    return prisma.academicYear.create({
      data: {
        institutionId: inst.id,
        year: data.year,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: data.isCurrent || false,
      },
    });
  }

  // Programs & Semesters
  static async getPrograms() {
    return prisma.program.findMany({
      include: { department: true, semesters: true },
      orderBy: { name: 'asc' },
    });
  }

  static async getSemesters(programId?: string) {
    const where = programId ? { programId } : {};
    return prisma.semester.findMany({
      where,
      include: { program: true, academicYear: true },
      orderBy: { number: 'asc' },
    });
  }

  // Courses
  static async getCourses(params: { departmentId?: string; programId?: string; search?: string }) {
    const where: any = {};
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.programId) where.programId = params.programId;
    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { name: { contains: params.search } },
      ];
    }

    return prisma.course.findMany({
      where,
      include: {
        department: true,
        program: true,
        semester: true,
        assignments: {
          include: { faculty: { include: { user: true } } },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  static async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        program: true,
        semester: true,
        assignments: {
          include: { faculty: { include: { user: true } } },
        },
        enrollments: {
          include: { student: { include: { user: true } } },
        },
        homeworkAssignments: true,
      },
    });
    if (!course) throw new AppError('Course not found', 404, 'NOT_FOUND');
    return course;
  }

  static async createCourse(data: {
    departmentId: string;
    programId: string;
    semesterId?: string;
    name: string;
    code: string;
    credits: number;
    type?: string;
    description?: string;
    facultyId?: string;
  }) {
    const existing = await prisma.course.findUnique({ where: { code: data.code.toUpperCase().trim() } });
    if (existing) throw new AppError('Course with this code already exists', 409, 'COURSE_CODE_EXISTS');

    return prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          departmentId: data.departmentId,
          programId: data.programId,
          semesterId: data.semesterId,
          name: data.name,
          code: data.code.toUpperCase().trim(),
          credits: Number(data.credits) || 3,
          type: data.type || 'THEORY',
          description: data.description,
        },
      });

      if (data.facultyId) {
        await tx.courseAssignment.create({
          data: {
            courseId: course.id,
            facultyId: data.facultyId,
            section: 'A',
            isPrimary: true,
          },
        });
      }

      return course;
    });
  }

  // Enrollments
  static async enrollStudent(data: {
    studentId: string;
    courseId: string;
    academicYearId: string;
    semesterId: string;
    section?: string;
  }) {
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId_semesterId: {
          studentId: data.studentId,
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
      },
    });
    if (existing) throw new AppError('Student is already enrolled in this course for this semester', 409, 'ALREADY_ENROLLED');

    return prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        academicYearId: data.academicYearId,
        semesterId: data.semesterId,
        section: data.section || 'A',
      },
      include: { course: true, student: { include: { user: true } } },
    });
  }

  static async getStudentEnrollments(studentId: string) {
    return prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            assignments: {
              include: { faculty: { include: { user: true } } },
            },
          },
        },
        semester: true,
        academicYear: true,
      },
    });
  }
}
