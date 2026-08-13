import {
  LayoutDashboardIcon,
  ImageIcon,
  BadgeCheckIcon,
  FolderTreeIcon,
  PackageIcon,
  LandmarkIcon,
  SettingsIcon,
  LanguagesIcon,
  UsersIcon,
  BellIcon,
  type LucideIcon } from
'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badgeKey?: 'dealerRequests';
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
{
  label: 'Overview',
  items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboardIcon }]
},
{
  label: 'Storefront CMS',
  items: [{ label: 'Banners', path: '/admin/banners', icon: ImageIcon }]
},
{
  label: 'Catalogue',
  items: [
    { label: 'Categories', path: '/admin/categories', icon: FolderTreeIcon },
    { label: 'Brands', path: '/admin/brands', icon: BadgeCheckIcon },
    { label: 'Products', path: '/admin/products', icon: PackageIcon }
  ]
},
{
  label: 'Commerce',
  items: [{ label: 'Subscriptions', path: '/admin/subscriptions', icon: LandmarkIcon }]
}];


/** Flat lookup used by breadcrumbs and global search. */
export const flatNavigation: {label: string;path: string;group: string;icon: LucideIcon;}[] =
navigation.flatMap((group) =>
group.items.map((item) => ({
  label: item.label,
  path: item.path,
  group: group.label,
  icon: item.icon
}))
);
