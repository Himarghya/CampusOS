import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { logAudit } from '../../middleware/audit';

export class PlacementsService {
  // Companies
  static async listCompanies() {
    return prisma.company.findMany({
      include: {
        _count: { select: { drives: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async createCompany(data: {
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }) {
    return prisma.company.create({ data });
  }

  // Placement Drives
  static async listDrives(params: { status?: string; studentId?: string }) {
    const where: any = {};
    if (params.status) where.status = params.status;

    const drives = await prisma.placementDrive.findMany({
      where,
      include: {
        company: true,
        eligibilityRules: true,
        rounds: { orderBy: { roundNumber: 'asc' } },
        applications: params.studentId
          ? { where: { studentId: params.studentId }, include: { results: true } }
          : { include: { student: { include: { user: true, department: true } } } },
        _count: { select: { applications: true } },
      },
      orderBy: { deadline: 'asc' },
    });

    return drives;
  }

  static async getDriveById(id: string, studentId?: string) {
    const drive = await prisma.placementDrive.findUnique({
      where: { id },
      include: {
        company: true,
        eligibilityRules: true,
        rounds: { orderBy: { roundNumber: 'asc' } },
        applications: {
          include: {
            student: { include: { user: true, department: true, skills: true } },
            results: { include: { round: true } },
          },
        },
      },
    });
    if (!drive) throw new AppError('Placement drive not found', 404, 'NOT_FOUND');

    let isEligible = true;
    let eligibilityReasons: string[] = [];

    if (studentId) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { department: true, skills: true },
      });

      if (student && drive.eligibilityRules.length > 0) {
        const rule = drive.eligibilityRules[0];
        if (student.cgpa < rule.minCgpa) {
          isEligible = false;
          eligibilityReasons.push(`CGPA ${student.cgpa.toFixed(2)} is below required ${rule.minCgpa.toFixed(2)}`);
        }
        if (student.activeBacklogs > rule.maxBacklogs) {
          isEligible = false;
          eligibilityReasons.push(`Active backlogs (${student.activeBacklogs}) exceed maximum allowed (${rule.maxBacklogs})`);
        }

        try {
          const allowedBranches: string[] = JSON.parse(rule.allowedBranches || '[]');
          if (allowedBranches.length > 0 && !allowedBranches.includes(student.department.code)) {
            isEligible = false;
            eligibilityReasons.push(`Department ${student.department.code} is not in allowed branches (${allowedBranches.join(', ')})`);
          }
        } catch {
          // branch check fallback
        }
      }
    }

    return {
      ...drive,
      eligibilityCheck: studentId ? { isEligible, reasons: eligibilityReasons } : undefined,
    };
  }

  static async createDrive(data: {
    companyId: string;
    title: string;
    jobRole: string;
    jobType?: string;
    packageLpa: number;
    location: string;
    description: string;
    deadline: string;
    driveDate: string;
    minCgpa?: number;
    maxBacklogs?: number;
    allowedBranches?: string[];
    graduationYear?: string;
    requiredSkills?: string[];
    rounds?: Array<{ name: string; roundDate: string; venue?: string }>;
    req?: any;
  }) {
    return prisma.$transaction(async (tx) => {
      const drive = await tx.placementDrive.create({
        data: {
          companyId: data.companyId,
          title: data.title,
          jobRole: data.jobRole,
          jobType: data.jobType || 'FULL_TIME',
          packageLpa: Number(data.packageLpa),
          location: data.location,
          description: data.description,
          deadline: new Date(data.deadline),
          driveDate: new Date(data.driveDate),
          status: 'ACTIVE',
        },
      });

      // Create eligibility rule
      await tx.placementEligibilityRule.create({
        data: {
          driveId: drive.id,
          minCgpa: Number(data.minCgpa) || 6.0,
          maxBacklogs: Number(data.maxBacklogs) || 0,
          allowedBranches: JSON.stringify(data.allowedBranches || ['CSE', 'IT', 'ECE']),
          graduationYear: data.graduationYear || '2026',
          requiredSkills: data.requiredSkills ? JSON.stringify(data.requiredSkills) : undefined,
        },
      });

      // Create rounds
      if (data.rounds && data.rounds.length > 0) {
        for (let i = 0; i < data.rounds.length; i++) {
          await tx.placementRound.create({
            data: {
              driveId: drive.id,
              roundNumber: i + 1,
              name: data.rounds[i].name,
              roundDate: new Date(data.rounds[i].roundDate),
              venue: data.rounds[i].venue,
            },
          });
        }
      } else {
        await tx.placementRound.create({
          data: {
            driveId: drive.id,
            roundNumber: 1,
            name: 'Online Assessment',
            roundDate: new Date(data.driveDate),
          },
        });
      }

      await logAudit({
        req: data.req,
        actorId: data.req?.user?.userId,
        action: 'PLACEMENT_DRIVE_CREATED',
        entityType: 'PlacementDrive',
        entityId: drive.id,
        details: { title: drive.title, packageLpa: drive.packageLpa },
      });

      return drive;
    });
  }

  static async applyForDrive(data: { driveId: string; studentId: string; resumeUrl?: string; req?: any }) {
    const drive = await prisma.placementDrive.findUnique({
      where: { id: data.driveId },
      include: { eligibilityRules: true },
    });
    if (!drive) throw new AppError('Placement drive not found', 404, 'NOT_FOUND');
    if (new Date() > drive.deadline) {
      throw new AppError('The deadline for this placement drive has passed', 400, 'DEADLINE_PASSED');
    }

    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: { department: true },
    });
    if (!student) throw new AppError('Student not found', 404, 'NOT_FOUND');

    // Check Eligibility
    if (drive.eligibilityRules.length > 0) {
      const rule = drive.eligibilityRules[0];
      if (student.cgpa < rule.minCgpa) {
        throw new AppError(`CGPA (${student.cgpa}) is below the required ${rule.minCgpa}`, 400, 'INELIGIBLE_CGPA');
      }
      if (student.activeBacklogs > rule.maxBacklogs) {
        throw new AppError(`Active backlogs exceed the maximum permitted (${rule.maxBacklogs})`, 400, 'INELIGIBLE_BACKLOGS');
      }
    }

    // Unique application
    const existing = await prisma.placementApplication.findUnique({
      where: {
        driveId_studentId: {
          driveId: data.driveId,
          studentId: data.studentId,
        },
      },
    });
    if (existing) throw new AppError('You have already applied to this drive', 409, 'ALREADY_APPLIED');

    const app = await prisma.placementApplication.create({
      data: {
        driveId: data.driveId,
        studentId: data.studentId,
        resumeUrl: data.resumeUrl,
        status: 'APPLIED',
      },
      include: { drive: { include: { company: true } } },
    });

    await logAudit({
      req: data.req,
      actorId: data.req?.user?.userId,
      action: 'PLACEMENT_APPLICATION_SUBMITTED',
      entityType: 'PlacementApplication',
      entityId: app.id,
      details: { driveTitle: app.drive.title },
    });

    return app;
  }

  static async updateApplicationStatus(id: string, status: string, req?: any) {
    const app = await prisma.placementApplication.update({
      where: { id },
      data: { status },
      include: { drive: true, student: { include: { user: true } } },
    });

    await logAudit({
      req,
      actorId: req?.user?.userId,
      action: 'PLACEMENT_STATUS_UPDATED',
      entityType: 'PlacementApplication',
      entityId: id,
      details: { newStatus: status, student: app.student.user.email },
    });

    return app;
  }
}
