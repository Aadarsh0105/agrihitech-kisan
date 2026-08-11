/**
 * Shared domain types for the Agri HiTech Kisan admin panel.
 * Every entity mirrors the shape the REST API is expected to return so that
 * hardcoded arrays can be swapped for Axios responses with no UI changes.
 */

export type LanguageCode =
'en' |
'hi' |
'mr' |
'gu' |
'pa' |
'ta' |
'te' |
'kn' |
'ml' |
'bn' |
'or' |
'as';

/** Translatable content field. English is required, other locales optional. */
export type Translated = {en: string;} & Partial<Record<LanguageCode, string>>;

export type Status = 'active' | 'inactive' | 'draft' | 'archived';

export interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
}

export interface Banner {
  id: string;
  title: Translated;
  subtitle: Translated;
  desktopImage: string;
  mobileImage: string;
  buttonText: Translated;
  buttonUrl: string;
  order: number;
  status: Status;
}

export interface PlatformFeature {
  id: string;
  icon: string;
  title: Translated;
  description: Translated;
  route: string;
  order: number;
  status: Status;
}

export interface Category {
  id: string;
  name: Translated;
  slug: string;
  description: Translated;
  image: string;
  icon: string;
  featured: boolean;
  order: number;
  productCount: number;
  status: Status;
  seo: SeoMeta;
}

export interface SubCategory {
  id: string;
  parentCategoryId: string;
  parentCategoryName: string;
  name: Translated;
  slug: string;
  description: Translated;
  image: string;
  productCount: number;
  status: Status;
  seo: SeoMeta;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: Translated;
  website: string;
  verified: boolean;
  featured: boolean;
  productCount: number;
  status: Status;
  seo: SeoMeta;
}

export interface ProductAttributeValue {
  attributeId: string;
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: Translated;
  slug: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  brandId: string;
  brandName: string;
  shortDescription: Translated;
  fullDescription: Translated;
  benefits: string[];
  technicalDetails: string;
  specifications: {label: string;value: string;}[];
  usage: Translated;
  packing: string;
  image: string;
  gallery: string[];
  brochureUrl: string;
  videoUrl: string;
  price: number;
  mrp: number;
  discount: number;
  availability: 'in_stock' | 'out_of_stock' | 'on_request';
  featured: boolean;
  trending: boolean;
  attributes: ProductAttributeValue[];
  status: Status;
  seo: SeoMeta;
  updatedAt: string;
}

export type AttributeInputType = 'text' | 'number' | 'select' | 'multiselect' | 'boolean';

export interface ProductAttribute {
  id: string;
  name: string;
  code: string;
  inputType: AttributeInputType;
  unit?: string;
  options: string[];
  appliesTo: string[];
  required: boolean;
  order: number;
  status: Status;
}

export type DealerStatus = 'approved' | 'pending' | 'rejected' | 'suspended';

export interface DealerDocument {
  id: string;
  name: string;
  type: 'gst' | 'license' | 'pan' | 'shop_photo' | 'other';
  url: string;
  verified: boolean;
}

export interface Dealer {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  licenseNumber: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  categories: string[];
  productCount: number;
  documents: DealerDocument[];
  verified: boolean;
  status: DealerStatus;
  appliedAt: string;
  logo: string;
}

export interface NewsArticle {
  id: string;
  title: Translated;
  description: Translated;
  featuredImage: string;
  category: string;
  author: string;
  publishedAt: string;
  status: Status;
  seo: SeoMeta;
}

export interface BlogPost {
  id: string;
  title: Translated;
  content: Translated;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  status: Status;
  seo: SeoMeta;
}

export interface GovernmentScheme {
  id: string;
  name: Translated;
  department: string;
  level: 'central' | 'state';
  state: string;
  description: Translated;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  officialWebsite: string;
  applyLink: string;
  featured: boolean;
  order: number;
  status: Status;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  photo: string;
  review: Translated;
  rating: number;
  location: string;
  status: Status;
}

export interface Benefit {
  id: string;
  icon: string;
  title: Translated;
  description: Translated;
  order: number;
  status: Status;
}

export interface Faq {
  id: string;
  question: Translated;
  answer: Translated;
  category: string;
  order: number;
  status: Status;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video';
  url: string;
  folder: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: Translated;
  updatedAt: string;
  status: Status;
  seo: SeoMeta;
}

export interface StateRecord {
  id: string;
  name: string;
  code: string;
  districtCount: number;
  cityCount: number;
  status: Status;
}

export interface DistrictRecord {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  cityCount: number;
  status: Status;
}

export interface CityRecord {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  stateName: string;
  pincode: string;
  status: Status;
}

export interface HomeSection {
  id: string;
  key: string;
  name: string;
  description: string;
  itemCount: number;
  order: number;
  enabled: boolean;
  managePath: string;
}

export type RoleKey =
'super_admin' |
'admin' |
'content_manager' |
'dealer_manager' |
'seo_manager' |
'support';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export interface Role {
  id: string;
  key: RoleKey;
  name: string;
  description: string;
  userCount: number;
  permissions: Record<string, PermissionAction[]>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  roleName: string;
  avatar: string;
  lastActive: string;
  status: Status;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: 'push' | 'email' | 'sms' | 'announcement';
  subject: string;
  body: string;
  updatedAt: string;
  status: Status;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  module: string;
  timestamp: string;
}

export interface TranslationEntry {
  id: string;
  module: string;
  field: string;
  reference: string;
  values: Partial<Record<LanguageCode, string>>;
}