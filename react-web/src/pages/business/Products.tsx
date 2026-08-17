import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Edit3, Package, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { ConfirmDialog, Modal } from '../../components/admin/ui/Modal';
import { Field, Input, Select, Textarea } from '../../components/admin/ui/Input';
import { createMyProduct, deleteMyProduct, getMyBrands, getMyProducts, updateMyProduct, type BusinessBrand, type BusinessProduct, type BusinessProductDraft } from '../../services/business.service';

const emptyDraft: BusinessProductDraft = { name: '', category: '', brand: '', description: '', price: 0, quantity: 0, unit: '', brandVariant: '', qualityGrade: '', suitableCrops: '', keyBenefits: '', safetyPrecautions: '', activeIngredient: '', targetPests: '', safetyPeriod: '', packSize: '', storage: '', images: null };
const messageOf = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.error ?? error.response?.data?.message ?? error.message : error instanceof Error ? error.message : 'Something went wrong';

export function BusinessProducts() {
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [brands, setBrands] = useState<BusinessBrand[]>([]);
  const [draft, setDraft] = useState<BusinessProductDraft>({ ...emptyDraft });
  const [editing, setEditing] = useState<BusinessProduct | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BusinessProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { const [myBrands, myProducts] = await Promise.all([getMyBrands(), getMyProducts()]); setBrands(myBrands); setProducts(myProducts); }
    catch (requestError) { setError(messageOf(requestError)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    brands.forEach((brand) => { if (brand.category) unique.set(brand.category._id, brand.category.name); });
    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [brands]);
  const availableBrands = brands.filter((brand) => brand.category?._id === draft.category);
  const set = <K extends keyof BusinessProductDraft>(key: K, value: BusinessProductDraft[K]) => setDraft((old) => ({ ...old, [key]: value }));

  const openCreate = () => { setEditing(null); setDraft({ ...emptyDraft }); setError(''); setModalOpen(true); };
  const openEdit = (product: BusinessProduct) => {
    setEditing(product);
    setDraft({ name: product.name, category: product.categoryId ?? '', brand: product.brandId ?? '', description: product.description ?? '', price: product.price ?? 0, quantity: product.quantity ?? 0, unit: product.unit ?? '', brandVariant: product.brandVariant ?? '', qualityGrade: product.qualityGrade ?? '', suitableCrops: product.suitableCrops?.join(', ') ?? '', keyBenefits: product.keyBenefits?.join(', ') ?? '', safetyPrecautions: product.safetyPrecautions ?? '', activeIngredient: product.specifications?.activeIngredient ?? '', targetPests: product.specifications?.targetPests ?? '', safetyPeriod: product.specifications?.safetyPeriod ?? '', packSize: product.specifications?.packSize ?? '', storage: product.specifications?.storage ?? '', images: null });
    setError(''); setModalOpen(true);
  };
  const save = async () => {
    if (!draft.name.trim() || !draft.category || !draft.brand || (!editing && !draft.images?.length)) return;
    setSaving(true); setError('');
    try { editing ? await updateMyProduct(editing._id, draft) : await createMyProduct(draft); setModalOpen(false); await load(); }
    catch (requestError) { setError(messageOf(requestError)); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!pendingDelete || !products.some((item) => item._id === pendingDelete._id)) return;
    setSaving(true);
    try { await deleteMyProduct(pendingDelete._id); setPendingDelete(null); await load(); }
    catch (requestError) { setError(messageOf(requestError)); }
    finally { setSaving(false); }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-display text-3xl font-extrabold">My Products</h1><p className="mt-2 text-sm text-muted-foreground">Create and manage only products owned by your business.</p></div><Button variant="primary" onClick={openCreate} disabled={!brands.length}><Plus className="h-4 w-4" />Add product</Button></div>
    {!brands.length && !loading ? <div className="rounded-xl border border-warning/30 bg-warning-subtle p-4 text-sm text-warning">Create a brand before adding products.</div> : null}
    {error ? <div className="rounded-xl border border-danger/20 bg-danger-subtle p-4 text-sm text-danger">{error}</div> : null}
    {loading ? <Message text="Loading your products..." /> : products.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} onEdit={() => openEdit(product)} onDelete={() => setPendingDelete(product)} />)}</div> : <Message text="You have not created any products yet." />}
    <ProductModal open={modalOpen} editing={editing} saving={saving} draft={draft} categories={categories} brands={availableBrands} set={set} close={() => setModalOpen(false)} save={save} />
    <ConfirmDialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} onConfirm={() => void remove()} title="Delete product" message="This product will be permanently removed from your catalogue." />
  </div>;
}

