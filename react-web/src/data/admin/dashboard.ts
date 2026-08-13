export interface StatCardData {
  id: string;
  label: string;
  value: number;
  delta: number;
  suffix?: string;
  icon:
  'package' |
  'folder' |
  'badge' |
  'store' |
  'userPlus' |
  'users' |
  'news' |
  'landmark';
  path: string;
}

export const dashboardStats: StatCardData[] = [
{ id: 'ds_01', label: 'Total Products', value: 1497, delta: 6.2, icon: 'package', path: '/products' },
{ id: 'ds_02', label: 'Total Categories', value: 42, delta: 2.4, icon: 'folder', path: '/categories' },
{ id: 'ds_03', label: 'Total Brands', value: 118, delta: 4.1, icon: 'badge', path: '/brands' },
{ id: 'ds_04', label: 'Total Dealers', value: 2864, delta: 9.8, icon: 'store', path: '/dealers' },
{ id: 'ds_05', label: 'Pending Dealer Requests', value: 4, delta: -12.5, icon: 'userPlus', path: '/dealer-requests' },
{ id: 'ds_06', label: 'Total Users', value: 184320, delta: 14.6, icon: 'users', path: '/roles' },
{ id: 'ds_07', label: 'Published News', value: 236, delta: 3.3, icon: 'news', path: '/news' },
{ id: 'ds_08', label: 'Government Schemes', value: 68, delta: 1.5, icon: 'landmark', path: '/schemes' }];


export interface TrafficPoint {
  date: string;
  visitors: number;
  productViews: number;
  dealerViews: number;
}

export const trafficSeries: TrafficPoint[] = [
{ date: 'Jul 12', visitors: 8420, productViews: 15230, dealerViews: 4120 },
{ date: 'Jul 16', visitors: 9110, productViews: 16880, dealerViews: 4380 },
{ date: 'Jul 20', visitors: 8760, productViews: 15940, dealerViews: 4010 },
{ date: 'Jul 24', visitors: 10240, productViews: 18720, dealerViews: 4890 },
{ date: 'Jul 28', visitors: 11380, productViews: 20140, dealerViews: 5320 },
{ date: 'Aug 01', visitors: 12760, productViews: 22890, dealerViews: 5910 },
{ date: 'Aug 05', visitors: 12210, productViews: 21460, dealerViews: 5640 },
{ date: 'Aug 09', visitors: 14030, productViews: 25120, dealerViews: 6480 }];


export interface MandiStatus {
  connected: boolean;
  lastSync: string;
  mandisCovered: number;
  commoditiesTracked: number;
  cacheMinutes: number;
  failureRate: number;
}

export const mandiStatus: MandiStatus = {
  connected: true,
  lastSync: '2026-08-11T06:00:00+05:30',
  mandisCovered: 2412,
  commoditiesTracked: 148,
  cacheMinutes: 360,
  failureRate: 1.8
};

export interface CategoryShare {
  name: string;
  value: number;
}

export const categoryShare: CategoryShare[] = [
{ name: 'Seeds', value: 428 },
{ name: 'Fertilizers', value: 316 },
{ name: 'Crop Protection', value: 254 },
{ name: 'Machinery', value: 187 },
{ name: 'Irrigation', value: 142 },
{ name: 'Others', value: 170 }];