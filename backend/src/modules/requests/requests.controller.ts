import { Response, NextFunction } from 'express';
import { RequestsService } from './requests.service';
import { AuthRequest } from '../../types';

export class RequestsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isPrivileged = ['ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'].includes(req.user?.role || '');
      const userId = isPrivileged && !req.query.myOnly ? undefined : req.user!.userId;
      const data = await RequestsService.listRequests({
        userId,
        status: req.query.status as string,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await RequestsService.createRequest({
        ...req.body,
        userId: req.user!.userId,
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await RequestsService.updateStatus(req.params.id, {
        ...req.body,
        reviewerId: req.user!.userId,
        req,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
