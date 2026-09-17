import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class AssignmentsService {
  static async listAssignments(params: { courseId?: string; facultyId?: string; studentId?: string }) {
    const where: any = {};
    if (params.courseId) where.courseId = params.courseId;
    if (params.facultyId) where.facultyId = params.facultyId;

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: true,
        faculty: { include: { user: true } },
        submissions: params.studentId ? { where: { studentId: params.studentId } } : { include: { student: { include: { user: true } } } },
        _count: { select: { submissions: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    return assignments;
  }

  static async getAssignmentById(id: string, studentId?: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        faculty: { include: { user: true } },
        submissions: studentId
          ? { where: { studentId } }
          : { include: { student: { include: { user: true } } } },
      },
    });
    if (!assignment) throw new AppError('Assignment not found', 404, 'NOT_FOUND');
    return assignment;
  }

  static async createAssignment(data: {
    courseId: string;
    facultyId: string;
    title: string;
    description: string;
    maxMarks?: number;
    dueDate: string;
    attachmentUrl?: string;
  }) {
    return prisma.assignment.create({
      data: {
        courseId: data.courseId,
        facultyId: data.facultyId,
        title: data.title,
        description: data.description,
        maxMarks: Number(data.maxMarks) || 100,
        dueDate: new Date(data.dueDate),
        attachmentUrl: data.attachmentUrl,
      },
      include: { course: true },
    });
  }

  static async submitAssignment(data: {
    assignmentId: string;
    studentId: string;
    fileUrl: string;
    fileName: string;
    fileSize?: number;
  }) {
    const assignment = await prisma.assignment.findUnique({ where: { id: data.assignmentId } });
    if (!assignment) throw new AppError('Assignment not found', 404, 'NOT_FOUND');

    const isLate = new Date() > assignment.dueDate;

    return prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: data.assignmentId,
          studentId: data.studentId,
        },
      },
      create: {
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize || 0,
        isLate,
        status: 'SUBMITTED',
      },
      update: {
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize || 0,
        submittedAt: new Date(),
        isLate,
        status: 'RESUBMITTED',
      },
    });
  }

  static async evaluateSubmission(id: string, data: { obtainedMarks: number; feedback?: string }) {
    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission) throw new AppError('Submission not found', 404, 'NOT_FOUND');

    return prisma.submission.update({
      where: { id },
      data: {
        obtainedMarks: Number(data.obtainedMarks),
        feedback: data.feedback,
        gradedAt: new Date(),
        status: 'EVALUATED',
      },
      include: {
        assignment: true,
        student: { include: { user: true } },
      },
    });
  }
}
