import { useEffect, useState } from 'react';
import { Building2, Edit3, Package, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Field, Input, Select, Textarea } from '../../components/admin/ui/Input';
import { ConfirmDialog, Modal } from '../../components/admin/ui/Modal';
import { getPublicCategories, type PublicCategory } from '../../services/category.service';
import {
  createCompanyProduct,
  deleteCompanyProduct,
  getCompanyProducts,
  getCompanyProfile,
  updateCompanyProduct,
  type CompanyProductApi,
  type CompanyProductDraft,
  type CompanyProfileApi,
} from '../../services/company.service';
import { Empty, Header } from './Brands';

const blank: CompanyProductDraft = { name: '', category: '', description: '', images: [] };

export function CompanyProducts() {
  const [products, setProducts] = useState<CompanyProductApi[]>([]);
  const [company, setCompany] = useState<CompanyProfileApi | null>(null);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [draft, setDraft] = useState<CompanyProductDraft>(blank);
  const [editing, setEditing] = useState<CompanyProductApi | null>(null);
  const [remove, setRemove] = useState<CompanyProductApi | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([getCompanyProducts(), getCompanyProfile(), getPublicCategories()])
      .then(([items, profile, categoryRows]) => {
        setProducts(items);
        setCompany(profile);
        setCategories(categoryRows);
      })
      .catch((reason) => setError(reason.response?.data?.message || reason.message))
      .finally(() => setLoading(false));

  useEffect(() => { void load(); }, []);

  const create = () => {
    setEditing(null);
    setDraft(blank);
    setOpen(true);
  };

  const edit = (item: CompanyProductApi) => {
    setEditing(item);
    setDraft({
      name: item.name,
      category: item.category?._id || '',
      description: item.description || '',
      images: [],
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) await updateCompanyProduct(editing._id, draft);
      else await createCompanyProduct(draft);
      setOpen(false);
      await load();
    } catch (reason: any) {
      setError(reason.response?.data?.message || reason.message);
    } finally {
      setSaving(false);
    }
  };

  const cannotSave = saving || !draft.name.trim() || !draft.category || (!editing && draft.images.length === 0);

  return <div className="space-y-6">
    <Header
      title="My Products"
      description="Products published under your company brand."
      action={<Button variant="primary" onClick={create}><Plus className="h-4 w-4" />Add product</Button>}
    />
    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <Building2 className="h-8 w-8 text-primary" />
      <div><p className="text-xs text-muted-foreground">Brand</p><p className="font-display font-bold">{company?.companyName || 'Your company'}</p></div>
    </div>
    {error ? <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
    {loading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : products.length ? (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => <article key={product._id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="grid h-40 place-items-center bg-muted/50">
            {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-contain p-3" /> : <Package className="h-10 w-10 text-primary/50" />}
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase text-primary">{product.companyBrand?.companyName || company?.companyName}</p>
            <h2 className="mt-1 font-display font-bold">{product.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{product.category?.name}</p>
            {product.description ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p> : null}
            <div className="mt-4 flex gap-2 border-t border-border pt-3">
              <Button size="sm" className="flex-1" onClick={() => edit(product)}><Edit3 className="h-4 w-4" />Edit</Button>
              <Button size="sm" variant="outlineDanger" onClick={() => setRemove(product)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </article>)}
      </div>
    ) : <Empty text="No company products added yet." />}
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={editing ? 'Edit company product' : 'Add company product'}
      size="lg"
      footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" disabled={cannotSave} onClick={save}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create product'}</Button></>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" required>
          <Input value={draft.name} onChange={(e) => setDraft((old) => ({ ...old, name: e.target.value }))} />
        </Field>
        <Field label="Category" required>
          <Select value={draft.category} onChange={(e) => setDraft((old) => ({ ...old, category: e.target.value }))}>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
        </Field>
        <Field label={editing ? 'Image (leave empty to keep current)' : 'Image'} required={!editing} className="sm:col-span-2">
          <Input type="file" multiple accept="image/*" onChange={(e) => setDraft((old) => ({ ...old, images: Array.from(e.target.files || []) }))} />
        </Field>
        <Field label="Description (optional)" className="sm:col-span-2">
          <Textarea value={draft.description} onChange={(e) => setDraft((old) => ({ ...old, description: e.target.value }))} />
        </Field>
      </div>
    </Modal>
    <ConfirmDialog
      open={Boolean(remove)}
      onClose={() => setRemove(null)}
      onConfirm={async () => { if (remove) { await deleteCompanyProduct(remove._id); setRemove(null); await load(); } }}
      title="Delete product"
      message="This company product will be permanently removed."
    />
  </div>;
}
