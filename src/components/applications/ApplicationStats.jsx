import React from 'react';
import { Layers, Activity, MessageSquare, Award } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';


export const ApplicationStats = ({ applications = [] }) => {
  const total = applications.length;
  
  const inProgress = applications.filter(
    (app) => app.status === 'Applied' || app.status === 'OA' || app.status === 'Interview'
  ).length;
  
  const interviews = applications.filter((app) => app.status === 'Interview').length;
  
  const offers = applications.filter((app) => app.status === 'Selected').length;

  const stats = [
    {
      label: 'Total Applications',
      value: total,
      trend: `${total} logged`,
      trendType: 'neutral',
      icon: Layers
    },
    {
      label: 'In Progress',
      value: inProgress,
      trend: `${Math.round((inProgress / (total || 1)) * 100)}% of total`,
      trendType: 'neutral',
      icon: Activity
    },
    {
      label: 'Interviews',
      value: interviews,
      trend: 'Awaiting results',
      trendType: 'positive',
      icon: MessageSquare
    },
    {
      label: 'Offers',
      value: offers,
      trend: 'Selected rate',
      trendType: 'positive',
      icon: Award
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          trendType={stat.trendType}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};
export default ApplicationStats;
