












import React from 'react';
import { Seo } from '../components/layout/Seo';

interface LegalPageProps {
  title: string;
  updated?: string;
  sections: {heading: string;body: string;}[];
}

export function LegalPage({ title, updated = 'July 2026', sections }: LegalPageProps) {
  return (
    <>
      <Seo title={title} description={`${title} for AgriMandi.`} />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Last updated: {updated}</p>
        </div>
      </div>
      <div className="container max-w-3xl py-10">
        <div className="space-y-8">
          {sections.map((s, i) =>
          <section key={i}>
              <h2 className="font-display text-lg font-bold text-foreground">{s.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          )}
        </div>
      </div>
    </>);

}

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
      { heading: 'Information we collect', body: 'We collect location data (only with your permission) to show your nearest dealers, along with basic account details when you register a brand or save products.' },
      { heading: 'How we use your data', body: 'Your data is used solely to power product discovery, dealer matching and platform personalisation. We never sell personal information.' },
      { heading: 'Location permissions', body: 'Location access is optional. Denying it simply falls back to distance-based ordering using a default reference point.' },
      { heading: 'Contact', body: 'For any privacy queries, reach us at support@agrimandi.in.' }]
      } />);


}

export function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      sections={[
      { heading: 'Platform usage', body: 'AgriMandi is a discovery platform connecting farmers with agricultural brands and dealers. It is not an online store; purchases happen directly with dealers.' },
      { heading: 'Brand responsibilities', body: 'Brands are responsible for the accuracy of product information, dosages and usage instructions they publish.' },
      { heading: 'Dealer listings', body: 'Dealer availability and timings are indicative. Please confirm stock directly before travelling.' },
      { heading: 'Liability', body: 'AgriMandi facilitates discovery and is not liable for transactions conducted off-platform.' }]
      } />);


}