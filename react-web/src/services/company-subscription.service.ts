import api from '../api/axios';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  type: 'MONTHLY' | 'YEARLY';
  price: number;
  currency: string;
  duration: number;
  trialDays: number;
  features: string[];
  isRecommended: boolean;
}

export interface SubscriptionOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  plan: SubscriptionPlan;
}

export interface SubscriptionRecord {
  _id?: string;
  planId?: Pick<SubscriptionPlan, '_id' | 'name' | 'type' | 'price' | 'currency' | 'duration'>;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  amount?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface SubscriptionHistoryResponse {
  current?: SubscriptionRecord;
  history: SubscriptionRecord[];
  trialUsed: boolean;
}

export const getCompanySubscriptionPlans = async () => {
  const { data } = await api.get<SubscriptionPlan[]>('/subscription');
  return data;
};

export const getCompanySubscriptionHistory = async () => {
  const { data } = await api.get<SubscriptionHistoryResponse>('/subscription/history');
  return data;
};

export const createCompanySubscriptionOrder = async (planId: string) => {
  const { data } = await api.post<SubscriptionOrder>('/subscription/create-order', { planId });
  return data;
};

export const verifyCompanySubscriptionPayment = async (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; planId: string }) => {
  const { data } = await api.post('/subscription/verify-payment', payload);
  return data;
};

export const activateCompanyTrial = async () => {
  const { data } = await api.post('/subscription/skip-trial');
  return data;
};
