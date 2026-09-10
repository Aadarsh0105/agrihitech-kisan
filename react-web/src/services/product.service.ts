import api from '../api/axios';
import type { Product } from '../types';
import type { Dealer } from '../types';

interface ApiImage {
  url: string;
}

interface ApiReference {
  _id: string;
  name: string;
}

interface ApiProduct {
  _id: string;
  name: string;
  brand?: ApiReference[];
  companyBrand?: { _id: string; companyName: string; profileimage?: string } | null;
  category?: ApiReference | null;
  subCategory?: ApiReference | null;
  description?: string;
  price?: number;
  images?: ApiImage[];
  unit?: string;
  quantity?: number;
  usageSteps?: Array<{ heading?: string; description?: string }>;
  keyBenefits?: string[];
  suitableCrops?: string[];
  safetyPrecautions?: string;
  specifications?: {
    activeIngredient?: string;
    targetPests?: string;
    safetyPeriod?: string;
    packSize?: string;
    storage?: string;
  };
  createdAt: string;
}

interface ProductListResponse {
  products: ApiProduct[];
}

interface BrandProductsResponse {
  brand: { _id: string; name: string; image?: string; category?: { _id: string; name: string } };
  products: ApiProduct[];
}

interface ProductDetailsResponse {
  product: ApiProduct;
  nearestShops?: ApiNearestShop[];
}

interface ApiNearestShop {
  _id: string;
  firmName?: string;
  proprietorName?: string;
  mobile?: string;
  distanceInKm?: number;
  location?: {
    state?: string;
    district?: string;
    village?: string;
    pincode?: string;
    coordinates?: [number, number];
  };
}

export interface ProductDetailsData {
  product: Product;
  nearestDealers: Dealer[];
}

function mapProduct(product: ApiProduct): Product {
  const brands = product.brand ?? [];
  const description = product.description ?? '';
  const packSize = product.specifications?.packSize || product.unit;
  const usage = product.usageSteps
    ?.map((step) => [step.heading, step.description].filter(Boolean).join(': '))
    .filter(Boolean)
    .join('\n');
  const specifications = product.specifications
    ? Object.entries(product.specifications)
        .filter((entry): entry is [string, string] => Boolean(entry[1]))
        .map(([key, value]) => ({
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()),
          value,
        }))
    : undefined;

  return {
    id: product._id,
    slug: product._id,
    name: product.name,
    nameHi: product.name,
    brandId: brands[0]?._id ?? product.companyBrand?._id ?? '',
    brandName: brands.map((brand) => brand.name).join(', ') || product.companyBrand?.companyName || '',
    categoryId: product.category?._id ?? '',
    categoryName: product.category?.name ?? '',
    subCategory: product.subCategory?.name,
    images: (product.images ?? []).map((image) => image.url),
    shortDescription: description,
    shortDescriptionHi: description,
    description,
    suitableCrops: product.suitableCrops ?? [],
    benefits: product.keyBenefits ?? [],
    packagingSizes: packSize
      ? [`${product.quantity || ''} ${packSize}`.trim()]
      : product.quantity
        ? [String(product.quantity)]
        : [],
    usage,
    dosage: product.safetyPrecautions,
    price: product.price,
    tags: [],
    trending: true,
    createdAt: product.createdAt,
    specifications,
  };
}

export async function getHomepageProducts(): Promise<Product[]> {
  const { data } = await api.get<ProductListResponse>('/products', {
    params: { page: 1, limit: 5 },
  });

  return data.products.map(mapProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await api.get<ProductListResponse>('/products', {
    params: { page: 1, limit: 100 },
  });

  return data.products.map(mapProduct);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data } = await api.get<ProductListResponse>(`/products/user/${categoryId}`, {
    params: { page: 1, limit: 100 },
  });

  return data.products.map(mapProduct);
}

export async function getProductsByBrand(brandId: string) {
  const { data } = await api.get<BrandProductsResponse>(`/brands/${brandId}/products`, {
    params: { page: 1, limit: 100 },
  });
  return { brand: data.brand, products: (data.products ?? []).map(mapProduct) };
}

export async function getProductById(
  productId: string,
  coordinates?: { latitude: number; longitude: number },
): Promise<ProductDetailsData> {
  const { data } = await api.get<ProductDetailsResponse>(`/products/${productId}`, {
    params: coordinates ? { lat: coordinates.latitude, lng: coordinates.longitude } : undefined,
  });

  return {
    product: mapProduct(data.product),
    nearestDealers: (data.nearestShops ?? []).map((shop) => {
      const location = shop.location;
      const [lng = 0, lat = 0] = location?.coordinates ?? [];
      const address = [location?.village, location?.district, location?.state, location?.pincode]
        .filter(Boolean)
        .join(', ');

      return {
        id: shop._id,
        name: shop.proprietorName ?? shop.firmName ?? 'Seller',
        shopName: shop.firmName ?? shop.proprietorName ?? 'Agri seller',
        address,
        state: location?.state ?? '',
        district: location?.district ?? '',
        distanceKm: Number(shop.distanceInKm ?? 0),
        phone: shop.mobile ?? '',
        whatsapp: shop.mobile ?? '',
        mapsUrl: lat || lng ? `https://www.google.com/maps?q=${lat},${lng}` : '#',
        openTiming: 'Contact seller for timings',
        available: true,
        verified: true,
        lat,
        lng,
      };
    }),
  };
}
