import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Import route modules
import authRoutes from './modules/auth/auth.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import studentsRoutes from './modules/students/students.routes';
import facultyRoutes from './modules/faculty/faculty.routes';
import departmentsRoutes from './modules/departments/departments.routes';
import academicRoutes from './modules/academic/academic.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import assignmentsRoutes from './modules/assignments/assignments.routes';
import examinationsRoutes from './modules/examinations/examinations.routes';
import placementsRoutes from './modules/placements/placements.routes';
import resumesRoutes from './modules/resumes/resumes.routes';
import noticesRoutes from './modules/notices/notices.routes';
import eventsRoutes from './modules/events/events.routes';
import requestsRoutes from './modules/requests/requests.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import auditRoutes from './modules/audit/audit.routes';
import uploadsRoutes from './modules/uploads/uploads.routes';

export function createApp() {
  const app = express();

  // Basic security and parsing
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files for uploads
  app.use('/uploads', express.static(config.uploadsDir));

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'CampusOS API', timestamp: new Date() });
  });

  // API v1 Routes
  const apiRouter = express.Router();
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/dashboard', dashboardRoutes);
  apiRouter.use('/students', studentsRoutes);
  apiRouter.use('/faculty', facultyRoutes);
  apiRouter.use('/departments', departmentsRoutes);
  apiRouter.use('/academic', academicRoutes);
  apiRouter.use('/attendance', attendanceRoutes);
  apiRouter.use('/assignments', assignmentsRoutes);
  apiRouter.use('/examinations', examinationsRoutes);
  apiRouter.use('/placements', placementsRoutes);
  apiRouter.use('/resumes', resumesRoutes);
  apiRouter.use('/notices', noticesRoutes);
  apiRouter.use('/events', eventsRoutes);
  apiRouter.use('/requests', requestsRoutes);
  apiRouter.use('/notifications', notificationsRoutes);
  apiRouter.use('/analytics', analyticsRoutes);
  apiRouter.use('/audit', auditRoutes);
  apiRouter.use('/uploads', uploadsRoutes);

  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
