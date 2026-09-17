import { Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthRequest } from '../../types';

export class DashboardController {
  static async getStudentDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getStudentDashboard(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getFacultyDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getFacultyDashboard(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getAdminDashboard();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPlacementDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getPlacementDashboard();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
