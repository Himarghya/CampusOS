import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class AcademicService {
  // Academic Years
  static async getAcademicYears() {
    return prisma.academicYear.findMany({ orderBy: { startDate: 'desc' } });
  }

  static async createAcademicYear(data: { year: string; startDate: string; endDate: string; isCurrent?: boolean }) {
    const inst = await prisma.institution.findFirst();
    if (!inst) throw new AppError('No institution found', 400, 'NO_INSTITUTION');

    if (data.isCurrent) {
      await prisma.academicYear.updateMany({
        where: { institutionId: inst.id },
        data: { isCurrent: false },
      });
    }

    return prisma.academicYear.create({
      data: {
        institutionId: inst.id,
        year: data.year,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: data.isCurrent || false,
      },
    });
  }

  // Programs & Semesters
  static async getPrograms() {
    return prisma.program.findMany({
      include: { department: true, semesters: true },
      orderBy: { name: 'asc' },
    });
  }

  static async getSemesters(programId?: string) {
    const where = programId ? { programId } : {};
    return prisma.semester.findMany({
      where,
      include: { program: true, academicYear: true },
      orderBy: { number: 'asc' },
    });
  }

  // Courses
  static async getCourses(params: { departmentId?: string; programId?: string; search?: string }) {
    const where: any = {};
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.programId) where.programId = params.programId;
    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { name: { contains: params.search } },
      ];
    }

    return prisma.course.findMany({
      where,
      include: {
        department: true,
        program: true,
        semester: true,
        assignments: {
          include: { faculty: { include: { user: true } } },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  static async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        program: true,
        semester: true,
        assignments: {
          include: { faculty: { include: { user: true } } },
        },
        enrollments: {
          include: { student: { include: { user: true } } },
        },
        homeworkAssignments: true,
      },
    });
    if (!course) throw new AppError('Course not found', 404, 'NOT_FOUND');
    return course;
  }

  static async createCourse(data: {
    departmentId: string;
    programId: string;
    semesterId?: string;
    name: string;
    code: string;
    credits: number;
    type?: string;
    description?: string;
    facultyId?: string;
  }) {
    const existing = await prisma.course.findUnique({ where: { code: data.code.toUpperCase().trim() } });
    if (existing) throw new AppError('Course with this code already exists', 409, 'COURSE_CODE_EXISTS');

    return prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          departmentId: data.departmentId,
          programId: data.programId,
          semesterId: data.semesterId,
          name: data.name,
          code: data.code.toUpperCase().trim(),
          credits: Number(data.credits) || 3,
          type: data.type || 'THEORY',
          description: data.description,
        },
      });

      if (data.facultyId) {
        await tx.courseAssignment.create({
          data: {
            courseId: course.id,
            facultyId: data.facultyId,
            section: 'A',
            isPrimary: true,
          },
        });
      }

      return course;
    });
  }

  // Enrollments
  static async enrollStudent(data: {
    studentId: string;
    courseId: string;
    academicYearId: string;
    semesterId: string;
    section?: string;
  }) {
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId_semesterId: {
          studentId: data.studentId,
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
      },
    });
    if (existing) throw new AppError('Student is already enrolled in this course for this semester', 409, 'ALREADY_ENROLLED');

    return prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        academicYearId: data.academicYearId,
        semesterId: data.semesterId,
        section: data.section || 'A',
      },
      include: { course: true, student: { include: { user: true } } },
    });
  }

  static async getStudentEnrollments(studentId: string) {
    return prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            assignments: {
              include: { faculty: { include: { user: true } } },
            },
          },
        },
        semester: true,
        academicYear: true,
      },
    });
  }

  // Disciplines & Programs mapping (matches EduPortal specifications)
  static async getDisciplines() {
    return [
      {
        id: 'disc-mt',
        name: 'Mechatronics',
        code: 'MT',
        programmes: ['M.Tech MT'],
      },
      {
        id: 'disc-des',
        name: 'Design',
        code: 'Des.',
        programmes: ['B.Design', 'M.Des Design', 'M.Des', 'Ph.D. (Design)'],
      },
      {
        id: 'disc-sm',
        name: 'Smart Manufacturing',
        code: 'SM',
        programmes: ['M.Tech SM', 'B.Tech SM', 'Ph.D. (Smart Manufacturing)'],
      },
      {
        id: 'disc-cse',
        name: 'Computer Science and Engineering',
        code: 'CSE',
        programmes: [
          'B.Tech CSE',
          'M.Tech CSE AI & ML',
          'M.Tech CSE Data Science',
          'Ph.D. (Computer Science & Engineering)',
        ],
      },
      {
        id: 'disc-me',
        name: 'Mechanical Engineering',
        code: 'ME',
        programmes: [
          'B.Tech ME',
          'M.Tech ME Design',
          'M.Tech ME CAD/CAM',
          'M.Tech ME Manufacturing and Automation',
          'Ph.D. (Mechanical Engineering)',
        ],
      },
      {
        id: 'disc-ece',
        name: 'Electronics and Communication Engineering',
        code: 'ECE',
        programmes: [
          'M.Tech ECE',
          'B.Tech ECE',
          'M.Tech ECE Power & Control',
          'M.Tech ECE Communication and Signal Processing',
          'M.Tech ECE Nanoelectronics and VLSI Design',
          'Ph.D. (Electronics & Communication Engineering)',
        ],
      },
      {
        id: 'disc-ns',
        name: 'Natural Sciences',
        code: 'NS',
        programmes: ['Ph.D. (Natural Sciences-Mathematics)', 'Ph.D. (Natural Sciences-Physics)'],
      },
      {
        id: 'disc-la',
        name: 'Liberal Arts',
        code: 'LA',
        programmes: ['Ph.D. (Liberal Arts-English)'],
      },
    ];
  }

  // Student Credit Standing Breakdown (matching EduPortal UI)
  static async getCreditStanding(studentId?: string) {
    return {
      currentSemester: 4,
      degree: 'B.Tech Computer Science and Engineering',
      rollNumber: '2022BCS0042',
      creditsEarned: 80,
      regularCredits: 80,
      backlogCredits: 0,
      swayamCredits: 0,
      semesterBreakdown: [
        { semester: 'Semester 1', creditsEarned: 17, regularCredits: 17, backlog: 0, sgpa: 8.5 },
        { semester: 'Semester 2', creditsEarned: 17, regularCredits: 17, backlog: 0, sgpa: 8.6 },
        { semester: 'Semester 3', creditsEarned: 21, regularCredits: 21, backlog: 0, sgpa: 8.8 },
        { semester: 'Semester 4', creditsEarned: 25, regularCredits: 25, backlog: 0, sgpa: 8.9 },
      ],
      degreeRequirements: {
        totalRequired: 160,
        totalCompleted: 80,
        categories: [
          { name: 'Program Core (PC)', required: 96, completed: 72 },
          { name: 'Discipline Electives (DE)', required: 24, completed: 8 },
          { name: 'Open Electives (OE)', required: 16, completed: 0 },
          { name: 'Engineering Sciences & Math', required: 16, completed: 16 },
          { name: 'Swayam / Online MOOCs', required: 8, completed: 0 },
        ],
      },
    };
  }

  // Registration & Pre-registration Offerings
  static async getRegistrationOfferings(semesterNumber = 5) {
    return {
      semester: semesterNumber,
      academicYear: '2026-2027',
      status: 'OPEN',
      deadline: '2026-06-15T23:59:59Z',
      minCredits: 16,
      maxCredits: 24,
      offerings: {
        core: [
          {
            id: 'cs501',
            code: 'CS301',
            name: 'Database Management Systems',
            credits: 4,
            type: 'CORE',
            faculty: 'Dr. Sarah Connor',
            slot: 'Slot A (Mon/Wed 09:00 - 10:30)',
            prerequisites: ['CS201 Data Structures'],
          },
          {
            id: 'cs502',
            code: 'CS302',
            name: 'Design and Analysis of Algorithms',
            credits: 4,
            type: 'CORE',
            faculty: 'Prof. Alan Turing',
            slot: 'Slot B (Tue/Thu 10:30 - 12:00)',
            prerequisites: ['CS201 Data Structures', 'MA201 Discrete Math'],
          },
          {
            id: 'cs503',
            code: 'CS303',
            name: 'Computer Networks',
            credits: 4,
            type: 'CORE',
            faculty: 'Dr. Leonard Kleinrock',
            slot: 'Slot C (Mon/Wed 14:00 - 15:30)',
            prerequisites: ['CS204 Computer Architecture'],
          },
        ],
        disciplineElectives: [
          {
            id: 'cs511',
            code: 'CS411',
            name: 'Artificial Intelligence & Intelligent Agents',
            credits: 3,
            type: 'ELECTIVE',
            faculty: 'Prof. Geoffrey Hinton',
            slot: 'Slot D (Tue/Thu 14:00 - 15:30)',
            prerequisites: ['CS201 Data Structures'],
          },
          {
            id: 'cs512',
            code: 'CS412',
            name: 'Cloud Computing & Distributed Systems',
            credits: 3,
            type: 'ELECTIVE',
            faculty: 'Dr. Werner Vogels',
            slot: 'Slot E (Wed/Fri 10:30 - 12:00)',
            prerequisites: ['CS202 Operating Systems'],
          },
          {
            id: 'cs513',
            code: 'CS413',
            name: 'Cryptography and Cyber Security',
            credits: 3,
            type: 'ELECTIVE',
            faculty: 'Dr. Ronald Rivest',
            slot: 'Slot F (Tue/Fri 16:00 - 17:30)',
            prerequisites: ['MA201 Discrete Math'],
          },
        ],
        openElectives: [
          {
            id: 'oe501',
            code: 'MG301',
            name: 'Engineering Economics and Finance',
            credits: 3,
            type: 'OPEN_ELECTIVE',
            faculty: 'Dr. Raghuram Rajan',
            slot: 'Slot G (Mon/Thu 16:00 - 17:30)',
            prerequisites: [],
          },
          {
            id: 'oe502',
            code: 'DES301',
            name: 'Design Thinking and Product Innovation',
            credits: 3,
            type: 'OPEN_ELECTIVE',
            faculty: 'Prof. Don Norman',
            slot: 'Slot H (Wed/Fri 14:00 - 15:30)',
            prerequisites: [],
          },
        ],
      },
    };
  }

  // Backlog and Improvement Courses
  static async getBacklogCourses(studentId?: string) {
    return [
      {
        id: 'backlog-1',
        courseCode: 'CS201',
        courseName: 'Data Structures and Algorithms',
        originalSemester: 'Semester 3',
        credits: 4,
        type: 'BACKLOG',
        gradeObtained: 'F',
        examFee: 500,
        status: 'ELIGIBLE_FOR_REGISTRATION',
      },
      {
        id: 'backlog-2',
        courseCode: 'MA201',
        courseName: 'Discrete Mathematical Structures',
        originalSemester: 'Semester 3',
        credits: 4,
        type: 'IMPROVEMENT',
        gradeObtained: 'P',
        examFee: 500,
        status: 'ELIGIBLE_FOR_IMPROVEMENT',
      },
      {
        id: 'backlog-3',
        courseCode: 'EC201',
        courseName: 'Digital Electronics Lab',
        originalSemester: 'Semester 2',
        credits: 2,
        type: 'BACKLOG',
        gradeObtained: 'F',
        examFee: 350,
        status: 'ELIGIBLE_FOR_REGISTRATION',
      },
    ];
  }

  // Timetable
  static async getStudentTimetable(studentId?: string) {
    return {
      semester: 4,
      days: [
        {
          day: 'Monday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS201', name: 'Data Structures', room: 'CR-204', faculty: 'Dr. Sarah Connor', type: 'LECTURE' },
            { time: '10:00 - 11:00', code: 'CS202', name: 'Operating Systems', room: 'CR-204', faculty: 'Prof. Alan Turing', type: 'LECTURE' },
            { time: '11:15 - 12:15', code: 'CS203', name: 'Web Technologies', room: 'CR-205', faculty: 'Dr. Tim Berners-Lee', type: 'LECTURE' },
            { time: '14:00 - 16:30', code: 'CS201L', name: 'DSA Lab', room: 'LAB-02', faculty: 'Dr. Sarah Connor', type: 'LAB' },
          ],
        },
        {
          day: 'Tuesday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS204', name: 'Computer Architecture', room: 'CR-204', faculty: 'Dr. John Hennessy', type: 'LECTURE' },
            { time: '10:00 - 11:00', code: 'MA201', name: 'Discrete Mathematics', room: 'CR-204', faculty: 'Prof. David Hilbert', type: 'LECTURE' },
            { time: '11:15 - 12:15', code: 'CS202', name: 'Operating Systems', room: 'CR-204', faculty: 'Prof. Alan Turing', type: 'LECTURE' },
            { time: '14:00 - 16:30', code: 'CS202L', name: 'OS Systems Lab', room: 'LAB-04', faculty: 'Prof. Alan Turing', type: 'LAB' },
          ],
        },
        {
          day: 'Wednesday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS201', name: 'Data Structures', room: 'CR-204', faculty: 'Dr. Sarah Connor', type: 'LECTURE' },
            { time: '10:00 - 11:00', code: 'CS203', name: 'Web Technologies', room: 'CR-205', faculty: 'Dr. Tim Berners-Lee', type: 'LECTURE' },
            { time: '11:15 - 12:15', code: 'CS204', name: 'Computer Architecture', room: 'CR-204', faculty: 'Dr. John Hennessy', type: 'LECTURE' },
            { time: '14:00 - 15:30', code: 'CS203T', name: 'Web Tech Tutorial', room: 'CR-102', faculty: 'Dr. Tim Berners-Lee', type: 'TUTORIAL' },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            { time: '09:00 - 10:00', code: 'MA201', name: 'Discrete Mathematics', room: 'CR-204', faculty: 'Prof. David Hilbert', type: 'LECTURE' },
            { time: '10:00 - 11:00', code: 'CS202', name: 'Operating Systems', room: 'CR-204', faculty: 'Prof. Alan Turing', type: 'LECTURE' },
            { time: '11:15 - 12:15', code: 'CS201', name: 'Data Structures', room: 'CR-204', faculty: 'Dr. Sarah Connor', type: 'LECTURE' },
            { time: '14:00 - 16:30', code: 'CS203L', name: 'Full-Stack Web Lab', room: 'LAB-01', faculty: 'Dr. Tim Berners-Lee', type: 'LAB' },
          ],
        },
        {
          day: 'Friday',
          slots: [
            { time: '09:00 - 10:00', code: 'CS204', name: 'Computer Architecture', room: 'CR-204', faculty: 'Dr. John Hennessy', type: 'LECTURE' },
            { time: '10:00 - 11:00', code: 'CS203', name: 'Web Technologies', room: 'CR-205', faculty: 'Dr. Tim Berners-Lee', type: 'LECTURE' },
            { time: '11:15 - 12:15', code: 'MA201', name: 'Discrete Math Tutorial', room: 'CR-204', faculty: 'Prof. David Hilbert', type: 'TUTORIAL' },
            { time: '14:00 - 16:00', code: 'SEM401', name: 'Technical Seminar & Projects', room: 'AUDITORIUM-2', faculty: 'Dept Faculty Panel', type: 'SEMINAR' },
          ],
        },
      ],
    };
  }
}
