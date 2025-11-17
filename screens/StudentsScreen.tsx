import React, { useState } from 'react';
import { Student, Profile, FeeStructure } from '../types';
import { GraduationCap, UserCircle, DollarSign, Edit, Trash2 } from '../components/icons/Icons';

interface StudentsScreenProps {
    currentUserProfile: Profile;
    students: Student[];
    onUpdateStudents: (students: Student[]) => void;
    feeStructures: FeeStructure[];
}

const StudentCard: React.FC<{ student: Student; onSelect: (student: Student) => void; isSelected: boolean }> = ({ student, onSelect, isSelected }) => (
    <div
        onClick={() => onSelect(student)}
        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
            isSelected ? 'bg-primary-light shadow-md' : 'bg-white hover:bg-gray-50'
        }`}
    >
        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-neutral-500"/>
        </div>
        <div>
            <p className="font-semibold text-neutral-800">{student.name}</p>
            <p className="text-sm text-neutral-400">{student.course.name}</p>
        </div>
    </div>
);

const StudentDetail: React.FC<{ 
    student: Student | null; 
    permissions: Profile['permissions']['students']; 
    onUpdateStudent: (updatedStudent: Student) => void;
    feeStructures: FeeStructure[];
}> = ({ student, permissions, onUpdateStudent, feeStructures }) => {
    
    const [paymentAmount, setPaymentAmount] = useState('');

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-6 text-center">
                <GraduationCap className="w-16 h-16 text-neutral-200" />
                <p className="mt-4 text-lg font-medium text-neutral-600">Select a student to view details</p>
                <p className="text-neutral-400">You can manage their academic and fee information here.</p>
            </div>
        );
    }

    const handleAssignFee = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!permissions.update) return;
        const feeId = Number(e.target.value);
        const feeStructure = feeStructures.find(f => f.id === feeId);
        if (feeStructure) {
            const updatedStudent = {
                ...student,
                feeDetails: {
                    ...student.feeDetails,
                    structure: feeStructure,
                    balance: feeStructure.totalAmount - student.feeDetails.paidAmount
                }
            };
            onUpdateStudent(updatedStudent);
        }
    };

    const handleRecordPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0 || !student.feeDetails.structure) {
            alert("Please enter a valid amount and ensure a fee structure is assigned.");
            return;
        }

        const newPaidAmount = student.feeDetails.paidAmount + amount;
        const newBalance = student.feeDetails.structure.totalAmount - newPaidAmount;

        const updatedStudent = {
            ...student,
            feeDetails: {
                ...student.feeDetails,
                paidAmount: newPaidAmount,
                balance: newBalance,
            }
        };
        onUpdateStudent(updatedStudent);
        setPaymentAmount('');
    };

    const feeDetails = student.feeDetails;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full overflow-y-auto">
            <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary text-2xl font-bold mr-4">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-neutral-800">{student.name}</h3>
                            <p className="text-neutral-400">{student.course.name}</p>
                        </div>
                    </div>
                     <div className="flex space-x-2">
                        {permissions.update && <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"><Edit className="w-5 h-5"/></button>}
                        {permissions.delete && <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5"/></button>}
                    </div>
                </div>
            </div>

            <div className="py-4 border-b text-sm grid grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold text-neutral-600 mb-2">Personal Details</h4>
                    <p><strong>Email:</strong> {student.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {student.phone}</p>
                    <p><strong>Admission Date:</strong> {student.admissionDate}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-neutral-600 mb-2">Academic Details</h4>
                    <p><strong>Institution:</strong> {student.institution.name}</p>
                    <p><strong>Academic Year:</strong> {student.academicYear.name}</p>
                    <p><strong>Course Duration:</strong> {student.course.duration}</p>
                </div>
            </div>

            <div className="flex-1 py-4">
                <h4 className="font-semibold text-neutral-600 mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2"/>Fee Management</h4>
                
                <div className="bg-neutral-100 p-4 rounded-lg space-y-4">
                    <div>
                        <label className="text-sm font-medium">Assign Fee Structure</label>
                        <select
                            value={feeDetails.structure?.id || ''}
                            onChange={handleAssignFee}
                            disabled={!permissions.update}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Select Structure...</option>
                            {feeStructures.map(fs => <option key={fs.id} value={fs.id}>{fs.name}</option>)}
                        </select>
                    </div>

                    {feeDetails.structure && (
                        <>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-neutral-400">Total Fee</p>
                                    <p className="font-bold text-lg">₹{feeDetails.structure.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-400">Amount Paid</p>
                                    <p className="font-bold text-lg text-green-600">₹{feeDetails.paidAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-400">Balance</p>
                                    <p className="font-bold text-lg text-red-600">₹{feeDetails.balance.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            {permissions.update && (
                                <div className="flex items-center space-x-2 pt-2">
                                    <input 
                                        type="number"
                                        placeholder="Enter amount"
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value)}
                                        className="block w-full px-3 py-2 bg-white border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                    <button
                                        onClick={handleRecordPayment}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition whitespace-nowrap"
                                    >
                                        Record Payment
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};


const StudentsScreen: React.FC<StudentsScreenProps> = ({ currentUserProfile, students, onUpdateStudents, feeStructures }) => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);
    
    const permissions = currentUserProfile.permissions.students;

    const handleUpdateStudent = (updatedStudent: Student) => {
        const newStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
        onUpdateStudents(newStudents);
        setSelectedStudent(updatedStudent);
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        <div className="lg:col-span-1 bg-neutral-100 p-4 rounded-xl shadow-inner overflow-y-auto">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-semibold text-lg">All Students ({students.length})</h3>
            </div>
            <div className="space-y-2">
                {students.map(student => (
                    <StudentCard 
                        key={student.id} 
                        student={student} 
                        onSelect={setSelectedStudent} 
                        isSelected={selectedStudent?.id === student.id}
                    />
                ))}
            </div>
        </div>
        <div className="lg:col-span-2">
            <StudentDetail student={selectedStudent} permissions={permissions} onUpdateStudent={handleUpdateStudent} feeStructures={feeStructures} />
        </div>
    </div>
  );
};

export default StudentsScreen;