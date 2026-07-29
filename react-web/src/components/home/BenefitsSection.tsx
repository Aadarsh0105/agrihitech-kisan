import { motion } from 'framer-motion';
import type { Benefit } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Section } from '../ui/Section';

export function BenefitsSection({ benefits }: {benefits: Benefit[];}) {
  const { t, tv } = useLanguage();
  return (
    <div className="bg-primary-50/60 dark:bg-primary-900/10">
      <Section title={t('section.benefits')} subtitle={t('section.benefitsSub')}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) =>
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
            
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <CategoryIcon name={b.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">{tv(b.title, b.titleHi)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tv(b.description, b.descriptionHi)}</p>
              </div>
            </motion.div>
          )}
        </div>
      </Section>
    </div>);

}