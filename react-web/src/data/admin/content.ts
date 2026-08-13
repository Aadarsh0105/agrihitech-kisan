import type {
  Banner,
  Benefit,
  BlogPost,
  Faq,
  GovernmentScheme,
  HomeSection,
  NewsArticle,
  PlatformFeature,
  Testimonial } from
'../types';
import { assets } from './assets';

const seo = (title: string, description: string, keywords: string[]) => ({
  metaTitle: title,
  metaDescription: description,
  keywords,
  canonicalUrl: '',
  robots: 'index, follow'
});

export const homeSections: HomeSection[] = [
{ id: 'hs_01', key: 'hero', name: 'Hero Banner', description: 'Rotating hero slides at the top of the homepage.', itemCount: 4, order: 1, enabled: true, managePath: '/banners' },
{ id: 'hs_02', key: 'features', name: 'Platform Features', description: 'Quick-access feature cards below the hero.', itemCount: 6, order: 2, enabled: true, managePath: '/platform-features' },
{ id: 'hs_03', key: 'categories', name: 'Popular Categories', description: 'Featured category grid driven by the catalogue.', itemCount: 8, order: 3, enabled: true, managePath: '/categories' },
{ id: 'hs_04', key: 'brands', name: 'Trusted Brands', description: 'Verified brand logo strip.', itemCount: 12, order: 4, enabled: true, managePath: '/brands' },
{ id: 'hs_05', key: 'products', name: 'Featured Products', description: 'Hand-picked and trending products.', itemCount: 10, order: 5, enabled: true, managePath: '/products' },
{ id: 'hs_06', key: 'benefits', name: 'Benefits', description: 'Why farmers choose the platform.', itemCount: 4, order: 6, enabled: true, managePath: '/benefits' },
{ id: 'hs_07', key: 'testimonials', name: 'Testimonials', description: 'Farmer and dealer reviews carousel.', itemCount: 6, order: 7, enabled: false, managePath: '/testimonials' },
{ id: 'hs_08', key: 'news', name: 'News Section', description: 'Latest agriculture news cards.', itemCount: 6, order: 8, enabled: true, managePath: '/news' },
{ id: 'hs_09', key: 'app', name: 'Mobile App Section', description: 'App download banner with store links.', itemCount: 1, order: 9, enabled: true, managePath: '/settings' }];


export const banners: Banner[] = [
{
  id: 'ban_01',
  title: { en: 'Kharif Season Ready', hi: 'खरीफ सीजन के लिए तैयार' },
  subtitle: { en: 'Certified seeds and nutrition delivered to your district.' },
  desktopImage: assets.banner,
  mobileImage: assets.banner,
  buttonText: { en: 'Explore Seeds' },
  buttonUrl: '/category/seeds',
  order: 1,
  status: 'active'
},
{
  id: 'ban_02',
  title: { en: 'Machinery Mega Days' },
  subtitle: { en: 'Compare tractors, tillers and implements from verified dealers.' },
  desktopImage: assets.banner,
  mobileImage: assets.banner,
  buttonText: { en: 'Browse Machinery' },
  buttonUrl: '/category/farm-machinery',
  order: 2,
  status: 'active'
},
{
  id: 'ban_03',
  title: { en: 'Know Your Mandi Bhav' },
  subtitle: { en: 'Daily government-sourced crop prices for 2,400+ mandis.' },
  desktopImage: assets.banner,
  mobileImage: assets.banner,
  buttonText: { en: 'Check Prices' },
  buttonUrl: '/mandi-bhav',
  order: 3,
  status: 'active'
},
{
  id: 'ban_04',
  title: { en: 'Monsoon Advisory 2026' },
  subtitle: { en: 'Region-wise sowing guidance from agronomists.' },
  desktopImage: assets.banner,
  mobileImage: assets.banner,
  buttonText: { en: 'Read Advisory' },
  buttonUrl: '/blog/monsoon-advisory-2026',
  order: 4,
  status: 'inactive'
}];


