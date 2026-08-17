import { Building2, Mail, Phone, ShieldCheck } from 'lucide-react';

export function CompanySettings() {
  return <div className="space-y-6"><div><h1 className="font-display text-3xl font-extrabold">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Manage your company account settings.</p></div><section className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-soft"><div className="grid gap-4 sm:grid-cols-2"><Item icon={Building2} label="Company name" value="Company Account" /><Item icon={Mail} label="Company email" value="Add company email" /><Item icon={Phone} label="Contact number" value="Add contact number" /><Item icon={ShieldCheck} label="Access status" value="Active" /></div></section></div>;
}

function Item({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) { return <div className="rounded-xl border border-border bg-background p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>; }
