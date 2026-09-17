import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { logAudit } from '../../middleware/audit';

export class ExaminationsService {
  static async listExams() {
    return prisma.exam.findMany({
      include: {
        academicYear: true,
        semester: { include: { program: true } },
        _count: { select: { marks: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  static async getExamById(id: string) {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        academicYear: true,
        semester: true,
        marks: {
          include: {
            course: true,
            student: { include: { user: true, department: true } },
          },
        },
      },
    });
    if (!exam) throw new AppError('Exam not found', 404, 'NOT_FOUND');
    return exam;
  }

  static async createExam(data: {
    academicYearId: string;
    semesterId: string;
    name: string;
    type: string;
    startDate: string;
    endDate: string;
  }) {
    return prisma.exam.create({
      data: {
        academicYearId: data.academicYearId,
        semesterId: data.semesterId,
        name: data.name,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'DRAFT',
      },
    });
  }

  static async updateExam(
    id: string,
    data: {
      name?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      academicYearId?: string;
      semesterId?: string;
      status?: string;
    },
    req?: any
  ) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.academicYearId !== undefined) updateData.academicYearId = data.academicYearId;
    if (data.semesterId !== undefined) updateData.semesterId = data.semesterId;
    if (data.status !== undefined) updateData.status = data.status;

    const exam = await prisma.exam.update({
      where: { id },
      data: updateData,
    });

    await logAudit({
      req,
      actorId: req?.user?.userId,
      action: 'EXAM_UPDATED',
      entityType: 'Exam',
      entityId: id,
      details: { updatedFields: Object.keys(updateData) },
    });

    return exam;
  }

  static async deleteExam(id: string, req?: any) {
    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new AppError('Exam not found', 404, 'NOT_FOUND');

    await prisma.exam.delete({ where: { id } });

    await logAudit({
      req,
      actorId: req?.user?.userId,
      action: 'EXAM_DELETED',
      entityType: 'Exam',
      entityId: id,
      details: { examName: exam.name },
    });

    return { message: 'Exam deleted successfully', id };
  }

  static async submitMarks(data: {
    examId: string;
    courseId: string;
    facultyId?: string;
    marks: Array<{
      studentId: string;
      internalMarks?: number;
      externalMarks?: number;
      practicalMarks?: number;
      remarks?: string;
    }>;
    req?: any;
  }) {
    const ops = data.marks.map((m) => {
      const internal = Number(m.internalMarks) || 0;
      const external = Number(m.externalMarks) || 0;
      const practical = Number(m.practicalMarks) || 0;
      const total = internal + external + practical;

      let grade = 'F';
      if (total >= 90) grade = 'A+';
      else if (total >= 80) grade = 'A';
      else if (total >= 70) grade = 'B+';
      else if (total >= 60) grade = 'B';
      else if (total >= 50) grade = 'C';
      else if (total >= 40) grade = 'P';

      return prisma.mark.upsert({
        where: {
          examId_courseId_studentId: {
            examId: data.examId,
            courseId: data.courseId,
            studentId: m.studentId,
          },
        },
        create: {
          examId: data.examId,
          courseId: data.courseId,
          studentId: m.studentId,
          facultyId: data.facultyId,
          internalMarks: internal,
          externalMarks: external,
          practicalMarks: practical,
          totalMarks: total,
          grade,
          remarks: m.remarks,
        },
        update: {
          internalMarks: internal,
          externalMarks: external,
          practicalMarks: practical,
          totalMarks: total,
          grade,
          remarks: m.remarks,
        },
      });
    });

    const results = await prisma.$transaction(ops);

    await logAudit({
      req: data.req,
      actorId: data.req?.user?.userId,
      action: 'MARKS_SUBMITTED',
      entityType: 'Exam',
      entityId: data.examId,
      details: { courseId: data.courseId, count: results.length },
    });

    return results;
  }

  static async publishExam(id: string, req?: any) {
    const exam = await prisma.exam.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    await logAudit({
      req,
      actorId: req?.user?.userId,
      action: 'EXAM_RESULTS_PUBLISHED',
      entityType: 'Exam',
      entityId: id,
      details: { examName: exam.name },
    });

    return exam;
  }

  static async getStudentResults(studentId: string) {
    return prisma.mark.findMany({
      where: {
        studentId,
        exam: { status: 'PUBLISHED' },
      },
      include: {
        exam: true,
        course: true,
      },
      orderBy: { exam: { startDate: 'desc' } },
    });
  }
}
