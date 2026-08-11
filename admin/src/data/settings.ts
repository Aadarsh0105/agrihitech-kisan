export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  footerCopyright: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleMapsUrl: string;
  maintenanceMode: boolean;
}

export const siteSettings: SiteSettings = {
  siteName: 'Agri HiTech Kisan',
  tagline: "India's Agricultural Product Discovery Platform",
  logo: '/media/brand/logo.svg',
  favicon: '/media/brand/favicon.ico',
  primaryColor: '#1B7A4B',
  secondaryColor: '#B4761C',
  footerCopyright: '© 2026 Agri HiTech Kisan Pvt. Ltd. All rights reserved.',
  email: 'support@agrihitechkisan.in',
  phone: '+91 1800 200 4455',
  whatsapp: '+91 90000 44551',
  address: 'B-402, Agri Tower, Baner Road, Pune, Maharashtra 411045',
  googleMapsUrl: 'https://maps.google.com/?q=Baner+Road+Pune',
  maintenanceMode: false
};

export const socialLinks = [
{ id: 'sl_01', platform: 'Facebook', url: 'https://facebook.com/agrihitechkisan' },
{ id: 'sl_02', platform: 'Instagram', url: 'https://instagram.com/agrihitechkisan' },
{ id: 'sl_03', platform: 'Twitter', url: 'https://x.com/agrihitechkisan' },
{ id: 'sl_04', platform: 'LinkedIn', url: 'https://linkedin.com/company/agrihitechkisan' },
{ id: 'sl_05', platform: 'YouTube', url: 'https://youtube.com/@agrihitechkisan' }];


export interface IntegrationSetting {
  id: string;
  group: string;
  label: string;
  key: string;
  value: string;
  masked: boolean;
}

export const integrationSettings: IntegrationSetting[] = [
{ id: 'in_01', group: 'SMTP', label: 'SMTP Host', key: 'SMTP_HOST', value: 'smtp.sendgrid.net', masked: false },
{ id: 'in_02', group: 'SMTP', label: 'SMTP Port', key: 'SMTP_PORT', value: '587', masked: false },
{ id: 'in_03', group: 'SMTP', label: 'SMTP Password', key: 'SMTP_PASSWORD', value: 'SG.xxxxxxxxxxxxxxxx', masked: true },
{ id: 'in_04', group: 'Cloudinary', label: 'Cloud Name', key: 'CLOUDINARY_CLOUD', value: 'agrihitech', masked: false },
{ id: 'in_05', group: 'Cloudinary', label: 'API Secret', key: 'CLOUDINARY_SECRET', value: 'cld_xxxxxxxxxxxx', masked: true },
{ id: 'in_06', group: 'Analytics', label: 'Google Analytics ID', key: 'GA_MEASUREMENT_ID', value: 'G-4KX2P9QN71', masked: false },
{ id: 'in_07', group: 'Analytics', label: 'Google Tag Manager', key: 'GTM_ID', value: 'GTM-M7L4XZ2', masked: false },
{ id: 'in_08', group: 'Analytics', label: 'Meta Pixel ID', key: 'META_PIXEL_ID', value: '812774559102334', masked: false },
{ id: 'in_09', group: 'Payments', label: 'Razorpay Key ID', key: 'RAZORPAY_KEY_ID', value: 'rzp_live_xxxxxxxx', masked: true },
{ id: 'in_10', group: 'Payments', label: 'PhonePe Merchant ID', key: 'PHONEPE_MERCHANT_ID', value: 'AGRIHITECHONLINE', masked: false },
{ id: 'in_11', group: 'Payments', label: 'Cashfree Secret Key', key: 'CASHFREE_SECRET', value: 'cf_xxxxxxxxxxxx', masked: true }];


export interface MandiBhavConfig {
  apiKey: string;
  apiStatus: 'connected' | 'degraded' | 'disconnected';
  cacheDurationMinutes: number;
  refreshFrequencyHours: number;
  enabled: boolean;
  endpoint: string;
}

export const mandiBhavConfig: MandiBhavConfig = {
  apiKey: '579b464db66ec23bdd0000012xxxxxxxxxxxxxxx',
  apiStatus: 'connected',
  cacheDurationMinutes: 360,
  refreshFrequencyHours: 6,
  enabled: true,
  endpoint: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'
};

export interface GlobalSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
  canonicalBase: string;
  robots: string;
  schemaJson: string;
  sitemapEnabled: boolean;
  sitemapFrequency: string;
}

export const globalSeo: GlobalSeo = {
  metaTitle: 'Agri HiTech Kisan | Agricultural Product Discovery Platform',
  metaDescription:
  'Discover certified seeds, fertilizers, machinery and verified dealers across India. Daily mandi prices and government schemes in 12 languages.',
  keywords: 'agriculture, seeds, fertilizers, tractors, mandi bhav, kisan, dealers',
  ogImage: '/media/seo/og-default.jpg',
  twitterHandle: '@agrihitechkisan',
  canonicalBase: 'https://agrihitechkisan.in',
  robots: 'index, follow',
  schemaJson: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Agri HiTech Kisan"\n}',
  sitemapEnabled: true,
  sitemapFrequency: 'daily'
};

export interface PageSeoRow {
  id: string;
  page: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  score: number;
  indexed: boolean;
}

export const pageSeoRows: PageSeoRow[] = [
{ id: 'ps_01', page: 'Homepage', path: '/', metaTitle: 'Agri HiTech Kisan | Agri Product Discovery', metaDescription: 'Seeds, fertilizers, machinery and verified dealers across India.', score: 94, indexed: true },
{ id: 'ps_02', page: 'Seeds Category', path: '/category/seeds', metaTitle: 'Buy Certified Seeds Online', metaDescription: 'Hybrid and research seeds for kharif and rabi.', score: 88, indexed: true },
{ id: 'ps_03', page: 'Fertilizers Category', path: '/category/fertilizers', metaTitle: 'Fertilizers & Soil Nutrition', metaDescription: '', score: 61, indexed: true },
{ id: 'ps_04', page: 'Dealer Directory', path: '/dealers', metaTitle: 'Find Verified Agri Dealers Near You', metaDescription: 'District-wise verified dealer directory.', score: 91, indexed: true },
{ id: 'ps_05', page: 'Mandi Bhav', path: '/mandi-bhav', metaTitle: 'Daily Mandi Bhav', metaDescription: 'Live government mandi prices for 2,400+ mandis.', score: 86, indexed: true },
{ id: 'ps_06', page: 'Govt. Schemes', path: '/schemes', metaTitle: 'Agriculture Government Schemes', metaDescription: '', score: 58, indexed: true },
{ id: 'ps_07', page: 'Privacy Policy', path: '/privacy-policy', metaTitle: 'Privacy Policy', metaDescription: 'How we handle your data.', score: 72, indexed: false }];