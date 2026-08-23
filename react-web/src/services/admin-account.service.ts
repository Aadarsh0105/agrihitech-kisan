import api from "../api/admin/axios";

export type AccountRole = "B2B" | "COMPANY" | "B2C";
export interface AccountBrand { _id: string; name: string; image?: string; category?: { _id: string; name: string }; }
export interface AdminAccount {
  _id: string; role: AccountRole; mobile: string; profileimage?: string; isVerified: boolean; createdAt: string;
  firmName?: string; proprietorName?: string; companyName?: string; contactPerson?: string; email?: string; gstNumber?: string; address?: string;
  categories?: string[]; dealerBrands?: AccountBrand[];
  location?: { state?: string; district?: string; village?: string; pincode?: string };
  subscription?: { planId?: { name: string; price: number; duration: number }; paymentStatus?: string; isActive?: boolean; startDate?: string; endDate?: string };
  subscriptionHistory?: Array<{ planId?: { name: string; price: number }; paymentStatus?: string; startDate?: string; endDate?: string }>;
}
export interface AccountProduct { _id: string; name: string; images?: string[]; price?: number; quantity?: number; category?: { name: string }; brand?: Array<{ name: string }> | { name: string }; createdAt: string; }

export async function getAdminAccounts(role: AccountRole, page: number, limit: number, search: string) {
  const { data } = await api.get("/admin/accounts", { params: { role, page, limit, search: search || undefined } });
  return data as { accounts: AdminAccount[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
}

export async function getAdminAccount(id: string) {
  const { data } = await api.get(`/admin/accounts/${id}`);
  return data as { account: AdminAccount; ownedBrands: AccountBrand[]; products: AccountProduct[] };
}