export const platformFeatures: PlatformFeature[] = [
{ id: 'pf_01', icon: 'Search', title: { en: 'Product Discovery' }, description: { en: 'Search 1,500+ agri products by crop, brand and district.' }, route: '/products', order: 1, status: 'active' },
{ id: 'pf_02', icon: 'Store', title: { en: 'Verified Dealers' }, description: { en: 'Find KYC-verified dealers near your village.' }, route: '/dealers', order: 2, status: 'active' },
{ id: 'pf_03', icon: 'LineChart', title: { en: 'Mandi Bhav' }, description: { en: 'Live government mandi prices, updated daily.' }, route: '/mandi-bhav', order: 3, status: 'active' },
{ id: 'pf_04', icon: 'Landmark', title: { en: 'Govt. Schemes' }, description: { en: 'Central and state schemes with eligibility checks.' }, route: '/schemes', order: 4, status: 'active' },
{ id: 'pf_05', icon: 'Newspaper', title: { en: 'Agri News' }, description: { en: 'Weather, policy and market updates in 12 languages.' }, route: '/news', order: 5, status: 'active' },
{ id: 'pf_06', icon: 'MessageCircle', title: { en: 'Expert Support' }, description: { en: 'Talk to agronomists in your own language.' }, route: '/support', order: 6, status: 'inactive' }];


export const benefits: Benefit[] = [
{ id: 'bn_01', icon: 'ShieldCheck', title: { en: 'Verified Sellers Only' }, description: { en: 'Every dealer is document-verified before listing.' }, order: 1, status: 'active' },
{ id: 'bn_02', icon: 'Languages', title: { en: '12 Indian Languages' }, description: { en: 'Browse the entire catalogue in your language.' }, order: 2, status: 'active' },
{ id: 'bn_03', icon: 'MapPin', title: { en: 'District Level Availability' }, description: { en: 'See what is actually stocked near you.' }, order: 3, status: 'active' },
{ id: 'bn_04', icon: 'BadgeIndianRupee', title: { en: 'Transparent Pricing' }, description: { en: 'MRP, dealer price and discount shown upfront.' }, order: 4, status: 'active' },
{ id: 'bn_05', icon: 'Headset', title: { en: 'Kisan Helpline' }, description: { en: 'Toll-free support from 7 AM to 9 PM.' }, order: 5, status: 'inactive' }];


export const testimonials: Testimonial[] = [
{ id: 'tst_01', name: 'Ramesh Chaudhary', designation: 'Wheat Farmer', photo: assets.farmer, review: { en: 'I compared seed prices from four dealers in Sikar and saved ₹3,200 this season.' }, rating: 5, location: 'Sikar, Rajasthan', status: 'active' },
{ id: 'tst_02', name: 'Sunita Devi', designation: 'Vegetable Grower', photo: assets.farmer, review: { en: 'The Hindi product details finally made technical specs easy to understand.' }, rating: 5, location: 'Muzaffarpur, Bihar', status: 'active' },
{ id: 'tst_03', name: 'Karthik Reddy', designation: 'Cotton Farmer', photo: assets.farmer, review: { en: 'Mandi bhav alerts help me decide the right day to sell.' }, rating: 4, location: 'Warangal, Telangana', status: 'active' },
{ id: 'tst_04', name: 'Harpreet Kaur', designation: 'Dairy & Fodder', photo: assets.farmer, review: { en: 'Found a verified machinery dealer 12 km away instead of travelling to Ludhiana.' }, rating: 5, location: 'Moga, Punjab', status: 'active' },
{ id: 'tst_05', name: 'Ashok Pawar', designation: 'Grape Grower', photo: assets.farmer, review: { en: 'Scheme section told me about a subsidy I did not know existed.' }, rating: 4, location: 'Nashik, Maharashtra', status: 'inactive' }];


export const faqs: Faq[] = [
{ id: 'faq_01', question: { en: 'Is Agri HiTech Kisan an online store?' }, answer: { en: 'No. We are a discovery platform. You compare products and connect directly with verified dealers.' }, category: 'General', order: 1, status: 'active' },
{ id: 'faq_02', question: { en: 'How do I become a listed dealer?' }, answer: { en: 'Submit your GST, trade licence and shop photograph through the dealer registration form. Verification takes 3–5 working days.' }, category: 'Dealers', order: 2, status: 'active' },
{ id: 'faq_03', question: { en: 'Where does mandi price data come from?' }, answer: { en: 'Prices are sourced from the Government of India Agmarknet open data API and refreshed every 6 hours.' }, category: 'Mandi Bhav', order: 3, status: 'active' },
{ id: 'faq_04', question: { en: 'Which languages are supported?' }, answer: { en: 'Twelve Indian languages including Hindi, Marathi, Tamil, Telugu, Bengali and Punjabi.' }, category: 'General', order: 4, status: 'active' },
{ id: 'faq_05', question: { en: 'Do you charge farmers anything?' }, answer: { en: 'No. The platform is completely free for farmers.' }, category: 'Pricing', order: 5, status: 'active' },
{ id: 'faq_06', question: { en: 'How are product prices decided?' }, answer: { en: 'Dealers publish their own prices. We display MRP alongside for transparency.' }, category: 'Pricing', order: 6, status: 'inactive' }];


