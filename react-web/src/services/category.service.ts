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
