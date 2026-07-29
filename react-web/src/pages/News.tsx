







import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { Badge } from '../components/ui/Badge';

export function News() {
  const { t, tv } = useLanguage();
  const { data, loading } = useAsync(() => api.getNews(), []);

  return (
    <>
      <Seo title={t('nav.news')} description="Latest agriculture news, policy updates and schemes for Indian farmers." />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">{t('section.news')}</h1>
          <p className="mt-1 text-muted-foreground">{t('section.newsSub')}</p>
        </div>
      </div>
      <div className="container py-8">
        {loading ?
        <div className="grid gap-5 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />)}</div> :

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((article, i) =>
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-soft-lg">
            
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img src={article.image} alt={tv(article.title, article.titleHi)} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="accent">{article.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> {format(new Date(article.date), 'd MMM yyyy')}</span>
                  </div>
                  <h2 className="font-display text-lg font-bold leading-snug text-foreground">{tv(article.title, article.titleHi)}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{tv(article.excerpt, article.excerptHi)}</p>
                </div>
              </motion.article>
          )}
          </div>
        }
      </div>
    </>);

}