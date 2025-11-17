import React, { useState } from 'react';
import { FeeStructure } from '../types';
import { X } from './icons/Icons';

interface AddFeeStructureModalProps {
  onClose: () => void;
  onAddFeeStructure: (newFeeStructure: Omit<FeeStructure, 'id'>) => void;
}

const AddFeeStructureModal: React.FC<AddFeeStructureModalProps> = ({ onClose, onAddFeeStructure }) => {
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(totalAmount);
    if (!name || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid name and a positive total amount.");
      return;
    }

    onAddFeeStructure({ name, totalAmount: amount });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Fee Structure</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-600">Structure Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., MBA Full-Time Fee 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-neutral-600">Total Amount (₹)</label>
            <input
              id="totalAmount"
              type="number"
              placeholder="e.g., 400000"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
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
              Save Structure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeeStructureModal;
