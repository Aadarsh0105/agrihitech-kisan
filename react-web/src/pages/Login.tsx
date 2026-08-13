import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Sprout } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { useAppDispatch } from '../redux/store';
import { hydrateToken } from '../redux/admin/authSlice';
import { notifyAuthChanged } from '../services/auth-session';

type LoginRole = 'B2C' | 'B2B' | 'ADMIN';

interface AuthUser {
  _id: string;
  mobile: string;
  role: LoginRole;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

const roles: Array<{ value: LoginRole; label: string; description: string }> = [
  { value: 'B2C', label: 'Customer', description: 'B2C' },
  { value: 'B2B', label: 'Business', description: 'B2B' },
  { value: 'ADMIN', label: 'Admin', description: 'Admin' },
];

const destinationByRole: Record<LoginRole, string> = {
  B2C: '/',
  B2B: '/brand',
  ADMIN: '/admin/dashboard',
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function Login() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');
  const requestedReturnTo = searchParams.get('returnTo');
  const returnTo = requestedReturnTo?.startsWith('/') && !requestedReturnTo.startsWith('//')
    ? requestedReturnTo
    : null;
  const [role, setRole] = useState<LoginRole>(
    requestedRole === 'B2B' || requestedRole === 'ADMIN' ? requestedRole : 'B2C',
  );
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otpSent) {
        await api.post('/auth/send-otp', { mobile, role });
        setOtpSent(true);
        return;
      }

      const { data } = await api.post<AuthResponse>('/auth/verify-otp', { mobile, otp, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      notifyAuthChanged();

      if (data.user.role === 'ADMIN') {
        localStorage.setItem('ahk_admin_token', data.token);
      } else {
        localStorage.removeItem('ahk_admin_token');
      }

      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      if (data.user.role === 'ADMIN') {
        dispatch(hydrateToken(data.token));
      }
      navigate(returnTo ?? destinationByRole[data.user.role], { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (nextRole: LoginRole) => {
    setRole(nextRole);
    setOtpSent(false);
    setOtp('');
    setError('');
  };

  return (
    <>
      <Seo title={t('common.login')} description="Log in to AgriMandi with your customer, business, or admin account." />
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft-lg"
        >
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Sprout className="h-6 w-6" />
            </span>
            <h1 className="font-display text-2xl font-extrabold text-foreground">{t('common.login')}</h1>
            <p className="text-sm text-muted-foreground">Choose how you want to access AgriMandi</p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2" aria-label="Account type">
            {roles.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => selectRole(item.value)}
                className={`rounded-xl border px-2 py-2.5 text-center transition-colors ${
                  role === item.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`block text-[10px] ${role === item.value ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                  {item.description}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Mobile number</Label>
              <Input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                minLength={10}
                required
                disabled={otpSent}
              />
            </div>

            {otpSent ? (
              <div>
                <Label>OTP</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 4-digit OTP"
                  minLength={4}
                  required
                  autoFocus
                />
              </div>
            ) : null}

            {error ? <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </Button>
          </form>

          {otpSent ? (
            <button type="button" onClick={() => setOtpSent(false)} className="mt-4 w-full text-center text-sm font-semibold text-primary hover:underline">
              Change mobile number
            </button>
          ) : role === 'B2B' ? (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don't have an account ?{' '}
              <Link to="/register-brand" className="font-semibold text-primary hover:underline">{t('nav.registerBrand')}</Link>
            </p>
          ) : null}
        </motion.div>
      </div>
    </>
  );
}
