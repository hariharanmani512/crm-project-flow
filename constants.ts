import { UserRole, User, Screen, Lead, LeadStatus, Contact, Institution, AcademicYear, AcademicSession, Profile, Team, Task, Student, Course, FeeStructure } from './types';
import { LayoutDashboard, Users, Phone, FolderKan, Settings, UserCircle, School, ClipboardCheck, GraduationCap, DollarSign } from './components/icons/Icons';

export const USER_ROLES: UserRole[] = [
  UserRole.Admin,
  UserRole.Counselor,
  UserRole.Telecaller,
  UserRole.Manager,
  UserRole.Director,
];

// 1. PROFILES (Permission Sets)
export const MOCK_PROFILES: Profile[] = [
  {
    id: 1, name: "Admin Profile",
    canSwitchGlobalContext: true,
    permissions: {
      dashboard: { read: true, create: true, update: true, delete: true },
      contacts: { read: true, create: true, update: true, delete: true },
      leads: { read: true, create: true, update: true, delete: true },
      students: { read: true, create: true, update: true, delete: true },
      tasks: { read: true, create: true, update: true, delete: true },
      settings: { read: true, create: true, update: true, delete: true },
    }
  },
  {
    id: 2, name: "Manager Profile",
    canSwitchGlobalContext: true,
    permissions: {
      dashboard: { read: true, create: false, update: false, delete: false },
      contacts: { read: true, create: true, update: true, delete: true },
      leads: { read: true, create: true, update: true, delete: false },
      students: { read: true, create: false, update: true, delete: false },
      tasks: { read: true, create: true, update: true, delete: false },
      settings: { read: false, create: false, update: false, delete: false },
    }
  },
  {
    id: 3, name: "Counselor Profile",
    canSwitchGlobalContext: false,
    permissions: {
      dashboard: { read: true, create: false, update: false, delete: false },
      contacts: { read: true, create: true, update: true, delete: false },
      leads: { read: true, create: true, update: true, delete: false },
      students: { read: true, create: false, update: true, delete: false },
      tasks: { read: true, create: true, update: true, delete: false },
      settings: { read: false, create: false, update: false, delete: false },
    }
  },
   {
    id: 4, name: "Telecaller Profile",
    canSwitchGlobalContext: false,
    permissions: {
      dashboard: { read: true, create: false, update: false, delete: false },
      contacts: { read: true, create: true, update: false, delete: false },
      leads: { read: true, create: false, update: true, delete: false },
      students: { read: false, create: false, update: false, delete: false },
      tasks: { read: true, create: true, update: true, delete: false },
      settings: { read: false, create: false, update: false, delete: false },
    }
  },
  {
    id: 5, name: "Student Profile",
    canSwitchGlobalContext: false,
    permissions: {
      dashboard: { read: true, create: false, update: false, delete: false },
      contacts: { read: false, create: false, update: false, delete: false },
      leads: { read: false, create: false, update: false, delete: false },
      students: { read: true, create: false, update: false, delete: false },
      tasks: { read: true, create: false, update: false, delete: false },
      settings: { read: false, create: false, update: false, delete: false },
    }
  }
];

// 2. TEAMS
export const MOCK_TEAMS: Team[] = [
    { id: 1, name: "Admissions Team Alpha", managerId: 4, memberIds: [2, 3] },
    { id: 2, name: "Executive Team", managerId: 5, memberIds: [1, 4] }
];


// 3. USERS (with profileId and teamId)
export const MOCK_USERS: User[] = [
  { id: 1, name: 'Arun Kumar', role: UserRole.Admin, avatar: 'https://picsum.photos/seed/user1/100/100', profileId: 1, teamId: 2 },
  { id: 2, name: 'Priya Sharma', role: UserRole.Counselor, avatar: 'https://picsum.photos/seed/user2/100/100', profileId: 3, teamId: 1 },
  { id: 3, name: 'Rajesh Singh', role: UserRole.Telecaller, avatar: 'https://picsum.photos/seed/user3/100/100', profileId: 4, teamId: 1 },
  { id: 4, name: 'Sunita Menon', role: UserRole.Manager, avatar: 'https://picsum.photos/seed/user4/100/100', profileId: 2, teamId: 1 },
  { id: 5, name: 'Vikram Reddy', role: UserRole.Director, avatar: 'https://picsum.photos/seed/user5/100/100', profileId: 1, teamId: 2 },
];


export const MOCK_INSTITUTIONS: Institution[] = [
    { id: 1, name: 'Global Institute of Technology' },
    { id: 2, name: 'Future Leaders Business School' },
];

