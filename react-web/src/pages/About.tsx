









import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Users, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';

const stats = [
{ value: '5,000+', labelEn: 'Products listed', labelHi: 'सूचीबद्ध उत्पाद' },
{ value: '600+', labelEn: 'Verified brands', labelHi: 'सत्यापित ब्रांड' },
{ value: '12,000+', labelEn: 'Dealers', labelHi: 'डीलर' },
{ value: '18', labelEn: 'States covered', labelHi: 'राज्य' }];


const values = [
{ icon: ShieldCheck, en: 'Verified & trusted', hi: 'सत्यापित और विश्वसनीय', descEn: 'Every brand and dealer is vetted for authenticity.', descHi: 'हर ब्रांड और डीलर की प्रामाणिकता जाँची जाती है।' },
{ icon: MapPin, en: 'Hyperlocal discovery', hi: 'स्थानीय खोज', descEn: 'Find the nearest dealer for any product instantly.', descHi: 'किसी भी उत्पाद के लिए तुरंत निकटतम डीलर खोजें।' },
{ icon: Users, en: 'Farmer first', hi: 'किसान पहले', descEn: 'Built around the needs of Indian farmers.', descHi: 'भारतीय किसानों की ज़रूरतों के आसपास बना।' }];


export function About() {
  const { t, tv } = useLanguage();
  return (
    <>
      <Seo title={t('nav.about')} description="AgriMandi connects farmers with verified agricultural brands and their nearest dealers." />
      <section className="bg-primary-50/60 py-16 dark:bg-primary-900/10">
        <div className="container max-w-3xl text-center">
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><Sprout className="h-7 w-7" /></motion.span>
          <h1 className="mt-5 font-display text-4xl font-extrabold text-foreground">{t('nav.about')} AgriMandi</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {tv(
              'AgriMandi is India’s agricultural product discovery platform. We help farmers browse verified brands and products, then instantly connect with their nearest dealers — bridging the gap between manufacturers and the field.',
              'एग्रीमंडी भारत का कृषि उत्पाद खोज प्लेटफ़ॉर्म है। हम किसानों को सत्यापित ब्रांड और उत्पाद देखने में मदद करते हैं और तुरंत उनके निकटतम डीलर से जोड़ते हैं।'
            )}
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) =>
          <motion.div key={s.value} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
              <div className="font-display text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{tv(s.labelEn, s.labelHi)}</div>
            </motion.div>
          )}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((v, i) =>
          <motion.div key={v.en} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30"><v.icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{tv(v.en, v.hi)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tv(v.descEn, v.descHi)}</p>
            </motion.div>
          )}
        </div>
      </div>
    </>);

}