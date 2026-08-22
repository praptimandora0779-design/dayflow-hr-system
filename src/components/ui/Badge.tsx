import React from 'react';

type BadgeVariant = 'approved' | 'pending' | 'rejected' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md' }) => {
  const styles: Record<BadgeVariant, string> = {
    approved: 'badge-approved',
    pending: 'badge-pending',
    rejected: 'badge-rejected',
    info: 'badge-info',
    neutral: 'badge-neutral',
  };

  const dotColors: Record<BadgeVariant, string> = {
    approved: 'bg-emerald-600',
    pending: 'bg-amber-600',
    rejected: 'bg-rose-600',
    info: 'bg-blue-600',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-tight rounded-md',
    md: 'px-2.5 py-1 text-xs font-medium tracking-tight rounded-md',
  };

  return (
    <span className={`inline-flex items-center font-sans ${styles[variant]} ${sizes[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} mr-1.5 shrink-0`} />
      {children}
    </span>
  );
};

export const AttendanceBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'PRESENT':
      return <Badge variant="approved">Present</Badge>;
    case 'LATE':
      return <Badge variant="pending">Late</Badge>;
    case 'HALF_DAY':
      return <Badge variant="pending">Half Day</Badge>;
    case 'ABSENT':
      return <Badge variant="rejected">Absent</Badge>;
    case 'LEAVE':
      return <Badge variant="info">On Leave</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const LeaveBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return <Badge variant="approved">Approved</Badge>;
    case 'PENDING':
      return <Badge variant="pending">Pending</Badge>;
    case 'REJECTED':
      return <Badge variant="rejected">Rejected</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
