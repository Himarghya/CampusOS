import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/student', requireAuth, authorize('STUDENT', 'ADMIN', 'SUPER_ADMIN'), DashboardController.getStudentDashboard);
router.get('/faculty', requireAuth, authorize('FACULTY', 'DEPT_HEAD', 'ADMIN', 'SUPER_ADMIN'), DashboardController.getFacultyDashboard);
router.get('/admin', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'), DashboardController.getAdminDashboard);
router.get('/placement', requireAuth, authorize('PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'), DashboardController.getPlacementDashboard);

export default router;
