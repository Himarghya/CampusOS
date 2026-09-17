import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Starting CampusOS database seed...');

  // Clean existing tables in reverse dependency order
  await prisma.notification.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.noticeRead.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.studentProject.deleteMany({});
  await prisma.studentSkill.deleteMany({});
  await prisma.placementResult.deleteMany({});
  await prisma.placementRound.deleteMany({});
  await prisma.placementApplication.deleteMany({});
  await prisma.placementEligibilityRule.deleteMany({});
  await prisma.placementDrive.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.mark.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.attendanceSession.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.courseAssignment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.faculty.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.academicYear.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.institution.deleteMany({});

  // 1. Institution
  const institution = await prisma.institution.create({
    data: {
      name: 'CampusOS Institute of Technology',
      code: 'CIT01',
      address: '100 Innovation Boulevard, Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      website: 'https://campusos.edu',
    },
  });

  // 2. Academic Years
  const academicYear = await prisma.academicYear.create({
    data: {
      institutionId: institution.id,
      year: '2025-2026',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-06-30'),
      isCurrent: true,
    },
  });

  // 3. Departments
  const deptCSE = await prisma.department.create({
    data: {
      institutionId: institution.id,
      name: 'Computer Science & Engineering',
      code: 'CSE',
    },
  });

  const deptIT = await prisma.department.create({
    data: {
      institutionId: institution.id,
      name: 'Information Technology',
      code: 'IT',
    },
  });

  const deptECE = await prisma.department.create({
    data: {
      institutionId: institution.id,
      name: 'Electronics & Communication',
      code: 'ECE',
    },
  });

  // 4. Programs
  const progCSE = await prisma.program.create({
    data: {
      institutionId: institution.id,
      departmentId: deptCSE.id,
      name: 'B.Tech in Computer Science & Engineering',
      code: 'BTECH-CSE',
      degree: 'B.Tech',
      durationYears: 4,
      totalSemesters: 8,
    },
  });

  // 5. Semesters
  const sem4 = await prisma.semester.create({
    data: {
      programId: progCSE.id,
      academicYearId: academicYear.id,
      number: 4,
      term: 'EVEN',
      startDate: new Date('2026-01-05'),
      endDate: new Date('2026-06-15'),
      isCurrent: true,
    },
  });

  const sem6 = await prisma.semester.create({
    data: {
      programId: progCSE.id,
      academicYearId: academicYear.id,
      number: 6,
      term: 'EVEN',
      startDate: new Date('2026-01-05'),
      endDate: new Date('2026-06-15'),
      isCurrent: false,
    },
  });

  // 6. Users & Passwords
  const adminPass = await hashPassword('Admin@123');
  const facultyPass = await hashPassword('Faculty@123');
  const placementPass = await hashPassword('Placement@123');
  const studentPass = await hashPassword('Student@123');

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'admin@campusos.edu',
      password: adminPass,
      role: 'ADMIN',
      firstName: 'College',
      lastName: 'Administrator',
      phone: '+91 98765 43210',
    },
  });

  // HOD
  const hodUser = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'hod.cse@campusos.edu',
      password: facultyPass,
      role: 'DEPT_HEAD',
      firstName: 'Dr. Rajesh',
      lastName: 'Sharma',
      phone: '+91 98765 43211',
    },
  });

  const hodFaculty = await prisma.faculty.create({
    data: {
      userId: hodUser.id,
      departmentId: deptCSE.id,
      employeeCode: 'FAC-CSE-001',
      designation: 'HOD & Professor',
      specialization: 'Artificial Intelligence & Systems',
      cabinNumber: 'CS-401',
    },
  });

  // Faculty 1
  const faculty1User = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'prof.sharma@campusos.edu',
      password: facultyPass,
      role: 'FACULTY',
      firstName: 'Prof. Vikram',
      lastName: 'Sharma',
      phone: '+91 98765 43212',
    },
  });

  const faculty1 = await prisma.faculty.create({
    data: {
      userId: faculty1User.id,
      departmentId: deptCSE.id,
      employeeCode: 'FAC-CSE-002',
      designation: 'Associate Professor',
      specialization: 'Data Structures & Algorithms',
      cabinNumber: 'CS-302',
    },
  });

  // Faculty 2
  const faculty2User = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'prof.mehta@campusos.edu',
      password: facultyPass,
      role: 'FACULTY',
      firstName: 'Prof. Priya',
      lastName: 'Mehta',
      phone: '+91 98765 43213',
    },
  });

  const faculty2 = await prisma.faculty.create({
    data: {
      userId: faculty2User.id,
      departmentId: deptCSE.id,
      employeeCode: 'FAC-CSE-003',
      designation: 'Assistant Professor',
      specialization: 'Database Systems & Cloud Computing',
      cabinNumber: 'CS-305',
    },
  });

  // Placement Officer
  const placementUser = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'placement@campusos.edu',
      password: placementPass,
      role: 'PLACEMENT_OFFICER',
      firstName: 'Amit',
      lastName: 'Kapoor',
      phone: '+91 98765 43214',
    },
  });

  // Primary Demo Student: John Doe (matching the mockup UI)
  const student1User = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'john.doe@campusos.edu',
      password: studentPass,
      role: 'STUDENT',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+91 98765 43215',
    },
  });

  const student1 = await prisma.student.create({
    data: {
      userId: student1User.id,
      departmentId: deptCSE.id,
      programId: progCSE.id,
      academicYearId: academicYear.id,
      currentSemesterId: sem4.id,
      rollNumber: '2023CSE042',
      admissionNumber: 'ADM-2023-042',
      batch: '2023-2027',
      currentSemester: 4,
      cgpa: 8.72,
      activeBacklogs: 0,
      guardianName: 'Robert Doe',
      guardianPhone: '+91 98765 43299',
    },
  });

  // Student 2: Ananya Sen
  const student2User = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'ananya.sen@campusos.edu',
      password: studentPass,
      role: 'STUDENT',
      firstName: 'Ananya',
      lastName: 'Sen',
      phone: '+91 98765 43216',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      departmentId: deptCSE.id,
      programId: progCSE.id,
      academicYearId: academicYear.id,
      currentSemesterId: sem4.id,
      rollNumber: '2023CSE015',
      batch: '2023-2027',
      currentSemester: 4,
      cgpa: 9.15,
      activeBacklogs: 0,
    },
  });

  // 7. Courses (6 core courses matching the student portal mockup)
  const courseDSA = await prisma.course.create({
    data: {
      departmentId: deptCSE.id,
      programId: progCSE.id,
      semesterId: sem4.id,
      name: 'Data Structures & Algorithms',
      code: 'CSE 201',
      credits: 4,
      type: 'THEORY',
      description: 'Advanced data structures, trees, graphs, sorting, searching, and algorithmic analysis.',
    },
  });

  const courseDBMS = await prisma.course.create({
    data: {
      departmentId: deptCSE.id,
      programId: progCSE.id,
      semesterId: sem4.id,
      name: 'Database Management Systems',
      code: 'CSE 202',
      credits: 4,
      type: 'THEORY',
      description: 'Relational database design, normalization, SQL, indexing, transaction processing, and concurrency.',
    },
  });

  const courseWebDev = await prisma.course.create({
    data: {
      departmentId: deptCSE.id,
      programId: progCSE.id,
      semesterId: sem4.id,
      name: 'Web Development',
      code: 'CSE 203',
      credits: 3,
      type: 'LAB',
      description: 'Full-stack web engineering with React, Node.js, RESTful API architecture, and cloud deployment.',
    },
  });

  const courseOS = await prisma.course.create({
    data: {
      departmentId: deptCSE.id,
      programId: progCSE.id,
      semesterId: sem4.id,
      name: 'Operating Systems',
      code: 'CSE 204',
      credits: 4,
      type: 'THEORY',
      description: 'Process management, concurrency, memory virtualization, storage subsystems, and POSIX internals.',
    },
  });

  const courseCN = await prisma.course.create({
    data: {
      departmentId: deptCSE.id,
      programId: progCSE.id,
      semesterId: sem4.id,
      name: 'Computer Networks',
      code: 'CSE 205',
      credits: 3,
      type: 'THEORY',
      description: 'OSI model, TCP/IP, routing algorithms, socket programming, and network security.',
    },
  });

  const courseML = await prisma.course.create({
    data: {
      departmentId: deptCSE.id,
      programId: progCSE.id,
      semesterId: sem4.id,
      name: 'Machine Learning Foundations',
      code: 'CSE 206',
      credits: 3,
      type: 'ELECTIVE',
      description: 'Supervised and unsupervised learning, regression, classification, and neural network fundamentals.',
    },
  });

  const allCourses = [courseDSA, courseDBMS, courseWebDev, courseOS, courseCN, courseML];

  // Assign Faculty to Courses
  await prisma.courseAssignment.createMany({
    data: [
      { courseId: courseDSA.id, facultyId: faculty1.id, section: 'A' },
      { courseId: courseDBMS.id, facultyId: faculty2.id, section: 'A' },
      { courseId: courseWebDev.id, facultyId: faculty2.id, section: 'A' },
      { courseId: courseOS.id, facultyId: faculty1.id, section: 'A' },
      { courseId: courseCN.id, facultyId: hodFaculty.id, section: 'A' },
      { courseId: courseML.id, facultyId: hodFaculty.id, section: 'A' },
    ],
  });

  // Enroll students in all 6 courses
  for (const course of allCourses) {
    await prisma.enrollment.create({
      data: {
        studentId: student1.id,
        courseId: course.id,
        academicYearId: academicYear.id,
        semesterId: sem4.id,
        section: 'A',
      },
    });

    await prisma.enrollment.create({
      data: {
        studentId: student2.id,
        courseId: course.id,
        academicYearId: academicYear.id,
        semesterId: sem4.id,
        section: 'A',
      },
    });
  }

  // 8. Attendance Sessions & Records (matching mockup progress bars)
  // DSA (75%)
  for (let i = 1; i <= 20; i++) {
    const session = await prisma.attendanceSession.create({
      data: {
        courseId: courseDSA.id,
        facultyId: faculty1.id,
        section: 'A',
        date: new Date(2026, 1, i),
        topic: `DSA Module ${i}`,
      },
    });

    const isPresent = i <= 15; // 15/20 = 75%
    await prisma.attendanceRecord.create({
      data: {
        sessionId: session.id,
        studentId: student1.id,
        status: isPresent ? 'PRESENT' : 'ABSENT',
      },
    });
  }

  // DBMS (60%)
  for (let i = 1; i <= 20; i++) {
    const session = await prisma.attendanceSession.create({
      data: {
        courseId: courseDBMS.id,
        facultyId: faculty2.id,
        section: 'A',
        date: new Date(2026, 1, i),
        topic: `DBMS Topic ${i}`,
      },
    });

    const isPresent = i <= 12; // 12/20 = 60%
    await prisma.attendanceRecord.create({
      data: {
        sessionId: session.id,
        studentId: student1.id,
        status: isPresent ? 'PRESENT' : (i === 13 ? 'EXCUSED' : 'ABSENT'),
      },
    });
  }

  // Web Dev (90%)
  for (let i = 1; i <= 20; i++) {
    const session = await prisma.attendanceSession.create({
      data: {
        courseId: courseWebDev.id,
        facultyId: faculty2.id,
        section: 'A',
        date: new Date(2026, 1, i),
        topic: `Web Dev Lab ${i}`,
      },
    });

    const isPresent = i <= 18; // 18/20 = 90%
    await prisma.attendanceRecord.create({
      data: {
        sessionId: session.id,
        studentId: student1.id,
        status: isPresent ? 'PRESENT' : 'ABSENT',
      },
    });
  }

  // OS (45%)
  for (let i = 1; i <= 20; i++) {
    const session = await prisma.attendanceSession.create({
      data: {
        courseId: courseOS.id,
        facultyId: faculty1.id,
        section: 'A',
        date: new Date(2026, 1, i),
        topic: `OS Topic ${i}`,
      },
    });

    const isPresent = i <= 9; // 9/20 = 45%
    await prisma.attendanceRecord.create({
      data: {
        sessionId: session.id,
        studentId: student1.id,
        status: isPresent ? 'PRESENT' : (i === 10 ? 'EXCUSED' : 'ABSENT'),
      },
    });
  }

  // 9. Assignments (12 total, with pending assignments)
  const assign1 = await prisma.assignment.create({
    data: {
      courseId: courseDSA.id,
      facultyId: faculty1.id,
      title: 'Graph Traversal & Shortest Path Implementation',
      description: 'Implement Dijkstra and A* pathfinding algorithm in C++ / Java with comprehensive test cases.',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  const assign2 = await prisma.assignment.create({
    data: {
      courseId: courseDBMS.id,
      facultyId: faculty2.id,
      title: 'Database Normalization & B+ Tree Indexing Case Study',
      description: 'Normalize an unnormalized e-commerce schema to BCNF and explain indexing tradeoffs.',
      maxMarks: 50,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  const assign3 = await prisma.assignment.create({
    data: {
      courseId: courseWebDev.id,
      facultyId: faculty2.id,
      title: 'React & Tailwind Single-Page Application',
      description: 'Build a fully responsive component-driven dashboard adhering to accessibility and state rules.',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  for (let k = 4; k <= 12; k++) {
    await prisma.assignment.create({
      data: {
        courseId: allCourses[k % allCourses.length].id,
        facultyId: faculty1.id,
        title: `Academic Assignment ${k} - Practical Exercise`,
        description: `Comprehensive practice set covering course modules with submission instructions.`,
        maxMarks: 100,
        dueDate: new Date(Date.now() + (k * 2) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 10. Exams (matching mockup: May 25 Data Structures, May 28 DBMS, Jun 02 Operating Systems)
  const midTermExam = await prisma.exam.create({
    data: {
      academicYearId: academicYear.id,
      semesterId: sem4.id,
      name: 'Mid Semester Examination 2026',
      type: 'MID_TERM',
      startDate: new Date('2026-05-25'),
      endDate: new Date('2026-06-05'),
      status: 'PUBLISHED',
    },
  });

  const finalExam = await prisma.exam.create({
    data: {
      academicYearId: academicYear.id,
      semesterId: sem4.id,
      name: 'End Semester Theory & Practical Examination',
      type: 'FINAL',
      startDate: new Date('2026-06-20'),
      endDate: new Date('2026-07-05'),
      status: 'SUBMITTED',
    },
  });

  // Exam Marks for John Doe
  await prisma.mark.create({
    data: {
      examId: midTermExam.id,
      courseId: courseDSA.id,
      studentId: student1.id,
      facultyId: faculty1.id,
      internalMarks: 28,
      externalMarks: 62,
      totalMarks: 90,
      grade: 'A+',
      remarks: 'Outstanding analytical skills',
    },
  });

  await prisma.mark.create({
    data: {
      examId: midTermExam.id,
      courseId: courseDBMS.id,
      studentId: student1.id,
      facultyId: faculty2.id,
      internalMarks: 25,
      externalMarks: 58,
      totalMarks: 83,
      grade: 'A',
      remarks: 'Good understanding of relational schemas',
    },
  });

  // 11. Placement Companies & Drives
  const companyGoogle = await prisma.company.create({
    data: {
      name: 'Google LLC',
      website: 'https://careers.google.com',
      industry: 'Software & Technology',
      description: 'Global technology leader specializing in search, cloud computing, software, and hardware.',
    },
  });

  const companyMicrosoft = await prisma.company.create({
    data: {
      name: 'Microsoft Corporation',
      website: 'https://careers.microsoft.com',
      industry: 'Cloud & Enterprise Software',
      description: 'Empowering every person and organization on the planet to achieve more.',
    },
  });

  const companyInfosys = await prisma.company.create({
    data: {
      name: 'Infosys Limited',
      website: 'https://infosys.com',
      industry: 'IT Consulting & Services',
      description: 'Next-generation digital services and consulting.',
    },
  });

  const driveGoogle = await prisma.placementDrive.create({
    data: {
      companyId: companyGoogle.id,
      title: 'Software Development Engineer - Campus 2026',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      packageLpa: 28.5,
      location: 'Bangalore / Hyderabad',
      description: 'Design, test, deploy, and maintain large-scale distributed cloud systems.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  });

  await prisma.placementEligibilityRule.create({
    data: {
      driveId: driveGoogle.id,
      minCgpa: 8.0,
      maxBacklogs: 0,
      allowedBranches: JSON.stringify(['CSE', 'IT', 'ECE']),
      graduationYear: '2027',
      requiredSkills: JSON.stringify(['Algorithms', 'Data Structures', 'C++', 'Java']),
    },
  });

  const driveMicrosoft = await prisma.placementDrive.create({
    data: {
      companyId: companyMicrosoft.id,
      title: 'Cloud Solutions Engineer - Azure Systems',
      jobRole: 'Cloud Engineer',
      packageLpa: 24.0,
      location: 'Hyderabad / Noida',
      description: 'Build enterprise cloud architectures and resilient microservice systems.',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  });

  await prisma.placementEligibilityRule.create({
    data: {
      driveId: driveMicrosoft.id,
      minCgpa: 7.5,
      maxBacklogs: 0,
      allowedBranches: JSON.stringify(['CSE', 'IT']),
      graduationYear: '2027',
    },
  });

  // Apply John Doe to Microsoft drive
  await prisma.placementApplication.create({
    data: {
      driveId: driveMicrosoft.id,
      studentId: student1.id,
      status: 'SHORTLISTED',
    },
  });

  // 12. Student Skills & Projects for John Doe
  await prisma.studentSkill.createMany({
    data: [
      { studentId: student1.id, name: 'React.js', category: 'TECHNICAL', proficiency: 'ADVANCED' },
      { studentId: student1.id, name: 'Node.js', category: 'TECHNICAL', proficiency: 'ADVANCED' },
      { studentId: student1.id, name: 'TypeScript', category: 'TECHNICAL', proficiency: 'ADVANCED' },
      { studentId: student1.id, name: 'PostgreSQL', category: 'TECHNICAL', proficiency: 'INTERMEDIATE' },
      { studentId: student1.id, name: 'Data Structures', category: 'TECHNICAL', proficiency: 'EXPERT' },
      { studentId: student1.id, name: 'Problem Solving', category: 'SOFT_SKILL', proficiency: 'EXPERT' },
    ],
  });

  await prisma.studentProject.create({
    data: {
      studentId: student1.id,
      title: 'Distributed Cloud Task Orchestrator',
      description: 'High-throughput asynchronous job processing queue built using Redis, Node.js and TypeScript with load balancing.',
      technologies: 'Node.js, TypeScript, Redis, Docker',
      githubUrl: 'https://github.com/johndoe/task-orchestrator',
    },
  });

  // 13. Notices & Announcements (matching mockup cards)
  await prisma.notice.create({
    data: {
      institutionId: institution.id,
      authorId: adminUser.id,
      title: 'Mid Semester Exam Schedule',
      content: 'Mid semester exams will begin from May 25, 2024. Check the exam schedule for more details.',
      category: 'EXAM',
      priority: 'HIGH',
      targetAudience: 'ALL',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  await prisma.notice.create({
    data: {
      institutionId: institution.id,
      authorId: faculty1User.id,
      title: 'Assignment Submission',
      content: 'Programming assignment 3 is due on May 20, 2024. Make sure to submit before the deadline.',
      category: 'ACADEMIC',
      priority: 'NORMAL',
      targetAudience: 'STUDENT',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  await prisma.notice.create({
    data: {
      institutionId: institution.id,
      authorId: hodUser.id,
      title: 'Workshop on AI/ML',
      content: 'Join our upcoming workshop on Artificial Intelligence and Machine Learning featuring industry keynote speakers.',
      category: 'EVENT',
      priority: 'NORMAL',
      targetAudience: 'ALL',
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    },
  });

  // 14. Campus Events
  const eventHackathon = await prisma.event.create({
    data: {
      institutionId: institution.id,
      title: 'CampusOS Hack-a-Sprint 2026',
      description: '36-hour national hackathon on AI, Decentralized Systems, and Cloud Scale.',
      category: 'HACKATHON',
      venue: 'Auditorium Hall A & Virtual',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      capacity: 150,
      registeredCount: 42,
    },
  });

  await prisma.eventRegistration.create({
    data: {
      eventId: eventHackathon.id,
      userId: student1User.id,
      status: 'REGISTERED',
    },
  });

  // 15. Student Requests
  await prisma.request.create({
    data: {
      userId: student1User.id,
      type: 'BONAFIDE_CERTIFICATE',
      title: 'Bonafide Certificate for National Passport Application',
      description: 'Kindly issue a bonafide letter verifying active enrollment in 4th Semester B.Tech CSE.',
      status: 'APPROVED',
      adminRemarks: 'Approved. Signed copy ready for pickup at Academic Section Counter 3.',
      reviewedById: adminUser.id,
      reviewedAt: new Date(),
    },
  });

  // 16. In-App Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student1User.id,
        title: 'New Assignment Published',
        message: 'Graph Traversal & Shortest Path is now open for submission in CSE 201.',
        type: 'DEADLINE',
      },
      {
        userId: student1User.id,
        title: 'Placement Drive Application Shortlisted',
        message: 'Congratulations! Your profile was shortlisted for Microsoft Cloud Solutions Engineer.',
        type: 'PLACEMENT',
      },
      {
        userId: student1User.id,
        title: 'Bonafide Certificate Request Approved',
        message: 'Your bonafide certificate request has been approved by the Administration.',
        type: 'SUCCESS',
      },
    ],
  });

  // 17. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      institutionId: institution.id,
      actorId: adminUser.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'Institution',
      entityId: institution.id,
      details: JSON.stringify({ version: '1.0.0', seed: true }),
    },
  });

  console.log('✅ CampusOS Database successfully seeded!');
  console.log('----------------------------------------------------');
  console.log('🔑 DEMO CREDENTIALS:');
  console.log('• Admin:            admin@campusos.edu    / Admin@123');
  console.log('• Dept Head (CSE):  hod.cse@campusos.edu   / Faculty@123');
  console.log('• Faculty (CSE):    prof.sharma@campusos.edu / Faculty@123');
  console.log('• Placement Officer: placement@campusos.edu / Placement@123');
  console.log('• Student (John Doe): john.doe@campusos.edu / Student@123');
  console.log('• Student (Ananya):  ananya.sen@campusos.edu / Student@123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
