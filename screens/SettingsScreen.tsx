import React, { useState } from 'react';
import { User, Profile, FeeStructure, Institution, AcademicYear, AcademicSession } from '../types';
import { MOCK_PROFILES, MOCK_TEAMS } from '../constants';
import { PlusCircle, School, UserCircle, Users, CheckCircle, XCircle, DollarSign, Calendar, BookOpen } from '../components/icons/Icons';
import AddFeeStructureModal from '../components/AddFeeStructureModal';
import AddInstitutionModal from '../components/AddInstitutionModal';
import AddAcademicYearModal from '../components/AddAcademicYearModal';
import AddAcademicSessionModal from '../components/AddAcademicSessionModal';


type Tab = 'users' | 'profiles' | 'teams' | 'fees' | 'institutions' | 'academicYears' | 'academicSessions';

const PermissionIcon: React.FC<{ allowed: boolean }> = ({ allowed }) => {
    return allowed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />;
}

interface SettingsScreenProps {
  allUsers: User[];
  // Fee Structures
  feeStructures: FeeStructure[];
  onCreateFeeStructure: (newFeeStructureData: Omit<FeeStructure, 'id'>) => void;
  // Institutions
  institutions: Institution[];
  onCreateInstitution: (data: Omit<Institution, 'id'>) => void;
  // Academic Years
  academicYears: AcademicYear[];
  onCreateAcademicYear: (data: Omit<AcademicYear, 'id'>) => void;
  // Academic Sessions
  academicSessions: AcademicSession[];
  onCreateAcademicSession: (data: Omit<AcademicSession, 'id'>) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
    const { 
        allUsers, feeStructures, onCreateFeeStructure,
        institutions, onCreateInstitution,
        academicYears, onCreateAcademicYear,
        academicSessions, onCreateAcademicSession
    } = props;

    const [activeTab, setActiveTab] = useState<Tab>('users');
    
    // Modal states
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
    const [isInstModalOpen, setIsInstModalOpen] = useState(false);
    const [isYearModalOpen, setIsYearModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);


