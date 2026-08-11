









import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Facebook, Instagram, Youtube, Twitter, Send } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { categories, brands } from '../../data/mockData';
import { Button } from '../ui/Button';

export function Footer() {
  const { t, tv } = useLanguage();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-8 border-t border-border bg-secondary/40">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Sprout className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold text-foreground">
                Agri<span className="text-primary">Mandi</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t('footer.tagline')}</p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) =>
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
                
                  <Icon className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="mt-5">
              <LanguageSwitch />
            </div>
          </div>

          <FooterCol title={t('footer.quickLinks')}>
            <FooterLink to="/">{t('nav.home')}</FooterLink>
            <FooterLink to="/products">{t('nav.products')}</FooterLink>
            <FooterLink to="/news">{t('nav.news')}</FooterLink>
            <FooterLink to="/about">{t('nav.about')}</FooterLink>
            <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
          </FooterCol>

          <FooterCol title={t('footer.categories')}>
            {categories.slice(0, 6).map((c) =>
            <FooterLink key={c.id} to={`/categories/${c.slug}`}>
                {tv(c.name, c.nameHi)}
              </FooterLink>
            )}
          </FooterCol>

          <FooterCol title={t('footer.brands')}>
            {brands.slice(0, 6).map((b) =>
            <FooterLink key={b.id} to={`/brands/${b.slug}`}>
                {b.name}
              </FooterLink>
            )}
          </FooterCol>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} AgriMandi. {t('footer.rights')}</p>
          <p>Made for Indian agriculture 🌱</p>
        </div>
      </div>
    </footer>);

}

function FooterCol({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-bold text-foreground">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>);

}

function FooterLink({ to, children }: {to: string;children: React.ReactNode;}) {
  return (
    <li>
      <Link to={to} className="text-sm text-muted-foreground transition hover:text-primary">
        {children}
      </Link>
    </li>);

}