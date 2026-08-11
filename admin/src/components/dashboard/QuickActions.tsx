import React from 'react';
import { Link } from 'react-router-dom';
import {
  ImagePlusIcon,
  LandmarkIcon,
  NewspaperIcon,
  PackagePlusIcon,
  StoreIcon,
  UploadCloudIcon } from
'lucide-react';
import { Card, CardHeader } from '../ui/Card';

const actions = [
{ label: 'Add product', to: '/products/new', icon: PackagePlusIcon },
{ label: 'Add banner', to: '/banners', icon: ImagePlusIcon },
{ label: 'Review dealers', to: '/dealer-requests', icon: StoreIcon },
{ label: 'Publish news', to: '/news', icon: NewspaperIcon },
{ label: 'Add scheme', to: '/schemes', icon: LandmarkIcon },
{ label: 'Upload media', to: '/media', icon: UploadCloudIcon }];


export function QuickActions() {
  return (
    <Card>
      <CardHeader title="Quick actions" description="Most used tasks this week" />
      <div className="grid grid-cols-2 gap-2 p-4">
        {actions.map((action) =>
        <Link
          key={action.to}
          to={action.to}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary-subtle">
          
            <action.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{action.label}</span>
          </Link>
        )}
      </div>
    </Card>);

}