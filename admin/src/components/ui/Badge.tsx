import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-muted text-muted-foreground border-border',
  success: 'bg-success-subtle text-success border-success/25',
  warning: 'bg-warning-subtle text-warning border-warning/25',
  danger: 'bg-danger-subtle text-danger border-danger/25',
  info: 'bg-info-subtle text-info border-info/25',
  primary: 'bg-primary-subtle text-primary border-primary/25'
};

export function Badge({
  tone = 'neutral',
  className,
  children




}: {tone?: BadgeTone;className?: string;children: React.ReactNode;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4',
        tones[tone],
        className
      )}>
      
      {children}
    </span>);

}

export function StatusBadge({ status }: {status: string;}) {
  const map: Record<string, {tone: BadgeTone;label: string;}> = {
    active: { tone: 'success', label: 'Active' },
    approved: { tone: 'success', label: 'Approved' },
    in_stock: { tone: 'success', label: 'In stock' },
    inactive: { tone: 'neutral', label: 'Inactive' },
    draft: { tone: 'warning', label: 'Draft' },
    pending: { tone: 'warning', label: 'Pending' },
    on_request: { tone: 'warning', label: 'On request' },
    archived: { tone: 'neutral', label: 'Archived' },
    rejected: { tone: 'danger', label: 'Rejected' },
    suspended: { tone: 'danger', label: 'Suspended' },
    out_of_stock: { tone: 'danger', label: 'Out of stock' }
  };
  const item = map[status] ?? { tone: 'neutral' as BadgeTone, label: status };
  return (
    <Badge tone={item.tone}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {item.label}
    </Badge>);

}