import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, RefreshCwIcon, SaveIcon } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Field, Input, Select } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { mandiBhavConfig } from '../data/settings';
import { mandiStatus } from '../data/dashboard';
import { formatDateTime, formatNumber } from '../utils/format';

export function MandiBhav() {
  const [config, setConfig] = useState(mandiBhavConfig);
  const [revealKey, setRevealKey] = useState(false);

  const statusTone =
  config.apiStatus === 'connected' ? 'success' : config.apiStatus === 'degraded' ? 'warning' : 'danger';

  return (
    <>
      <PageHeader
        title="Mandi Bhav Settings"
        description="Configuration only — mandi prices are read live from the government open data API."
        actions={
        <>
            <Button variant="secondary">
              <RefreshCwIcon className="h-3.5 w-3.5" />
              Force refresh
            </Button>
            <Button variant="primary">
              <SaveIcon className="h-3.5 w-3.5" />
              Save configuration
            </Button>
          </>
        } />
      

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">API status</p>
          <p className="mt-2">
            <Badge tone={statusTone}>{config.apiStatus}</Badge>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Mandis covered</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {formatNumber(mandiStatus.mandisCovered)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Commodities</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {mandiStatus.commoditiesTracked}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Last sync</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDateTime(mandiStatus.lastSync)}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Government API connection"
            description="Credentials are stored server-side and never exposed to the storefront." />
          
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="API key" hint="Issued by data.gov.in">
                <div className="flex items-center gap-2">
                  <Input
                    type={revealKey ? 'text' : 'password'}
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="font-mono" />
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label={revealKey ? 'Hide API key' : 'Reveal API key'}
                    onClick={() => setRevealKey((v) => !v)}>
                    
                    {revealKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Resource endpoint">
                <Input
                  value={config.endpoint}
                  onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                  className="font-mono text-xs" />
                
              </Field>
            </div>
            <Field label="Cache duration (minutes)" hint="How long responses are served from cache">
              <Input
                type="number"
                value={config.cacheDurationMinutes}
                onChange={(e) =>
                setConfig({ ...config, cacheDurationMinutes: Number(e.target.value) })
                } />
              
            </Field>
            <Field label="Refresh frequency">
              <Select
                value={String(config.refreshFrequencyHours)}
                onChange={(e) =>
                setConfig({ ...config, refreshFrequencyHours: Number(e.target.value) })
                }>
                
                <option value="1">Every hour</option>
                <option value="3">Every 3 hours</option>
                <option value="6">Every 6 hours</option>
                <option value="12">Every 12 hours</option>
                <option value="24">Once a day</option>
              </Select>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Feature toggle" />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
              <div>
                <p className="text-xs font-medium text-foreground">Mandi Bhav module</p>
                <p className="text-[11px] text-muted-foreground">
                  Hides the section across the storefront when off.
                </p>
              </div>
              <Switch
                label="Enable Mandi Bhav"
                checked={config.enabled}
                onChange={(next) => setConfig({ ...config, enabled: next })} />
              
            </div>

            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">Failure rate (7 days)</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{mandiStatus.failureRate}%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-warning"
                  style={{ width: `${Math.min(mandiStatus.failureRate * 10, 100)}%` }} />
                
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              There is no CRUD here by design — price records are never stored or edited by admins, only
              cached from the government feed.
            </p>
          </CardBody>
        </Card>
      </div>
    </>);

}