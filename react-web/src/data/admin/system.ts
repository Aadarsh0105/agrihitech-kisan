import type {
  ActivityEntry,
  AdminUser,
  MediaAsset,
  Role,
  StaticPage,
  TranslationEntry } from
'../types';
import { assets } from './assets';

export const mediaAssets: MediaAsset[] = [
{ id: 'md_01', name: 'kharif-hero-desktop.jpg', type: 'image', url: assets.banner, folder: 'Banners', size: '412 KB', dimensions: '1920×640', uploadedAt: '2026-08-10T10:12:00+05:30' },
{ id: 'md_02', name: 'seed-packet-hb908.jpg', type: 'image', url: assets.product, folder: 'Products', size: '188 KB', dimensions: '1200×1200', uploadedAt: '2026-08-09T14:02:00+05:30' },
{ id: 'md_03', name: 'category-tools-flatlay.jpg', type: 'image', url: assets.category, folder: 'Categories', size: '224 KB', dimensions: '1200×1200', uploadedAt: '2026-08-08T09:20:00+05:30' },
{ id: 'md_04', name: 'dealer-shopfront-nashik.jpg', type: 'image', url: assets.storefront, folder: 'Dealers', size: '306 KB', dimensions: '1600×1200', uploadedAt: '2026-08-07T16:45:00+05:30' },
{ id: 'md_05', name: 'farmer-portrait-01.jpg', type: 'image', url: assets.farmer, folder: 'Testimonials', size: '162 KB', dimensions: '1000×1000', uploadedAt: '2026-08-06T11:30:00+05:30' },
{ id: 'md_06', name: 'hb-908-brochure.pdf', type: 'pdf', url: '#', folder: 'Brochures', size: '1.2 MB', uploadedAt: '2026-08-05T13:15:00+05:30' },
{ id: 'md_07', name: 'jivo-245-spec-sheet.pdf', type: 'pdf', url: '#', folder: 'Brochures', size: '2.4 MB', uploadedAt: '2026-08-04T10:05:00+05:30' },
{ id: 'md_08', name: 'drip-installation-guide.mp4', type: 'video', url: '#', folder: 'Videos', size: '38 MB', uploadedAt: '2026-08-02T18:00:00+05:30' },
{ id: 'md_09', name: 'app-promo-teaser.mp4', type: 'video', url: '#', folder: 'Videos', size: '54 MB', uploadedAt: '2026-07-28T12:40:00+05:30' },
{ id: 'md_10', name: 'brand-strip-coromandel.jpg', type: 'image', url: assets.storefront, folder: 'Brands', size: '96 KB', dimensions: '600×300', uploadedAt: '2026-07-26T15:22:00+05:30' }];


export const mediaFolders = ['All', 'Banners', 'Products', 'Categories', 'Brands', 'Dealers', 'Testimonials', 'Brochures', 'Videos'];

export const staticPages: StaticPage[] = [
{ id: 'pg_01', title: 'About Us', slug: 'about-us', content: { en: 'Agri HiTech Kisan connects Indian farmers with verified agricultural suppliers…' }, updatedAt: '2026-07-30T10:00:00+05:30', status: 'active', seo: { metaTitle: 'About Agri HiTech Kisan', metaDescription: 'Our mission and story.', keywords: ['about'], robots: 'index, follow' } },
{ id: 'pg_02', title: 'Privacy Policy', slug: 'privacy-policy', content: { en: 'This policy explains what personal data we collect and how we use it…' }, updatedAt: '2026-06-18T10:00:00+05:30', status: 'active', seo: { metaTitle: 'Privacy Policy', metaDescription: 'How we handle your data.', keywords: ['privacy'], robots: 'noindex, follow' } },
{ id: 'pg_03', title: 'Terms & Conditions', slug: 'terms-conditions', content: { en: 'By using this platform you agree to the following terms…' }, updatedAt: '2026-06-18T10:00:00+05:30', status: 'active', seo: { metaTitle: 'Terms & Conditions', metaDescription: 'Platform terms of use.', keywords: ['terms'], robots: 'noindex, follow' } },
{ id: 'pg_04', title: 'Refund Policy', slug: 'refund-policy', content: { en: 'Transactions happen directly with dealers. Refund terms are dealer specific…' }, updatedAt: '2026-05-11T10:00:00+05:30', status: 'active', seo: { metaTitle: 'Refund Policy', metaDescription: 'Refund terms.', keywords: ['refund'], robots: 'noindex, follow' } },
{ id: 'pg_05', title: 'Shipping Policy', slug: 'shipping-policy', content: { en: 'Delivery timelines are set by the fulfilling dealer…' }, updatedAt: '2026-05-11T10:00:00+05:30', status: 'draft', seo: { metaTitle: 'Shipping Policy', metaDescription: 'Shipping terms.', keywords: ['shipping'], robots: 'noindex, follow' } },
{ id: 'pg_06', title: 'Cookies Policy', slug: 'cookies-policy', content: { en: 'We use essential and analytics cookies…' }, updatedAt: '2026-04-02T10:00:00+05:30', status: 'active', seo: { metaTitle: 'Cookies Policy', metaDescription: 'Cookie usage.', keywords: ['cookies'], robots: 'noindex, follow' } },
{ id: 'pg_07', title: 'Contact Page', slug: 'contact', content: { en: 'Reach the Kisan helpline or write to our support desk…' }, updatedAt: '2026-08-01T10:00:00+05:30', status: 'active', seo: { metaTitle: 'Contact Us', metaDescription: 'Get in touch.', keywords: ['contact'], robots: 'index, follow' } }];


