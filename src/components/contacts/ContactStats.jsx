import React from 'react';
import { Users, UserCheck, Award, Clock } from 'lucide-react';

/**
 * Metric cards summarizing the current CRM database statistics.
 */
export const ContactStats = ({ contacts = [], baseDate = new Date().toISOString().split('T')[0] }) => {
  const total = contacts.length;
  
  const hrRecruiters = contacts.filter(
    (c) => c.contactType === 'HR' || c.contactType === 'Recruiter'
  ).length;

  const referrals = contacts.filter(
    (c) => c.contactType === 'Referral' || c.referred === 'Yes'
  ).length;

  // Follow-ups due: has a followUpDate, status is not Closed
  const followUps = contacts.filter(
    (c) => c.followUpDate && c.followUpDate.trim() !== '' && c.status !== 'Closed'
  ).length;

  const cards = [
    {
      label: 'Total Contacts',
      value: total,
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50/50'
    },
    {
      label: 'HR & Recruiters',
      value: hrRecruiters,
      icon: UserCheck,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50/50'
    },
    {
      label: 'Referral Contacts',
      value: referrals,
      icon: Award,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/50'
    },
    {
      label: 'Follow-ups Due',
      value: followUps,
      icon: Clock,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 bg-white p-4.5 shadow-3xs flex items-center justify-between"
          >
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <span className="block text-lg font-bold text-slate-900 mt-1 leading-none">
                {card.value}
              </span>
            </div>
            <div className={`rounded-md p-2 ${card.bgColor} shrink-0`}>
              <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ContactStats;
