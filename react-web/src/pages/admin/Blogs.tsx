import React from 'react';
import { PenLineIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../../components/admin/shared/CrudScreen';
import type { Column } from '../../components/admin/shared/DataTable';
import { Thumb } from '../../components/admin/shared/Thumb';
import { Badge, StatusBadge } from '../../components/admin/ui/Badge';
import { blogs } from '../../data/admin/content';
import { statusFilter, statusOptions, newId } from '../../config/admin/options';
import { formatDate } from '../../utils/admin/format';
import { t } from '../../utils/admin/i18n';
import type { BlogPost } from '../../types/admin';

const blogCategories = ['Soil Health', 'Irrigation', 'Crop Protection', 'Nutrition', 'Machinery'];

const columns: Column<BlogPost>[] = [
{
  key: 'post',
  header: 'Post',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.featuredImage} alt={t(item.title)} size="lg" />
        <div className="min-w-0 max-w-md">
          <p className="truncate text-sm font-medium text-foreground">{t(item.title)}</p>
          <p className="truncate text-[11px] text-muted-foreground">by {item.author}</p>
        </div>
      </div>

},
{ key: 'category', header: 'Category', render: (item) => <Badge tone="primary">{item.category}</Badge> },
{
  key: 'tags',
  header: 'Tags',
  render: (item) =>
  <div className="flex flex-wrap gap-1">
        {item.tags.slice(0, 3).map((tag) =>
    <Badge key={tag}>#{tag}</Badge>
    )}
      </div>

},
{
  key: 'published',
  header: 'Published',
  render: (item) => <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'title', label: 'Title', type: 'translated', required: true, full: true, group: 'Content' },
{ key: 'content', label: 'Body', type: 'translatedArea', full: true, group: 'Content' },
{ key: 'featuredImage', label: 'Featured image', type: 'image', full: true, group: 'Media' },
{ key: 'category', label: 'Category', type: 'select', options: blogCategories.map((c) => ({ value: c, label: c })), group: 'Publishing' },
{ key: 'tags', label: 'Tags', type: 'tags', group: 'Publishing' },
{ key: 'author', label: 'Author', type: 'text', group: 'Publishing' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Publishing' }];


export function Blogs() {
  return (
    <CrudScreen<BlogPost>
      title="Blog Management"
      description="Long-form agronomy content with tags and SEO metadata."
      endpoint="blogs"
      seed={blogs}
      columns={columns}
      fields={fields}
      createLabel="Add post"
      emptyIcon={PenLineIcon}
      searchFields={(item) => `${t(item.title)} ${item.author} ${item.tags.join(' ')} ${item.category}`}
      filters={[
      statusFilter,
      { key: 'category', label: 'Category', options: blogCategories.map((c) => ({ value: c, label: c })) }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        category: (item, value) => item.category === value
      }}
      rowLabel={(item) => t(item.title)}
      makeEmpty={() => ({
        id: newId('blg'),
        title: { en: '' },
        content: { en: '' },
        featuredImage: '',
        category: 'Soil Health',
        tags: [],
        author: '',
        publishedAt: new Date().toISOString(),
        status: 'draft',
        seo: { metaTitle: '', metaDescription: '', keywords: [], robots: 'index, follow' }
      })} />);


}