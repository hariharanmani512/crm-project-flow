
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition hover:shadow-lg hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-neutral-400">{title}</p>
        <p className="text-3xl font-bold text-neutral-800">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
    </div>
  );
};

export default DashboardCard;
