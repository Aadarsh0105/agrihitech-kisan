import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, CheckCircle2, Clock3, CreditCard, History, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { getSessionUser } from '../../services/auth-session';
import { activateCompanyTrial, createCompanySubscriptionOrder, getCompanySubscriptionHistory, getCompanySubscriptionPlans, verifyCompanySubscriptionPayment, type SubscriptionHistoryResponse, type SubscriptionPlan, type SubscriptionRecord } from '../../services/company-subscription.service';
import { Header } from './Brands';

interface RazorpayResponse { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }
interface RazorpayOptions { key: string; amount: number; currency: string; name: string; description: string; order_id: string; prefill?: { contact?: string; email?: string }; handler: (response: RazorpayResponse) => void | Promise<void>; modal?: { ondismiss?: () => void }; theme?: { color?: string }; }
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => { open: () => void }; } }

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.error ?? error.response?.data?.message ?? error.message;
  return error instanceof Error ? error.message : 'Unable to process subscription';
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existing) { existing.addEventListener('load', () => resolve(true), { once: true }); existing.addEventListener('error', () => resolve(false), { once: true }); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
  : 'Not available';

const planName = (record?: SubscriptionRecord) => record?.planId?.name || (record?.amount === 0 ? 'Free trial' : 'Subscription');

export function CompanySubscription({ dashboardPath = '/company/dashboard', workspaceLabel = 'company' }: { dashboardPath?: string; workspaceLabel?: string } = {}) {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionHistoryResponse>({ history: [], trialUsed: false });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = getSessionUser();

  useEffect(() => {
    let active = true;
    Promise.all([getCompanySubscriptionPlans(), getCompanySubscriptionHistory()])
      .then(([planRows, subscriptionData]) => {
        if (!active) return;
        setPlans(planRows);
        setSubscription(subscriptionData);
      })
      .catch((reason) => { if (active) setError(errorMessage(reason)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const skipWithTrial = async () => {
    setProcessing('trial'); setError(''); setSuccess('');
    try {
      await activateCompanyTrial();
      navigate(dashboardPath, { replace: true });
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setProcessing('');
    }
  };

  const selectPlan = async (plan: SubscriptionPlan) => {
    setProcessing(plan._id); setError(''); setSuccess('');
    try {
      if (plan.price === 0) {
        await activateCompanyTrial();
        navigate(dashboardPath, { replace: true });
        return;
      }
      const sdkReady = await loadRazorpay();
      if (!sdkReady || !window.Razorpay) throw new Error('Payment window could not be loaded');
      const order = await createCompanySubscriptionOrder(plan._id);
      const checkout = new window.Razorpay({ key: order.key, amount: order.amount, currency: order.currency, name: 'Agri HiTech Kisan', description: `${plan.name} subscription`, order_id: order.orderId, prefill: { contact: user?.mobile, email: user?.email }, theme: { color: '#238255' }, modal: { ondismiss: () => setProcessing('') }, handler: async (response) => { try { await verifyCompanySubscriptionPayment({ ...response, planId: plan._id }); navigate(dashboardPath, { replace: true }); } catch (reason) { setError(errorMessage(reason)); } finally { setProcessing(''); } } });
      checkout.open();
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setProcessing('');
    }
  };

  const current = subscription.current;
  const expiry = current?.endDate ? new Date(current.endDate) : null;
  const isCurrent = Boolean(current?.isActive && expiry && expiry.getTime() >= Date.now());
  const daysRemaining = expiry ? Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000)) : 0;

  return <div className="space-y-8">
    <Header title="Subscription" description="Review your current access, renewal options, and billing history." />
    {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p> : null}
    {success ? <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">{success}</p> : null}

    {loading ? <div className="h-56 animate-pulse rounded-3xl bg-muted" /> : <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="grid gap-6 bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:grid-cols-[1.3fr_1fr] lg:p-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="h-5 w-5" />Current access</div>
          <div className="mt-4 flex flex-wrap items-center gap-3"><h2 className="font-display text-3xl font-extrabold">{current?.startDate ? planName(current) : 'No active plan'}</h2><span className={`rounded-full px-3 py-1 text-xs font-bold ${isCurrent ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>{isCurrent ? 'ACTIVE' : 'INACTIVE'}</span></div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{isCurrent ? `Your ${workspaceLabel} workspace remains available for ${daysRemaining} more day${daysRemaining === 1 ? '' : 's'}.` : `Choose a plan below to activate subscription access for your ${workspaceLabel} workspace.`}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Summary icon={CalendarDays} label="Started" value={formatDate(current?.startDate)} />
          <Summary icon={Clock3} label="Expires" value={formatDate(current?.endDate)} />
          <Summary icon={CreditCard} label="Amount" value={`${current?.currency || 'INR'} ${(current?.amount || 0).toLocaleString('en-IN')}`} />
          <Summary icon={CheckCircle2} label="Payment" value={current?.paymentStatus || (current?.startDate ? 'TRIAL' : 'PENDING')} />
        </div>
      </div>
    </section>}

    {!loading && !subscription.trialUsed && !isCurrent ? <section className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-lg font-bold">Start with a free trial</h2><p className="mt-1 text-sm text-muted-foreground">Explore the complete {workspaceLabel} workspace before selecting a paid plan.</p></div><Button className="shrink-0" disabled={Boolean(processing)} onClick={skipWithTrial}>{processing === 'trial' ? 'Starting trial...' : 'Start free trial'}</Button></section> : null}

    <section>
      <div className="mb-4"><h2 className="font-display text-xl font-bold">Available plans</h2><p className="mt-1 text-sm text-muted-foreground">Choose the access period that fits your business.</p></div>
      {loading ? <div className="grid gap-4 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-2xl bg-muted" />)}</div> : plans.length ? <div className="grid gap-4 lg:grid-cols-3">{plans.map((plan) => <article key={plan._id} className={`flex flex-col rounded-2xl border bg-card p-6 shadow-soft ${plan.isRecommended ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}><div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-bold">{plan.name}</h3>{plan.isRecommended ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Recommended</span> : null}</div><p className="mt-4 font-display text-3xl font-extrabold">{plan.price === 0 ? 'Free' : `${plan.currency} ${plan.price.toLocaleString('en-IN')}`}</p><p className="mt-1 text-xs text-muted-foreground">Access for {plan.duration} days</p><ul className="mt-5 flex-1 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{feature}</li>)}</ul><Button variant="primary" className="mt-6 w-full" disabled={Boolean(processing) || (plan.price === 0 && subscription.trialUsed)} onClick={() => selectPlan(plan)}>{processing === plan._id ? 'Please wait...' : plan.price === 0 && subscription.trialUsed ? 'Trial already used' : isCurrent ? 'Switch plan' : plan.price === 0 ? 'Start trial' : 'Choose plan'}</Button></article>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">No active subscription plans are available.</div>}
    </section>

    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><History className="h-5 w-5" /></span><div><h2 className="font-display font-bold">Subscription history</h2><p className="text-xs text-muted-foreground">Previous plans and their expiry dates</p></div></div>
      {subscription.history.length ? <div className="divide-y divide-border">{subscription.history.map((record, index) => <div key={record._id || `${record.startDate}-${index}`} className="grid gap-4 px-5 py-4 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center"><div><p className="font-semibold">{planName(record)}</p><p className="text-xs text-muted-foreground">{record.paymentStatus || 'TRIAL'} payment</p></div><div><p className="text-xs text-muted-foreground">Started</p><p className="mt-1 text-sm font-medium">{formatDate(record.startDate)}</p></div><div><p className="text-xs text-muted-foreground">Expired</p><p className="mt-1 text-sm font-medium">{formatDate(record.endDate)}</p></div><p className="font-semibold">{record.currency || 'INR'} {(record.amount || 0).toLocaleString('en-IN')}</p></div>)}</div> : <div className="px-6 py-12 text-center"><History className="mx-auto h-9 w-9 text-muted-foreground/40" /><p className="mt-3 font-semibold">No previous subscriptions</p><p className="mt-1 text-sm text-muted-foreground">Completed or replaced plans will appear here.</p></div>}
    </section>
  </div>;
}

function Summary({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="rounded-2xl border border-border/70 bg-background/80 p-4"><Icon className="h-4 w-4 text-primary" /><p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>;
}
