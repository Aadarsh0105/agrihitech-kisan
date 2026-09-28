import api from '../api/axios';

export interface PublicCategory {
  id: string;
  name: string;
  image?: string;
}

interface PublicCategoryResponse {
  success: boolean;
  categories: Array<Omit<PublicCategory, 'image'> & { image?: string | null }>;
}

interface CategoryDetailsResponse {
  _id: string;
  name: string;
  image?: string;
  productCount?: number;
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const { data } = await api.get<PublicCategoryResponse>('/categories/public');
  return data.categories.map((category) => ({
    ...category,
    image: category.image ?? undefined,
  }));
}

export async function getCategoryById(categoryId: string): Promise<CategoryDetailsResponse> {
  const { data } = await api.get<CategoryDetailsResponse>(`/categories/${categoryId}`);
  return data;
}


export interface PublicSubCategory {
  _id: string;
  name: string;
  image?: string;
}

export interface CategoryBrand {
  _id: string;
  name: string;
  image?: string;
  productCount?: number;
}

export async function getSubCategories(categoryId: string): Promise<PublicSubCategory[]> {
  const { data } = await api.get<{ subCategories: PublicSubCategory[] }>('/subcategories', { params: { categoryId } });
  return data.subCategories ?? [];
}

export async function getCategoryBrands(categoryId: string, subCategoryId?: string): Promise<CategoryBrand[]> {
  const { data } = await api.get<{ brands: CategoryBrand[] }>(`/categories/${categoryId}/brands`, {
    params: { page: 1, limit: 100, onlyWithProducts: 'true', ...(subCategoryId ? { subCategoryId } : {}) },
  });
  return data.brands ?? [];
}
