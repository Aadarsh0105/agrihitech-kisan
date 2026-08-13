import { Navigate, useNavigate } from 'react-router-dom';
import { ChevronRight, CircleHelp, FileText, LogOut, ShieldCheck, User } from 'lucide-react';
import { Seo } from '../components/layout/Seo';
import { useAsync } from '../hooks/useAsync';
import api from '../api/axios';
import {
  clearSession,
  getSessionUser,
  notifyAuthChanged,
  sessionUserName,
  type SessionUser,
} from '../services/auth-session';

interface ProfileResponse {
  success: boolean;
  user: SessionUser;
}

const profileActions = [
  { label: 'Help & Support', href: '/contact', icon: CircleHelp },
  { label: 'Terms & Conditions', href: '/terms', icon: FileText },
  { label: 'Privacy Policy', href: '/privacy-policy', icon: ShieldCheck },
];

async function getProfile() {
  const { data } = await api.get<ProfileResponse>('/auth/me');
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  notifyAuthChanged();
  return data.user;
}

export function Profile() {
  const navigate = useNavigate();
  const storedUser = getSessionUser();
  const profile = useAsync(getProfile, []);
  const user = profile.data ?? storedUser;

  const logout = () => {
    clearSession();
    navigate('/');
  };

  if (profile.loading && !user) {
    return <div className="container py-20 text-center text-muted-foreground">Loading profile...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Seo title="Profile" description="Manage your Agri HiTech Kisan account and support information." />
      <div className="min-h-[70vh] bg-gradient-to-b from-emerald-50/80 via-background to-background py-10 sm:py-14">
        <div className="container max-w-3xl">
          <h1 className="mb-7 text-center font-display text-3xl font-extrabold text-foreground">Profile</h1>

          <section className="flex items-center gap-4 rounded-3xl border border-border bg-white p-5 shadow-soft-lg sm:p-7">
            {user.profileimage ? (
              <img src={user.profileimage} alt={sessionUserName(user)} className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24" />
            ) : (
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary/10 text-primary sm:h-24 sm:w-24">
                <User className="h-9 w-9" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-2xl font-extrabold text-gray-900">{sessionUserName(user)}</h2>
              <p className="mt-1 text-base text-gray-500">{user.mobile}</p>
              <span className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{user.role}</span>
            </div>
          </section>

          <section className="mt-7 overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-soft-lg sm:p-7">
            <h2 className="mb-3 font-display text-xl font-extrabold text-gray-900">Other Information</h2>
            <div className="divide-y divide-gray-100">
              {profileActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.href)}
                  className="flex w-full items-center gap-4 py-5 text-left text-base font-medium text-gray-800 transition hover:text-primary"
                >
                  <action.icon className="h-6 w-6 shrink-0 text-primary" />
                  <span className="flex-1">{action.label}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-4 py-5 text-left text-base font-medium text-gray-800 transition hover:text-red-600"
              >
                <LogOut className="h-6 w-6 shrink-0 text-primary" />
                <span className="flex-1">Logout</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
