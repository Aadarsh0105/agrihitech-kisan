import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, DownloadIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { StatCard } from '../../components/admin/shared/StatCard';
import { Card, CardHeader } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge, StatusBadge } from '../../components/admin/ui/Badge';
import { CardSkeleton } from '../../components/admin/ui/Skeleton';
import { Thumb } from '../../components/admin/shared/Thumb';
import { TrafficChart } from '../../components/admin/dashboard/TrafficChart';
import { QuickActions } from '../../components/admin/dashboard/QuickActions';
import { ActivityFeed } from '../../components/admin/dashboard/ActivityFeed';
import { MandiStatusCard } from '../../components/admin/dashboard/MandiStatusCard';
import { dashboardStats, categoryShare } from '../../data/admin/dashboard';
import { products } from '../../data/admin/catalogue';
import { dealers } from '../../data/admin/dealers';
import { useResource } from '../../hooks/admin/useResource';
import { formatCurrency, formatDate, relativeTime } from '../../utils/admin/format';
import { t } from '../../utils/admin/i18n';
import type { Product } from '../../types/admin';
import type { Dealer } from '../../types/admin';

export function Dashboard() {
  const productsResource = useResource<Product>({ endpoint: 'products', seed: products });
  const dealersResource = useResource<Dealer>({ endpoint: 'dealers', seed: dealers });

  const latestProducts = productsResource.items.slice(0, 5);
  const latestDealers = dealersResource.items.slice(0, 5);
  const totalShare = categoryShare.reduce((sum, item) => sum + item.value, 0);

  return (
    <>
      <PageHeader title="Dashboard" description="Platform health, catalogue growth and dealer network at a glance." />
      <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) =>
          <StatCard key={stat.id} stat={stat} index={index} />
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <div className="space-y-4">
          <MandiStatusCard />
          <QuickActions />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Latest products"
            description="Most recently updated catalogue entries"
            action={
              <Link to="/admin/products">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />

          {productsResource.isLoading ?
            <div className="space-y-2 p-4">
              <CardSkeleton />
            </div> :

            <ul className="divide-y divide-border">
              {latestProducts.map((product) =>
                <li key={product.id} className="flex items-center gap-3 px-5 py-3">
                  <Thumb src={product.image} alt={t(product.name)} />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/admin/products"
                      className="block truncate text-sm font-medium text-foreground hover:text-primary">

                      {t(product.name)}
                    </Link>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {product.categoryName} · {product.brandName} · {formatDate(product.updatedAt)}
                    </p>
                  </div>
                  <span className="hidden text-sm font-medium text-foreground sm:block">
                    {formatCurrency(product.price)}
                  </span>
                  <StatusBadge status={product.status} />
                </li>
              )}
            </ul>
          }
        </Card>

        <Card>
          <CardHeader title="Catalogue mix" description="Products by category" />
          <ul className="space-y-3 p-5">
            {categoryShare.map((item) => {
              const percent = Math.round(item.value / totalShare * 100);
              return (
                <li key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percent}%` }} />

                  </div>
                </li>);

            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Latest dealers"
            description="Newest additions to the verified network"
            action={
              <Link to="/dealers">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />

          <ul className="divide-y divide-border">
            {latestDealers.map((dealer) =>
              <li key={dealer.id} className="flex items-center gap-3 px-5 py-3">
                <Thumb src={dealer.logo} alt={dealer.businessName} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/dealers/${dealer.id}`}
                    className="block truncate text-sm font-medium text-foreground hover:text-primary">

                    {dealer.businessName}
                  </Link>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {dealer.city}, {dealer.state} · joined {relativeTime(dealer.appliedAt)}
                  </p>
                </div>
                {dealer.verified ? <Badge tone="info">Verified</Badge> : null}
                <StatusBadge status={dealer.status} />
              </li>
            )}
          </ul>
        </Card>

        <ActivityFeed />
      </div>
    </>);

}
