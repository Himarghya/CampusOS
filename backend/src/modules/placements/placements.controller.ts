import { Response, NextFunction } from 'express';
import { PlacementsService } from './placements.service';
import { AuthRequest } from '../../types';

export class PlacementsController {
  static async listCompanies(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PlacementsService.listCompanies();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createCompany(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PlacementsService.createCompany(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async listDrives(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.role === 'STUDENT' ? req.user.studentId : undefined;
      const data = await PlacementsService.listDrives({ ...req.query, studentId });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getDriveById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.role === 'STUDENT' ? req.user.studentId : undefined;
      const data = await PlacementsService.getDriveById(req.params.id, studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createDrive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PlacementsService.createDrive({ ...req.body, req });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async apply(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PlacementsService.applyForDrive({
        driveId: req.params.id,
        studentId: req.user!.studentId!,
        resumeUrl: req.body.resumeUrl,
        req,
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PlacementsService.updateApplicationStatus(req.params.id, req.body.status, req);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
