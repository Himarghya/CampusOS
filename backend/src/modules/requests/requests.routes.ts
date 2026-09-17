import { Router } from 'express';
import { RequestsController } from './requests.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, RequestsController.list);
router.post('/', requireAuth, RequestsController.create);
router.patch('/:id/status', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'), RequestsController.updateStatus);

export default router;
