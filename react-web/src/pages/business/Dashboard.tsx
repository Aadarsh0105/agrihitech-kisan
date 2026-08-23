import { Link } from 'react-router-dom';
import { BadgeCheck, Package, Store } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { getMyBrands, getMyProducts } from '../../services/business.service';
import { getSessionUser, sessionUserName } from '../../services/auth-session';

export function BusinessDashboard() {
  const resource = useAsync(async () => {
    const [brands, products] = await Promise.all([getMyBrands(), getMyProducts()]);
    return { brands, products };
  }, []);
  const user = getSessionUser();
  return <div className="space-y-6">
    <div><p className="text-sm font-semibold text-primary">Business overview</p><h1 className="mt-1 font-display text-3xl font-extrabold">Welcome, {user ? sessionUserName(user) : 'Business'}</h1><p className="mt-2 text-sm text-muted-foreground">Track and manage your own brands and products.</p></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Metric icon={BadgeCheck} label="Assigned brands" value={resource.loading ? '...' : String(resource.data?.brands.length ?? 0)} /><Metric icon={Package} label="My products" value={resource.loading ? '...' : String(resource.data?.products.length ?? 0)} /><Metric icon={Store} label="Business account" value="Active" /></section>
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft"><h2 className="font-display text-lg font-bold">Quick actions</h2><div className="mt-4 flex flex-wrap gap-3"><Link className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" to="/business/brands">Manage assigned brands</Link><Link className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold" to="/business/products">My products</Link><Link className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold" to="/business/marketplace">Open marketplace</Link></div></section>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) { return <div className="rounded-2xl border border-border bg-card p-5 shadow-soft"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-extrabold">{value}</p></div>; }