export const permissionModules = [
'Dashboard',
'Home CMS',
'Catalogue',
'Dealers',
'News & Blogs',
'Schemes',
'Media',
'SEO',
'Settings',
'Users & Roles'];


export const roles: Role[] = [
{
  id: 'rl_01',
  key: 'super_admin',
  name: 'Super Admin',
  description: 'Unrestricted access to every module and setting.',
  userCount: 2,
  permissions: Object.fromEntries(
    permissionModules.map((m) => [m, ['view', 'create', 'edit', 'delete']])
  ) as Role['permissions']
},
{
  id: 'rl_02',
  key: 'admin',
  name: 'Admin',
  description: 'Full operational access except billing and role management.',
  userCount: 4,
  permissions: Object.fromEntries(
    permissionModules.map((m) => [
    m,
    m === 'Users & Roles' ? ['view'] : ['view', 'create', 'edit', 'delete']]
    )
  ) as Role['permissions']
},
{
  id: 'rl_03',
  key: 'content_manager',
  name: 'Content Manager',
  description: 'Manages CMS, catalogue content, news and blogs.',
  userCount: 7,
  permissions: {
    Dashboard: ['view'],
    'Home CMS': ['view', 'create', 'edit', 'delete'],
    Catalogue: ['view', 'create', 'edit'],
    Dealers: ['view'],
    'News & Blogs': ['view', 'create', 'edit', 'delete'],
    Schemes: ['view', 'create', 'edit'],
    Media: ['view', 'create', 'edit'],
    SEO: ['view'],
    Settings: [],
    'Users & Roles': []
  }
},
{
  id: 'rl_04',
  key: 'dealer_manager',
  name: 'Dealer Manager',
  description: 'Approves, verifies and suspends dealer accounts.',
  userCount: 5,
  permissions: {
    Dashboard: ['view'],
    'Home CMS': [],
    Catalogue: ['view'],
    Dealers: ['view', 'create', 'edit', 'delete'],
    'News & Blogs': [],
    Schemes: [],
    Media: ['view'],
    SEO: [],
    Settings: [],
    'Users & Roles': []
  }
},
{
  id: 'rl_05',
  key: 'seo_manager',
  name: 'SEO Manager',
  description: 'Owns metadata, sitemaps and structured data.',
  userCount: 2,
  permissions: {
    Dashboard: ['view'],
    'Home CMS': ['view'],
    Catalogue: ['view', 'edit'],
    Dealers: [],
    'News & Blogs': ['view', 'edit'],
    Schemes: ['view'],
    Media: ['view'],
    SEO: ['view', 'create', 'edit', 'delete'],
    Settings: ['view'],
    'Users & Roles': []
  }
},
{
  id: 'rl_06',
  key: 'support',
  name: 'Support',
  description: 'Read-only access for the farmer helpline team.',
  userCount: 9,
  permissions: {
    Dashboard: ['view'],
    'Home CMS': [],
    Catalogue: ['view'],
    Dealers: ['view'],
    'News & Blogs': ['view'],
    Schemes: ['view'],
    Media: [],
    SEO: [],
    Settings: [],
    'Users & Roles': []
  }
}];


