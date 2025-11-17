import React from 'react';
import { UserRole } from '../types';
import { USER_ROLES } from '../constants';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-light to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
            <svg className="w-12 h-12 text-primary mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"></path>
            </svg>
          <h1 className="mt-4 text-3xl font-bold text-neutral-800">Welcome to EduCRM</h1>
          <p className="mt-2 text-neutral-400">Select your role to continue</p>
        </div>
        <div className="space-y-4">
          {USER_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => onLogin(role)}
              className="w-full px-4 py-3 text-lg font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-transform transform hover:-translate-y-1"
            >
              Login as {role}
            </button>
          ))}
            <button
              onClick={() => alert("Student Portal coming soon!")}
              className="w-full px-4 py-3 text-lg font-semibold text-primary bg-primary-light rounded-lg shadow-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-transform transform hover:-translate-y-1"
            >
              Login as Student
            </button>
        </div>
        <p className="text-xs text-center text-neutral-400">
            This is a simulated login. No credentials required.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;