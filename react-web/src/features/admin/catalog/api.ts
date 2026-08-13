import api from "../../../api/admin/axios";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return Array.isArray(data) ? data : data?.categories ?? [];
}

export async function fetchBrands() {
  const { data } = await api.get("/brands");
  return data?.brands ?? data?.data ?? [];
}

export async function fetchProducts() {
  const { data } = await api.get("/products");
  return data?.products ?? data?.data ?? [];
}

export async function fetchPlans() {
  const { data } = await api.get("/subscription");
  return Array.isArray(data) ? data : data?.plans ?? data?.data ?? [];
}
