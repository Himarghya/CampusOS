# CampusOS — Smart Campus Operating System

> **One Campus. One Platform. Complete Academic Intelligence.**

CampusOS (EduPortal) is a production-grade full-stack college management and student engagement platform connecting students, faculty, department heads, placement officers, and college administrators through a unified, data-driven architecture.

---

## 📸 Visual Design & Highlights

Built according to modern SaaS principles with a responsive layout:
- **Student Portal**: KPI cards, course progress bars, upcoming exams schedule, recent announcements, attendance overview donut charts, and JWT security badge.
- **Faculty Portal**: Course rosters, session planner, bulk roll-call attendance marking, coursework submission manager, and marks entry.
- **Admin Hub**: Student & faculty directories, department analytics, exam result publishing workflow, and system audit logs.
- **Placement & Career Center**: Recruiter database, placement drives with automatic CGPA/backlog eligibility checks, student applications, and compensation insights.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Custom Dark Navy `#0B1220` + Pastel Slate/Indigo Theme)
- **Data & State**: TanStack Query (React Query)
- **Icons & Charts**: Lucide React + Recharts
- **Forms & Validation**: React Hook Form + Zod
- **Routing**: React Router DOM (Role-guarded routes)

### Backend
- **Runtime & Framework**: Node.js + Express.js + TypeScript
- **ORM & Database**: Prisma ORM with SQLite / PostgreSQL support
- **Authentication**: JWT access tokens + rotating refresh tokens + bcrypt password hashing
- **Security**: RBAC authorization middleware, Helmet, CORS, audit logging, Zod validation
- **Testing**: Vitest + Supertest

---

## 🔑 Demo Credentials

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Student** | `john.doe@campusos.edu` | `Student@123` | John Doe (CSE 4th Sem, 8.72 CGPA) |
| **Student** | `ananya.sen@campusos.edu` | `Student@123` | Ananya Sen (CSE 4th Sem, 9.15 CGPA) |
| **Faculty** | `prof.sharma@campusos.edu` | `Faculty@123` | Prof. Vikram Sharma (DSA) |
| **Dept Head (HOD)** | `hod.cse@campusos.edu` | `Faculty@123` | Dr. Rajesh Sharma (HOD CSE) |
| **Placement Officer** | `placement@campusos.edu` | `Placement@123` | Mr. Amit Kapoor |
| **College Admin** | `admin@campusos.edu` | `Admin@123` | College Administrator |

> 💡 *Tip: The top navigation bar includes an interactive **1-Click Role Switcher** dropdown for immediate evaluation across all roles without typing passwords.*

---

## 🚀 Quickstart & Local Development

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
Backend API will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web UI will run on `http://localhost:5173`.

---

## 🧪 Testing

Run backend integration and RBAC test suite:
```bash
cd backend
npm test
```

Build production bundles:
```bash
cd frontend
npm run build
```

---

## 🐳 Docker Deployment

Run the entire platform with Docker Compose:
```bash
docker compose up --build
```
