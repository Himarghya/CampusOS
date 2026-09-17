import { Router } from 'express';
import { StudentsController } from './students.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD', 'FACULTY', 'PLACEMENT_OFFICER'), StudentsController.list);
router.get('/:id', requireAuth, StudentsController.getById);
router.post('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), StudentsController.create);
router.patch('/:id', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'STUDENT'), StudentsController.update);
router.patch('/:id/toggle-active', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), StudentsController.toggleActive);

export default router;
