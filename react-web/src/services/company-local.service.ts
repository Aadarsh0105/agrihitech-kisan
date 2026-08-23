export type CompanyBrand = { id: string; name: string; category: string; image: string };
export type CompanyProduct = { id: string; name: string; brandId: string; category: string; price: number; description: string; image: string };
export type CompanyDealer = { id: string; firmName: string; proprietor: string; mobile: string; location: string; territory: string; status: 'active' | 'suspended' };
export type DealershipRequest = { id: string; firmName: string; proprietor: string; mobile: string; location: string; requestedBrand: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string };
export type CompanyEnquiry = { id: string; from: string; subject: string; message: string; status: 'new' | 'read'; createdAt: string };
export type CompanyProfile = { name: string; contactPerson: string; email: string; mobile: string; gst: string; address: string };

const keys = { brands: 'ahk_company_brands', products: 'ahk_company_products', dealers: 'ahk_company_dealers', requests: 'ahk_company_requests', enquiries: 'ahk_company_enquiries', profile: 'ahk_company_profile', plan: 'ahk_company_plan' };
export const COMPANY_DATA_CHANGED = 'company-data-changed';
const read = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; } };
const write = (key: string, value: unknown) => { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event(COMPANY_DATA_CHANGED)); };
const id = () => crypto.randomUUID();

export const companyStore = {
  brands: () => read<CompanyBrand[]>(keys.brands, []),
  products: () => read<CompanyProduct[]>(keys.products, []),
  dealers: () => read<CompanyDealer[]>(keys.dealers, []),
  requests: () => read<DealershipRequest[]>(keys.requests, []),
  enquiries: () => read<CompanyEnquiry[]>(keys.enquiries, []),
  profile: () => { const user = getSessionUser(); return read<CompanyProfile>(keys.profile, { name: user?.companyName || 'Company Account', contactPerson: user?.contactPerson || '', email: user?.email || '', mobile: user?.mobile || '', gst: user?.gstNumber || '', address: user?.address || '' }); },
  plan: () => read<string>(keys.plan, 'Growth'),
  saveBrand: (brand: Omit<CompanyBrand, 'id'> & { id?: string }) => { const rows = companyStore.brands(); const next = brand.id ? rows.map((row) => row.id === brand.id ? { ...row, ...brand, id: row.id } : row) : [{ ...brand, id: id() }, ...rows]; write(keys.brands, next); },
  deleteBrand: (brandId: string) => { write(keys.brands, companyStore.brands().filter((row) => row.id !== brandId)); write(keys.products, companyStore.products().filter((row) => row.brandId !== brandId)); },
  saveProduct: (product: Omit<CompanyProduct, 'id'> & { id?: string }) => { const rows = companyStore.products(); const next = product.id ? rows.map((row) => row.id === product.id ? { ...row, ...product, id: row.id } : row) : [{ ...product, id: id() }, ...rows]; write(keys.products, next); },
  deleteProduct: (productId: string) => write(keys.products, companyStore.products().filter((row) => row.id !== productId)),
  updateRequest: (requestId: string, status: DealershipRequest['status']) => { const requests = companyStore.requests().map((row) => row.id === requestId ? { ...row, status } : row); write(keys.requests, requests); if (status === 'approved') { const request = requests.find((row) => row.id === requestId); if (request && !companyStore.dealers().some((row) => row.id === request.id)) write(keys.dealers, [{ id: request.id, firmName: request.firmName, proprietor: request.proprietor, mobile: request.mobile, location: request.location, territory: request.location, status: 'active' }, ...companyStore.dealers()]); } },
  toggleDealer: (dealerId: string) => write(keys.dealers, companyStore.dealers().map((row) => row.id === dealerId ? { ...row, status: row.status === 'active' ? 'suspended' : 'active' } : row)),
  readEnquiry: (enquiryId: string) => write(keys.enquiries, companyStore.enquiries().map((row) => row.id === enquiryId ? { ...row, status: 'read' } : row)),
  saveProfile: (profile: CompanyProfile) => write(keys.profile, profile),
  selectPlan: (plan: string) => write(keys.plan, plan),
  addRequest: (request: DealershipRequest) => write(keys.requests, [request, ...companyStore.requests().filter((row) => row.id !== request.id)]),
};
import { getSessionUser } from './auth-session';
