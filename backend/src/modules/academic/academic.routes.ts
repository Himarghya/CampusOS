import { Router } from 'express';
import { AcademicController } from './academic.controller';
import { requireAuth } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

router.get('/academic-years', requireAuth, AcademicController.getAcademicYears);
router.post('/academic-years', requireAuth, authorize('ADMIN', 'SUPER_ADMIN'), AcademicController.createAcademicYear);

router.get('/programs', requireAuth, AcademicController.getPrograms);
router.get('/semesters', requireAuth, AcademicController.getSemesters);

router.get('/courses', requireAuth, AcademicController.getCourses);
router.get('/courses/:id', requireAuth, AcademicController.getCourseById);
router.post('/courses', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'), AcademicController.createCourse);

router.post('/enrollments', requireAuth, authorize('ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'), AcademicController.enrollStudent);
router.get('/enrollments/me', requireAuth, AcademicController.getMyEnrollments);

router.get('/disciplines', requireAuth, AcademicController.getDisciplines);
router.get('/credit-standing', requireAuth, AcademicController.getCreditStanding);
router.get('/registration/offerings', requireAuth, AcademicController.getRegistrationOfferings);
router.get('/registration/backlog', requireAuth, AcademicController.getBacklogCourses);
router.get('/timetable', requireAuth, AcademicController.getStudentTimetable);

export default router;
