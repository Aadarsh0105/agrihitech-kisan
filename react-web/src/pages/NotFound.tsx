














import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t('common.notFound')} />
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary dark:bg-primary-900/30"><Sprout className="h-8 w-8" /></span>
        <h1 className="mt-6 font-display text-5xl font-extrabold text-foreground">404</h1>
        <p className="mt-2 text-muted-foreground">{t('common.notFound')}</p>
        <Link to="/" className="mt-6">
          <Button size="lg">{t('common.backHome')}</Button>
        </Link>
      </div>
    </>);

}