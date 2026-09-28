












import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSessionUser } from '../services/auth-session';
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
      updated="26/09/2026"
      sections={[
        { heading: '1. Information We Collect', body: 'We may collect your name, mobile number, email address, profile image, selected categories, business details and location information that you provide while registering or using the platform.' },
        { heading: '2. How We Use Information', body: 'We use this information to manage your account, show relevant products and services, connect farmers with nearby dealers, provide mandi and subsidy information, process subscriptions and improve the platform.' },
        { heading: '3. Location Information', body: 'Location access is used only with your permission to show nearby dealers and location-based information. You may disable location permission in your device or browser settings.' },
        { heading: '4. Information Sharing', body: 'We do not sell personal information. Contact and business information may be shown to farmers, dealers or companies when required for the services you choose to use. Information may also be shared when required by law.' },
        { heading: '5. Data Security', body: 'We use reasonable technical and organisational safeguards to protect your information. No internet or electronic storage system can be guaranteed to be completely secure.' },
        { heading: '6. Data Retention and Deletion', body: 'We retain information while your account is active or as needed to provide services and meet legal obligations. You may request account and data deletion from your profile or by contacting support.' },
        { heading: '7. Third-Party Services', body: 'The platform may use third-party services for maps, payments, hosting, analytics or government information. Their handling of data is governed by their own privacy policies.' },
        { heading: '8. Policy Updates', body: 'We may update this Privacy Policy when our services or legal requirements change. The latest version and update date will be available on the platform.' },
        { heading: '9. Contact', body: 'For privacy questions or data requests, contact Agri Hitech Kisan through the Help & Support section.' },
      ]}
    />
  );
}

const roleTerms = {
  B2C: {
    title: 'Agri Hitech Kisan - User Terms', subtitle: 'Terms & Conditions and Privacy Policy',
    sections: [
      { heading: '1. Service', body: 'Agri Hitech Kisan provides information about medicines, seeds, irrigation, machinery, mandi prices and subsidy schemes.' },
      { heading: '2. Free Service', body: 'All information is currently free. Do not pay cash to anyone.' },
      { heading: '3. Main Disclaimer - No Liability', body: 'This platform is for information purposes only. It does not sell or manufacture products. Product information and prices may be incorrect, and users must verify them independently. The platform has no liability for loss, crop damage or incidents caused by a product. Mandi prices change daily; confirm them with the local mandi.' },
      { heading: '4. Rights of Company', body: 'The company may modify or discontinue any feature without notice.' },
      { heading: '5. Information We Collect', body: 'We collect name, mobile number, district, crop and location only to provide relevant information.' },
      { heading: '6. Data Protection', body: 'We do not sell your data to any third party.' },
      { heading: '7. Data Deletion', body: 'You may request deletion of your data at any time by email.' },
    ],
  },
  B2B: {
    title: 'Agri Hitech Kisan - Dealer Terms', subtitle: 'For Shop / Dealer Registration',
    sections: [
      { heading: '1. Registration', body: 'Dukaandar ko apni dukaan ka sahi naam, GST (yadi ho), pura pata, mobile number aur beche jane wale product (Beej, Dawa, Yantra) ki sahi jankari deni hogi. Galat jankari par ID band kar di jayegi.' },
      { heading: '2. Kisan ko Number Dikhana', body: 'Aapka registered mobile number najdeeki kisano ko dikhaya jayega. Kisan aapko product ki jankari ke liye call kar sakta hai. Kisan se sahi vyavhar karna aapki zimmedari hai.' },
      { heading: '3. Fees / Charges (Yearly / Monthly)', body: 'App par dukaan dikhane ke liye company aapse yearly ya monthly charge legi. Fees advance me dena hoga. Fees jama hone ke baad wapas nahi hogi (Non-Refundable). Agar aap fees nahi dete to aapki dukaan kisano ko dikhna band ho jayegi.' },
      { heading: '4. Wholesale Suvidha', body: 'Aap App ke madhyam se kisano ko ya anya dukaandaro ko thok me samaan bech sakte hain. Product ki kimat, stock, delivery aur payment ki puri zimmedari aapki hogi.' },
      { heading: '5. Product ki Zimmedari - No Liability of App', body: 'Aapke dwara beche gaye kisi bhi beej, dawa, yantra ki quality, asli-nakli, expiry aur warranty ki puri zimmedari aapki swayam ki hogi. Kisi bhi shikayat ya nuksan ki sthiti me Agri Hitech App ki koi jawabdaari nahi hogi.' },
      { heading: '6. Mana Hai', body: 'Nakli, ban ki hui dawa ya expiry product bechna sakht mana hai. Aisa karne par aapki ID hamesha ke liye band kar di jayegi.' },
      { heading: '7. Company ka Adhikar', body: 'Company bina suchna ke fees me badlav kar sakti hai aur kisi bhi dealer ka account band kar sakti hai.' },
    ],
  },
  COMPANY: {
    title: 'Agri Hitech Kisan - Company Terms', subtitle: 'For Company / Brand Registration (English Version)',
    sections: [
      { heading: '1. Company Registration', body: 'The company must provide the correct company name, GST certificate, business address, logo, mobile number and email ID. The ID will be activated only after verification.' },
      { heading: '2. Add Products', body: 'The company may add its own products such as seeds, pesticides, farm equipment and irrigation tools with photos, prices, features and warranty details. If any fake or misleading product is added, the ID will be permanently banned.' },
      { heading: '3. Fees / Charges (Monthly / Yearly)', body: 'To list the company and display products, the platform charges a monthly or yearly fee. Fees must be paid in advance and are non-refundable. If fees are not paid, all company products will stop appearing to farmers.' },
      { heading: '4. Add Dealer Numbers', body: 'The company may add the names and contact numbers of its authorised dealers or distributors so farmers can contact them directly. The company is fully responsible for dealer behaviour and service.' },
      { heading: '5. Product Liability - No Liability of App', body: 'The platform only connects companies with farmers and does not guarantee price, stock or quality. The company is solely responsible for product quality, delivery, warranty, service and any loss or damage to farmers. The platform has no legal liability in any dispute.' },
      { heading: '6. Prohibited', body: 'Selling fake, banned or expired products, or publishing misleading advertisements, is strictly prohibited.' },
      { heading: '7. Rights of App', body: 'The platform reserves the right to change charges or design and to block any company account without prior notice.' },
    ],
  },
} as const;

export function Terms() {
  const [params] = useSearchParams();
  const requestedRole = params.get('role');
  const sessionRole = getSessionUser()?.role;
  const role = requestedRole === 'B2B' || requestedRole === 'COMPANY' || requestedRole === 'B2C'
    ? requestedRole : sessionRole === 'B2B' || sessionRole === 'COMPANY' ? sessionRole : 'B2C';
  const terms = roleTerms[role];
  return <LegalPage title="Terms & Conditions" updated="26/09/2026" sections={[...terms.sections]} />;
}
