import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  EyeIcon,
  EyeOffIcon,
  SaveIcon,
  ShieldAlertIcon } from
'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge } from '../../components/admin/ui/Badge';
import { Field, Input, Textarea } from '../../components/admin/ui/Input';
import { Switch } from '../../components/admin/ui/Switch';
import { Tabs } from '../../components/admin/ui/Tabs';
import { integrationSettings, siteSettings, socialLinks } from '../../data/admin/settings';

const tabs = [
{ key: 'general', label: 'General' },
{ key: 'contact', label: 'Contact & social' },
{ key: 'integrations', label: 'Integrations' },
{ key: 'advanced', label: 'Advanced' }];


export function Settings() {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState(siteSettings);
  const [revealed, setRevealed] = useState<string[]>([]);

  const groups = Array.from(new Set(integrationSettings.map((item) => item.group)));

  return (
    <>
      <PageHeader
        title="Site Settings"
        description="Branding, contact details, third-party integrations and platform-wide switches."
        actions={
        <Button variant="primary">
            <SaveIcon className="h-3.5 w-3.5" />
            Save settings
          </Button>
        } />
      

      {settings.maintenanceMode ?
      <Card className="border-warning/40 bg-warning-subtle">
          <CardBody className="flex items-center gap-3 py-3">
            <AlertTriangleIcon className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-xs font-medium text-warning">
              Maintenance mode is ON — the storefront currently shows a holding page to all visitors.
            </p>
          </CardBody>
        </Card> :
      null}

      <Tabs idPrefix="settings" items={tabs} value={tab} onChange={setTab} />

      {tab === 'general' ?
      <Card>
          <CardHeader title="Brand identity" description="Shown across the storefront and emails." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name" required>
              <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
            
            </Field>
            <Field label="Tagline">
              <Input
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
            
            </Field>
            <Field label="Logo URL">
              <Input
              value={settings.logo}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })} />
            
            </Field>
            <Field label="Favicon URL">
              <Input
              value={settings.favicon}
              onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} />
            
            </Field>
            <Field label="Primary colour">
              <div className="flex items-center gap-2">
                <span
                className="h-9 w-9 shrink-0 rounded-md border border-border"
                style={{ background: settings.primaryColor }}
                aria-hidden="true" />
              
                <Input
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="font-mono" />
              
              </div>
            </Field>
            <Field label="Secondary colour">
              <div className="flex items-center gap-2">
                <span
                className="h-9 w-9 shrink-0 rounded-md border border-border"
                style={{ background: settings.secondaryColor }}
                aria-hidden="true" />
              
                <Input
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="font-mono" />
              
              </div>
            </Field>
            <Field label="Footer copyright" className="sm:col-span-2">
              <Input
              value={settings.footerCopyright}
              onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })} />
            
            </Field>
          </CardBody>
        </Card> :
      null}

      {tab === 'contact' ?
      <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Contact details" />
            <CardBody className="space-y-4">
              <Field label="Support email">
                <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
              
              </Field>
              <Field label="Helpline number">
                <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
              
              </Field>
              <Field label="WhatsApp number">
                <Input
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
              
              </Field>
              <Field label="Registered address">
                <Textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
              
              </Field>
              <Field label="Google Maps link">
                <Input
                value={settings.googleMapsUrl}
                onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })} />
              
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Social media" description="Rendered in the storefront footer." />
            <CardBody className="space-y-3">
              {socialLinks.map((link) =>
            <Field key={link.id} label={link.platform}>
                  <Input defaultValue={link.url} />
                </Field>
            )}
            </CardBody>
          </Card>
        </div> :
      null}

      {tab === 'integrations' ?
      <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group) =>
        <Card key={group}>
              <CardHeader
            title={group}
            description="Values are written to server-side environment variables." />
          
              <CardBody className="space-y-3">
                {integrationSettings.
            filter((item) => item.group === group).
            map((item) => {
              const isRevealed = revealed.includes(item.id);
              return (
                <Field key={item.id} label={item.label} hint={item.key}>
                        <div className="flex items-center gap-2">
                          <Input
                      type={item.masked && !isRevealed ? 'password' : 'text'}
                      defaultValue={item.value}
                      className="font-mono text-xs" />
                    
                          {item.masked ?
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label={isRevealed ? `Hide ${item.label}` : `Reveal ${item.label}`}
                      onClick={() =>
                      setRevealed((prev) =>
                      prev.includes(item.id) ?
                      prev.filter((id) => id !== item.id) :
                      [...prev, item.id]
                      )
                      }>
                      
                              {isRevealed ?
                      <EyeOffIcon className="h-4 w-4" /> :

                      <EyeIcon className="h-4 w-4" />
                      }
                            </Button> :
                    null}
                        </div>
                      </Field>);

            })}
              </CardBody>
            </Card>
        )}
        </div> :
      null}

      {tab === 'advanced' ?
      <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Platform switches" />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div>
                  <p className="text-xs font-medium text-foreground">Maintenance mode</p>
                  <p className="text-[11px] text-muted-foreground">
                    Shows a holding page to all storefront visitors.
                  </p>
                </div>
                <Switch
                label="Maintenance mode"
                checked={settings.maintenanceMode}
                onChange={(next) => setSettings({ ...settings, maintenanceMode: next })} />
              
              </div>
            </CardBody>
          </Card>

          <Card className="border-danger/30">
            <CardHeader title="Danger zone" />
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-subtle p-3">
                <ShieldAlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-danger">Purge all caches</p>
                  <p className="mt-0.5 text-[11px] text-danger/80">
                    Clears mandi price, catalogue and CDN caches. Expect elevated API load for ~10 minutes.
                  </p>
                  <Button variant="danger" size="sm" className="mt-2.5">
                    Purge caches
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Environment: <Badge tone="info">production</Badge>
              </p>
            </CardBody>
          </Card>
        </div> :
      null}
    </>);

}