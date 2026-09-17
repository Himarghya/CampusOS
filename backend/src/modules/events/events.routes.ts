import { Router } from 'express';
import { EventsController } from './events.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, EventsController.list);
router.get('/:id', requireAuth, EventsController.getById);
router.post('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'FACULTY', 'DEPT_HEAD', 'PLACEMENT_OFFICER'), EventsController.create);
router.post('/:id/register', requireAuth, EventsController.register);
router.delete('/:id/register', requireAuth, EventsController.cancel);

export default router;
