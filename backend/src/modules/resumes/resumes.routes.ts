import { Router } from 'express';
import { ResumesController } from './resumes.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/profile', requireAuth, ResumesController.getProfile);
router.get('/profile/:studentId', requireAuth, ResumesController.getProfile);
router.post('/skills', requireAuth, authorize('STUDENT'), ResumesController.addSkill);
router.delete('/skills/:id', requireAuth, authorize('STUDENT'), ResumesController.removeSkill);
router.post('/projects', requireAuth, authorize('STUDENT'), ResumesController.addProject);
router.delete('/projects/:id', requireAuth, authorize('STUDENT'), ResumesController.deleteProject);
router.post('/resumes', requireAuth, authorize('STUDENT'), ResumesController.addResume);

export default router;
