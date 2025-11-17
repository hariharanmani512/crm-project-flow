import React, { useState } from 'react';
import { AcademicYear } from '../types';
import { X } from './icons/Icons';

interface AddAcademicYearModalProps {
  onClose: () => void;
  onAddAcademicYear: (data: Omit<AcademicYear, 'id'>) => void;
}

const AddAcademicYearModal: React.FC<AddAcademicYearModalProps> = ({ onClose, onAddAcademicYear }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{4}-\d{4}$/.test(name.trim())) {
      alert("Please enter a valid year name in the format YYYY-YYYY (e.g., 2025-2026).");
      return;
    }

    onAddAcademicYear({ name });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Academic Year</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-600">Academic Year Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., 2026-2027"
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
              Save Year
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAcademicYearModal;