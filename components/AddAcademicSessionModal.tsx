import React, { useState } from 'react';
import { AcademicSession, AcademicYear } from '../types';
import { X } from './icons/Icons';

interface AddAcademicSessionModalProps {
  onClose: () => void;
  onAddAcademicSession: (data: Omit<AcademicSession, 'id'>) => void;
  academicYears: AcademicYear[];
}

const AddAcademicSessionModal: React.FC<AddAcademicSessionModalProps> = ({ onClose, onAddAcademicSession, academicYears }) => {
  const [name, setName] = useState('');
  const [academicYearId, setAcademicYearId] = useState(academicYears[0]?.id || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !academicYearId) {
      alert("Please enter a valid session name and select an academic year.");
      return;
    }

    onAddAcademicSession({ name, academicYearId });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Academic Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-neutral-600">Parent Academic Year</label>
            <select
                id="academicYear"
                value={academicYearId}
                onChange={(e) => setAcademicYearId(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
            >
                <option value="">Select a year...</option>
                {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-600">Session Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Fall 2026 Intake"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
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
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAcademicSessionModal;