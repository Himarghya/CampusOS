import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { logAudit } from '../../middleware/audit';

export class AttendanceService {
  static async createSession(data: {
    courseId: string;
    facultyId: string;
    section?: string;
    date: string;
    topic?: string;
    sessionType?: string;
    req?: any;
  }) {
    const session = await prisma.attendanceSession.create({
      data: {
        courseId: data.courseId,
        facultyId: data.facultyId,
        section: data.section || 'A',
        date: new Date(data.date),
        topic: data.topic,
        sessionType: data.sessionType || 'REGULAR',
      },
      include: {
        course: true,
      },
    });

    await logAudit({
      req: data.req,
      actorId: data.req?.user?.userId,
      action: 'ATTENDANCE_SESSION_CREATED',
      entityType: 'AttendanceSession',
      entityId: session.id,
      details: { course: session.course.code, date: data.date },
    });

    return session;
  }

  static async getSessions(params: { courseId?: string; facultyId?: string }) {
    const where: any = {};
    if (params.courseId) where.courseId = params.courseId;
    if (params.facultyId) where.facultyId = params.facultyId;

    return prisma.attendanceSession.findMany({
      where,
      include: {
        course: true,
        faculty: { include: { user: true } },
        records: { include: { student: { include: { user: true } } } },
      },
      orderBy: { date: 'desc' },
    });
  }

  static async getSessionById(id: string) {
    const session = await prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            enrollments: { include: { student: { include: { user: true } } } },
          },
        },
        faculty: { include: { user: true } },
        records: { include: { student: { include: { user: true } } } },
      },
    });
    if (!session) throw new AppError('Attendance session not found', 404, 'NOT_FOUND');
    return session;
  }

  static async markBulkAttendance(data: {
    sessionId: string;
    records: Array<{ studentId: string; status: 'PRESENT' | 'ABSENT' | 'EXCUSED'; remarks?: string }>;
    req?: any;
  }) {
    const session = await prisma.attendanceSession.findUnique({ where: { id: data.sessionId } });
    if (!session) throw new AppError('Session not found', 404, 'NOT_FOUND');

    const ops = data.records.map((r) =>
      prisma.attendanceRecord.upsert({
        where: {
          sessionId_studentId: {
            sessionId: data.sessionId,
            studentId: r.studentId,
          },
        },
        create: {
          sessionId: data.sessionId,
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks,
        },
        update: {
          status: r.status,
          remarks: r.remarks,
        },
      })
    );

    const results = await prisma.$transaction(ops);

    await logAudit({
      req: data.req,
      actorId: data.req?.user?.userId,
      action: 'ATTENDANCE_MARKED',
      entityType: 'AttendanceSession',
      entityId: data.sessionId,
      details: { count: results.length },
    });

    return results;
  }

  static async getStudentAttendance(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
    });

    const records = await prisma.attendanceRecord.findMany({
      where: { studentId },
      include: {
        session: {
          include: { course: true, faculty: { include: { user: true } } },
        },
      },
      orderBy: { markedAt: 'desc' },
    });

    const subjectStats = await Promise.all(
      enrollments.map(async (enr) => {
        const totalCourseSessions = await prisma.attendanceSession.count({
          where: { courseId: enr.courseId },
        });

        const presentCount = records.filter(
          (r) => r.session.courseId === enr.courseId && r.status === 'PRESENT'
        ).length;
        const absentCount = records.filter(
          (r) => r.session.courseId === enr.courseId && r.status === 'ABSENT'
        ).length;
        const excusedCount = records.filter(
          (r) => r.session.courseId === enr.courseId && r.status === 'EXCUSED'
        ).length;

        const percentage = totalCourseSessions > 0 ? Math.round((presentCount / totalCourseSessions) * 100) : 100;

        return {
          courseId: enr.course.id,
          courseCode: enr.course.code,
          courseName: enr.course.name,
          credits: enr.course.credits,
          totalSessions: totalCourseSessions,
          presentCount,
          absentCount,
          excusedCount,
          percentage,
          status: percentage >= 75 ? 'GOOD' : percentage >= 65 ? 'WARNING' : 'CRITICAL',
        };
      })
    );

    const totalSessionsAll = subjectStats.reduce((a, b) => a + b.totalSessions, 0);
    const presentSessionsAll = subjectStats.reduce((a, b) => a + b.presentCount, 0);
    const overallPercentage = totalSessionsAll > 0 ? Math.round((presentSessionsAll / totalSessionsAll) * 100) : 100;

    return {
      overallPercentage,
      totalSessions: totalSessionsAll,
      presentSessions: presentSessionsAll,
      subjectWise: subjectStats,
      recentRecords: records.slice(0, 20),
    };
  }
}
