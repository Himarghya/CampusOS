import { Response, NextFunction } from 'express';
import { ResumesService } from './resumes.service';
import { AuthRequest } from '../../types';

export class ResumesController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId || req.user!.studentId!;
      const data = await ResumesService.getStudentProfile(studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async addSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ResumesService.addSkill(req.user!.studentId!, req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async removeSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ResumesService.removeSkill(req.user!.studentId!, req.params.id);
      res.status(200).json({ success: true, message: 'Skill removed' });
    } catch (error) {
      next(error);
    }
  }

  static async addProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ResumesService.addProject(req.user!.studentId!, req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ResumesService.deleteProject(req.user!.studentId!, req.params.id);
      res.status(200).json({ success: true, message: 'Project removed' });
    } catch (error) {
      next(error);
    }
  }

  static async addResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ResumesService.addResume(req.user!.studentId!, req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
