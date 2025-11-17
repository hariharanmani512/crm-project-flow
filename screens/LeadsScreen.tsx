import React, { useState, useEffect, useMemo } from 'react';
import { Lead, LeadStatus, User, Profile, Team, Activity } from '../types';
import { MOCK_TEAMS } from '../constants';
import { getLeadScore } from '../services/geminiService';
import { Phone, Users, Zap, MessageSquare, X, FolderKan, Mail, FileText, CheckCircle } from '../components/icons/Icons';

interface LeadsScreenProps {
  currentUser: User;
  currentUserProfile: Profile;
  currentUserTeam: Team | null;
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
  onConvertLead: (leadId: number) => void;
}

const statusColors: { [key in LeadStatus]: string } = {
  [LeadStatus.New]: 'bg-blue-100 text-blue-800',
  [LeadStatus.Contacted]: 'bg-yellow-100 text-yellow-800',
  [LeadStatus.Qualified]: 'bg-purple-100 text-purple-800',
  [LeadStatus.Lost]: 'bg-red-100 text-red-800',
  [LeadStatus.Converted]: 'bg-green-100 text-green-800',
};

const ActivityIcon: React.FC<{type: Activity['type']}> = ({type}) => {
    const baseClass = "w-4 h-4 text-neutral-500";
    switch(type) {
        case 'Call': return <Phone className={baseClass} />;
        case 'Email': return <Mail className={baseClass} />;
        case 'Note': return <FileText className={baseClass} />;
        case 'Meeting': return <Users className={baseClass} />;
        default: return <FileText className={baseClass} />;
    }
}