export const adminUsers: AdminUser[] = [
{ id: 'au_01', name: 'Rajeev Nandan', email: 'rajeev@agrihitechkisan.in', role: 'super_admin', roleName: 'Super Admin', avatar: assets.farmer, lastActive: '2026-08-11T09:40:00+05:30', status: 'active' },
{ id: 'au_02', name: 'Neha Bhatt', email: 'neha@agrihitechkisan.in', role: 'content_manager', roleName: 'Content Manager', avatar: assets.farmer, lastActive: '2026-08-11T08:15:00+05:30', status: 'active' },
{ id: 'au_03', name: 'Imran Sheikh', email: 'imran@agrihitechkisan.in', role: 'dealer_manager', roleName: 'Dealer Manager', avatar: assets.farmer, lastActive: '2026-08-10T19:02:00+05:30', status: 'active' },
{ id: 'au_04', name: 'Divya Krishnan', email: 'divya@agrihitechkisan.in', role: 'seo_manager', roleName: 'SEO Manager', avatar: assets.farmer, lastActive: '2026-08-09T13:55:00+05:30', status: 'active' },
{ id: 'au_05', name: 'Arun Kale', email: 'arun@agrihitechkisan.in', role: 'support', roleName: 'Support', avatar: assets.farmer, lastActive: '2026-08-08T10:31:00+05:30', status: 'inactive' }];


export const activities: ActivityEntry[] = [
{ id: 'ac_01', actor: 'Neha Bhatt', action: 'published', target: 'Hybrid Bajra Seed HB-908', module: 'Products', timestamp: '2026-08-11T09:22:00+05:30' },
{ id: 'ac_02', actor: 'Imran Sheikh', action: 'approved dealer', target: 'Annapurna Seeds & Supplies', module: 'Dealers', timestamp: '2026-08-11T08:50:00+05:30' },
{ id: 'ac_03', actor: 'Divya Krishnan', action: 'updated SEO for', target: 'Fertilizers category', module: 'SEO', timestamp: '2026-08-11T07:35:00+05:30' },
{ id: 'ac_04', actor: 'System', action: 'synced', target: 'Mandi Bhav – 2,412 mandis', module: 'Mandi Bhav', timestamp: '2026-08-11T06:00:00+05:30' },
{ id: 'ac_05', actor: 'Neha Bhatt', action: 'created', target: 'Monsoon Advisory 2026 banner', module: 'Banners', timestamp: '2026-08-10T17:12:00+05:30' },
{ id: 'ac_06', actor: 'Rajeev Nandan', action: 'changed role of', target: 'Arun Kale to Support', module: 'Users & Roles', timestamp: '2026-08-10T15:44:00+05:30' },
{ id: 'ac_07', actor: 'Imran Sheikh', action: 'suspended', target: 'Punjab Farm Machinery', module: 'Dealers', timestamp: '2026-08-10T12:08:00+05:30' }];


export const translationEntries: TranslationEntry[] = [
{ id: 'tr_01', module: 'Categories', field: 'name', reference: 'Seeds', values: { en: 'Seeds', hi: 'बीज', mr: 'बियाणे', gu: 'બિયારણ' } },
{ id: 'tr_02', module: 'Categories', field: 'name', reference: 'Fertilizers', values: { en: 'Fertilizers', hi: 'उर्वरक', mr: 'खते' } },
{ id: 'tr_03', module: 'Products', field: 'name', reference: 'Hybrid Bajra Seed HB-908', values: { en: 'Hybrid Bajra Seed HB-908', hi: 'हाइब्रिड बाजरा बीज HB-908' } },
{ id: 'tr_04', module: 'Banners', field: 'title', reference: 'Kharif Season Ready', values: { en: 'Kharif Season Ready', hi: 'खरीफ सीजन के लिए तैयार' } },
{ id: 'tr_05', module: 'Benefits', field: 'title', reference: 'Verified Sellers Only', values: { en: 'Verified Sellers Only' } },
{ id: 'tr_06', module: 'FAQs', field: 'question', reference: 'Is Agri HiTech Kisan an online store?', values: { en: 'Is Agri HiTech Kisan an online store?', hi: 'क्या एग्री हाईटेक किसान एक ऑनलाइन स्टोर है?' } },
{ id: 'tr_07', module: 'Schemes', field: 'name', reference: 'PM Kisan Samman Nidhi', values: { en: 'PM Kisan Samman Nidhi', hi: 'पीएम किसान सम्मान निधि', mr: 'पीएम किसान सन्मान निधी', ta: 'பிரதமர் கிசான் சம்மான் நிதி' } }];