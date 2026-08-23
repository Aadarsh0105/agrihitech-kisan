import api from '../api/axios';

export interface PublicBrand {
  _id: string;
  name: string;
  image?: string;
  productCount?: number;
  category?: { _id: string; name: string };
}

interface BrandListResponse {
  success: boolean;
  brands: PublicBrand[];
}

export async function getPublicBrands(): Promise<PublicBrand[]> {
  const { data } = await api.get<BrandListResponse>('/brands');
  return data.brands;
}
