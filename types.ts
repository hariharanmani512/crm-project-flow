export enum UserRole {
  Admin = 'Admin',
  Counselor = 'Counselor',
  Telecaller = 'Telecaller',
  Manager = 'Manager',
  Director = 'Director',
  Student = 'Student',
}

export interface PermissionSet {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface Profile {
  id: number;
  name: string;
  canSwitchGlobalContext: boolean;
  permissions: {
    dashboard: PermissionSet;
    contacts: PermissionSet;
    leads: PermissionSet;
    students: PermissionSet; // New Permission
    tasks: PermissionSet;
    settings: PermissionSet;
  };
}

export interface Team {
  id: number;
  name: string;
  managerId: number;
  memberIds: number[];
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar: string;
  profileId: number;
  teamId: number;
}

export interface Screen {
    id: 'dashboard' | 'leads' | 'contacts' | 'students' | 'tasks' | 'settings';
    title: string;
    icon: React.ComponentType<{ className?: string }>;
}

export enum LeadStatus {
    New = 'New',
    Contacted = 'Contacted',
    Qualified = 'Qualified', // This is the "Enquiry" stage
    Lost = 'Lost',
    Converted = 'Converted',
}

export interface Institution {
    id: number;
    name: string;
}

export interface AcademicYear {
    id: number;
    name: string; // e.g., "2024-2025"
}

export interface AcademicSession {
    id: number;
    name: string; // e.g., "Fall 2024 Intake"
    academicYearId: number;
}

export interface Activity {
    id: number;
    date: string;
    type: 'Call' | 'Email' | 'Note' | 'Meeting';
    notes: string;
    createdBy: string;
}


export interface Lead {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: LeadStatus;
    source: string;
    assignedTo: User;
    lastContacted: string;
    enquiryFor: string;
    institution: Institution;
    academicYear: AcademicYear;
    academicSession: AcademicSession;
    activities: Activity[]; // Added activities to Lead
}

export interface Contact {
    id: number;
    name: string;
    phone: string;
    email: string;
    createdDate: string;
    institution: Institution;
    academicYear: AcademicYear;
    academicSession: AcademicSession;
    activities: Activity[];
}

export interface Task {
    id: number;
    subject: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    assignedTo: User;
    relatedTo: {
        type: 'Contact' | 'Lead';
        id: number;
        name: string;
    }
}

// NEW TYPES FOR STUDENT & FEE MANAGEMENT
export interface Course {
    id: number;
    name: string;
    duration: string; // e.g., "2 Years"
}

export interface FeeStructure {
    id: number;
    name: string; // e.g., "MBA 2024-2025 Full Fee"
    totalAmount: number;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    phone: string;
    admissionDate: string;
    course: Course;
    institution: Institution;
    academicYear: AcademicYear;
    academicSession: AcademicSession;
    originalLeadId: number;
    feeDetails: {
        structure: FeeStructure | null;
        paidAmount: number;
        balance: number;
    };
}