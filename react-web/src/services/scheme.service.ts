import api from "../api/axios";

export interface PublicScheme {
  _id: string;
  title: string;
  slug: string;
  tags: string[];
  content: string;
  benefits: string;
  eligibility: string;
  applicationProcess: string;
  requiredDocuments: string;
  createdAt: string;
}

export interface SchemePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getPublicSchemes(page = 1, limit = 9) {
  const { data } = await api.get("/schemes", { params: { page, limit } });
  return {
    schemes: (data?.schemes ?? []) as PublicScheme[],
    pagination: data?.pagination as SchemePagination
  };
}

export async function getPublicScheme(slug: string) {
  try {
    const { data } = await api.get(`/schemes/slug/${encodeURIComponent(slug)}`);
    return data?.scheme as PublicScheme;
  } catch (error) {
    // Older records may not have a slug until they are edited in Admin.
    const { data } = await api.get(`/schemes/${encodeURIComponent(slug)}`);
    return data?.scheme as PublicScheme;
  }
}