export const news: NewsArticle[] = [
{ id: 'nws_01', title: { en: 'IMD forecasts above-normal monsoon for central India' }, description: { en: 'The met department expects 106% of long-period average rainfall this kharif season.' }, featuredImage: assets.banner, category: 'Weather', author: 'Editorial Desk', publishedAt: '2026-08-10T09:00:00+05:30', status: 'active', seo: seo('Above-normal monsoon forecast', 'IMD monsoon forecast for kharif 2026.', ['monsoon']) },
{ id: 'nws_02', title: { en: 'MSP for paddy raised by ₹143 per quintal' }, description: { en: 'Cabinet approves revised minimum support prices for 14 kharif crops.' }, featuredImage: assets.banner, category: 'Policy', author: 'Editorial Desk', publishedAt: '2026-08-08T09:00:00+05:30', status: 'active', seo: seo('MSP hike for paddy', 'Revised MSP for kharif crops.', ['msp']) },
{ id: 'nws_03', title: { en: 'Drone spraying subsidy extended to five more states' }, description: { en: 'Kisan drone scheme now covers Odisha, Assam, Jharkhand, Chhattisgarh and Tripura.' }, featuredImage: assets.banner, category: 'Technology', author: 'Priya Menon', publishedAt: '2026-08-05T09:00:00+05:30', status: 'active', seo: seo('Drone subsidy extended', 'Kisan drone scheme expansion.', ['drone']) },
{ id: 'nws_04', title: { en: 'Onion prices ease as Nashik arrivals rise' }, description: { en: 'Daily arrivals crossed 22,000 quintals, softening wholesale rates by 14%.' }, featuredImage: assets.banner, category: 'Market', author: 'Editorial Desk', publishedAt: '2026-08-03T09:00:00+05:30', status: 'draft', seo: seo('Onion prices ease', 'Nashik onion market update.', ['onion']) },
{ id: 'nws_05', title: { en: 'New biofertilizer plant commissioned in Vidarbha' }, description: { en: 'The 40,000 TPA unit will supply eastern Maharashtra districts.' }, featuredImage: assets.banner, category: 'Industry', author: 'Rahul Kumar', publishedAt: '2026-07-30T09:00:00+05:30', status: 'active', seo: seo('Biofertilizer plant', 'New biofertilizer capacity in Vidarbha.', ['biofertilizer']) }];


export const blogs: BlogPost[] = [
{ id: 'blg_01', title: { en: 'A practical guide to soil testing before kharif' }, content: { en: 'Soil testing is the cheapest yield insurance a farmer can buy…' }, featuredImage: assets.category, category: 'Soil Health', tags: ['soil', 'kharif', 'testing'], author: 'Dr. Anil Deshpande', publishedAt: '2026-08-07T09:00:00+05:30', status: 'active', seo: seo('Soil testing guide', 'How to test soil before kharif sowing.', ['soil testing']) },
{ id: 'blg_02', title: { en: 'Choosing between drip and sprinkler irrigation' }, content: { en: 'Water availability, crop spacing and land slope decide the answer…' }, featuredImage: assets.category, category: 'Irrigation', tags: ['drip', 'sprinkler', 'water'], author: 'Meera Iyer', publishedAt: '2026-08-01T09:00:00+05:30', status: 'active', seo: seo('Drip vs sprinkler', 'Compare drip and sprinkler irrigation.', ['drip']) },
{ id: 'blg_03', title: { en: 'Ten integrated pest management practices that work' }, content: { en: 'IPM reduces spray costs while protecting beneficial insects…' }, featuredImage: assets.category, category: 'Crop Protection', tags: ['ipm', 'pest'], author: 'Dr. Anil Deshpande', publishedAt: '2026-07-24T09:00:00+05:30', status: 'draft', seo: seo('IPM practices', 'Integrated pest management guide.', ['ipm']) },
{ id: 'blg_04', title: { en: 'Understanding fertilizer grades on the bag' }, content: { en: 'The three numbers printed on every bag tell you more than you think…' }, featuredImage: assets.category, category: 'Nutrition', tags: ['npk', 'fertilizer'], author: 'Editorial Desk', publishedAt: '2026-07-15T09:00:00+05:30', status: 'active', seo: seo('Fertilizer grades explained', 'What NPK numbers mean.', ['npk']) }];


