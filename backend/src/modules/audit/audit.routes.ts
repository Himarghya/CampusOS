import { Router } from 'express';
import { AuditController } from './audit.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), AuditController.list);

export default router;
