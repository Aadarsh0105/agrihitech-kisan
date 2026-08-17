export interface SessionUser {
  _id: string;
  mobile: string;
  role: 'B2C' | 'B2B' | 'ADMIN' | 'COMPANY';
  firmName?: string;
  proprietorName?: string;
  profileimage?: string;
  categories?: string[];
}

export const AUTH_CHANGED_EVENT = 'auth-session-changed';

export function getSessionUser(): SessionUser | null {
  if (!localStorage.getItem('token')) return null;

  try {
    return JSON.parse(localStorage.getItem('auth_user') ?? 'null') as SessionUser | null;
  } catch {
    return null;
  }
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('ahk_admin_token');
  notifyAuthChanged();
}

export function sessionUserName(user: SessionUser) {
  return user.proprietorName || user.firmName || 'User';
}
