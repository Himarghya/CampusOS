import { Response, NextFunction } from 'express';
import { DepartmentsService } from './departments.service';
import { AuthRequest } from '../../types';

export class DepartmentsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DepartmentsService.listDepartments();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DepartmentsService.getDepartmentById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DepartmentsService.createDepartment(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
