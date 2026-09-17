import { Router } from 'express';
import { PlacementsController } from './placements.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/companies', requireAuth, PlacementsController.listCompanies);
router.post('/companies', requireAuth, authorize('PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'), PlacementsController.createCompany);

router.get('/drives', requireAuth, PlacementsController.listDrives);
router.get('/drives/:id', requireAuth, PlacementsController.getDriveById);
router.post('/drives', requireAuth, authorize('PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'), PlacementsController.createDrive);
router.post('/drives/:id/apply', requireAuth, authorize('STUDENT'), PlacementsController.apply);
router.patch('/applications/:id/status', requireAuth, authorize('PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'), PlacementsController.updateStatus);

export default router;
