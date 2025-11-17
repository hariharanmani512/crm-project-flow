import React from 'react';
import { Profile, Screen } from '../types';
import { SCREENS } from '../constants';
import { LogOut } from './icons/Icons';

interface SidebarProps {
  currentScreenId: string;
  navigate: (screen: Screen) => void;
  userProfile: Profile;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreenId, navigate, userProfile, isOpen, setIsOpen, onLogout }) => {

  // Filter screens based on the user's profile permissions
  const availableScreens = Object.values(SCREENS).filter(screen =>
    userProfile.permissions[screen.id]?.read
  );
  
  const NavLink: React.FC<{ screen: Screen }> = ({ screen }) => (
    <li
      key={screen.id}
      onClick={() => navigate(screen)}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
        currentScreenId === screen.id
          ? 'bg-primary text-white shadow-md'
          : 'text-neutral-600 hover:bg-primary-light hover:text-primary-dark'
      }`}
    >
      <screen.icon className="h-5 w-5 mr-4" />
      <span className="font-medium">{screen.title}</span>
    </li>
  );

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`absolute md:relative flex flex-col w-64 bg-white h-full shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-center p-6 border-b border-neutral-200">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"></path>
          </svg>
          <h1 className="ml-3 text-2xl font-bold text-primary">EduCRM</h1>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul>
            {availableScreens.map(screen => (
              <NavLink key={screen.id} screen={screen} />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-200">
            <button 
                onClick={onLogout}
                className="flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 text-neutral-600 hover:bg-red-100 hover:text-red-600 w-full"
            >
                <LogOut className="h-5 w-5 mr-4" />
                <span className="font-medium">Logout</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;