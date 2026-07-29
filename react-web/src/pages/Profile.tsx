






import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, History, Languages, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { products } from '../data/mockData';
import { indianStates } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { ProductGrid } from '../components/products/ProductGrid';
import { Select, Label } from '../components/ui/Input';

type Tab = 'wishlist' | 'saved' | 'recent';

export function Profile() {
  const { t, locale, setLocale } = useLanguage();
  const [tab, setTab] = useState<Tab>('wishlist');

  const tabs: {id: Tab;label: string;icon: React.ReactNode;}[] = [
  { id: 'wishlist', label: t('account.wishlist'), icon: <Heart className="h-4 w-4" /> },
  { id: 'saved', label: t('account.saved'), icon: <Bookmark className="h-4 w-4" /> },
  { id: 'recent', label: t('account.recent'), icon: <History className="h-4 w-4" /> }];


  const lists: Record<Tab, typeof products> = {
    wishlist: products.slice(0, 4),
    saved: products.slice(2, 6),
    recent: products.slice(4, 8)
  };

  return (
    <>
      <Seo title="My Account" description="Manage your wishlist, saved products and preferences on AgriMandi." />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">My Account</h1>
        </div>
      </div>

      <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        {/* preferences */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-4 font-display text-base font-bold">Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label><span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-primary" /> {t('account.language')}</span></Label>
                <Select value={locale} onChange={(e) => setLocale(e.target.value as 'en' | 'hi')}>
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </Select>
              </div>
              <div>
                <Label><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {t('account.location')}</span></Label>
                <Select>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tb) =>
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              className={`relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === tb.id ? 'text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}>
              
                {tab === tb.id && <motion.span layoutId="profile-tab" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {tb.icon} {tb.label}
              </button>
            )}
          </div>
          <ProductGrid products={lists[tab]} />
        </div>
      </div>
    </>);

}