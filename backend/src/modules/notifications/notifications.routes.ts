import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.get('/', requireAuth, NotificationsController.list);
router.patch('/:id/read', requireAuth, NotificationsController.markRead);
router.post('/read-all', requireAuth, NotificationsController.markAllRead);

export default router;
