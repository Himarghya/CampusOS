import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.post('/sessions', requireAuth, authorize('FACULTY', 'DEPT_HEAD', 'ADMIN', 'SUPER_ADMIN'), AttendanceController.createSession);
router.get('/sessions', requireAuth, AttendanceController.getSessions);
router.get('/sessions/:id', requireAuth, AttendanceController.getSessionById);
router.post('/records/bulk', requireAuth, authorize('FACULTY', 'DEPT_HEAD', 'ADMIN', 'SUPER_ADMIN'), AttendanceController.markBulkAttendance);
router.get('/me', requireAuth, AttendanceController.getMyAttendance);
router.get('/student/:studentId', requireAuth, AttendanceController.getStudentAttendanceById);
router.get('/course/:courseId/spreadsheet', requireAuth, AttendanceController.getCourseSpreadsheet);

export default router;
