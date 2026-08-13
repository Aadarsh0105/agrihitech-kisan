import React from "react";
import { InboxIcon, BoxIcon } from "lucide-react";
export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  message,
  action





}: {icon?: BoxIcon;title: string;message: string;action?: React.ReactNode;}) {
  return <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>;
}