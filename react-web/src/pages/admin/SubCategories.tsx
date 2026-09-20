import { useEffect, useState } from 'react';
import api from '../../api/admin/axios';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { Button } from '../../components/admin/ui/Button';

type Category = { _id: string; name: string };
type SubCategory = { _id: string; name: string; category: Category };

export function SubCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<SubCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [categoryResponse, subCategoryResponse] = await Promise.all([
        api.get('/categories'), api.get('/subcategories')
      ]);
      setCategories((Array.isArray(categoryResponse.data) ? categoryResponse.data : categoryResponse.data.categories || [])
        .filter((category: Category) => !/medicine/i.test(category.name)));
      setItems(subCategoryResponse.data.subCategories || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load subcategories');
    }
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!name.trim() || !categoryId) { setError('Select a category and enter a name.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = { name: name.trim(), categoryId };
      if (editingId) await api.put(`/subcategories/${editingId}`, payload);
      else await api.post('/subcategories', payload);
      setName(''); setEditingId(''); setCategoryId('');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save subcategory');
    } finally { setSaving(false); }
  };
  const remove = async (item: SubCategory) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    setError('');
    try { await api.delete(`/subcategories/${item._id}`); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete subcategory'); }
  };

  return <div className="space-y-6">
    <PageHeader title="Sub Category Management" description="Manage the subcategories shown under each product category." />
    {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="rounded-xl border border-border bg-background px-3 py-2 text-foreground" value={categoryId} onChange={event => setCategoryId(event.target.value)}>
          <option value="">Select parent category</option>
          {categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
        </select>
        <input className="rounded-xl border border-border bg-background px-3 py-2 text-foreground" placeholder="Subcategory name, e.g. Wheat" value={name} onChange={event => setName(event.target.value)} />
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" disabled={saving} onClick={save}>{editingId ? 'Save changes' : 'Add subcategory'}</Button>
        {editingId && <Button onClick={() => { setEditingId(''); setName(''); setCategoryId(''); }}>Cancel</Button>}
      </div>
    </div>
    <div className="space-y-2">
      {items.map(item => <div key={item._id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">{item.category?.name}</p></div>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingId(item._id); setName(item.name); setCategoryId(item.category?._id || ''); }}>Edit</Button>
          <Button onClick={() => void remove(item)}>Delete</Button>
        </div>
      </div>)}
      {!items.length && <p className="text-sm text-muted-foreground">No subcategories yet.</p>}
    </div>
  </div>;
}
