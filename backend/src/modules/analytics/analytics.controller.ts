import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthRequest } from '../../types';

export class AnalyticsController {
  static async getAdminAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getAdminAnalytics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPlacementAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getPlacementAnalytics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
