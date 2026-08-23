import api from "../api/axios";

export interface PublicNews {
  _id: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  createdAt: string;
}

export interface NewsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getPublicNews(page = 1, limit = 9) {
  const { data } = await api.get("/news", { params: { page, limit } });
  return {
    news: (data?.news ?? []) as PublicNews[],
    pagination: data?.pagination as NewsPagination
  };
}

export async function getPublicNewsBySlug(slug: string) {
  try {
    const { data } = await api.get(`/news/slug/${encodeURIComponent(slug)}`);
    return data?.news as PublicNews;
  } catch (error) {
    const { data } = await api.get(`/news/${encodeURIComponent(slug)}`);
    return data?.news as PublicNews;
  }
}
