import { motion } from 'framer-motion';
import { LocateFixed, MapPin } from 'lucide-react';
import type { Dealer } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { DealerCard } from '../cards/DealerCard';
import { Button } from '../ui/Button';

interface Props {
  dealers: Dealer[] | null;
  loading: boolean;
  hasLocation: boolean;
  onUseLocation: () => void;
}

export function NearestDealers({ dealers, loading, hasLocation, onUseLocation }: Props) {
  const { t } = useLanguage();

  return (
    <section id="dealers" className="scroll-mt-24">
      <div className="rounded-3xl border border-primary-200 bg-primary-50/60 p-6 dark:border-primary-900/40 dark:bg-primary-900/10 md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Available Near You</h2>
              <p className="text-sm text-muted-foreground">
                {hasLocation ? 'Sellers are ordered using your current location.' : 'Share your location to find the nearest sellers.'}
              </p>
            </div>
          </div>
          <Button variant={hasLocation ? 'secondary' : 'primary'} onClick={onUseLocation} disabled={loading}>
            <LocateFixed className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? t('dealers.locating') : hasLocation ? 'Refresh location' : t('dealers.useLocation')}
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        ) : dealers?.length ? (
          <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dealers.map((dealer, index) => (
              <DealerCard key={dealer.id} dealer={dealer} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/25 bg-white/70 px-5 py-10 text-center">
            <MapPin className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 font-semibold text-foreground">
              {hasLocation ? 'No subscribed sellers found for this category nearby.' : 'Location is required to find nearby sellers.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
