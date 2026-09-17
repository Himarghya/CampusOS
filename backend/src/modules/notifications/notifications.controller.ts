import { Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { AuthRequest } from '../../types';

export class NotificationsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await NotificationsService.listUserNotifications(req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await NotificationsService.markRead(req.params.id, req.user!.userId);
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  static async markAllRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await NotificationsService.markAllRead(req.user!.userId);
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
