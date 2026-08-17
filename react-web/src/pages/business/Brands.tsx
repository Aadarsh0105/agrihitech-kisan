import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, Edit3, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { ConfirmDialog, Modal } from '../../components/admin/ui/Modal';
import { Field, Input, Select } from '../../components/admin/ui/Input';
import { getPublicCategories, type PublicCategory } from '../../services/category.service';
import { getSessionUser } from '../../services/auth-session';
import { createMyBrand, deleteMyBrand, getMyBrands, updateMyBrand, type BusinessBrand, type BusinessBrandDraft } from '../../services/business.service';

const emptyDraft: BusinessBrandDraft = { name: '', category: '', image: null };
const messageOf = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.error ?? error.response?.data?.message ?? error.message : error instanceof Error ? error.message : 'Something went wrong';

export function BusinessBrands() {
  const [brands, setBrands] = useState<BusinessBrand[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [draft, setDraft] = useState<BusinessBrandDraft>({ ...emptyDraft });
  const [editing, setEditing] = useState<BusinessBrand | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BusinessBrand | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { const [ownedBrands, categoryList] = await Promise.all([getMyBrands(), getPublicCategories()]); setBrands(ownedBrands); setCategories(categoryList); }
    catch (requestError) { setError(messageOf(requestError)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const allowedCategories = useMemo(() => {
    const assigned = getSessionUser()?.categories?.map((name) => name.toLowerCase()) ?? [];
    return assigned.length ? categories.filter((category) => assigned.includes(category.name.toLowerCase())) : categories;
  }, [categories]);

  const openCreate = () => { setEditing(null); setDraft({ ...emptyDraft }); setError(''); setModalOpen(true); };
  const openEdit = (brand: BusinessBrand) => { setEditing(brand); setDraft({ name: brand.name, category: brand.category?._id ?? '', image: null }); setError(''); setModalOpen(true); };
  const save = async () => {
    if (!draft.name.trim() || !draft.category || (!editing && !draft.image)) return;
    setSaving(true); setError('');
    try { editing ? await updateMyBrand(editing._id, draft) : await createMyBrand(draft); setModalOpen(false); await load(); }
    catch (requestError) { setError(messageOf(requestError)); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!pendingDelete || !brands.some((brand) => brand._id === pendingDelete._id)) return;
    setSaving(true); setError('');
    try { await deleteMyBrand(pendingDelete._id); setPendingDelete(null); await load(); }
    catch (requestError) { setError(messageOf(requestError)); }
    finally { setSaving(false); }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-display text-3xl font-extrabold">My Brands</h1><p className="mt-2 text-sm text-muted-foreground">Create and manage brands owned by your business.</p></div><Button variant="primary" onClick={openCreate}><Plus className="h-4 w-4" />Add brand</Button></div>
    {error ? <div className="rounded-xl border border-danger/20 bg-danger-subtle p-4 text-sm text-danger">{error}</div> : null}
    {loading ? <Message text="Loading your brands..." /> : brands.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{brands.map((brand) => <BrandCard key={brand._id} brand={brand} onEdit={() => openEdit(brand)} onDelete={() => setPendingDelete(brand)} />)}</div> : <Message text="You have not created any brands yet." />}

    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit brand' : 'Add brand'} description="The brand will belong only to your business account." footer={<><Button onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => void save()} disabled={saving || !draft.name.trim() || !draft.category || (!editing && !draft.image)}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create brand'}</Button></>}>
      <div className="space-y-4">
        <Field label="Brand name" required><Input value={draft.name} placeholder="Enter brand name" onChange={(event) => setDraft((old) => ({ ...old, name: event.target.value }))} /></Field>
        <Field label="Category" required><Select value={draft.category} onChange={(event) => setDraft((old) => ({ ...old, category: event.target.value }))}><option value="">Select category</option>{allowedCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></Field>
        <Field label="Brand image" required={!editing} hint={editing ? 'Leave empty to keep the current image' : 'Upload a logo or brand image'}><Input type="file" accept="image/*" onChange={(event) => setDraft((old) => ({ ...old, image: event.target.files?.[0] ?? null }))} /></Field>
        {draft.image ? <img src={URL.createObjectURL(draft.image)} alt="Brand preview" className="h-28 w-full rounded-xl border border-border object-contain p-2" /> : editing?.image ? <img src={editing.image} alt={editing.name} className="h-28 w-full rounded-xl border border-border object-contain p-2" /> : null}
      </div>
    </Modal>
    <ConfirmDialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} onConfirm={() => void remove()} title="Delete brand" message="This brand will be permanently removed. Delete its products first if the backend prevents removal." />
  </div>;
}

function BrandCard({ brand, onEdit, onDelete }: { brand: BusinessBrand; onEdit: () => void; onDelete: () => void }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"><div className="grid h-40 place-items-center bg-muted/50">{brand.image ? <img src={brand.image} alt={brand.name} className="h-full w-full object-contain p-3" /> : <BadgeCheck className="h-10 w-10 text-primary/50" />}</div><div className="p-4"><h2 className="font-display text-lg font-bold">{brand.name}</h2><p className="mt-1 text-sm text-muted-foreground">{brand.category?.name ?? 'Uncategorized'}</p><div className="mt-4 flex gap-2 border-t border-border pt-3"><Button size="sm" className="flex-1" onClick={onEdit}><Edit3 className="h-3.5 w-3.5" />Edit</Button><Button variant="outlineDanger" size="sm" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" />Delete</Button></div></div></article>;
}

function Message({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">{text}</div>; }
