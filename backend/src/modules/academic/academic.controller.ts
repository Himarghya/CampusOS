import { Response, NextFunction } from 'express';
import { AcademicService } from './academic.service';
import { AuthRequest } from '../../types';

export class AcademicController {
  static async getAcademicYears(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.getAcademicYears();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createAcademicYear(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.createAcademicYear(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPrograms(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.getPrograms();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSemesters(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.getSemesters(req.query.programId as string);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getCourses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.getCourses(req.query as any);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getCourseById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.getCourseById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.createCourse(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async enrollStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AcademicService.enrollStudent(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getMyEnrollments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.studentId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      const data = await AcademicService.getStudentEnrollments(req.user.studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
