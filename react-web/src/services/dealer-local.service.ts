import { getSessionUser } from './auth-session';
import { companyStore, type DealershipRequest } from './company-local.service';

export type DealerListing = { id: string; sellerId: string; sellerName: string; productName: string; category: string; price: number; quantity: number; unit: string; location: string; status: 'active' | 'sold' };
export type DealerOrder = { id: string; listingId: string; productName: string; sellerName: string; quantity: number; amount: number; status: 'placed' | 'confirmed' | 'dispatched' | 'completed'; createdAt: string };
export type DealerEnquiry = { id: string; type: 'sent' | 'received'; party: string; subject: string; message: string; status: 'open' | 'closed'; createdAt: string };
export type DealerProfile = { firmName: string; proprietorName: string; mobile: string; email: string; gst: string; address: string; serviceArea: string };

const keys = { listings: 'ahk_dealer_listings', orders: 'ahk_dealer_orders', enquiries: 'ahk_dealer_enquiries', profile: 'ahk_dealer_profile', plan: 'ahk_dealer_plan', requestIds: 'ahk_dealer_request_ids' };
export const DEALER_DATA_CHANGED = 'dealer-data-changed';
const read = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; } };
const write = (key: string, value: unknown) => { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event(DEALER_DATA_CHANGED)); };
const id = () => crypto.randomUUID();
const user = () => getSessionUser();

export const dealerStore = {
  listings: () => read<DealerListing[]>(keys.listings, []),
  orders: () => read<DealerOrder[]>(keys.orders, []),
  enquiries: () => read<DealerEnquiry[]>(keys.enquiries, []),
  requestIds: () => read<string[]>(keys.requestIds, []),
  dealerships: () => companyStore.requests().filter((row) => dealerStore.requestIds().includes(row.id)),
  profile: () => read<DealerProfile>(keys.profile, { firmName: user()?.firmName ?? '', proprietorName: user()?.proprietorName ?? '', mobile: user()?.mobile ?? '', email: '', gst: '', address: '', serviceArea: '' }),
  plan: () => read<string>(keys.plan, 'Starter'),
  requestDealership: (brandName: string) => { const profile = dealerStore.profile(); const request: DealershipRequest = { id: id(), firmName: profile.firmName || 'Dealer Firm', proprietor: profile.proprietorName || 'Dealer', mobile: profile.mobile, location: profile.serviceArea || profile.address || 'Not provided', requestedBrand: brandName, status: 'pending', createdAt: new Date().toISOString() }; companyStore.addRequest(request); write(keys.requestIds, [request.id, ...dealerStore.requestIds()]); },
  saveListing: (listing: Omit<DealerListing, 'id' | 'sellerId' | 'sellerName' | 'status'> & { id?: string }) => { const rows = dealerStore.listings(); const profile = dealerStore.profile(); const next = listing.id ? rows.map((row) => row.id === listing.id ? { ...row, ...listing, id: row.id } : row) : [{ ...listing, id: id(), sellerId: user()?._id ?? 'dealer', sellerName: profile.firmName || 'Dealer', status: 'active' as const }, ...rows]; write(keys.listings, next); },
  deleteListing: (listingId: string) => write(keys.listings, dealerStore.listings().filter((row) => row.id !== listingId)),
  buy: (listing: DealerListing, quantity: number) => { const order: DealerOrder = { id: id(), listingId: listing.id, productName: listing.productName, sellerName: listing.sellerName, quantity, amount: listing.price * quantity, status: 'placed', createdAt: new Date().toISOString() }; write(keys.orders, [order, ...dealerStore.orders()]); },
  sendEnquiry: (party: string, subject: string, message: string) => { const enquiry: DealerEnquiry = { id: id(), type: 'sent', party, subject, message, status: 'open', createdAt: new Date().toISOString() }; write(keys.enquiries, [enquiry, ...dealerStore.enquiries()]); },
  advanceOrder: (orderId: string) => { const steps: DealerOrder['status'][] = ['placed', 'confirmed', 'dispatched', 'completed']; write(keys.orders, dealerStore.orders().map((row) => row.id === orderId ? { ...row, status: steps[Math.min(steps.indexOf(row.status) + 1, steps.length - 1)] } : row)); },
  closeEnquiry: (enquiryId: string) => write(keys.enquiries, dealerStore.enquiries().map((row) => row.id === enquiryId ? { ...row, status: 'closed' } : row)),
  saveProfile: (profile: DealerProfile) => write(keys.profile, profile),
  selectPlan: (plan: string) => write(keys.plan, plan),
};