export const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
    { id: 1, name: '2024-2025' },
    { id: 2, name: '2025-2026' },
];

export const MOCK_ACADEMIC_SESSIONS: AcademicSession[] = [
    { id: 1, name: 'Fall 2024 Intake', academicYearId: 1 },
    { id: 2, name: 'Spring 2025 Intake', academicYearId: 1 },
    { id: 3, name: 'Fall 2025 Intake', academicYearId: 2 },
    { id: 4, name: 'Spring 2026 Intake', academicYearId: 2 },
];

export const MOCK_COURSES: Course[] = [
    { id: 1, name: 'B.Tech Computer Science', duration: '4 Years' },
    { id: 2, name: 'MBA General Management', duration: '2 Years' },
    { id: 3, name: 'Data Science Certification', duration: '6 Months' },
];

export const MOCK_FEE_STRUCTURES: FeeStructure[] = [
    { id: 1, name: 'B.Tech Annual Fee 2024', totalAmount: 150000 },
    { id: 2, name: 'MBA Full-Time Fee 2024', totalAmount: 400000 },
    { id: 3, name: 'Data Science Program Fee', totalAmount: 75000 },
];

export const SCREENS: { [key: string]: Screen } = {
  DASHBOARD: {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
  LEADS: {
    id: 'leads',
    title: 'Leads & Enquiries',
    icon: FolderKan,
  },
  CONTACTS: {
    id: 'contacts',
    title: 'Contacts',
    icon: Phone,
  },
  STUDENTS: {
    id: 'students',
    title: 'Students',
    icon: GraduationCap,
  },
  TASKS: {
    id: 'tasks',
    title: 'Tasks',
    icon: ClipboardCheck,
  },
  SETTINGS: {
    id: 'settings',
    title: 'Admin Settings',
    icon: Settings,
  },
};

export const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    name: 'Aisha Begum',
    phone: '+91 98765 43210',
    email: 'aisha.b@example.com',
    status: LeadStatus.New,
    source: 'Website',
    assignedTo: MOCK_USERS[1],
    lastContacted: '2024-07-20',
    enquiryFor: 'MBA Program',
    institution: MOCK_INSTITUTIONS[1],
    academicYear: MOCK_ACADEMIC_YEARS[0],
    academicSession: MOCK_ACADEMIC_SESSIONS[1],
    activities: [
      { id: 1, date: '2024-07-21', notes: 'Initial call, sent brochure.', type: 'Call', createdBy: 'Priya Sharma' }
    ]
  },
  {
    id: 2,
    name: 'Bhavin Patel',
    phone: '+91 91234 56789',
    email: 'bhavin.p@example.com',
    status: LeadStatus.Contacted,
    source: 'Referral',
    assignedTo: MOCK_USERS[2],
    lastContacted: '2024-07-19',
    enquiryFor: 'B.Tech CSE',
    institution: MOCK_INSTITUTIONS[0],
    academicYear: MOCK_ACADEMIC_YEARS[0],
    academicSession: MOCK_ACADEMIC_SESSIONS[0],
    activities: [
      { id: 1, date: '2024-07-19', notes: 'Spoke about curriculum, seems interested.', type: 'Call', createdBy: 'Rajesh Singh' },
      { id: 2, date: '2024-07-22', notes: 'Follow-up email sent with fee structure.', type: 'Email', createdBy: 'Rajesh Singh' }
    ]
  },
  {
    id: 3,
    name: 'Catherine D\'Souza',
    phone: '+91 99887 76655',
    email: 'catherine.d@example.com',
    status: LeadStatus.Qualified,
    source: 'Social Media',
    assignedTo: MOCK_USERS[1],
    lastContacted: '2024-07-22',
    enquiryFor: 'Data Science Certification',
    institution: MOCK_INSTITUTIONS[0],
    academicYear: MOCK_ACADEMIC_YEARS[1],
    academicSession: MOCK_ACADEMIC_SESSIONS[2],
    activities: [
       { id: 1, date: '2024-07-22', notes: 'Campus visit scheduled for this Friday.', type: 'Meeting', createdBy: 'Priya Sharma' }
    ]
  },
    {
    id: 4,
    name: 'David Raj',
    phone: '+91 90000 11111',
    email: 'david.r@example.com',
    status: LeadStatus.Converted,
    source: 'Education Fair',
    assignedTo: MOCK_USERS[1],
    lastContacted: '2024-07-15',
    enquiryFor: 'MBA Program',
    institution: MOCK_INSTITUTIONS[1],
    academicYear: MOCK_ACADEMIC_YEARS[0],
    academicSession: MOCK_ACADEMIC_SESSIONS[0],
    activities: [
      { id: 1, date: '2024-07-15', notes: 'Admission confirmed. Payment received.', type: 'Meeting', createdBy: 'Priya Sharma' }
    ]
  },
  {
    id: 5,
    name: 'Fathima Sheikh',
    phone: '+91 88888 22222',
    email: 'fathima.s@example.com',
    status: LeadStatus.Lost,
    source: 'Website',
    assignedTo: MOCK_USERS[2],
    lastContacted: '2024-07-18',
    enquiryFor: 'B.Tech CSE',
    institution: MOCK_INSTITUTIONS[0],
    academicYear: MOCK_ACADEMIC_YEARS[0],
    academicSession: MOCK_ACADEMIC_SESSIONS[0],
    activities: [
      { id: 1, date: '2024-07-18', notes: 'Joined another institute.', type: 'Call', createdBy: 'Rajesh Singh' }
    ]
  },
];

