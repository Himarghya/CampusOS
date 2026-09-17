import { Response, NextFunction } from 'express';
import { AssignmentsService } from './assignments.service';
import { AuthRequest } from '../../types';

export class AssignmentsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.role === 'STUDENT' ? req.user.studentId : undefined;
      const data = await AssignmentsService.listAssignments({
        ...req.query,
        studentId,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.role === 'STUDENT' ? req.user.studentId : undefined;
      const data = await AssignmentsService.getAssignmentById(req.params.id, studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AssignmentsService.createAssignment({
        ...req.body,
        facultyId: req.user?.facultyId || req.body.facultyId,
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async submit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AssignmentsService.submitAssignment({
        assignmentId: req.params.id,
        studentId: req.user!.studentId!,
        fileUrl: req.body.fileUrl,
        fileName: req.body.fileName,
        fileSize: req.body.fileSize,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async evaluate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AssignmentsService.evaluateSubmission(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
