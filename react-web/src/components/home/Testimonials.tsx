



















import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Section } from '../ui/Section';

export function Testimonials({ testimonials }: {testimonials: Testimonial[];}) {
  const { t, tv } = useLanguage();
  return (
    <Section title={t('section.testimonials')} subtitle={t('section.testimonialsSub')}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((item, i) =>
        <motion.figure
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: Math.min(i * 0.08, 0.4) }}
          className="relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
          
            <Quote className="h-8 w-8 text-primary-200" />
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) =>
            <Star
              key={s}
              className={`h-4 w-4 ${s < item.rating ? 'fill-accent text-accent' : 'text-border'}`} />

            )}
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
              “{tv(item.quote, item.quoteHi)}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-100 font-display text-sm font-bold text-primary-700">
                {item.name.charAt(0)}
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {tv(item.role, item.roleHi)} · {item.location}
                </div>
              </div>
            </figcaption>
          </motion.figure>
        )}
      </div>
    </Section>);

}