import {
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  ImageIcon,
  SparklesIcon,
  FolderTreeIcon,
  ListTreeIcon,
  BadgeCheckIcon,
  PackageIcon,
  SlidersHorizontalIcon,
  StoreIcon,
  UserPlusIcon,
  NewspaperIcon,
  PenLineIcon,
  LandmarkIcon,
  LineChartIcon,
  MapPinIcon,
  QuoteIcon,
  ShieldCheckIcon,
  HelpCircleIcon,
  FolderOpenIcon,
  FileTextIcon,
  SearchCheckIcon,
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
  items: [{ label: 'Dashboard', path: '/', icon: LayoutDashboardIcon }]
},
{
  label: 'Storefront CMS',
  items: [
  { label: 'Home Page', path: '/home-cms', icon: LayoutTemplateIcon },
  { label: 'Banners', path: '/banners', icon: ImageIcon },
  { label: 'Platform Features', path: '/platform-features', icon: SparklesIcon },
  { label: 'Benefits', path: '/benefits', icon: ShieldCheckIcon },
  { label: 'Testimonials', path: '/testimonials', icon: QuoteIcon }]

},
{
  label: 'Catalogue',
  items: [
  { label: 'Categories', path: '/categories', icon: FolderTreeIcon },
  { label: 'Sub Categories', path: '/sub-categories', icon: ListTreeIcon },
  { label: 'Brands', path: '/brands', icon: BadgeCheckIcon },
  { label: 'Products', path: '/products', icon: PackageIcon },
  { label: 'Attributes', path: '/attributes', icon: SlidersHorizontalIcon }]

},
{
  label: 'Network',
  items: [
  { label: 'Dealers', path: '/dealers', icon: StoreIcon },
  { label: 'Dealer Requests', path: '/dealer-requests', icon: UserPlusIcon, badgeKey: 'dealerRequests' },
  { label: 'Locations', path: '/locations', icon: MapPinIcon }]

},
{
  label: 'Knowledge',
  items: [
  { label: 'News', path: '/news', icon: NewspaperIcon },
  { label: 'Blogs', path: '/blogs', icon: PenLineIcon },
  { label: 'Govt. Schemes', path: '/schemes', icon: LandmarkIcon },
  { label: 'Mandi Bhav', path: '/mandi-bhav', icon: LineChartIcon },
  { label: 'FAQs', path: '/faqs', icon: HelpCircleIcon }]

},
{
  label: 'Content Ops',
  items: [
  { label: 'Media Library', path: '/media', icon: FolderOpenIcon },
  { label: 'Static Pages', path: '/pages', icon: FileTextIcon },
  { label: 'SEO', path: '/seo', icon: SearchCheckIcon },
  { label: 'Languages', path: '/languages', icon: LanguagesIcon }]

},
{
  label: 'Administration',
  items: [
  { label: 'Roles & Permissions', path: '/roles', icon: UsersIcon },
  { label: 'Notifications', path: '/notifications', icon: BellIcon },
  { label: 'Site Settings', path: '/settings', icon: SettingsIcon }]

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