    const handleAddNew = () => {
        switch (activeTab) {
          case 'users':
            alert('Add new user functionality will be implemented in a future update.');
            break;
          case 'profiles':
            alert('Add new profile functionality will be implemented in a future update.');
            break;
          case 'teams':
            alert('Add new team functionality will be implemented in a future update.');
            break;
          case 'fees':
            setIsFeeModalOpen(true);
            break;
          case 'institutions':
            setIsInstModalOpen(true);
            break;
          case 'academicYears':
            setIsYearModalOpen(true);
            break;
          case 'academicSessions':
            setIsSessionModalOpen(true);
            break;
          default:
            break;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                        <thead className="bg-neutral-100">
                            <tr>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Profile</th>
                             <th className="p-4 font-semibold">Team</th>
                            <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-neutral-400">{user.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-sm rounded-full bg-primary-light text-primary-dark">
                                        {MOCK_PROFILES.find(p => p.id === user.profileId)?.name || 'N/A'}
                                    </span>
                                </td>
                                 <td className="p-4">{MOCK_TEAMS.find(t => t.id === user.teamId)?.name || 'N/A'}</td>
                                <td className="p-4">
                                    <button className="text-primary hover:underline mr-4">Edit</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                );
            case 'profiles':
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-100">
                                <tr>
                                    <th className="p-4 font-semibold">Profile</th>
                                    <th className="p-4 font-semibold text-center">Context Switch</th>
                                    <th className="p-4 font-semibold text-center">Read</th>
                                    <th className="p-4 font-semibold text-center">Create</th>
                                    <th className="p-4 font-semibold text-center">Update</th>
                                    <th className="p-4 font-semibold text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_PROFILES.map(profile => (
                                    <React.Fragment key={profile.id}>
                                        <tr className="border-b bg-gray-50">
                                            <td colSpan={6} className="p-3 font-bold text-primary">{profile.name}</td>
                                        </tr>
                                         <tr className="border-b hover:bg-gray-50">
                                                <td className="p-4 pl-8 font-medium">Global Filters</td>
                                                <td className="p-4 text-center"><div className="flex justify-center"><PermissionIcon allowed={profile.canSwitchGlobalContext}/></div></td>
                                                <td className="p-4 text-center text-neutral-300">-</td>
                                                <td className="p-4 text-center text-neutral-300">-</td>
                                                <td className="p-4 text-center text-neutral-300">-</td>
                                                <td className="p-4 text-center text-neutral-300">-</td>
                                        </tr>
                                        {Object.entries(profile.permissions).map(([moduleName, perms]) => (
                                             <tr key={`${profile.id}-${moduleName}`} className="border-b hover:bg-gray-50">
                                                <td className="p-4 pl-8 capitalize">{moduleName}</td>
                                                <td className="p-4 text-center text-neutral-300">-</td>
                                                <td className="p-4 text-center"><div className="flex justify-center"><PermissionIcon allowed={perms.read}/></div></td>
                                                <td className="p-4 text-center"><div className="flex justify-center"><PermissionIcon allowed={perms.create}/></div></td>
                                                <td className="p-4 text-center"><div className="flex justify-center"><PermissionIcon allowed={perms.update}/></div></td>
                                                <td className="p-4 text-center"><div className="flex justify-center"><PermissionIcon allowed={perms.delete}/></div></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'teams':
                return (
                     <div className="space-y-4">
                        {MOCK_TEAMS.map(team => {
                           const manager = allUsers.find(u => u.id === team.managerId);
                           const members = allUsers.filter(u => team.memberIds.includes(u.id));
                           return (
                               <div key={team.id} className="p-4 border rounded-lg bg-white">
                                    <h3 className="text-lg font-bold mb-2">{team.name}</h3>
                                    <p><strong>Manager:</strong> {manager?.name || 'N/A'}</p>
                                    <div>
                                        <strong>Members:</strong>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {members.map(m => (
                                                <span key={m.id} className="flex items-center text-sm bg-neutral-100 rounded-full px-3 py-1">
                                                    <img src={m.avatar} className="w-5 h-5 rounded-full mr-2" />
                                                    {m.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                               </div>
                           );
                        })}
                     </div>
                );
            case 'fees':
            case 'institutions':
            case 'academicYears':
            case 'academicSessions':
                const dataMap = {
                    fees: { data: feeStructures, columns: ['Structure Name', 'Total Amount'], icon: DollarSign, emptyText: "No fee structures created yet." },
                    institutions: { data: institutions, columns: ['Institution Name'], icon: School, emptyText: "No institutions created yet." },
                    academicYears: { data: academicYears, columns: ['Year Name'], icon: Calendar, emptyText: "No academic years created yet." },
                    academicSessions: { data: academicSessions, columns: ['Session Name', 'Academic Year'], icon: BookOpen, emptyText: "No academic sessions created yet." },
                };
                const current = dataMap[activeTab];
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-100">
                                <tr>
                                    {current.columns.map(col => <th key={col} className="p-4 font-semibold">{col}</th>)}
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {current.data.map((item: any) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{item.name}</td>
                                        {activeTab === 'fees' && <td className="p-4">₹{item.totalAmount.toLocaleString()}</td>}
                                        {activeTab === 'academicSessions' && <td className="p-4">{academicYears.find(y => y.id === item.academicYearId)?.name}</td>}
                                        <td className="p-4">
                                            <button className="text-primary hover:underline mr-4">Edit</button>
                                            <button className="text-red-500 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {current.data.length === 0 && (
                            <div className="text-center py-12 text-neutral-400">
                                <current.icon className="w-12 h-12 mx-auto mb-2" />
                                <p>{current.emptyText}</p>
                                <p className="text-sm">Click "Add New" to create one.</p>
                            </div>
                        )}
                    </div>
                );
        }
    }

  return (
    <>
    {isFeeModalOpen && <AddFeeStructureModal onClose={() => setIsFeeModalOpen(false)} onAddFeeStructure={onCreateFeeStructure} />}
    {isInstModalOpen && <AddInstitutionModal onClose={() => setIsInstModalOpen(false)} onAddInstitution={onCreateInstitution} />}
    {isYearModalOpen && <AddAcademicYearModal onClose={() => setIsYearModalOpen(false)} onAddAcademicYear={onCreateAcademicYear} />}
    {isSessionModalOpen && <AddAcademicSessionModal onClose={() => setIsSessionModalOpen(false)} onAddAcademicSession={onCreateAcademicSession} academicYears={academicYears} />}
    
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Admin Console</h2>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New
                </button>
            </div>
            
            <div className="flex space-x-1 border-b mb-6 overflow-x-auto">
                <button onClick={() => setActiveTab('users')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Users</button>
                <button onClick={() => setActiveTab('profiles')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'profiles' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Profiles</button>
                <button onClick={() => setActiveTab('teams')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'teams' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Teams</button>
                <button onClick={() => setActiveTab('institutions')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'institutions' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Institutions</button>
                <button onClick={() => setActiveTab('academicYears')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'academicYears' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Academic Years</button>
                <button onClick={() => setActiveTab('academicSessions')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'academicSessions' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Sessions</button>
                <button onClick={() => setActiveTab('fees')} className={`px-4 py-2 font-medium transition whitespace-nowrap ${activeTab === 'fees' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500'}`}>Fee Structures</button>
            </div>

            <div>{renderContent()}</div>
        </div>
    </div>
    </>
  );
};

export default SettingsScreen;