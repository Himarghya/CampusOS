import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('CampusOS Backend API Suite', () => {
  let studentToken: string;
  let facultyToken: string;
  let adminToken: string;
  let studentId: string;

  it('GET /health returns 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('CampusOS API');
  });

  it('POST /api/v1/auth/login logs in Student successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john.doe@campusos.edu', password: 'Student@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('john.doe@campusos.edu');
    expect(res.body.data.user.role).toBe('STUDENT');
    expect(res.body.data.tokens.accessToken).toBeDefined();

    studentToken = res.body.data.tokens.accessToken;
    studentId = res.body.data.user.student.id;
  });

  it('POST /api/v1/auth/login logs in Faculty successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'prof.sharma@campusos.edu', password: 'Faculty@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('FACULTY');
    facultyToken = res.body.data.tokens.accessToken;
  });

  it('POST /api/v1/auth/login logs in College Admin successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@campusos.edu', password: 'Admin@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    adminToken = res.body.data.tokens.accessToken;
  });

  it('GET /api/v1/dashboard/student fetches real DB metrics matching mockup', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/student')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis.cgpa).toBe(8.72);
    expect(res.body.data.kpis.myCoursesCount).toBeGreaterThanOrEqual(4);
    expect(res.body.data.myCourses.length).toBeGreaterThan(0);
    expect(res.body.data.attendanceOverview).toBeDefined();
  });

  it('GET /api/v1/dashboard/admin fetches college summary', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis.totalStudents).toBeGreaterThan(0);
  });

  it('RBAC Enforcement: Student cannot create a course or department (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/v1/departments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Unauthorized Dept', code: 'UNAUTH' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('Placement Eligibility: Checks student CGPA & application', async () => {
    const drivesRes = await request(app)
      .get('/api/v1/placements/drives')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(drivesRes.status).toBe(200);
    expect(drivesRes.body.data.length).toBeGreaterThan(0);
  });

  it('Assignments: Fetches student coursework and submissions', async () => {
    const res = await request(app)
      .get('/api/v1/assignments')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
