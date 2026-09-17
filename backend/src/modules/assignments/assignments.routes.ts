import { Router } from 'express';
import { AssignmentsController } from './assignments.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, AssignmentsController.list);
router.get('/:id', requireAuth, AssignmentsController.getById);
router.post('/', requireAuth, authorize('FACULTY', 'DEPT_HEAD', 'ADMIN', 'SUPER_ADMIN'), AssignmentsController.create);
router.post('/:id/submissions', requireAuth, authorize('STUDENT'), AssignmentsController.submit);
router.patch('/submissions/:id/evaluate', requireAuth, authorize('FACULTY', 'DEPT_HEAD', 'ADMIN', 'SUPER_ADMIN'), AssignmentsController.evaluate);

export default router;
