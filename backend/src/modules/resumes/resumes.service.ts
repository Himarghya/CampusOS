import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class ResumesService {
  static async getStudentProfile(studentId: string) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
        department: true,
        program: true,
        skills: true,
        projects: true,
        resumes: true,
      },
    });
    if (!student) throw new AppError('Student not found', 404, 'NOT_FOUND');

    // Calculate completeness
    let score = 20; // Base user info
    if (student.skills.length > 0) score += 20;
    if (student.projects.length > 0) score += 25;
    if (student.resumes.length > 0) score += 25;
    if (student.guardianName || student.address) score += 10;

    return {
      ...student,
      completenessScore: Math.min(score, 100),
    };
  }

  static async addSkill(studentId: string, data: { name: string; category?: string; proficiency?: string }) {
    return prisma.studentSkill.upsert({
      where: {
        studentId_name: {
          studentId,
          name: data.name.trim(),
        },
      },
      create: {
        studentId,
        name: data.name.trim(),
        category: data.category || 'TECHNICAL',
        proficiency: data.proficiency || 'INTERMEDIATE',
      },
      update: {
        category: data.category || 'TECHNICAL',
        proficiency: data.proficiency || 'INTERMEDIATE',
      },
    });
  }

  static async removeSkill(studentId: string, skillId: string) {
    return prisma.studentSkill.delete({
      where: { id: skillId },
    });
  }

  static async addProject(studentId: string, data: {
    title: string;
    description: string;
    technologies: string;
    projectUrl?: string;
    githubUrl?: string;
  }) {
    return prisma.studentProject.create({
      data: {
        studentId,
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        projectUrl: data.projectUrl,
        githubUrl: data.githubUrl,
      },
    });
  }

  static async deleteProject(studentId: string, projectId: string) {
    return prisma.studentProject.delete({
      where: { id: projectId },
    });
  }

  static async addResume(studentId: string, data: {
    title?: string;
    fileUrl: string;
    fileName: string;
    fileSize?: number;
  }) {
    // Unmark any previous primary
    await prisma.resume.updateMany({
      where: { studentId },
      data: { isPrimary: false },
    });

    return prisma.resume.create({
      data: {
        studentId,
        title: data.title || 'Primary Resume',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize || 0,
        isPrimary: true,
      },
    });
  }
}
