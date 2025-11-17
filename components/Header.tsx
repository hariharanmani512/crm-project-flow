import React, { useState, useRef, useEffect } from 'react';
import { User, Profile, Institution, AcademicYear, AcademicSession } from '../types';
import { Bell, ChevronDown, LogOut, Menu, ChevronsUpDown } from './icons/Icons';

interface GlobalContextSwitcherProps {
  institutions: Institution[];
  academicYears: AcademicYear[];
  academicSessions: AcademicSession[];
  selectedInstitution: Institution;
  setSelectedInstitution: (institution: Institution) => void;
  selectedAcademicYear: AcademicYear;
  setSelectedAcademicYear: (year: AcademicYear) => void;
  selectedAcademicSession: AcademicSession;
  setSelectedAcademicSession: (session: AcademicSession) => void;
}

const GlobalContextSwitcher: React.FC<GlobalContextSwitcherProps> = ({
    institutions, academicYears, academicSessions,
    selectedInstitution, setSelectedInstitution,
    selectedAcademicYear, setSelectedAcademicYear,
    selectedAcademicSession, setSelectedAcademicSession
}) => {
    const availableSessions = academicSessions.filter(s => s.academicYearId === selectedAcademicYear.id);
    
    const handleYearChange = (yearId: number) => {
        const newYear = academicYears.find(y => y.id === yearId)!;
        setSelectedAcademicYear(newYear);
        // Reset session to the first available for the new year
        const firstSessionForNewYear = academicSessions.find(s => s.academicYearId === newYear.id)!;
        setSelectedAcademicSession(firstSessionForNewYear);
    };

    const Selector: React.FC<{label: string, value: number, onChange: (id: number) => void, options: {id: number, name: string}[]}> = 
    ({ label, value, onChange, options }) => (
        <div className="relative">
            <label className="text-xs text-neutral-400 absolute -top-2 left-2 bg-white px-1">{label}</label>
            <select 
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full text-sm bg-white border border-neutral-200 rounded-md py-1.5 pl-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
                {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
            <ChevronsUpDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"/>
        </div>
    );
    
    return (
        <div className="hidden lg:flex items-center gap-4 bg-white border-l pl-4 ml-4">
            <Selector 
                label="Institution" 
                value={selectedInstitution.id} 
                onChange={(id) => setSelectedInstitution(institutions.find(i => i.id === id)!)} 
                options={institutions}
            />
            <Selector 
                label="Academic Year" 
                value={selectedAcademicYear.id} 
                onChange={handleYearChange} 
                options={academicYears}
            />
            <Selector 
                label="Session" 
                value={selectedAcademicSession.id} 
                onChange={(id) => setSelectedAcademicSession(academicSessions.find(s => s.id === id)!)} 
                options={availableSessions}
            />
        </div>
    );
}


interface HeaderProps {
  screenTitle: string;
  user: User;
  userProfile: Profile;
  onLogout: () => void;
  onMenuClick: () => void;
  // Context Switcher Props
  institutions: Institution[];
  academicYears: AcademicYear[];
  academicSessions: AcademicSession[];
  selectedInstitution: Institution;
  setSelectedInstitution: (institution: Institution) => void;
  selectedAcademicYear: AcademicYear;
  setSelectedAcademicYear: (year: AcademicYear) => void;
  selectedAcademicSession: AcademicSession;
  setSelectedAcademicSession: (session: AcademicSession) => void;
}

const Header: React.FC<HeaderProps> = ({ screenTitle, user, userProfile, onLogout, onMenuClick, ...contextProps }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow-sm p-4 h-16 flex-shrink-0">
       <div className="flex items-center">
         <button onClick={onMenuClick} className="md:hidden mr-4 text-neutral-600">
            <Menu className="h-6 w-6" />
         </button>
        <h2 className="text-xl font-semibold text-neutral-800">{screenTitle}</h2>
        {userProfile.canSwitchGlobalContext && <GlobalContextSwitcher {...contextProps} />}
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative text-neutral-500 hover:text-primary transition">
            <Bell className="h-6 w-6"/>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-100 transition"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border-2 border-primary-light"
            />
            <div className="hidden md:flex flex-col items-start">
                <span className="font-medium text-sm text-neutral-800">{user.name}</span>
                <span className="text-xs text-neutral-400">{user.role}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-400 hidden md:block" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                <p className="text-xs text-neutral-400">{user.role}</p>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                }}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2"/>
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;