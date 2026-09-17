import { Router } from 'express';
import { FacultyController } from './faculty.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, FacultyController.list);
router.get('/:id', requireAuth, FacultyController.getById);
router.post('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'), FacultyController.create);

export default router;
