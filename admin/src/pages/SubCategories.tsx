import React from 'react';
import { ListTreeIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Thumb } from '../components/shared/Thumb';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { categories, subCategories } from '../data/catalogue';
import { statusFilter, statusOptions, newId } from '../config/options';
import { formatNumber } from '../utils/format';
import { t } from '../utils/i18n';
import type { SubCategory } from '../types';

const parentOptions = categories.map((c) => ({ value: c.id, label: t(c.name) }));

const columns: Column<SubCategory>[] = [
{
  key: 'name',
  header: 'Sub category',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.image} alt={t(item.name)} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{t(item.name)}</p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">/{item.slug}</p>
        </div>
      </div>

},
{
  key: 'parent',
  header: 'Parent category',
  render: (item) => <Badge tone="primary">{item.parentCategoryName}</Badge>
},
{
  key: 'products',
  header: 'Products',
  align: 'right',
  render: (item) => <span className="text-xs font-medium">{formatNumber(item.productCount)}</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'parentCategoryId', label: 'Parent category', type: 'select', options: parentOptions, required: true, group: 'Details' },
{ key: 'slug', label: 'Slug', type: 'text', required: true, group: 'Details' },
{ key: 'name', label: 'Name', type: 'translated', required: true, full: true, group: 'Details' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Details' },
{ key: 'image', label: 'Image', type: 'image', full: true, group: 'Media' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function SubCategories() {
  return (
    <CrudScreen<SubCategory>
      title="Sub Category Management"
      description="Second-level taxonomy mapped to a parent category."
      endpoint="subCategories"
      seed={subCategories}
      columns={columns}
      fields={fields}
      createLabel="Add sub category"
      emptyIcon={ListTreeIcon}
      searchFields={(item) => `${t(item.name)} ${item.slug} ${item.parentCategoryName}`}
      filters={[
      statusFilter,
      { key: 'parent', label: 'Parent', options: categories.map((c) => ({ value: c.id, label: t(c.name) })) }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        parent: (item, value) => item.parentCategoryId === value
      }}
      rowLabel={(item) => t(item.name)}
      makeEmpty={() => ({
        id: newId('sub'),
        parentCategoryId: categories[0].id,
        parentCategoryName: t(categories[0].name),
        name: { en: '' },
        slug: '',
        description: { en: '' },
        image: '',
        productCount: 0,
        status: 'draft',
        seo: { metaTitle: '', metaDescription: '', keywords: [], robots: 'index, follow' }
      })} />);


}