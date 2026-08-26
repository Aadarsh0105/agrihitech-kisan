import { ArrowRight, Building2, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const registrationOptions = [
  {
    title: 'Join as a Dealer',
    description: 'Register your business, connect with trusted brands, and reach more agricultural buyers.',
    href: '/register-brand',
    action: 'Register as Dealer',
    icon: Store,
  },
  {
    title: 'Join as a Company',
    description: 'Create your company account to manage brands, products, and your dealer network.',
    href: '/register-company',
    action: 'Register Company',
    icon: Building2,
  },
];

export function PartnerRegistration() {
  return (
    <section className="pb-5 lg:pb-8">
      <div className="container">
        <div className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 shadow-soft md:p-7">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Grow with Agri HiTech Kisan</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">Bring your agriculture business online</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Choose the account that matches your business and start building stronger connections across the agriculture network.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {registrationOptions.map((option) => (
                <article key={option.href} className="group rounded-2xl border border-border bg-card/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <option.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">{option.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <Link to={option.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    {option.action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
