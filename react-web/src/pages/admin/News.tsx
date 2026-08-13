import React from 'react';
import { NewspaperIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../../components/admin/shared/CrudScreen';
import type { Column } from '../../components/admin/shared/DataTable';
import { Thumb } from '../../components/admin/shared/Thumb';
import { Badge, StatusBadge } from '../../components/admin/ui/Badge';
import { news } from '../../data/admin/content';
import { statusFilter, statusOptions, newId } from '../../config/admin/options';
import { formatDate } from '../../utils/admin/format';
import { t } from '../../utils/admin/i18n';
import type { NewsArticle } from '../../types/admin';

const newsCategories = ['Weather', 'Policy', 'Market', 'Technology', 'Industry'];

const columns: Column<NewsArticle>[] = [
{
  key: 'article',
  header: 'Article',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.featuredImage} alt={t(item.title)} size="lg" />
        <div className="min-w-0 max-w-md">
          <p className="truncate text-sm font-medium text-foreground">{t(item.title)}</p>
          <p className="line-clamp-1 text-[11px] text-muted-foreground">{t(item.description)}</p>
        </div>
      </div>

},
{ key: 'category', header: 'Category', render: (item) => <Badge tone="primary">{item.category}</Badge> },
{ key: 'author', header: 'Author', render: (item) => <span className="text-xs">{item.author}</span> },
{
  key: 'published',
  header: 'Published',
  render: (item) => <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'title', label: 'Headline', type: 'translated', required: true, full: true, group: 'Content' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Content' },
{ key: 'featuredImage', label: 'Featured image', type: 'image', full: true, group: 'Media' },
{ key: 'category', label: 'Category', type: 'select', options: newsCategories.map((c) => ({ value: c, label: c })), group: 'Publishing' },
{ key: 'author', label: 'Author', type: 'text', group: 'Publishing' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Publishing' }];


export function News() {
  return (
    <CrudScreen<NewsArticle>
      title="News Management"
      description="Agriculture news cards published to the homepage and news listing."
      endpoint="news"
      seed={news}
      columns={columns}
      fields={fields}
      createLabel="Add article"
      emptyIcon={NewspaperIcon}
      searchFields={(item) => `${t(item.title)} ${t(item.description)} ${item.author} ${item.category}`}
      filters={[
      statusFilter,
      { key: 'category', label: 'Category', options: newsCategories.map((c) => ({ value: c, label: c })) }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        category: (item, value) => item.category === value
      }}
      rowLabel={(item) => t(item.title)}
      makeEmpty={() => ({
        id: newId('nws'),
        title: { en: '' },
        description: { en: '' },
        featuredImage: '',
        category: 'Policy',
        author: '',
        publishedAt: new Date().toISOString(),
        status: 'draft',
        seo: { metaTitle: '', metaDescription: '', keywords: [], robots: 'index, follow' }
      })} />);


}