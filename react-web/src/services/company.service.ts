import api from '../api/axios';

export interface CompanyProfileApi { _id: string; mobile: string; companyName: string; contactPerson: string; email?: string; gstNumber?: string; address?: string; profileimage?: string; location?: { state?: string; district?: string; village?: string; pincode?: string }; subscription?: { isActive?: boolean; endDate?: string; planId?: { name?: string } }; }
export interface CompanyProfileDraft { companyName: string; contactPerson: string; email: string; gstNumber: string; address: string; location: { state: string; district: string; village: string; pincode: string }; profileimage: File | null; }
export interface CompanyDealerApi { _id: string; firmName?: string; proprietorName?: string; mobile: string; companyDealerStatus: 'ACTIVE' | 'SUSPENDED'; categories?: string[]; location?: { state?: string; district?: string; village?: string }; }
export interface CompanyBrandApi { _id: string; name: string; image: string; category?: { _id: string; name: string }; subCategory?: { _id: string; name: string }; createdBy?: { role?: string }; }
export interface CompanyProductApi { _id: string; name: string; description?: string; price?: number; quantity?: number; unit?: string; images?: Array<{ url: string }>; brand?: Array<{ _id: string; name: string }>; companyBrand?: { _id: string; companyName: string }; category?: { _id: string; name: string }; subCategory?: { _id: string; name: string }; createdBy?: { role?: string; firmName?: string; proprietorName?: string; companyName?: string }; }
export interface CompanyProductDraft { name: string; category: string; subCategory?: string; description: string; images: File[]; }

export async function getCompanyProfile() { const { data } = await api.get<{ user: CompanyProfileApi }>('/auth/me'); return data.user; }
export async function updateCompanyProfile(payload: CompanyProfileDraft) {
  const form = new FormData();
  form.append('companyName', payload.companyName.trim());
  form.append('contactPerson', payload.contactPerson.trim());
  form.append('email', payload.email.trim());
  form.append('gstNumber', payload.gstNumber.trim());
  form.append('address', payload.address.trim());
  form.append('location', JSON.stringify(payload.location));
  if (payload.profileimage) form.append('profileimage', payload.profileimage);
  const { data } = await api.put<{ user: CompanyProfileApi }>('/auth/me/update', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.user;
}
export async function getCompanyDealers() {
  const { data } = await api.get<{ dealers: CompanyDealerApi[] }>('/company/dealers');
  return data.dealers;
}
export async function getCompanyBrands() { const { data } = await api.get<{ brands: CompanyBrandApi[] }>('/brands/my-brands', { params: { page: 1, limit: 100 } }); return data.brands; }
function brandData(draft: { name: string; category: string; image: File | null }) { const data = new FormData(); data.append('name', draft.name); data.append('category', draft.category); if (draft.image) data.append('image', draft.image); return data; }
export async function createCompanyBrand(draft: { name: string; category: string; image: File | null }) { await api.post('/brands/create', brandData(draft), { headers: { 'Content-Type': 'multipart/form-data' } }); }
export async function updateCompanyBrand(id: string, draft: { name: string; category: string; image: File | null }) { await api.put(`/brands/${id}`, brandData(draft), { headers: { 'Content-Type': 'multipart/form-data' } }); }
export async function deleteCompanyBrand(id: string) { await api.delete(`/brands/${id}`); }
export async function assignCompanyDealer(mobile: string) { await api.post('/company/dealers', { mobile }); }
export async function setCompanyDealerStatus(id: string, status: CompanyDealerApi['companyDealerStatus']) { await api.patch(`/company/dealers/${id}/status`, { status }); }
export async function removeCompanyDealer(id: string) { await api.delete(`/company/dealers/${id}`); }
export async function getCompanyProducts() {
  const { data } = await api.get<{ products: CompanyProductApi[] }>('/products/company/mine', { params: { page: 1, limit: 100 } });
  return data.products || [];
}

function productData(draft: CompanyProductDraft) { const data = new FormData(); data.append('name', draft.name.trim()); data.append('category', draft.category); if (draft.subCategory) data.append('subCategory', draft.subCategory); if (draft.description.trim()) data.append('description', draft.description.trim()); draft.images.forEach((image) => data.append('images', image)); return data; }
export async function createCompanyProduct(draft: CompanyProductDraft) { await api.post('/products/create', productData(draft), { headers: { 'Content-Type': 'multipart/form-data' } }); }
export async function updateCompanyProduct(id: string, draft: CompanyProductDraft) { await api.put(`/products/${id}`, productData(draft), { headers: { 'Content-Type': 'multipart/form-data' } }); }
export async function deleteCompanyProduct(id: string) { await api.delete(`/products/${id}`); }
