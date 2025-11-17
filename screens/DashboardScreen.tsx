import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { Lead, LeadStatus, Screen, Student, User } from '../types';
import { FolderKan, PlusCircle, TrendingUp, Calendar, MessageSquare, Phone, GraduationCap } from '../components/icons/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardScreenProps {
  navigate: (screen: Screen) => void;
  currentUser: User;
  leads: Lead[];
  students: Student[];
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentUser, leads, students }) => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === LeadStatus.New).length;
    const convertedLeads = leads.filter(l => l.status === LeadStatus.Converted).length;
    const totalStudents = students.length;

    const data = [
        { name: 'New', count: leads.filter(l => l.status === LeadStatus.New).length },
        { name: 'Contacted', count: leads.filter(l => l.status === LeadStatus.Contacted).length },
        { name: 'Qualified', count: leads.filter(l => l.status === LeadStatus.Qualified).length },
        { name: 'Converted', count: leads.filter(l => l.status === LeadStatus.Converted).length },
        { name: 'Lost', count: leads.filter(l => l.status === LeadStatus.Lost).length },
    ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hello, {currentUser.name}!</h2>
        <p className="text-neutral-400">Here's what's happening with your institution today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Leads" value={totalLeads} icon={FolderKan} color="bg-blue-500" />
        <DashboardCard title="New Leads" value={newLeads} icon={PlusCircle} color="bg-green-500" />
        <DashboardCard title="Converted Leads" value={convertedLeads} icon={TrendingUp} color="bg-accent" />
        <DashboardCard title="Total Students" value={totalStudents} icon={GraduationCap} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-lg mb-4">Lead Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4A90E2" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-lg mb-4">Upcoming Follow-ups</h3>
            <div className="space-y-4">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-light rounded-full"><Calendar className="h-5 w-5 text-primary"/></div>
                    <div>
                        <p className="font-medium">Meeting with Aisha Begum</p>
                        <p className="text-sm text-neutral-400">Discuss MBA program details - Today, 4:00 PM</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 rounded-full"><Phone className="h-5 w-5 text-red-500"/></div>
                    <div>
                        <p className="font-medium">Call Bhavin Patel</p>
                        <p className="text-sm text-neutral-400">Follow up on B.Tech CSE enquiry - Tomorrow, 11:00 AM</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full"><MessageSquare className="h-5 w-5 text-yellow-500"/></div>
                    <div>
                        <p className="font-medium">Send SMS to new leads</p>
                        <p className="text-sm text-neutral-400">Promotional message for weekend webinar - Today</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;