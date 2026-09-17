import { Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service';
import { AuthRequest } from '../../types';

export class AttendanceController {
  static async createSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const session = await AttendanceService.createSession({
        ...req.body,
        facultyId: req.user?.facultyId || req.body.facultyId,
        req,
      });
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  static async getSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getSessions(req.query as any);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSessionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getSessionById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async markBulkAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.markBulkAttendance({
        sessionId: req.body.sessionId,
        records: req.body.records,
        req,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getMyAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.studentId) {
        res.status(200).json({ success: true, data: { overallPercentage: 100, subjectWise: [] } });
        return;
      }
      const data = await AttendanceService.getStudentAttendance(req.user.studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentAttendanceById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getStudentAttendance(req.params.studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
