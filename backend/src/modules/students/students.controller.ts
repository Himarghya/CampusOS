import { Response, NextFunction } from 'express';
import { StudentsService } from './students.service';
import { AuthRequest } from '../../types';

export class StudentsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await StudentsService.listStudents(req.query as any);
      res.status(200).json({ success: true, data: result.students, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.getStudentById(req.params.id);
      res.status(200).json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.createStudent({ ...req.body, req });
      res.status(201).json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.updateStudent(req.params.id, req.body);
      res.status(200).json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }

  static async toggleActive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await StudentsService.toggleActive(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
