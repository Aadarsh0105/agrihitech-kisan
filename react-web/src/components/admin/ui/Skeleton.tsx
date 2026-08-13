import React from 'react';
import { cn } from '../../../utils/admin/cn';

export function Skeleton({ className }: {className?: string;}) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-muted', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
    </div>);

}

export function TableSkeleton({ rows = 6, columns = 5 }: {rows?: number;columns?: number;}) {
  return (
    <div className="divide-y divide-border" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) =>
      <div key={r} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: columns }).map((_, c) =>
        <Skeleton key={c} className={cn('h-4', c === 0 ? 'w-1/4' : 'flex-1')} />
        )}
        </div>
      )}
    </div>);

}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-20" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>);

}