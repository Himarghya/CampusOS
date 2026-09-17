import { Response, NextFunction } from 'express';
import { EventsService } from './events.service';
import { AuthRequest } from '../../types';

export class EventsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await EventsService.listEvents(req.user?.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await EventsService.getEventById(req.params.id, req.user?.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await EventsService.createEvent(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await EventsService.registerForEvent(req.params.id, req.user!.userId);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await EventsService.cancelRegistration(req.params.id, req.user!.userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
