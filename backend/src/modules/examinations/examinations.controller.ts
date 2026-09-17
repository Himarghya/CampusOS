import { Response, NextFunction } from 'express';
import { ExaminationsService } from './examinations.service';
import { AuthRequest } from '../../types';

export class ExaminationsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.listExams();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.getExamById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.createExam(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.updateExam(req.params.id, req.body, req);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.deleteExam(req.params.id, req);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async submitMarks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.submitMarks({
        ...req.body,
        examId: req.params.id,
        facultyId: req.user?.facultyId,
        req,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async publish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ExaminationsService.publishExam(req.params.id, req);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getMyResults(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.studentId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      const data = await ExaminationsService.getStudentResults(req.user.studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
