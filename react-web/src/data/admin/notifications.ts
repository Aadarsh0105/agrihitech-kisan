import type { NotificationTemplate } from '../types';

export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export const headerNotifications: HeaderNotification[] = [
{
  id: 'ntf_01',
  title: 'New dealer request',
  message: 'Shree Balaji Krishi Kendra (Nashik) submitted verification documents.',
  createdAt: '2026-08-11T09:12:00+05:30',
  read: false
},
{
  id: 'ntf_02',
  title: 'Mandi Bhav sync warning',
  message: 'Government API responded slowly for 3 districts in the last refresh.',
  createdAt: '2026-08-11T07:40:00+05:30',
  read: false
},
{
  id: 'ntf_03',
  title: 'Product published',
  message: 'Content Manager published “Hybrid Bajra Seed HB-908”.',
  createdAt: '2026-08-10T18:22:00+05:30',
  read: true
},
{
  id: 'ntf_04',
  title: 'SEO audit complete',
  message: '6 category pages are missing a meta description.',
  createdAt: '2026-08-10T11:05:00+05:30',
  read: true
}];


export const notificationTemplates: NotificationTemplate[] = [
{
  id: 'tpl_01',
  name: 'Dealer approval',
  channel: 'email',
  subject: 'Your dealer account is approved',
  body: 'Namaste {{dealer_name}}, your Agri HiTech Kisan dealer profile is now live.',
  updatedAt: '2026-08-04T10:00:00+05:30',
  status: 'active'
},
{
  id: 'tpl_02',
  name: 'Dealer rejection',
  channel: 'email',
  subject: 'Additional documents required',
  body: 'We could not verify {{document_name}}. Please re-upload a clearer copy.',
  updatedAt: '2026-07-29T10:00:00+05:30',
  status: 'active'
},
{
  id: 'tpl_03',
  name: 'New scheme alert',
  channel: 'push',
  subject: 'New government scheme in {{state}}',
  body: '{{scheme_name}} applications are now open. Tap to check eligibility.',
  updatedAt: '2026-08-08T10:00:00+05:30',
  status: 'active'
},
{
  id: 'tpl_04',
  name: 'Mandi price digest',
  channel: 'sms',
  subject: 'Daily mandi rates',
  body: 'Today in {{mandi}}: {{crop}} ₹{{price}}/quintal. Reply STOP to opt out.',
  updatedAt: '2026-08-09T10:00:00+05:30',
  status: 'active'
},
{
  id: 'tpl_05',
  name: 'Monsoon advisory',
  channel: 'announcement',
  subject: 'Kharif season advisory',
  body: 'Banner announcement shown across the homepage for 7 days.',
  updatedAt: '2026-06-14T10:00:00+05:30',
  status: 'inactive'
}];