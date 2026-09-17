import { Response, NextFunction } from 'express';
import { NoticesService } from './notices.service';
import { AuthRequest } from '../../types';

export class NoticesController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const audience = req.user?.role;
      const data = await NoticesService.listNotices({
        category: req.query.category as string,
        audience,
        userId: req.user?.userId,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await NoticesService.getNoticeById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await NoticesService.createNotice({
        ...req.body,
        authorId: req.user!.userId,
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await NoticesService.markAsRead(req.params.id, req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
