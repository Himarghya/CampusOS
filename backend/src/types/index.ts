import { Request } from 'express';
import { TokenPayload } from '../lib/auth';

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: TokenPayload & {
    studentId?: string;
    facultyId?: string;
    departmentId?: string;
  };
}

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'DEPT_HEAD' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'STUDENT';
