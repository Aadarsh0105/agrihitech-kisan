import { Phone, Store, User } from 'lucide-react';
import { getSessionUser, sessionUserName } from '../../services/auth-session';

export function BusinessSettings() {
  const user = getSessionUser();
  return <div className="space-y-6">
    <div><h1 className="font-display text-3xl font-extrabold">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Your business account information.</p></div>
    <section className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-soft"><div className="grid gap-5 sm:grid-cols-2"><Info icon={Store} label="Firm name" value={user?.firmName ?? 'Not provided'} /><Info icon={User} label="Proprietor" value={user ? sessionUserName(user) : 'Not provided'} /><Info icon={Phone} label="Mobile number" value={user?.mobile ?? 'Not provided'} /><Info icon={Store} label="Account type" value="Business (B2B)" /></div></section>
  </div>;
}

function Info({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) { return <div className="rounded-xl border border-border bg-background p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
