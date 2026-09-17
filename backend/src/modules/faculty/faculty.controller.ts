import { Response, NextFunction } from 'express';
import { FacultyService } from './faculty.service';
import { AuthRequest } from '../../types';

export class FacultyController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await FacultyService.listFaculty(req.query as any);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await FacultyService.getFacultyById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await FacultyService.createFaculty(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
