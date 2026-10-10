import React from 'react';
import { Calendar, CheckCircle2, Clock, Award } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';

/**
 * Statistics metrics banner for the Interview Hub.
 * Computes counts dynamically based on the state.
 */
export const InterviewStats = ({ interviews = [] }) => {
  const upcoming = interviews.filter(
    (i) => i.status === 'Scheduled' || i.status === 'Rescheduled' || i.status === 'Pending'
  ).length;

  const completed = interviews.filter((i) => i.status === 'Completed').length;

  const pendingResult = interviews.filter(
    (i) => i.status === 'Completed' && i.result === 'Pending'
  ).length;

  const selected = interviews.filter((i) => i.result === 'Selected').length;

  const stats = [
    {
      label: 'Upcoming',
      value: upcoming,
      trend: 'Scheduled rounds',
      trendType: 'neutral',
      icon: Calendar
    },
    {
      label: 'Completed',
      value: completed,
      trend: 'Previous rounds',
      trendType: 'neutral',
      icon: CheckCircle2
    },
    {
      label: 'Pending Result',
      value: pendingResult,
      trend: 'Awaiting feedback',
      trendType: 'neutral',
      icon: Clock
    },
    {
      label: 'Selected',
      value: selected,
      trend: 'Success rate',
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
export default InterviewStats;
