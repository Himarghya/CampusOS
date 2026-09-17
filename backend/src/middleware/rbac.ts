import { Response, NextFunction } from 'express';
import { AuthRequest, Role } from '../types';
import { AppError } from './errorHandler';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role as Role) && req.user.role !== 'SUPER_ADMIN') {
      return next(
        new AppError(
          `Forbidden: Role '${req.user.role}' is not authorized to access this resource`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}
