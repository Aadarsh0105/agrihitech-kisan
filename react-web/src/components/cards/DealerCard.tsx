






import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, BadgeCheck, Navigation } from 'lucide-react';
import type { Dealer } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Badge } from '../ui/Badge';
import { formatDistance } from '../../lib/utils';

export function DealerCard({ dealer, index = 0 }: {dealer: Dealer;index?: number;}) {
  const { t } = useLanguage();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-soft-lg">
      
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-foreground">
            {dealer.shopName}
            {dealer.verified &&
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label={t('dealers.verified')} />
            }
          </h3>
          <p className="text-sm text-muted-foreground">{dealer.name}</p>
        </div>
        <Badge variant="success" className="shrink-0">
          <Navigation className="h-3 w-3" />
          {formatDistance(dealer.distanceKm)} {t('dealers.distance')}
        </Badge>
      </div>

      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{dealer.address}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-primary" />
          <span>{t('dealers.open')}: {dealer.openTiming}</span>
        </p>
      </div>

      <div className="mt-3">
        <Badge variant={dealer.available ? 'success' : 'muted'}>
          {dealer.available ? t('dealers.available') : t('dealers.unavailable')}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href={`tel:${dealer.phone}`}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-700">
          
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dealers.call')}</span>
        </a>
        <a
          href={`https://wa.me/${dealer.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-sm font-semibold text-white transition hover:opacity-90">
          
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dealers.whatsapp')}</span>
        </a>
        <a
          href={dealer.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-semibold text-foreground transition hover:bg-secondary">
          
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dealers.directions')}</span>
        </a>
      </div>
    </motion.article>);

}