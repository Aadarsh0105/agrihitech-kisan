import api from '../api/axios';
import { getSessionUser } from './auth-session';

export interface BusinessBrand {
  _id: string;
  name: string;
  image?: string;
  category?: { _id: string; name: string } | null;
}

export interface BusinessProduct {
  _id: string;
  name: string;
  images?: Array<{ url: string }>;
  price?: number;
  quantity?: number;
  unit?: string;
  brandName?: string;
  brandId?: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  brandVariant?: string;
  qualityGrade?: string;
  suitableCrops?: string[];
  keyBenefits?: string[];
  safetyPrecautions?: string;
  specifications?: {
    activeIngredient?: string;
    targetPests?: string;
    safetyPeriod?: string;
    packSize?: string;
    storage?: string;
  };
}

export interface BusinessProductDraft {
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  brandVariant: string;
  qualityGrade: string;
  suitableCrops: string;
  keyBenefits: string;
  safetyPrecautions: string;
  activeIngredient: string;
  targetPests: string;
  safetyPeriod: string;
  packSize: string;
  storage: string;
  images: File[] | null;
}

export interface MarketplaceCategory { _id: string; name: string; image?: string; totalBrands?: number; }
export interface MarketplaceBrand { _id: string; name: string; image?: string; productCount?: number; }
export interface MarketplaceProduct { _id: string; name: string; description?: string; price?: number; quantity?: number; unit?: string; images?: Array<{ url: string }>; createdBy?: { _id: string }; }
export interface MarketplaceSeller { _id: string; firmName?: string; proprietorName?: string; mobile?: string | null; distanceInKm?: number; location?: { state?: string; district?: string; village?: string; pincode?: string }; subscription?: { isActive?: boolean }; }
export interface BusinessProfile { _id: string; mobile: string; firmName?: string; proprietorName?: string; email?: string; profileimage?: string; categories?: string[]; location?: { state?: string; district?: string; village?: string; pincode?: string }; }
export interface BusinessProfileDraft { firmName: string; proprietorName: string; email: string; location: { state: string; district: string; village: string; pincode: string }; profileimage: File | null; }

export async function getMyBrands(): Promise<BusinessBrand[]> {
  const { data } = await api.get<{ user: { dealerBrands?: BusinessBrand[] } }>('/auth/me');
  return data.user.dealerBrands ?? [];
}

export async function getAssignableBrands(): Promise<BusinessBrand[]> {
  const { data } = await api.get<{ brands: BusinessBrand[] }>('/brands', {
    params: { assignable: true },
  });
  return data.brands ?? [];
}

export async function updateMyBrands(dealerBrands: string[]) {
  await api.put('/auth/me/update', { dealerBrands });
  return getMyBrands();
}

export async function getMarketplaceCategories() {
  const { data } = await api.get<{ categories: MarketplaceCategory[] }>('/categories/categories-by-role', { params: { page: 1, limit: 100 } });
  return data.categories ?? [];
}

export async function getMarketplaceBrands(categoryId: string) {
  const { data } = await api.get<{ brands: MarketplaceBrand[] }>(`/categories/${categoryId}/brands`, { params: { page: 1, limit: 100 } });
  return (data.brands ?? []).filter((brand) => (brand.productCount ?? 0) > 0);
}

export async function getMarketplaceProducts(brandId: string) {
  const { data } = await api.get<{ products: MarketplaceProduct[] }>(`/brands/${brandId}/products`, { params: { page: 1, limit: 100 } });
  return (data.products ?? []).filter((product) => product.createdBy?._id !== getSessionUser()?._id);
}

export async function getMarketplaceProductSeller(productId: string, coordinates: { latitude: number; longitude: number }) {
  const { data } = await api.get<{ product: MarketplaceProduct; productOwner?: MarketplaceSeller }>(`/products/${productId}`, {
    params: { lat: coordinates.latitude, lng: coordinates.longitude },
  });
  return { product: data.product, seller: data.productOwner };
}

export async function getBusinessProfile() {
  const { data } = await api.get<{ user: BusinessProfile }>('/auth/me');
  return data.user;
}

export async function updateBusinessProfile(payload: BusinessProfileDraft) {
  const form = new FormData();
  form.append('firmName', payload.firmName.trim());
  form.append('proprietorName', payload.proprietorName.trim());
  form.append('email', payload.email.trim());
  form.append('location', JSON.stringify(payload.location));
  if (payload.profileimage) form.append('profileimage', payload.profileimage);
  const { data } = await api.put<{ user: BusinessProfile }>('/auth/me/update', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.user;
}

export async function getMyProducts(): Promise<BusinessProduct[]> {
  const brands = await getMyBrands();
  const responses = await Promise.all(
    brands.map((brand) => api.get<{ products: BusinessProduct[] }>(`/brands/${brand._id}/my-products`, {
      params: { page: 1, limit: 100 },
    })),
  );

  return responses.flatMap((response, index) =>
    (response.data.products ?? []).map((product) => ({
      ...product,
      brandId: brands[index]._id,
      brandName: brands[index].name,
      categoryId: brands[index].category?._id,
      categoryName: brands[index].category?.name,
    })),
  );
}

function productFormData(draft: BusinessProductDraft) {
  const data = new FormData();
  data.append('name', draft.name.trim());
  data.append('category', draft.category);
  data.append('brand', draft.brand);
  data.append('description', draft.description);
  data.append('price', String(draft.price || 0));
  data.append('quantity', String(draft.quantity || 0));
  data.append('unit', draft.unit);
  data.append('brandVariant', draft.brandVariant);
  data.append('qualityGrade', draft.qualityGrade);
  data.append('safetyPrecautions', draft.safetyPrecautions);
  data.append('specifications[activeIngredient]', draft.activeIngredient);
  data.append('specifications[targetPests]', draft.targetPests);
  data.append('specifications[safetyPeriod]', draft.safetyPeriod);
  data.append('specifications[packSize]', draft.packSize);
  data.append('specifications[storage]', draft.storage);
  draft.suitableCrops.split(',').map((value) => value.trim()).filter(Boolean)
    .forEach((value) => data.append('suitableCrops[]', value));
  draft.keyBenefits.split(',').map((value) => value.trim()).filter(Boolean)
    .forEach((value) => data.append('keyBenefits[]', value));
  draft.images?.forEach((image) => data.append('images', image));
  return data;
}

export async function createMyProduct(draft: BusinessProductDraft) {
  await api.post('/products/create', productFormData(draft), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function updateMyProduct(productId: string, draft: BusinessProductDraft) {
  await api.put(`/products/${productId}`, productFormData(draft), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deleteMyProduct(productId: string) {
  await api.delete(`/products/${productId}`);
}
