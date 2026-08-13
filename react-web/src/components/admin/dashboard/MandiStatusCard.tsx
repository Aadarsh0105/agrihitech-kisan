import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, RadioIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { mandiStatus } from '../../../data/admin/dashboard';
import { formatNumber, relativeTime } from '../../../utils/admin/format';

export function MandiStatusCard() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-subtle text-primary">
            <RadioIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Mandi Bhav feed</p>
            <p className="text-[11px] text-muted-foreground">
              Synced {relativeTime(mandiStatus.lastSync)}
            </p>
          </div>
        </div>
        <Badge tone={mandiStatus.connected ? 'success' : 'danger'}>
          {mandiStatus.connected ? 'Connected' : 'Down'}
        </Badge>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <dt className="text-[11px] text-muted-foreground">Mandis</dt>
          <dd className="text-sm font-semibold text-foreground">
            {formatNumber(mandiStatus.mandisCovered)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">Commodities</dt>
          <dd className="text-sm font-semibold text-foreground">
            {mandiStatus.commoditiesTracked}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">Failure rate</dt>
          <dd className="text-sm font-semibold text-foreground">{mandiStatus.failureRate}%</dd>
        </div>
      </dl>

      <Link
        to="/mandi-bhav"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        
        Configure feed
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </Card>);

}