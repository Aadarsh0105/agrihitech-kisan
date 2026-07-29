




import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Login() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t('common.login')} description="Log in to AgriMandi to manage your brand and products." />
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft-lg">
          
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><Sprout className="h-6 w-6" /></span>
            <h1 className="font-display text-2xl font-extrabold text-foreground">{t('common.login')}</h1>
            <p className="text-sm text-muted-foreground">Access your brand dashboard</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <Label>{t('common.email')}</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label>{t('common.password')}</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" size="lg" className="w-full">{t('common.login')}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New brand?{' '}
            <Link to="/register-brand" className="font-semibold text-primary hover:underline">{t('nav.registerBrand')}</Link>
          </p>
        </motion.div>
      </div>
    </>);

}