import React from 'react';
import { HelpCircleIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { faqs } from '../data/content';
import { statusFilter, statusOptions, newId } from '../config/options';
import { t } from '../utils/i18n';
import type { Faq } from '../types';

const faqCategories = ['General', 'Dealers', 'Mandi Bhav', 'Pricing', 'Account'];

const columns: Column<Faq>[] = [
{
  key: 'question',
  header: 'Question',
  render: (item) =>
  <div className="max-w-lg">
        <p className="text-sm font-medium text-foreground">{t(item.question)}</p>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{t(item.answer)}</p>
      </div>

},
{ key: 'category', header: 'Category', render: (item) => <Badge tone="primary">{item.category}</Badge> },
{ key: 'order', header: 'Order', align: 'center', render: (item) => <span className="text-xs">{item.order}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'question', label: 'Question', type: 'translated', required: true, full: true, group: 'Content' },
{ key: 'answer', label: 'Answer', type: 'translatedArea', full: true, group: 'Content' },
{ key: 'category', label: 'Category', type: 'select', options: faqCategories.map((c) => ({ value: c, label: c })), group: 'Placement' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Placement' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function Faqs() {
  return (
    <CrudScreen<Faq>
      title="FAQ Management"
      description="Questions surfaced on the help centre and product pages."
      endpoint="faqs"
      seed={faqs}
      columns={columns}
      fields={fields}
      createLabel="Add FAQ"
      emptyIcon={HelpCircleIcon}
      searchFields={(item) => `${t(item.question)} ${t(item.answer)} ${item.category}`}
      filters={[
      statusFilter,
      { key: 'category', label: 'Category', options: faqCategories.map((c) => ({ value: c, label: c })) }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        category: (item, value) => item.category === value
      }}
      rowLabel={(item) => t(item.question)}
      makeEmpty={() => ({
        id: newId('faq'),
        question: { en: '' },
        answer: { en: '' },
        category: 'General',
        order: faqs.length + 1,
        status: 'draft'
      })} />);


}