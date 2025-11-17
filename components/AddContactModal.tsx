import React, { useState, useMemo } from 'react';
import { Contact, Institution, AcademicYear, AcademicSession } from '../types';
import { X } from './icons/Icons';

interface AddContactModalProps {
  onClose: () => void;
  onAddContact: (newContact: Omit<Contact, 'id' | 'activities'>) => void;
  institutions: Institution[];
  academicYears: AcademicYear[];
  academicSessions: AcademicSession[];
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onAddContact, institutions, academicYears, academicSessions }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || 0);
  const [academicYearId, setAcademicYearId] = useState(academicYears[0]?.id || 0);

  const availableSessions = useMemo(() => {
    return academicSessions.filter(s => s.academicYearId === academicYearId);
  }, [academicYearId, academicSessions]);

  const [academicSessionId, setAcademicSessionId] = useState(availableSessions[0]?.id || 0);

  // When year changes, reset the session to the first available one for that year.
  const handleYearChange = (newYearId: number) => {
    setAcademicYearId(newYearId);
    const newAvailableSessions = academicSessions.filter(s => s.academicYearId === newYearId);
    setAcademicSessionId(newAvailableSessions[0]?.id || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
        alert("Name and Phone are required.");
        return;
    }

    const newContactData = {
      name,
      email,
      phone,
      createdDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      institution: institutions.find(i => i.id === institutionId)!,
      academicYear: academicYears.find(ay => ay.id === academicYearId)!,
      academicSession: academicSessions.find(as => as.id === academicSessionId)!,
    };
    
    onAddContact(newContactData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-600">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-600">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-600">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
           <div>
            <label htmlFor="institution" className="block text-sm font-medium text-neutral-600">Institution</label>
            <select
                id="institution"
                value={institutionId}
                onChange={(e) => setInstitutionId(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
                {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-neutral-600">Academic Year</label>
            <select
                id="academicYear"
                value={academicYearId}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
                {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="academicSession" className="block text-sm font-medium text-neutral-600">Academic Session</label>
            <select
                id="academicSession"
                value={academicSessionId}
                onChange={(e) => setAcademicSessionId(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                disabled={availableSessions.length === 0}
            >
                {availableSessions.map(as => <option key={as.id} value={as.id}>{as.name}</option>)}
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;