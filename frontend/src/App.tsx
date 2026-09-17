import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppShell } from './components/layout/AppShell';

// Auth
import { LoginPage } from './pages/auth/LoginPage';

// Student
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentResultsPage } from './pages/student/StudentResultsPage';
import { StudentPlacementsPage } from './pages/student/StudentPlacementsPage';
import { StudentResumePage } from './pages/student/StudentResumePage';
import { StudentDisciplinesPage } from './pages/student/StudentDisciplinesPage';
import { StudentRegistrationPage } from './pages/student/StudentRegistrationPage';
import { StudentAddDropBacklogPage } from './pages/student/StudentAddDropBacklogPage';
import { StudentTimetablePage } from './pages/student/StudentTimetablePage';
import { StudentProgrammesPage } from './pages/student/StudentProgrammesPage';
import { StudentCurriculumsPage } from './pages/student/StudentCurriculumsPage';

// Faculty
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyCoursesPage } from './pages/faculty/FacultyCoursesPage';
import { FacultyAttendancePage } from './pages/faculty/FacultyAttendancePage';
import { FacultyAssignmentsPage } from './pages/faculty/FacultyAssignmentsPage';
import { FacultyMarksPage } from './pages/faculty/FacultyMarksPage';

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminFacultyPage } from './pages/admin/AdminFacultyPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminExamsPage } from './pages/admin/AdminExamsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// Placement
import { PlacementDashboard } from './pages/placement/PlacementDashboard';
import { PlacementDrivesPage } from './pages/placement/PlacementDrivesPage';
import { PlacementCompaniesPage } from './pages/placement/PlacementCompaniesPage';
import { PlacementAnalyticsPage } from './pages/placement/PlacementAnalyticsPage';

// Shared
import { NoticesPage } from './pages/shared/NoticesPage';
import { EventsPage } from './pages/shared/EventsPage';
import { RequestsPage } from './pages/shared/RequestsPage';
import { ProfilePage } from './pages/shared/ProfilePage';
import { SettingsPage } from './pages/shared/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F17]">
        <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleDashboardRouter: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <AdminDashboard />;
  if (role === 'FACULTY' || role === 'DEPT_HEAD') return <FacultyDashboard />;
  if (role === 'PLACEMENT_OFFICER') return <PlacementDashboard />;
  return <StudentDashboard />;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<RoleDashboardRouter />} />

                {/* Student Routes */}
                <Route path="/courses" element={<StudentCoursesPage />} />
                <Route path="/attendance" element={<StudentAttendancePage />} />
                <Route path="/assignments" element={<StudentAssignmentsPage />} />
                <Route path="/exams" element={<StudentResultsPage />} />
                <Route path="/grades" element={<StudentResultsPage />} />
                <Route path="/placements" element={<StudentPlacementsPage />} />
                <Route path="/resume" element={<StudentResumePage />} />

                {/* Student Academics, Registration & Curriculum Routes */}
                <Route path="/academics/pre-registration" element={<StudentRegistrationPage mode="pre" />} />
                <Route path="/academics/registration" element={<StudentRegistrationPage mode="final" />} />
                <Route path="/academics/add-drop" element={<StudentAddDropBacklogPage />} />
                <Route path="/academics/swayam" element={<StudentAddDropBacklogPage />} />
                <Route path="/academics/timetable" element={<StudentTimetablePage />} />
                <Route path="/curriculum/disciplines" element={<StudentDisciplinesPage />} />
                <Route path="/curriculum/programmes" element={<StudentProgrammesPage />} />
                <Route path="/curriculum/structures" element={<StudentCurriculumsPage />} />

                {/* Faculty Routes */}
                <Route path="/faculty/courses" element={<FacultyCoursesPage />} />
                <Route path="/faculty/attendance" element={<FacultyAttendancePage />} />
                <Route path="/faculty/assignments" element={<FacultyAssignmentsPage />} />
                <Route path="/faculty/marks" element={<FacultyMarksPage />} />

                {/* Admin Routes */}
                <Route path="/admin/students" element={<AdminStudentsPage />} />
                <Route path="/admin/faculty" element={<AdminFacultyPage />} />
                <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/admin/exams" element={<AdminExamsPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/audit" element={<AdminAuditLogsPage />} />

                {/* Placement Routes */}
                <Route path="/placement/drives" element={<PlacementDrivesPage />} />
                <Route path="/placement/companies" element={<PlacementCompaniesPage />} />
                <Route path="/placement/analytics" element={<PlacementAnalyticsPage />} />

                {/* Shared Routes */}
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
