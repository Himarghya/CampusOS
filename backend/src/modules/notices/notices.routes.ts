import { Router } from 'express';
import { NoticesController } from './notices.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, NoticesController.list);
router.get('/:id', requireAuth, NoticesController.getById);
router.post('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD', 'FACULTY', 'PLACEMENT_OFFICER'), NoticesController.create);
router.post('/:id/read', requireAuth, NoticesController.markRead);

export default router;
