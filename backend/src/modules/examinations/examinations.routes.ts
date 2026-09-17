import { Router } from 'express';
import { ExaminationsController } from './examinations.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/', requireAuth, ExaminationsController.list);
router.get('/my-results', requireAuth, ExaminationsController.getMyResults);
router.get('/:id', requireAuth, ExaminationsController.getById);
router.post('/', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), ExaminationsController.create);
router.patch('/:id', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), ExaminationsController.update);
router.delete('/:id', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), ExaminationsController.delete);
router.post('/:id/marks', requireAuth, authorize('FACULTY', 'DEPT_HEAD', 'ADMIN', 'SUPER_ADMIN'), ExaminationsController.submitMarks);
router.post('/:id/publish', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), ExaminationsController.publish);

export default router;
