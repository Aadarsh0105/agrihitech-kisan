export interface Banner {
  _id: string;
  image: string;
  public_id: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  totalProducts: number;
  slug?: string;
  nameHi?: string;
  bannerImage?: string;
}

export interface Brand {
  _id: string;
  name: string;
  image: string;
  totalProducts: number;
  slug?: string;
  logo?: string;
  description?: string;
  descriptionHi?: string;
  verified?: boolean;
}

export interface HomeResponse {
  message: string;
  banners: Banner[];
  categories: Category[];
  brands: Brand[];
}
