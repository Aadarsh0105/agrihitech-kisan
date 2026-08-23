import { useEffect, useState } from 'react';
import { BadgeCheck, Edit3, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { ConfirmDialog, Modal } from '../../components/admin/ui/Modal';
import { Field, Input, Select } from '../../components/admin/ui/Input';
import { getPublicCategories, type PublicCategory } from '../../services/category.service';
import { createCompanyBrand, deleteCompanyBrand, getCompanyBrands, updateCompanyBrand, type CompanyBrandApi } from '../../services/company.service';

const blank = { name: '', category: '', image: null as File | null };
export function CompanyBrands() {
  const [brands, setBrands] = useState<CompanyBrandApi[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [draft, setDraft] = useState(blank);
  const [editing, setEditing] = useState<CompanyBrandApi | null>(null);
  const [remove, setRemove] = useState<CompanyBrandApi | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const load = () => Promise.all([getCompanyBrands(), getPublicCategories()]).then(([brandRows, categoryRows]) => { setBrands(brandRows); setCategories(categoryRows); }).catch((reason) => setError(reason.response?.data?.message || reason.message)).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);
  const create = () => { setEditing(null); setDraft(blank); setOpen(true); };
  const edit = (brand: CompanyBrandApi) => { setEditing(brand); setDraft({ name: brand.name, category: brand.category?._id || '', image: null }); setOpen(true); };
  const save = async () => { setSaving(true); setError(''); try { if (editing) await updateCompanyBrand(editing._id, draft); else await createCompanyBrand(draft); setOpen(false); await load(); } catch (reason: any) { setError(reason.response?.data?.message || reason.message); } finally { setSaving(false); } };
  return <div className="space-y-6"><Header title="My Brands" description="Create and manage brands owned by your company." action={<Button variant="primary" onClick={create}><Plus className="h-4 w-4" />Add brand</Button>} />{error ? <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}{loading ? <div className="h-56 animate-pulse rounded-2xl bg-muted" /> : brands.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{brands.map((brand) => <article key={brand._id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"><div className="grid h-40 place-items-center bg-muted/50">{brand.image ? <img src={brand.image} alt={brand.name} className="h-full w-full object-contain p-3" /> : <BadgeCheck className="h-10 w-10 text-primary/50" />}</div><div className="p-4"><h2 className="font-display text-lg font-bold">{brand.name}</h2><p className="mt-1 text-sm text-muted-foreground">{brand.category?.name}</p><p className="mt-1 text-xs text-muted-foreground">Created by {brand.createdBy?.role || 'COMPANY'}</p><div className="mt-4 flex gap-2 border-t border-border pt-3"><Button size="sm" className="flex-1" onClick={() => edit(brand)}><Edit3 className="h-4 w-4" />Edit</Button><Button variant="outlineDanger" size="sm" onClick={() => setRemove(brand)}><Trash2 className="h-4 w-4" /></Button></div></div></article>)}</div> : <Empty text="No company brands created yet." />}<Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit brand' : 'Add company brand'} footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" disabled={saving || !draft.name || !draft.category || (!editing && !draft.image)} onClick={save}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create brand'}</Button></>}><div className="space-y-4"><Field label="Brand name" required><Input value={draft.name} onChange={(e) => setDraft((old) => ({ ...old, name: e.target.value }))} /></Field><Field label="Category" required><Select value={draft.category} onChange={(e) => setDraft((old) => ({ ...old, category: e.target.value }))}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></Field><Field label="Brand image" required={!editing}><Input type="file" accept="image/*" onChange={(e) => setDraft((old) => ({ ...old, image: e.target.files?.[0] || null }))} /></Field></div></Modal><ConfirmDialog open={Boolean(remove)} onClose={() => setRemove(null)} onConfirm={async () => { if (remove) { await deleteCompanyBrand(remove._id); await load(); } }} title="Delete brand" message="A brand can only be deleted when it has no products." /></div>;
}

export function Header({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) { return <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-display text-3xl font-extrabold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{action}</div>; }
export function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">{text}</div>; }
