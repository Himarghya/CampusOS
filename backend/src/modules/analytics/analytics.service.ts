import prisma from '../../lib/prisma';

export class AnalyticsService {
  static async getAdminAnalytics() {
    const studentsByDept = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        _count: { select: { students: true, faculty: true, courses: true } },
      },
    });

    const marksDistribution = await prisma.mark.groupBy({
      by: ['grade'],
      _count: { grade: true },
    });

    const applicationsByStatus = await prisma.placementApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const recentDrives = await prisma.placementDrive.findMany({
      include: { company: true, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Attendance stats
    const totalRecords = await prisma.attendanceRecord.count();
    const presentRecords = await prisma.attendanceRecord.count({ where: { status: 'PRESENT' } });
    const collegeAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 86;

    return {
      overview: {
        totalStudents: await prisma.student.count(),
        totalFaculty: await prisma.faculty.count(),
        totalCourses: await prisma.course.count(),
        totalDepartments: studentsByDept.length,
        averageAttendance: collegeAttendance,
      },
      departmentDistribution: studentsByDept.map((d) => ({
        name: d.name,
        code: d.code,
        students: d._count.students,
        faculty: d._count.faculty,
        courses: d._count.courses,
      })),
      marksDistribution: marksDistribution.filter((m) => m.grade).map((m) => ({
        grade: m.grade || 'N/A',
        count: m._count.grade,
      })),
      placementStats: {
        byStatus: applicationsByStatus.map((a) => ({ status: a.status, count: a._count.status })),
        recentDrives: recentDrives.map((d) => ({
          company: d.company.name,
          role: d.jobRole,
          packageLpa: d.packageLpa,
          applications: d._count.applications,
        })),
      },
    };
  }

  static async getPlacementAnalytics() {
    const totalDrives = await prisma.placementDrive.count();
    const totalApplications = await prisma.placementApplication.count();
    const selectedCount = await prisma.placementApplication.count({ where: { status: 'SELECTED' } });
    const shortlistedCount = await prisma.placementApplication.count({ where: { status: 'SHORTLISTED' } });

    const avgPackageResult = await prisma.placementDrive.aggregate({
      _avg: { packageLpa: true },
      _max: { packageLpa: true },
      _min: { packageLpa: true },
    });

    const companyDrives = await prisma.placementDrive.findMany({
      include: {
        company: true,
        applications: {
          include: { student: { include: { department: true } } },
        },
      },
    });

    return {
      kpis: {
        totalDrives,
        totalApplications,
        selectedCount,
        shortlistedCount,
        averagePackage: avgPackageResult._avg.packageLpa ? parseFloat(avgPackageResult._avg.packageLpa.toFixed(1)) : 0,
        highestPackage: avgPackageResult._max.packageLpa || 0,
      },
      drivesDetail: companyDrives.map((d) => ({
        id: d.id,
        company: d.company.name,
        role: d.jobRole,
        packageLpa: d.packageLpa,
        applicationsCount: d.applications.length,
        selectedCount: d.applications.filter((a) => a.status === 'SELECTED').length,
      })),
    };
  }
}
