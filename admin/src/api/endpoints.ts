/**
 * Single source of truth for every admin REST endpoint.
 * Pages reference these keys today via `useResource`; swapping the hardcoded
 * arrays for live data only requires wiring these paths into Axios thunks.
 */
export const endpoints = {
  dashboard: '/admin/dashboard',
  banners: '/admin/banners',
  homeSections: '/admin/home-sections',
  platformFeatures: '/admin/platform-features',
  categories: '/admin/categories',
  subCategories: '/admin/sub-categories',
  brands: '/admin/brands',
  products: '/admin/products',
  productAttributes: '/admin/product-attributes',
  dealers: '/admin/dealers',
  dealerRequests: '/admin/dealers/requests',
  news: '/admin/news',
  blogs: '/admin/blogs',
  schemes: '/admin/government-schemes',
  mandiBhav: '/admin/settings/mandi-bhav',
  states: '/admin/locations/states',
  districts: '/admin/locations/districts',
  cities: '/admin/locations/cities',
  testimonials: '/admin/testimonials',
  benefits: '/admin/benefits',
  faqs: '/admin/faqs',
  media: '/admin/media',
  staticPages: '/admin/pages',
  seo: '/admin/seo',
  settings: '/admin/settings',
  translations: '/admin/translations',
  roles: '/admin/roles',
  adminUsers: '/admin/users',
  notifications: '/admin/notifications',
  activities: '/admin/activities',
  profile: '/admin/profile'
} as const;

export type EndpointKey = keyof typeof endpoints;