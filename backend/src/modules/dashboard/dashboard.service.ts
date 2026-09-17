import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class DashboardService {
  static async getStudentDashboard(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        department: true,
        program: true,
        semester: true,
        academicYear: true,
      },
    });

    if (!student) {
      throw new AppError('Student profile not found', 404, 'NOT_FOUND');
    }

    // 1. Enrolled Courses + Subject-wise attendance calculation
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id, status: 'ENROLLED' },
      include: {
        course: {
          include: {
            assignments: {
              include: { faculty: { include: { user: true } } },
            },
          },
        },
      },
    });

    const coursesWithAttendance = await Promise.all(
      enrollments.map(async (enr) => {
        const totalSessions = await prisma.attendanceSession.count({
          where: { courseId: enr.courseId },
        });

        const presentRecords = await prisma.attendanceRecord.count({
          where: {
            studentId: student.id,
            status: 'PRESENT',
            session: { courseId: enr.courseId },
          },
        });

        const attendancePct = totalSessions > 0 ? Math.round((presentRecords / totalSessions) * 100) : 100;

        return {
          id: enr.course.id,
          code: enr.course.code,
          name: enr.course.name,
          credits: enr.course.credits,
          type: enr.course.type,
          facultyName: enr.course.assignments[0]?.faculty?.user
            ? `${enr.course.assignments[0].faculty.user.firstName} ${enr.course.assignments[0].faculty.user.lastName}`
            : 'Faculty Assigned',
          attendancePercentage: attendancePct,
          totalSessions,
          attendedSessions: presentRecords,
        };
      })
    );

    // 2. Pending Assignments
    const enrolledCourseIds = enrollments.map((e) => e.courseId);
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: { in: enrolledCourseIds },
        isPublished: true,
      },
      include: {
        course: { select: { name: true, code: true } },
        submissions: {
          where: { studentId: student.id },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const pendingAssignments = assignments.filter((a) => a.submissions.length === 0);

    // 3. Upcoming Exams
    const upcomingExams = await prisma.exam.findMany({
      where: {
        status: { in: ['SUBMITTED', 'APPROVED', 'PUBLISHED'] },
        startDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: {
        semester: true,
      },
      orderBy: { startDate: 'asc' },
      take: 5,
    });

    // 4. Overall Attendance Stats
    const allStudentRecords = await prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
    });

    const totalRecords = allStudentRecords.length;
    const presentCount = allStudentRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = allStudentRecords.filter((r) => r.status === 'ABSENT').length;
    const excusedCount = allStudentRecords.filter((r) => r.status === 'EXCUSED').length;

    const overallAttendance = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 85;

    // 5. Recent Announcements / Notices
    const notices = await prisma.notice.findMany({
      where: {
        targetAudience: { in: ['ALL', 'STUDENT'] },
      },
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    });

    // 6. Placement Opportunities
    const activePlacementDrives = await prisma.placementDrive.findMany({
      where: { status: 'ACTIVE' },
      include: {
        company: true,
        eligibilityRules: true,
      },
      orderBy: { deadline: 'asc' },
      take: 4,
    });

    return {
      student: {
        id: student.id,
        rollNumber: student.rollNumber,
        batch: student.batch,
        currentSemester: student.currentSemester,
        cgpa: student.cgpa,
        department: student.department.name,
        program: student.program.name,
      },
      kpis: {
        myCoursesCount: enrollments.length,
        pendingAssignmentsCount: pendingAssignments.length,
        upcomingExamsCount: upcomingExams.length,
        cgpa: student.cgpa,
        overallAttendance,
      },
      attendanceOverview: {
        overallPercentage: overallAttendance,
        presentPercentage: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 85,
        absentPercentage: totalRecords > 0 ? Math.round((absentCount / totalRecords) * 100) : 10,
        leavePercentage: totalRecords > 0 ? Math.round((excusedCount / totalRecords) * 100) : 5,
        totalSessions: totalRecords,
        presentSessions: presentCount,
      },
      myCourses: coursesWithAttendance,
      pendingAssignments: pendingAssignments.map((a) => ({
        id: a.id,
        title: a.title,
        courseName: a.course.name,
        courseCode: a.course.code,
        dueDate: a.dueDate,
        maxMarks: a.maxMarks,
      })),
      upcomingExams: upcomingExams.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        date: e.startDate,
        courseCode: student.department.code + ' ' + (200 + (student.currentSemester || 1)),
      })),
      announcements: notices.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        category: n.category,
        priority: n.priority,
        publishedAt: n.publishedAt,
        author: `${n.author.firstName} ${n.author.lastName}`,
      })),
      placementOpportunities: activePlacementDrives.map((d) => ({
        id: d.id,
        companyName: d.company.name,
        role: d.jobRole,
        packageLpa: d.packageLpa,
        location: d.location,
        deadline: d.deadline,
      })),
    };
  }

  static async getFacultyDashboard(userId: string) {
    const faculty = await prisma.faculty.findUnique({
      where: { userId },
      include: { department: true },
    });

    if (!faculty) throw new AppError('Faculty profile not found', 404, 'NOT_FOUND');

    const courseAssignments = await prisma.courseAssignment.findMany({
      where: { facultyId: faculty.id },
      include: {
        course: {
          include: {
            enrollments: true,
          },
        },
      },
    });

    const assignedCourses = courseAssignments.map((ca) => ({
      id: ca.course.id,
      code: ca.course.code,
      name: ca.course.name,
      credits: ca.course.credits,
      section: ca.section,
      studentCount: ca.course.enrollments.length,
    }));

    const totalStudentsTaught = assignedCourses.reduce((acc, c) => acc + c.studentCount, 0);

    const pendingEvaluations = await prisma.submission.findMany({
      where: {
        status: 'SUBMITTED',
        assignment: { facultyId: faculty.id },
      },
      include: {
        assignment: { select: { title: true, maxMarks: true } },
        student: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
      take: 10,
    });

    const recentSessions = await prisma.attendanceSession.findMany({
      where: { facultyId: faculty.id },
      include: {
        course: { select: { name: true, code: true } },
        records: true,
      },
      orderBy: { date: 'desc' },
      take: 5,
    });

    const notices = await prisma.notice.findMany({
      where: { targetAudience: { in: ['ALL', 'FACULTY'] } },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    });

    return {
      faculty: {
        id: faculty.id,
        employeeCode: faculty.employeeCode,
        designation: faculty.designation,
        department: faculty.department.name,
      },
      kpis: {
        assignedCoursesCount: assignedCourses.length,
        totalStudentsTaught,
        pendingEvaluationsCount: pendingEvaluations.length,
        totalSessionsConducted: await prisma.attendanceSession.count({
          where: { facultyId: faculty.id },
        }),
      },
      assignedCourses,
      pendingEvaluations: pendingEvaluations.map((p) => ({
        id: p.id,
        assignmentTitle: p.assignment.title,
        studentName: `${p.student.user.firstName} ${p.student.user.lastName}`,
        submittedAt: p.submittedAt,
        maxMarks: p.assignment.maxMarks,
      })),
      recentSessions: recentSessions.map((s) => ({
        id: s.id,
        courseName: s.course.name,
        courseCode: s.course.code,
        section: s.section,
        date: s.date,
        presentCount: s.records.filter((r) => r.status === 'PRESENT').length,
        totalCount: s.records.length,
      })),
      announcements: notices,
    };
  }

  static async getAdminDashboard() {
    const totalStudents = await prisma.student.count();
    const totalFaculty = await prisma.faculty.count();
    const totalDepartments = await prisma.department.count();
    const totalCourses = await prisma.course.count();
    const activeDrives = await prisma.placementDrive.count({ where: { status: 'ACTIVE' } });
    const pendingRequests = await prisma.request.count({ where: { status: 'PENDING' } });

    const recentAudit = await prisma.auditLog.findMany({
      include: { actor: { select: { firstName: true, lastName: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const departmentStats = await prisma.department.findMany({
      include: {
        _count: {
          select: { students: true, faculty: true, courses: true },
        },
      },
    });

    return {
      kpis: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalCourses,
        activeDrives,
        pendingRequests,
      },
      departmentDistribution: departmentStats.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        studentsCount: d._count.students,
        facultyCount: d._count.faculty,
        coursesCount: d._count.courses,
      })),
      recentActivity: recentAudit.map((a) => ({
        id: a.id,
        action: a.action,
        entityType: a.entityType,
        actor: a.actor ? `${a.actor.firstName} ${a.actor.lastName} (${a.actor.role})` : 'System',
        createdAt: a.createdAt,
      })),
    };
  }

  static async getPlacementDashboard() {
    const totalCompanies = await prisma.company.count();
    const activeDrives = await prisma.placementDrive.count({ where: { status: 'ACTIVE' } });
    const totalApplications = await prisma.placementApplication.count();
    const selectedCount = await prisma.placementApplication.count({
      where: { status: 'SELECTED' },
    });
    const shortlistedCount = await prisma.placementApplication.count({
      where: { status: 'SHORTLISTED' },
    });

    const upcomingDrives = await prisma.placementDrive.findMany({
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
      orderBy: { deadline: 'asc' },
      take: 6,
    });

    return {
      kpis: {
        totalCompanies,
        activeDrives,
        totalApplications,
        selectedCount,
        shortlistedCount,
      },
      drives: upcomingDrives.map((d) => ({
        id: d.id,
        companyName: d.company.name,
        jobRole: d.jobRole,
        packageLpa: d.packageLpa,
        deadline: d.deadline,
        status: d.status,
        applicationsCount: d._count.applications,
      })),
    };
  }
}
