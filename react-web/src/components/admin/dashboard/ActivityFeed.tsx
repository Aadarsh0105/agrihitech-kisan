import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { activities } from '../../../data/admin/system';
import { relativeTime } from '../../../utils/admin/format';

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader title="Latest activity" description="Audit trail across all modules" />
      <ol className="p-4">
        {activities.map((entry, index) =>
        <li key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < activities.length - 1 ?
          <span className="absolute left-[7px] top-4 h-full w-px bg-border" aria-hidden="true" /> :
          null}
            <span className="relative mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-surface" />
            <div className="min-w-0">
              <p className="text-xs leading-relaxed text-foreground">
                <span className="font-medium">{entry.actor}</span>{' '}
                <span className="text-muted-foreground">{entry.action}</span>{' '}
                <span className="font-medium">{entry.target}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {entry.module} · {relativeTime(entry.timestamp)}
              </p>
            </div>
          </li>
        )}
      </ol>
    </Card>);

}