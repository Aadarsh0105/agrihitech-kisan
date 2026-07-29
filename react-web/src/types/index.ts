

/**
 * Domain types for the agricultural discovery platform.
 * These map 1:1 to the future MongoDB collections / Express API responses,
 * so the UI can be wired to real endpoints by swapping the mock services.
 */

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  icon: string; // lucide icon key, resolved in CategoryIcon
  productCount: number;
  subCategories: SubCategory[];
  bannerImage?: string;
}

export interface PlatformFeature {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner?: string;
  description: string;
  descriptionHi: string;
  website?: string;
  verified: boolean;
  productCount: number;
  social?: {facebook?: string;instagram?: string;youtube?: string;};
  contact?: {email?: string;phone?: string;address?: string;};
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  subCategory?: string;
  images: string[];
  shortDescription: string;
  shortDescriptionHi: string;
  description?: string;
  suitableCrops: string[];
  dosage?: string;
  usage?: string;
  benefits: string[];
  packagingSizes: string[];
  price?: number;
  tags: string[];
  trending?: boolean;
  featured?: boolean;
  createdAt: string;
  downloads?: {brochure?: string;manual?: string;specPdf?: string;};
  specifications?: {label: string;value: string;}[];
}

export interface Dealer {
  id: string;
  name: string;
  shopName: string;
  address: string;
  state: string;
  district: string;
  distanceKm: number;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  openTiming: string;
  available: boolean;
  verified: boolean;
  lat: number;
  lng: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleHi: string;
  location: string;
  avatar: string;
  quote: string;
  quoteHi: string;
  rating: number;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  excerpt: string;
  excerptHi: string;
  image: string;
  category: string;
  date: string;
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
}