export const MOCK_CONTACTS: Contact[] = [
    {
        id: 1,
        name: 'Ganesh Iyer',
        phone: '+91 9876512345',
        email: 'ganesh.i@example.com',
        createdDate: '2024-07-10',
        institution: MOCK_INSTITUTIONS[0],
        academicYear: MOCK_ACADEMIC_YEARS[0],
        academicSession: MOCK_ACADEMIC_SESSIONS[0],
        activities: [
            { id: 1, date: '2024-07-10', type: 'Note', notes: 'Contact created from inbound web query.', createdBy: 'System' },
            { id: 2, date: '2024-07-11', type: 'Call', notes: 'Called and left a voicemail.', createdBy: 'Rajesh Singh' },
        ]
    },
    {
        id: 2,
        name: 'Harini Varma',
        phone: '+91 9123456780',
        email: 'harini.v@example.com',
        createdDate: '2024-07-11',
        institution: MOCK_INSTITUTIONS[1],
        academicYear: MOCK_ACADEMIC_YEARS[0],
        academicSession: MOCK_ACADEMIC_SESSIONS[1],
        activities: [
            { id: 1, date: '2024-07-11', type: 'Email', notes: 'Sent initial introductory email.', createdBy: 'Priya Sharma' },
        ]
    },
    {
        id: 3,
        name: 'Imran Khan',
        phone: '+91 9988776654',
        email: 'imran.k@example.com',
        createdDate: '2024-07-12',
        institution: MOCK_INSTITUTIONS[0],
        academicYear: MOCK_ACADEMIC_YEARS[1],
        academicSession: MOCK_ACADEMIC_SESSIONS[2],
        activities: []
    },
];

export const MOCK_STUDENTS: Student[] = [
    {
        id: 1,
        name: 'David Raj',
        email: 'david.r@example.com',
        phone: '+91 90000 11111',
        admissionDate: '2024-07-15',
        course: MOCK_COURSES[1], // MBA
        institution: MOCK_INSTITUTIONS[1],
        academicYear: MOCK_ACADEMIC_YEARS[0],
        academicSession: MOCK_ACADEMIC_SESSIONS[0],
        originalLeadId: 4,
        feeDetails: {
            structure: MOCK_FEE_STRUCTURES[1], // MBA Fee
            paidAmount: 200000,
            balance: 200000,
        }
    }
];


export const MOCK_TASKS: Task[] = [
    {
        id: 1,
        subject: 'Call Bhavin Patel for follow-up',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Not Started',
        assignedTo: MOCK_USERS[2], // Rajesh
        relatedTo: { type: 'Lead', id: 2, name: 'Bhavin Patel' }
    },
    {
        id: 2,
        subject: 'Send fee structure to Aisha Begum',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        status: 'Not Started',
        assignedTo: MOCK_USERS[1], // Priya
        relatedTo: { type: 'Lead', id: 1, name: 'Aisha Begum' }
    },
    {
        id: 3,
        subject: 'Prepare admission documents for David Raj',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Completed',
        assignedTo: MOCK_USERS[1], // Priya
        relatedTo: { type: 'Lead', id: 4, name: 'David Raj' }
    },
     {
        id: 4,
        subject: 'Initial call to Ganesh Iyer',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
        status: 'In Progress',
        assignedTo: MOCK_USERS[2], // Rajesh
        relatedTo: { type: 'Contact', id: 1, name: 'Ganesh Iyer' }
    },
];