const LeadCard: React.FC<{ lead: Lead; onSelect: (lead: Lead) => void; isSelected: boolean }> = ({ lead, onSelect, isSelected }) => (
    <div
        onClick={() => onSelect(lead)}
        className={`p-4 border-l-4 rounded-r-lg cursor-pointer transition-all duration-200 ${
            isSelected ? 'bg-primary-light border-primary shadow-md' : 'bg-white border-neutral-200 hover:bg-gray-50 hover:border-primary-dark'
        }`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-neutral-800">{lead.name}</p>
                <p className="text-sm text-neutral-400">{lead.enquiryFor}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[lead.status]}`}>
                {lead.status}
            </span>
        </div>
        <div className="flex items-center mt-3 text-xs text-neutral-400">
            <img src={lead.assignedTo.avatar} className="w-5 h-5 rounded-full mr-2"/>
            <span>{lead.assignedTo.name}</span>
        </div>
    </div>
);

const LeadDetail: React.FC<{ 
    lead: Lead | null; 
    onClose: () => void; 
    onUpdateLeadStatus: (leadId: number, status: LeadStatus) => void; 
    onConvertLead: (leadId: number) => void;
    permissions: Profile['permissions']['leads'] 
}> = ({ lead, onClose, onUpdateLeadStatus, onConvertLead, permissions }) => {
    const [score, setScore] = useState<number | null>(null);
    const [reasoning, setReasoning] = useState<string>('');
    const [isLoadingScore, setIsLoadingScore] = useState<boolean>(false);
    
    useEffect(() => {
        setScore(null);
        setReasoning('');
    }, [lead]);

    const handleGetScore = async () => {
        if (!lead) return;
        setIsLoadingScore(true);
        setScore(null);
        setReasoning('');
        try {
            const result = await getLeadScore(lead);
            setScore(result.score);
            setReasoning(result.reasoning);
        } catch (error) {
            setReasoning("Failed to get lead score.");
        } finally {
            setIsLoadingScore(false);
        }
    };

    const handleMoveToEnquiry = () => {
        if (!lead || !permissions.update) return;
        onUpdateLeadStatus(lead.id, LeadStatus.Qualified);
        alert(`${lead.name} has been moved to Enquiry (Qualified).`);
    };

    const handleConvert = () => {
        if (!lead || !permissions.update) return;
        if(window.confirm(`Are you sure you want to convert ${lead.name} into a Student?`)) {
            onConvertLead(lead.id);
        }
    }
    
    const team = useMemo(() => MOCK_TEAMS.find(t => t.id === lead?.assignedTo.teamId), [lead]);


    if (!lead) {
        return (
            <div className="hidden lg:flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-6 text-center">
                <FolderKan className="w-16 h-16 text-neutral-200" />
                <p className="mt-4 text-lg font-medium text-neutral-600">Select a lead to view details</p>
                <p className="text-neutral-400">You can view activity history and get AI-powered insights.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full overflow-y-auto relative">
             <button onClick={onClose} className="lg:hidden absolute top-4 right-4 text-neutral-400 hover:text-neutral-800">
                <X className="w-6 h-6" />
            </button>
            <div className="border-b pb-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary text-2xl font-bold mr-4">
                        {lead.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-800">{lead.name}</h3>
                        <p className="text-neutral-400">{lead.enquiryFor}</p>
                    </div>
                </div>
                {permissions.update && lead.status !== LeadStatus.Converted && (
                    <div className="mt-4 flex space-x-2">
                        {lead.status !== LeadStatus.Qualified &&
                            <button 
                                onClick={handleMoveToEnquiry}
                                className="flex-1 text-sm flex items-center justify-center py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                            >
                                Move to Enquiry
                            </button>
                        }
                        {lead.status === LeadStatus.Qualified &&
                            <button 
                                onClick={handleConvert}
                                className="flex-1 text-sm flex items-center justify-center py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                               <CheckCircle className="w-4 h-4 mr-2" />
                                Convert to Student
                            </button>
                        }
                    </div>
                )}
            </div>

            <div className="py-4 border-b grid grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-semibold text-neutral-600 mb-1">Contact Details</h4>
                    <p><strong>Email:</strong> {lead.email}</p>
                    <p><strong>Phone:</strong> {lead.phone}</p>
                    <p><strong>Source:</strong> {lead.source}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-neutral-600 mb-1">Assignment</h4>
                    <p><strong>Assigned To:</strong> {lead.assignedTo.name}</p>
                    <p><strong>Team:</strong> {team?.name || 'N/A'}</p>
                </div>
            </div>

            <div className="py-4 border-b">
                <h4 className="font-semibold text-neutral-600 mb-2">Smart Lead Scoring</h4>
                 {score !== null ? (
                     <div className="text-center p-4 bg-primary-light rounded-lg">
                        <p className="text-5xl font-bold text-primary">{score}</p>
                        <p className="text-sm text-primary-dark mt-2">{reasoning}</p>
                    </div>
                ) : (
                    <button onClick={handleGetScore} disabled={isLoadingScore} className="w-full flex items-center justify-center py-2 bg-accent text-white rounded-lg hover:bg-yellow-600 transition disabled:bg-neutral-200">
                       <Zap className="w-4 h-4 mr-2" />
                       {isLoadingScore ? 'Analyzing...' : 'Get AI Score'}
                    </button>
                )}
            </div>

            <div className="flex-1 py-4">
                 <h4 className="font-semibold text-neutral-600 mb-4">Activity Timeline</h4>
                 <div className="space-y-4">
                     {lead.activities.length > 0 ? lead.activities.map(activity => (
                         <div key={activity.id} className="flex items-start text-sm">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3 flex-shrink-0">
                                <ActivityIcon type={activity.type} />
                            </div>
                            <div>
                                <p className="text-neutral-800">{activity.notes}</p>
                                <p className="text-xs text-neutral-400">{activity.createdBy} - {activity.date}</p>
                            </div>
                         </div>
                     )) : (
                        <p className="text-sm text-neutral-400 text-center py-4">No activities logged for this lead.</p>
                     )}
                 </div>
            </div>
        </div>
    );
};


const LeadsScreen: React.FC<LeadsScreenProps> = ({ currentUser, currentUserProfile, currentUserTeam, leads, onUpdateLeads, onConvertLead }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };
  
  const handleCloseDetail = () => {
    setSelectedLead(null);
  }

  const handleUpdateLeadStatus = (leadId: number, status: LeadStatus) => {
    const newLeads = leads.map(l => l.id === leadId ? { ...l, status } : l);
    onUpdateLeads(newLeads);
    // Refresh selected lead data
    setSelectedLead(newLeads.find(l => l.id === leadId) || null);
  };

  const leadsForUser = useMemo(() => {
    const { role } = currentUser;
    if (role === 'Admin' || role === 'Director') {
      return leads;
    }
    if (role === 'Manager') {
      const teamMemberIds = currentUserTeam?.memberIds || [];
      return leads.filter(lead => teamMemberIds.includes(lead.assignedTo.id) || lead.assignedTo.id === currentUser.id);
    }
    return leads.filter(lead => lead.assignedTo.id === currentUser.id);
  }, [leads, currentUser, currentUserTeam]);

  const permissions = currentUserProfile.permissions.leads;

  // If a lead is selected but it's no longer in the visible list (e.g. after user change), deselect it
  useEffect(() => {
      if(selectedLead && !leadsForUser.find(l => l.id === selectedLead.id)) {
          setSelectedLead(null);
      }
  }, [leadsForUser, selectedLead]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        <div className={`lg:col-span-1 bg-white p-4 rounded-xl shadow-md overflow-y-auto ${selectedLead ? 'hidden lg:block' : 'block'}`}>
            <h3 className="font-semibold text-lg mb-4 px-2">All Leads ({leadsForUser.length})</h3>
            <div className="space-y-3">
                {leadsForUser.map(lead => (
                    <LeadCard 
                        key={lead.id} 
                        lead={lead} 
                        onSelect={handleSelectLead} 
                        isSelected={selectedLead?.id === lead.id}
                    />
                ))}
            </div>
        </div>
        <div className={`lg:col-span-2 ${selectedLead ? 'block' : 'hidden lg:block'}`}>
            <LeadDetail lead={selectedLead} onClose={handleCloseDetail} onUpdateLeadStatus={handleUpdateLeadStatus} onConvertLead={onConvertLead} permissions={permissions} />
        </div>
    </div>
  );
};

export default LeadsScreen;