export const schemes: GovernmentScheme[] = [
{
  id: 'sch_01',
  name: { en: 'PM Kisan Samman Nidhi', hi: 'पीएम किसान सम्मान निधि' },
  department: 'Ministry of Agriculture & Farmers Welfare',
  level: 'central',
  state: 'All India',
  description: { en: 'Income support of ₹6,000 per year to eligible landholding farmer families in three instalments.' },
  eligibility: ['Landholding farmer family', 'Valid Aadhaar linked bank account', 'Not an income tax payer'],
  benefits: ['₹6,000 per year', 'Direct benefit transfer', 'No application fee'],
  requiredDocuments: ['Aadhaar card', 'Land records', 'Bank passbook'],
  officialWebsite: 'https://pmkisan.gov.in',
  applyLink: 'https://pmkisan.gov.in/RegistrationForm.aspx',
  featured: true,
  order: 1,
  status: 'active'
},
{
  id: 'sch_02',
  name: { en: 'Pradhan Mantri Fasal Bima Yojana' },
  department: 'Ministry of Agriculture & Farmers Welfare',
  level: 'central',
  state: 'All India',
  description: { en: 'Crop insurance against yield loss due to natural calamities, pests and diseases.' },
  eligibility: ['All farmers growing notified crops', 'Loanee and non-loanee farmers'],
  benefits: ['Low premium of 2% for kharif', 'Full sum insured coverage', 'Localised calamity cover'],
  requiredDocuments: ['Aadhaar card', 'Sowing certificate', 'Bank passbook'],
  officialWebsite: 'https://pmfby.gov.in',
  applyLink: 'https://pmfby.gov.in/farmerRegistrationForm',
  featured: true,
  order: 2,
  status: 'active'
},
{
  id: 'sch_03',
  name: { en: 'Sub-Mission on Agricultural Mechanization' },
  department: 'Department of Agriculture & Cooperation',
  level: 'central',
  state: 'All India',
  description: { en: 'Subsidy on purchase of tractors, power tillers and farm implements.' },
  eligibility: ['Individual farmers', 'FPOs and custom hiring centres'],
  benefits: ['40–50% subsidy on implements', 'Higher rate for SC/ST and women farmers'],
  requiredDocuments: ['Land records', 'Aadhaar card', 'Quotation from dealer'],
  officialWebsite: 'https://agrimachinery.nic.in',
  applyLink: 'https://agrimachinery.nic.in/Index/Registration',
  featured: false,
  order: 3,
  status: 'active'
},
{
  id: 'sch_04',
  name: { en: 'Mukhyamantri Krishi Sinchai Yojana' },
  department: 'Maharashtra Department of Agriculture',
  level: 'state',
  state: 'Maharashtra',
  description: { en: 'State top-up subsidy for micro irrigation installation on horticulture crops.' },
  eligibility: ['Maharashtra resident farmers', 'Maximum 5 hectare per beneficiary'],
  benefits: ['Additional 25% state subsidy', 'Priority for drought-prone talukas'],
  requiredDocuments: ['7/12 extract', 'Aadhaar card', 'Water source proof'],
  officialWebsite: 'https://mahadbt.maharashtra.gov.in',
  applyLink: 'https://mahadbt.maharashtra.gov.in/Farmer/Login',
  featured: false,
  order: 4,
  status: 'active'
},
{
  id: 'sch_05',
  name: { en: 'Rythu Bandhu Investment Support' },
  department: 'Telangana Department of Agriculture',
  level: 'state',
  state: 'Telangana',
  description: { en: 'Per-acre investment support paid before each cropping season.' },
  eligibility: ['Telangana landholding farmers', 'Updated land record (Dharani)'],
  benefits: ['₹5,000 per acre per season', 'Paid directly to bank account'],
  requiredDocuments: ['Pattadar passbook', 'Aadhaar card'],
  officialWebsite: 'https://rythubandhu.telangana.gov.in',
  applyLink: 'https://rythubandhu.telangana.gov.in',
  featured: false,
  order: 5,
  status: 'draft'
}];