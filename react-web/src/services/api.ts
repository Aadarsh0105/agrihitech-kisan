


/**
 * Service layer. The UI ONLY talks to these functions, never to mock data directly.
 * To connect a real Node/Express + MongoDB backend later, replace each body with a
 * `fetch('/api/...')` call — signatures stay identical, so no UI changes are needed.
 */

import {
  products, brands, categories, dealers, testimonials, news, benefits } from
'../data/mockData';
import type { Product, Brand, Category, Dealer, Testimonial, NewsArticle, Benefit } from '../types';

const delay = <T,>(data: T, ms = 300): Promise<T> =>
new Promise((resolve) => setTimeout(() => resolve(data), ms));

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  crop?: string;
  state?: string;
  district?: string;
  productType?: string;
  sort?: 'newest' | 'popular';
}

export const api = {
  getFeaturedProducts: () => delay(products.filter((p) => p.featured)),
  getTrendingProducts: () => delay(products.filter((p) => p.trending)),
  getRecentProducts: () =>
  delay([...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8)),

  getProducts: (filters: ProductFilters = {}) => {
    let result = [...products];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.suitableCrops.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (filters.categorySlug) {
      const cat = categories.find((c) => c.slug === filters.categorySlug);
      if (cat) result = result.filter((p) => p.categoryId === cat.id);
    }
    if (filters.brandSlug) {
      const b = brands.find((x) => x.slug === filters.brandSlug);
      if (b) result = result.filter((p) => p.brandId === b.id);
    }
    if (filters.crop) result = result.filter((p) => p.suitableCrops.includes(filters.crop!));
    if (filters.sort === 'newest')
    result = result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (filters.sort === 'popular') result = result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    return delay(result);
  },

  getProductBySlug: (slug: string) => delay(products.find((p) => p.slug === slug) ?? null),
  getBrands: () => delay(brands),
  getBrandBySlug: (slug: string) => delay(brands.find((b) => b.slug === slug) ?? null),
  getCategories: () => delay(categories),
  getCategoryBySlug: (slug: string) => delay(categories.find((c) => c.slug === slug) ?? null),

  /** Nearest dealers for a product, optionally sorted by user coordinates. */
  getDealersForProduct: (_productId: string, coords?: {lat: number;lng: number;}) => {
    let result = [...dealers];
    if (coords) {
      result = result.
      map((d) => ({
        ...d,
        distanceKm: haversine(coords.lat, coords.lng, d.lat, d.lng)
      })).
      sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      result = result.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return delay(result);
  },

  getTestimonials: (): Promise<Testimonial[]> => delay(testimonials),
  getNews: (): Promise<NewsArticle[]> => delay(news),
  getBenefits: (): Promise<Benefit[]> => delay(benefits)
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
  Math.sin(dLat / 2) ** 2 +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type { Product, Brand, Category, Dealer, Testimonial, NewsArticle, Benefit };