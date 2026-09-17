import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/admin', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'), AnalyticsController.getAdminAnalytics);
router.get('/placement', requireAuth, authorize('PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'), AnalyticsController.getPlacementAnalytics);

export default router;