function ProductCard({ product, onEdit, onDelete }: { product: BusinessProduct; onEdit: () => void; onDelete: () => void }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"><div className="grid h-40 place-items-center bg-muted/50">{product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-contain p-3" /> : <Package className="h-10 w-10 text-primary/50" />}</div><div className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.brandName}</p><h2 className="mt-1 font-display text-base font-bold">{product.name}</h2><div className="mt-3 flex justify-between text-sm"><span className="font-bold">{product.price != null ? `₹${product.price}` : 'Price unavailable'}</span><span className="text-muted-foreground">{product.quantity ?? ''} {product.unit ?? ''}</span></div><div className="mt-4 flex gap-2 border-t border-border pt-3"><Button size="sm" className="flex-1" onClick={onEdit}><Edit3 className="h-3.5 w-3.5" />Edit</Button><Button variant="outlineDanger" size="sm" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button></div></div></article>;
}

type SetDraft = <K extends keyof BusinessProductDraft>(key: K, value: BusinessProductDraft[K]) => void;
function ProductModal({ open, editing, saving, draft, categories, brands, set, close, save }: { open: boolean; editing: BusinessProduct | null; saving: boolean; draft: BusinessProductDraft; categories: Array<{ id: string; name: string }>; brands: BusinessBrand[]; set: SetDraft; close: () => void; save: () => Promise<void> }) {
  return <Modal open={open} onClose={close} title={editing ? 'Edit product' : 'Add product'} description="Products are added under one of your own brands." size="lg" footer={<><Button onClick={close}>Cancel</Button><Button variant="primary" onClick={() => void save()} disabled={saving || !draft.name.trim() || !draft.category || !draft.brand || (!editing && !draft.images?.length)}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create product'}</Button></>}><div className="grid gap-4 sm:grid-cols-2">
    <Field label="Product name" required><Input value={draft.name} onChange={(e) => set('name', e.target.value)} /></Field>
    <Field label="Category" required><Select value={draft.category} onChange={(e) => { set('category', e.target.value); set('brand', ''); }}><option value="">Select category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
    <Field label="Brand" required hint={!draft.category ? 'Select a category first' : undefined}><Select value={draft.brand} disabled={!draft.category} onChange={(e) => set('brand', e.target.value)}><option value="">Select your brand</option>{brands.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</Select></Field>
    <Field label="Price"><Input type="number" min="0" value={draft.price} onChange={(e) => set('price', Number(e.target.value))} /></Field>
    <Field label="Quantity"><Input type="number" min="0" value={draft.quantity} onChange={(e) => set('quantity', Number(e.target.value))} /></Field>
    <Field label="Unit"><Input value={draft.unit} onChange={(e) => set('unit', e.target.value)} /></Field>
    <Field label="Brand variant"><Input value={draft.brandVariant} onChange={(e) => set('brandVariant', e.target.value)} /></Field>
    <Field label="Quality grade"><Input value={draft.qualityGrade} onChange={(e) => set('qualityGrade', e.target.value)} /></Field>
    <Field label="Description" className="sm:col-span-2"><Textarea value={draft.description} onChange={(e) => set('description', e.target.value)} /></Field>
    <Field label="Suitable crops" hint="Comma-separated"><Input value={draft.suitableCrops} onChange={(e) => set('suitableCrops', e.target.value)} /></Field>
    <Field label="Key benefits" hint="Comma-separated"><Input value={draft.keyBenefits} onChange={(e) => set('keyBenefits', e.target.value)} /></Field>
    <Field label="Active ingredient"><Input value={draft.activeIngredient} onChange={(e) => set('activeIngredient', e.target.value)} /></Field>
    <Field label="Target pests"><Input value={draft.targetPests} onChange={(e) => set('targetPests', e.target.value)} /></Field>
    <Field label="Safety period"><Input value={draft.safetyPeriod} onChange={(e) => set('safetyPeriod', e.target.value)} /></Field>
    <Field label="Pack size"><Input value={draft.packSize} onChange={(e) => set('packSize', e.target.value)} /></Field>
    <Field label="Storage"><Input value={draft.storage} onChange={(e) => set('storage', e.target.value)} /></Field>
    <Field label="Safety precautions"><Textarea value={draft.safetyPrecautions} onChange={(e) => set('safetyPrecautions', e.target.value)} /></Field>
    <Field label="Product images" required={!editing} hint={editing ? 'Leave empty to keep existing images' : 'Choose up to 5 images'}><Input type="file" accept="image/*" multiple onChange={(e) => set('images', e.target.files ? Array.from(e.target.files).slice(0, 5) : null)} /></Field>
  </div></Modal>;
}

function Message({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">{text}</div>; }
