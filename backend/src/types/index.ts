import { Request } from 'express';
import { TokenPayload } from '../lib/auth';

export interface AuthRequest extends Request {
  user?: TokenPayload & {
    studentId?: string;
    facultyId?: string;
    departmentId?: string;
  };
}

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'DEPT_HEAD' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'STUDENT';
