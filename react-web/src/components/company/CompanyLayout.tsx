import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, LayoutDashboard, LogOut, Menu, Package, Settings, Store, X } from 'lucide-react';
import { clearSession } from '../../services/auth-session';

const links = [
  { label: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
  { label: 'My Products', path: '/company/products', icon: Package },
  { label: 'My Dealers', path: '/company/dealers', icon: Store },
  { label: 'Settings', path: '/company/settings', icon: Settings },
];

export function CompanyLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = () => { clearSession(); navigate('/login?role=COMPANY', { replace: true }); };
  return <div className="flex min-h-screen bg-muted/30">
    {open ? <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" /> : null}
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
      <div className="flex h-16 items-center gap-3 border-b border-border px-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-5 w-5" /></span><div><p className="font-display text-sm font-bold">Agri HiTech Kisan</p><p className="text-[11px] text-muted-foreground">Company Console</p></div><button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div>
      <nav className="flex-1 space-y-1 p-3">{links.map((link) => <NavLink key={link.path} to={link.path} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><link.icon className="h-4 w-4" />{link.label}</NavLink>)}</nav>
      <p className="border-t border-border p-4 text-xs text-muted-foreground">Manage your company workspace</p>
    </aside>
    <div className="min-w-0 flex-1"><header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6"><button className="mr-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button><div className="ml-auto flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">Company Account</p><p className="text-[11px] text-muted-foreground">Company workspace</p></div><button onClick={signOut} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />Sign out</button></div></header><main className="p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl"><Outlet /></div></main></div>
  </div>;
}
