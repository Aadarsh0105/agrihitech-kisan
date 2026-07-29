





import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Dealer } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DealerCard } from '../cards/DealerCard';
import { Button } from '../ui/Button';

export function NearestDealers({ productId }: {productId: string;}) {
  const { t } = useLanguage();
  const [dealers, setDealers] = useState<Dealer[] | null>(null);
  const [locating, setLocating] = useState(false);
  const [usingLocation, setUsingLocation] = useState(false);

  useEffect(() => {
    api.getDealersForProduct(productId).then(setDealers);
  }, [productId]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        const sorted = await api.getDealersForProduct(productId, coords);
        setDealers(sorted);
        setUsingLocation(true);
        setLocating(false);
      },
      async () => {
        // Permission denied — fall back to default distance ordering.
        const sorted = await api.getDealersForProduct(productId);
        setDealers(sorted);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <section id="dealers" className="scroll-mt-24">
      <div className="rounded-3xl border border-primary-200 bg-primary-50/60 p-6 dark:border-primary-900/40 dark:bg-primary-900/10 md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">{t('dealers.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('dealers.subtitle')}</p>
            </div>
          </div>
          <Button variant={usingLocation ? 'secondary' : 'primary'} onClick={useMyLocation} disabled={locating}>
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            {locating ? t('dealers.locating') : t('dealers.useLocation')}
          </Button>
        </div>

        {!dealers ?
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) =>
          <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-card" />
          )}
          </div> :

        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dealers.map((d, i) =>
          <DealerCard key={d.id} dealer={d} index={i} />
          )}
          </motion.div>
        }
      </div>
    </section>);

}