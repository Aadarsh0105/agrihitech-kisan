export interface UserEnquiry {
  id: string;
  productId: string;
  productName: string;
  message: string;
  status: 'submitted';
  createdAt: string;
}

const favouritesKey = 'ahk_user_favourites';
const enquiriesKey = 'ahk_user_enquiries';
export const USER_DATA_CHANGED = 'user-local-data-changed';

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
}

function changed() { window.dispatchEvent(new Event(USER_DATA_CHANGED)); }

export function getFavouriteIds(): string[] { return read<string[]>(favouritesKey, []); }
export function isFavourite(productId: string) { return getFavouriteIds().includes(productId); }
export function toggleFavourite(productId: string) {
  const current = getFavouriteIds();
  const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
  localStorage.setItem(favouritesKey, JSON.stringify(next)); changed(); return next.includes(productId);
}
export function getEnquiries(): UserEnquiry[] { return read<UserEnquiry[]>(enquiriesKey, []); }
export function addEnquiry(input: Pick<UserEnquiry, 'productId' | 'productName' | 'message'>) {
  const enquiry: UserEnquiry = { ...input, id: crypto.randomUUID(), status: 'submitted', createdAt: new Date().toISOString() };
  localStorage.setItem(enquiriesKey, JSON.stringify([enquiry, ...getEnquiries()])); changed(); return enquiry;
}
