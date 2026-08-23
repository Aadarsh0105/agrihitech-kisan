import { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, Building2, Check, SlidersHorizontal } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Modal } from '../../components/admin/ui/Modal';
import { getSessionUser } from '../../services/auth-session';
import { getAssignableBrands, getMyBrands, updateMyBrands, type BusinessBrand } from '../../services/business.service';

const messageOf = (error: unknown) => axios.isAxiosError(error)
  ? error.response?.data?.error ?? error.response?.data?.message ?? error.message
  : error instanceof Error ? error.message : 'Unable to load brands';

export function BusinessBrands() {
  const [assigned, setAssigned] = useState<BusinessBrand[]>([]);
  const [available, setAvailable] = useState<BusinessBrand[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = getSessionUser()?.categories?.map((name) => name.toLowerCase()) ?? [];
  const allowedBrands = available.filter((brand) =>
    !categories.length || (brand.category?.name && categories.includes(brand.category.name.toLowerCase())),
  );

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [myBrands, publicBrands] = await Promise.all([getMyBrands(), getAssignableBrands()]);
      setAssigned(myBrands); setAvailable(publicBrands); setSelected(myBrands.map((brand) => brand._id));
    } catch (reason) { setError(messageOf(reason)); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const updated = await updateMyBrands(selected); setAssigned(updated); setOpen(false);
      setSuccess('Brand assignments updated successfully.');
    } catch (reason) { setError(messageOf(reason)); } finally { setSaving(false); }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Dealer catalogue</p><h1 className="mt-1 font-display text-3xl font-extrabold">My Brands</h1><p className="mt-2 text-sm text-muted-foreground">Select the Company and Admin brands your business is authorised to deal in.</p></div><Button variant="primary" onClick={() => { setSelected(assigned.map((brand) => brand._id)); setOpen(true); }}><SlidersHorizontal className="h-4 w-4" />Manage brands</Button></div>
    {error ? <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</div> : null}
    {success ? <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-4 text-sm font-medium text-primary"><Check className="h-4 w-4" />{success}</div> : null}
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5"><div className="flex gap-3"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-display font-bold">Assignment-only brand access</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Brands are created and maintained by Companies or Admin. Your business can assign eligible brands and create products under those assignments.</p></div></div></section>
    {loading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : assigned.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{assigned.map((brand) => <BrandCard key={brand._id} brand={brand} />)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><Building2 className="mx-auto h-10 w-10 text-muted-foreground/40" /><p className="mt-3 font-semibold">No brands assigned</p><p className="mt-1 text-sm text-muted-foreground">Select brands available under your registered categories.</p><Button className="mt-5" variant="primary" onClick={() => setOpen(true)}>Assign brands</Button></div>}

    <Modal open={open} onClose={() => setOpen(false)} title="Assign brands" description="Choose brands from your registered business categories." size="lg" footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" disabled={saving} onClick={() => void save()}>{saving ? 'Saving...' : `Save ${selected.length} assignment${selected.length === 1 ? '' : 's'}`}</Button></>}>
      <div className="max-h-[430px] overflow-y-auto pr-1">{allowedBrands.length ? <div className="grid gap-3 sm:grid-cols-2">{allowedBrands.map((brand) => { const checked = selected.includes(brand._id); return <button type="button" key={brand._id} onClick={() => setSelected((old) => checked ? old.filter((id) => id !== brand._id) : [...old, brand._id])} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${checked ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:bg-muted/50'}`}><div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted">{brand.image ? <img src={brand.image} alt="" className="h-full w-full object-contain p-1" /> : <Building2 className="h-5 w-5 text-muted-foreground" />}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{brand.name}</p><p className="truncate text-xs text-muted-foreground">{brand.category?.name || 'Uncategorized'}</p></div><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{checked ? <Check className="h-4 w-4" /> : null}</span></button>; })}</div> : <p className="rounded-xl bg-muted/50 px-4 py-10 text-center text-sm text-muted-foreground">No Company or Admin brands are available for your registered categories.</p>}</div>
    </Modal>
  </div>;
}

function BrandCard({ brand }: { brand: BusinessBrand }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"><div className="grid h-40 place-items-center bg-muted/50">{brand.image ? <img src={brand.image} alt={brand.name} className="h-full w-full object-contain p-3" /> : <Building2 className="h-10 w-10 text-primary/40" />}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-lg font-bold">{brand.name}</h2><p className="mt-1 text-sm text-muted-foreground">{brand.category?.name || 'Uncategorized'}</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">Assigned</span></div></div></article>;
}
