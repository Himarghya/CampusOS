import { Router } from 'express';
import { DepartmentsController } from './departments.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, DepartmentsController.list);
router.get('/:id', requireAuth, DepartmentsController.getById);
router.post('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), DepartmentsController.create);

export default router;
