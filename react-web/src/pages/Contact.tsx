










import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { Input, Textarea, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  return (
    <>
      <Seo title={t('nav.contact')} description="Get in touch with the AgriMandi team." />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">{t('nav.contact')}</h1>
          <p className="mt-1 text-muted-foreground">We’d love to hear from you.</p>
        </div>
      </div>

      <div className="container grid gap-8 py-10 lg:grid-cols-2">
        <div className="space-y-4">
          {[
          { icon: Mail, label: 'Email', value: 'support@agrimandi.in' },
          { icon: Phone, label: 'Phone', value: '+91 1800 123 4567' },
          { icon: MapPin, label: 'Office', value: 'Pune, Maharashtra, India' }].
          map((c) =>
          <div key={c.label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30"><c.icon className="h-5 w-5" /></span>
              <div>
                <div className="text-sm font-semibold text-foreground">{c.label}</div>
                <div className="text-sm text-muted-foreground">{c.value}</div>
              </div>
            </div>
          )}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => {e.preventDefault();setSent(true);}}
          className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          
          {sent ?
          <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <p className="font-display text-lg font-bold">Message sent! We’ll reply soon.</p>
            </div> :

          <div className="space-y-4">
              <div><Label>Name</Label><Input required /></div>
              <div><Label>{t('common.email')}</Label><Input type="email" required /></div>
              <div><Label>Message</Label><Textarea required /></div>
              <Button type="submit" size="lg" className="w-full"><Send className="h-4 w-4" /> Send message</Button>
            </div>
          }
        </motion.form>
      </div>
    </>);

}