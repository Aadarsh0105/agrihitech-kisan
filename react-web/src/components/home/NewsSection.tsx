























import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import type { PublicNews } from '../../services/news.service';
import { useLanguage } from '../../i18n/LanguageContext';
import { Section } from '../ui/Section';

const excerpt = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() || '';

export function NewsSection({ news }: {news: PublicNews[];}) {
  const { t } = useLanguage();
  return (
    <Section title={t('section.news')} subtitle={t('section.newsSub')} viewAllHref="/news">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {news.map((article, i) =>
        <motion.article
          key={article._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: Math.min(i * 0.08, 0.4) }}
          className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-soft-lg">
          
            <Link to={`/news/${article.slug || article._id}`} className="block">
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {format(new Date(article.createdAt), 'd MMM yyyy')}
                  </span>
                </div>
                <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-foreground group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {excerpt(article.content)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {t('common.readMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.article>
        )}
      </div>
    </Section>);

}
