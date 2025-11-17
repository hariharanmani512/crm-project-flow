import React, { useState, useCallback, useMemo } from 'react';
import { User, UserRole, Screen, Profile, Team, Lead, LeadStatus, Contact, Student, Course, FeeStructure, Institution, AcademicYear, AcademicSession } from './types';
import { MOCK_USERS, MOCK_PROFILES, MOCK_TEAMS, SCREENS, MOCK_LEADS, MOCK_CONTACTS, MOCK_STUDENTS, MOCK_COURSES, MOCK_FEE_STRUCTURES, MOCK_INSTITUTIONS, MOCK_ACADEMIC_YEARS, MOCK_ACADEMIC_SESSIONS } from './constants';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LeadsScreen from './screens/LeadsScreen';
import ContactsScreen from './screens/ContactsScreen';
import SettingsScreen from './screens/SettingsScreen';
import TasksScreen from './screens/TasksScreen';
import StudentsScreen from './screens/StudentsScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [currentUserTeam, setCurrentUserTeam] = useState<Team | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(SCREENS.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Centralized state for data - now fully dynamic
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(MOCK_FEE_STRUCTURES);
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(MOCK_ACADEMIC_YEARS);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>(MOCK_ACADEMIC_SESSIONS);


  // State for Global Context
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>(institutions[0]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear>(academicYears[0]);
  const [selectedAcademicSession, setSelectedAcademicSession] = useState<AcademicSession>(academicSessions.find(s => s.academicYearId === academicYears[0].id)!);

  const handleLogin = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      const profile = MOCK_PROFILES.find(p => p.id === user.profileId);
      const team = MOCK_TEAMS.find(t => t.id === user.teamId);
      setCurrentUser(user);
      setCurrentUserProfile(profile || null);
      setCurrentUserTeam(team || null);
      setIsAuthenticated(true);
      setCurrentScreen(SCREENS.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserProfile(null);
    setCurrentUserTeam(null);
    setIsAuthenticated(false);
  };

  const handleConvertLead = (leadId: number) => {
    const leadToConvert = leads.find(l => l.id === leadId);
    if (!leadToConvert) return;

    // 1. Update lead status
    const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status: LeadStatus.Converted } : l);
    setLeads(updatedLeads);

    // 2. Create a new student
    const newStudent: Student = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name: leadToConvert.name,
        email: leadToConvert.email,
        phone: leadToConvert.phone,
        admissionDate: new Date().toISOString().split('T')[0],
        course: MOCK_COURSES.find(c => leadToConvert.enquiryFor.includes(c.name)) || MOCK_COURSES[0],
        institution: leadToConvert.institution,
        academicYear: leadToConvert.academicYear,
        academicSession: leadToConvert.academicSession,
        originalLeadId: leadToConvert.id,
        feeDetails: {
            structure: null,
            paidAmount: 0,
            balance: 0,
        }
    };
    setStudents([newStudent, ...students]);

    // 3. Create a new user for the student
    const studentProfile = MOCK_PROFILES.find(p => p.name === 'Student Profile');
    if (studentProfile) {
        const newStudentUser: User = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name: newStudent.name,
            role: UserRole.Student,
            avatar: `https://i.pravatar.cc/150?u=${newStudent.email}`,
            profileId: studentProfile.id,
            teamId: 0, // No team for students
        };
        setUsers([...users, newStudentUser]);
    }
    
    // 4. FIX: Switch global context to the new student's context
    setSelectedInstitution(leadToConvert.institution);
    setSelectedAcademicYear(leadToConvert.academicYear);
    setSelectedAcademicSession(leadToConvert.academicSession);
    
    alert(`${leadToConvert.name} has been converted to a student and a user account has been created!`);
    navigate(SCREENS.STUDENTS);
  };

  const handleMoveContactToLead = (contact: Contact) => {
    if(!currentUser) return;
    const newLead: Lead = {
      id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      status: LeadStatus.New,
      source: 'From Contact',
      assignedTo: currentUser,
      lastContacted: new Date().toISOString().split('T')[0],
      enquiryFor: 'Not Specified',
      institution: contact.institution,
      academicYear: contact.academicYear,
      academicSession: contact.academicSession,
      activities: [{
        id: 1,
        date: new Date().toISOString().split('T')[0],
        type: 'Note',
        notes: `Lead created from contact by ${currentUser.name}.`,
        createdBy: currentUser.name
      }]
    };
    setLeads([newLead, ...leads]);
    alert(`${contact.name} has been moved to Leads.`);
    navigate(SCREENS.LEADS);
  };
  
  // --- NEW HANDLERS FOR DYNAMIC DATA ---
  const handleCreateInstitution = (newInstitutionData: Omit<Institution, 'id'>) => {
    const newInstitution: Institution = {
        id: institutions.length > 0 ? Math.max(...institutions.map(i => i.id)) + 1 : 1,
        ...newInstitutionData
    };
    setInstitutions([...institutions, newInstitution]);
    alert(`Institution "${newInstitution.name}" has been created.`);
  };

  const handleCreateAcademicYear = (newYearData: Omit<AcademicYear, 'id'>) => {
    const newYear: AcademicYear = {
        id: academicYears.length > 0 ? Math.max(...academicYears.map(y => y.id)) + 1 : 1,
        ...newYearData
    };
    setAcademicYears([...academicYears, newYear]);
    alert(`Academic Year "${newYear.name}" has been created.`);
  };
  
  const handleCreateAcademicSession = (newSessionData: Omit<AcademicSession, 'id'>) => {
    const newSession: AcademicSession = {
        id: academicSessions.length > 0 ? Math.max(...academicSessions.map(s => s.id)) + 1 : 1,
        ...newSessionData
    };
    setAcademicSessions([...academicSessions, newSession]);
    alert(`Academic Session "${newSession.name}" has been created.`);
  };

  const handleCreateFeeStructure = (newFeeStructureData: Omit<FeeStructure, 'id'>) => {
    const newFeeStructure: FeeStructure = {
      id: feeStructures.length > 0 ? Math.max(...feeStructures.map(fs => fs.id)) + 1 : 1,
      ...newFeeStructureData
    };
    setFeeStructures([newFeeStructure, ...feeStructures]);
    alert(`Fee Structure "${newFeeStructure.name}" has been created.`);
  };

  const navigate = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const filteredData = useMemo(() => {
    const filterItem = (item: Lead | Contact | Student) => {
        const institutionMatch = !selectedInstitution || item.institution.id === selectedInstitution.id;
        const yearMatch = !selectedAcademicYear || item.academicYear.id === selectedAcademicYear.id;
        const sessionMatch = !selectedAcademicSession || item.academicSession.id === selectedAcademicSession.id;
        return institutionMatch && yearMatch && sessionMatch;
    };
    return {
        leads: leads.filter(filterItem),
        contacts: contacts.filter(filterItem),
        students: students.filter(filterItem),
    };
  }, [leads, contacts, students, selectedInstitution, selectedAcademicYear, selectedAcademicSession]);


  const renderScreen = () => {
    if (!currentUser || !currentUserProfile) return null;

    switch (currentScreen.id) {
      case 'dashboard':
        return <DashboardScreen navigate={navigate} currentUser={currentUser} leads={filteredData.leads} students={filteredData.students} />;
      case 'leads':
        return <LeadsScreen
                    currentUser={currentUser}
                    currentUserProfile={currentUserProfile}
                    currentUserTeam={currentUserTeam}
                    leads={filteredData.leads}
                    onUpdateLeads={setLeads}
                    onConvertLead={handleConvertLead}
                />;
      case 'contacts':
        return <ContactsScreen
                    currentUserProfile={currentUserProfile}
                    contacts={filteredData.contacts}
                    onUpdateContacts={setContacts}
                    onMoveToLead={handleMoveContactToLead}
                    institutions={institutions}
                    academicYears={academicYears}
                    academicSessions={academicSessions}
                />;
      case 'students':
        return <StudentsScreen
                    currentUserProfile={currentUserProfile}
                    students={filteredData.students}
                    onUpdateStudents={setStudents}
                    feeStructures={feeStructures}
                />;
      case 'tasks':
        // Note: Tasks are not filtered by context for now as they don't have inst/year fields
        return <TasksScreen currentUser={currentUser} currentUserProfile={currentUserProfile} currentUserTeam={currentUserTeam}/>;
      case 'settings':
        if (!currentUserProfile.permissions.settings.read) {
            return <div className="p-4">You do not have permission to access this page.</div>;
        }
        return <SettingsScreen
                    allUsers={users}
                    // Fee Structures
                    feeStructures={feeStructures}
                    onCreateFeeStructure={handleCreateFeeStructure}
                    // Institutions
                    institutions={institutions}
                    onCreateInstitution={handleCreateInstitution}
                    // Academic Years
                    academicYears={academicYears}
                    onCreateAcademicYear={handleCreateAcademicYear}
                    // Academic Sessions
                    academicSessions={academicSessions}
                    onCreateAcademicSession={handleCreateAcademicSession}
                />;
      default:
        return <DashboardScreen navigate={navigate} currentUser={currentUser} leads={filteredData.leads} students={filteredData.students} />;
    }
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-neutral-100 font-sans text-neutral-800">
      <Sidebar 
        currentScreenId={currentScreen.id} 
        navigate={navigate} 
        userProfile={currentUserProfile!}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          screenTitle={currentScreen.title} 
          user={currentUser}
          userProfile={currentUserProfile}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          // Context Switcher Props
          institutions={institutions}
          academicYears={academicYears}
          academicSessions={academicSessions}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
          selectedAcademicYear={selectedAcademicYear}
          setSelectedAcademicYear={setSelectedAcademicYear}
          selectedAcademicSession={selectedAcademicSession}
          setSelectedAcademicSession={setSelectedAcademicSession}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;