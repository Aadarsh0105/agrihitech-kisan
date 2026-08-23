import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../admin/ui/Button';
import { getSessionUser } from '../../services/auth-session';
import { activateCompanyTrial, createCompanySubscriptionOrder, getCompanySubscriptionPlans, verifyCompanySubscriptionPayment, type SubscriptionPlan } from '../../services/company-subscription.service';

interface PaymentResponse { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }
interface CheckoutOptions { key: string; amount: number; currency: string; name: string; description: string; order_id: string; prefill?: { contact?: string; email?: string }; handler: (response: PaymentResponse) => void | Promise<void>; modal?: { ondismiss?: () => void }; theme?: { color?: string }; }
declare global { interface Window { Razorpay?: new (options: CheckoutOptions) => { open: () => void }; } }

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.error ?? error.response?.data?.message ?? error.message;
  return error instanceof Error ? error.message : 'Unable to process subscription';
}

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function SubscriptionChoiceModal({ open, onComplete, accountLabel = 'company' }: { open: boolean; onComplete: () => void; accountLabel?: string }) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState('');
  const [error, setError] = useState('');
  const user = getSessionUser();

  useEffect(() => { if (!open) return; setLoading(true); setError(''); getCompanySubscriptionPlans().then(setPlans).catch((reason) => setError(errorMessage(reason))).finally(() => setLoading(false)); }, [open]);
  useEffect(() => { if (!open) return; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, [open]);
  useEffect(() => {
    if (!open) return;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const heading = dialog?.querySelector('h2');
    if (heading) heading.textContent = `Choose your ${accountLabel} plan`;
  });

  const skip = async () => { setProcessing('trial'); setError(''); try { await activateCompanyTrial(); onComplete(); } catch (reason) { setError(errorMessage(reason)); } finally { setProcessing(''); } };
  const selectPlan = async (plan: SubscriptionPlan) => {
    setProcessing(plan._id); setError('');
    try {
      if (plan.price === 0) { await activateCompanyTrial(); onComplete(); return; }
      if (!await loadCheckout() || !window.Razorpay) throw new Error('Payment window could not be loaded');
      const order = await createCompanySubscriptionOrder(plan._id);
      new window.Razorpay({ key: order.key, amount: order.amount, currency: order.currency, name: 'Agri HiTech Kisan', description: `${plan.name} subscription`, order_id: order.orderId, prefill: { contact: user?.mobile, email: user?.email }, theme: { color: '#238255' }, modal: { ondismiss: () => setProcessing('') }, handler: async (response) => { try { await verifyCompanySubscriptionPayment({ ...response, planId: plan._id }); onComplete(); } catch (reason) { setError(errorMessage(reason)); } finally { setProcessing(''); } } }).open();
    } catch (reason) { setError(errorMessage(reason)); setProcessing(''); }
  };

  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" className="my-6 w-full max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8"><div className="text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="h-6 w-6" /></span><h2 className="mt-4 font-display text-2xl font-extrabold">Choose your company plan</h2><p className="mt-2 text-sm text-muted-foreground">Subscribe now, or skip and continue with a 7-day trial.</p></div>{error ? <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p> : null}{loading ? <div className="mt-6 grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-muted" />)}</div> : <div className="mt-6 grid gap-4 md:grid-cols-3">{plans.map((plan) => <article key={plan._id} className={`rounded-2xl border p-5 ${plan.isRecommended ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'border-border bg-background'}`}><div className="flex items-center justify-between gap-2"><h3 className="font-display text-lg font-bold">{plan.name}</h3>{plan.isRecommended ? <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">Recommended</span> : null}</div><p className="mt-3 font-display text-2xl font-extrabold">{plan.price === 0 ? 'Free' : `${plan.currency} ${plan.price.toLocaleString('en-IN')}`}</p><p className="mt-1 text-xs text-muted-foreground">{plan.duration} days</p><ul className="mt-4 space-y-2">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{feature}</li>)}</ul><Button variant="primary" className="mt-5 w-full" disabled={Boolean(processing)} onClick={() => selectPlan(plan)}>{processing === plan._id ? 'Please wait...' : plan.price === 0 ? 'Start trial' : 'Select plan'}</Button></article>)}</div>}<div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row"><p className="text-xs text-muted-foreground">You can manage your subscription later from the Company dashboard.</p><Button disabled={Boolean(processing)} onClick={skip}>{processing === 'trial' ? 'Starting trial...' : 'Skip for now - Start 7-day trial'}</Button></div></section></div>, document.body);
}
