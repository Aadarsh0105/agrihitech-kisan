import type { LucideIcon } from 'lucide-react';

export function CompanyEmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <div className="space-y-6"><div><h1 className="font-display text-3xl font-extrabold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">Manage your company workspace.</p></div><div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-7 w-7" /></span><h2 className="mt-5 font-display text-lg font-bold">Nothing here yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p></div></div>;
}
