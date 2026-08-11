import React from 'react';
import { BellIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { notificationTemplates } from '../data/notifications';
import { statusOptions, newId } from '../config/options';
import { formatDate } from '../utils/format';
import type { NotificationTemplate } from '../types';

const channelOptions = [
{ value: 'push', label: 'Push notification' },
{ value: 'email', label: 'Email' },
{ value: 'sms', label: 'SMS' },
{ value: 'announcement', label: 'Announcement' }];


const channelTone = {
  push: 'info',
  email: 'primary',
  sms: 'warning',
  announcement: 'neutral'
} as const;

const columns: Column<NotificationTemplate>[] = [
{
  key: 'template',
  header: 'Template',
  render: (item) =>
  <div className="max-w-md">
        <p className="text-sm font-medium text-foreground">{item.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{item.subject}</p>
      </div>

},
{
  key: 'channel',
  header: 'Channel',
  render: (item) => <Badge tone={channelTone[item.channel]}>{item.channel}</Badge>
},
{
  key: 'body',
  header: 'Body',
  render: (item) =>
  <p className="line-clamp-1 max-w-sm font-mono text-[11px] text-muted-foreground">{item.body}</p>

},
{
  key: 'updated',
  header: 'Updated',
  render: (item) => <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'name', label: 'Template name', type: 'text', required: true, group: 'Template' },
{ key: 'channel', label: 'Channel', type: 'select', options: channelOptions, group: 'Template' },
{ key: 'subject', label: 'Subject / title', type: 'text', full: true, group: 'Template' },
{ key: 'body', label: 'Body', type: 'textarea', full: true, hint: 'Use {{variables}} for personalisation', group: 'Template' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Template' }];


export function Notifications() {
  return (
    <CrudScreen<NotificationTemplate>
      title="Notification Management"
      description="Push, email, SMS and announcement templates sent to farmers and dealers."
      endpoint="notifications"
      seed={notificationTemplates}
      columns={columns}
      fields={fields}
      createLabel="Add template"
      emptyIcon={BellIcon}
      searchFields={(item) => `${item.name} ${item.subject} ${item.body} ${item.channel}`}
      filters={[
      { key: 'channel', label: 'Channel', options: channelOptions },
      { key: 'status', label: 'Status', options: statusOptions }]
      }
      filterPredicates={{
        channel: (item, value) => item.channel === value,
        status: (item, value) => item.status === value
      }}
      rowLabel={(item) => item.name}
      makeEmpty={() => ({
        id: newId('tpl'),
        name: '',
        channel: 'push',
        subject: '',
        body: '',
        updatedAt: new Date().toISOString(),
        status: 'draft'
      })} />);


}