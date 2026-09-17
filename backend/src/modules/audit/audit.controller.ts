import { Response, NextFunction } from 'express';
import { AuditService } from './audit.service';
import { AuthRequest } from '../../types';

export class AuditController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuditService.listLogs(req.query as any);
      res.status(200).json({ success: true, data: result.logs, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  }
}
