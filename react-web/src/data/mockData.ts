


import type {
  Brand, Category, Dealer, Product, Testimonial, NewsArticle, Benefit,
} from
  '../types';

const SEED_IMG = "/c96a6946-9bb5-4344-9086-2de64f22b3d4.jpg";
const FERT_IMG = "/f9fda487-0cce-440e-a03b-2812e1eea3af.jpg";
const PEST_IMG = "/002db2eb-7c22-4f8e-b69b-91b370e3694c.jpg";
const LOGO_SHEET = "/856a8d3b-9812-4329-ab03-e34534cf6224.jpg";
const BANNER = "/0feba23c-6ead-4445-9e3f-f20e07dd649f.jpg";

export const categories: Category[] = [
  {
    id: "c1",
    slug: "seeds",
    name: "Seeds",
    nameHi: "बीज",
    icon: "sprout",
    bannerImage: SEED_IMG,
    productCount: 1250,
    subCategories: [
      {
        id: "s1",
        slug: "hybrid-seeds",
        name: "Hybrid Seeds",
        nameHi: "हाइब्रिड बीज",
      },
      {
        id: "s2",
        slug: "vegetable-seeds",
        name: "Vegetable Seeds",
        nameHi: "सब्ज़ी बीज",
      },
      {
        id: "s3",
        slug: "grain-seeds",
        name: "Grain Seeds",
        nameHi: "अनाज बीज",
      },
    ],
  },

  {
    id: "c2",
    slug: "agriculture-machinery",
    name: "Agriculture Machinery",
    nameHi: "कृषि मशीनरी",
    icon: "tractor",
    bannerImage: LOGO_SHEET,
    productCount: 520,
    subCategories: [
      {
        id: "s4",
        slug: "tractors",
        name: "Tractors",
        nameHi: "ट्रैक्टर",
      },
      {
        id: "s5",
        slug: "power-tillers",
        name: "Power Tillers",
        nameHi: "पावर टिलर",
      },
      {
        id: "s6",
        slug: "harvesters",
        name: "Harvesters",
        nameHi: "हार्वेस्टर",
      },
    ],
  },

  {
    id: "c3",
    slug: "farming-medicine",
    name: "Farming Medicine",
    nameHi: "कृषि दवाइयाँ",
    icon: "shield",
    bannerImage: PEST_IMG,
    productCount: 680,
    subCategories: [
      {
        id: "s7",
        slug: "insecticides",
        name: "Insecticides",
        nameHi: "कीटनाशी",
      },
      {
        id: "s8",
        slug: "fungicides",
        name: "Fungicides",
        nameHi: "फफूंदनाशी",
      },
      {
        id: "s9",
        slug: "herbicides",
        name: "Herbicides",
        nameHi: "शाकनाशी",
      },
    ],
  },

  {
    id: "c4",
    slug: "irrigation-equipment",
    name: "Irrigation Equipment",
    nameHi: "सिंचाई उपकरण",
    icon: "droplets",
    bannerImage: SEED_IMG,
    productCount: 410,
    subCategories: [
      {
        id: "s10",
        slug: "drip-irrigation",
        name: "Drip Irrigation",
        nameHi: "ड्रिप सिंचाई",
      },
      {
        id: "s11",
        slug: "sprinklers",
        name: "Sprinklers",
        nameHi: "स्प्रिंकलर",
      },
      {
        id: "s12",
        slug: "water-pumps",
        name: "Water Pumps",
        nameHi: "पानी के पंप",
      },
    ],
  }
];

export const platformFeatures = [
  {
    id: "f1",
    slug: "mandi-bhav",
    title: "Live Mandi Bhav",
    description:
      "Check real-time crop prices from government mandis across India and make better selling decisions.",
  },
  {
    id: "f2",
    slug: "anudan-yojna",
    title: "Anudan Yojna",
    description:
      "Discover the latest agricultural subsidies, PM-Kisan, state schemes and financial assistance for farmers.",
  },
];

export const brands: Brand[] = [
  {
    id: 'b1',
    slug: 'syngenta',
    name: 'Syngenta',
    logo: 'https://www.google.com/s2/favicons?sz=256&domain=syngenta.com',
    banner: BANNER,
    description: 'Global leader in crop protection and seeds.',
    descriptionHi: 'फसल सुरक्षा और बीजों में वैश्विक अग्रणी।',
    website: 'https://www.syngenta.com',
    verified: true,
    productCount: 132,
    contact: {
      email: 'info@syngenta.com',
      phone: '+91 98765 43210',
      address: 'Pune, Maharashtra'
    }
  },
  {
    id: 'b2',
    slug: 'bayer-cropscience',
    name: 'Bayer Crop Science',
    logo: 'https://www.google.com/s2/favicons?sz=256&domain=bayer.com',
    banner: BANNER,
    description: 'Innovative crop protection and seed technologies.',
    descriptionHi: 'नवाचार आधारित फसल सुरक्षा और बीज तकनीक।',
    website: 'https://www.bayer.com',
    verified: true,
    productCount: 98,
    contact: {
      email: 'info@bayer.com',
      phone: '+91 90123 45678',
      address: 'Mumbai, Maharashtra'
    }
  },
  {
    id: 'b3',
    slug: 'upl',
    name: 'UPL',
    logo: 'https://www.google.com/s2/favicons?sz=256&domain=upl-ltd.com',
    banner: BANNER,
    description: 'Sustainable agriculture solutions.',
    descriptionHi: 'सतत कृषि समाधान।',
    website: 'https://www.upl-ltd.com',
    verified: true,
    productCount: 76,
    contact: {
      email: 'info@upl-ltd.com',
      phone: '+91 99887 76655',
      address: 'Mumbai, Maharashtra'
    }
  },
  {
    id: 'b4',
    slug: 'iffco-mc',
    name: 'IFFCO MC',
    logo: 'https://www.google.com/s2/favicons?sz=256&domain=coromandel.biz',
    banner: BANNER,
    description: 'Crop protection and specialty plant nutrition.',
    descriptionHi: 'फसल सुरक्षा और विशेष पौध पोषण।',
    website: 'https://www.iffcomc.com',
    verified: true,
    productCount: 54,
    contact: {
      email: 'info@iffcomc.com',
      phone: '+91 91234 56789',
      address: 'New Delhi'
    }
  },
  {
    id: 'b5',
    slug: 'coromandel',
    name: 'Coromandel International',
    logo: 'https://www.google.com/s2/favicons?sz=256&domain=dhanuka.com',
    banner: BANNER,
    description: 'Leading fertilizer, crop protection and specialty nutrients company.',
    descriptionHi: 'उर्वरक, फसल सुरक्षा और विशेष पोषक तत्वों की अग्रणी कंपनी।',
    website: 'https://www.coromandel.biz',
    verified: true,
    productCount: 41,
    contact: {
      email: 'info@coromandel.biz',
      phone: '+91 93456 78901',
      address: 'Hyderabad, Telangana'
    }
  },
  {
    id: 'b6',
    slug: 'dhanuka',
    name: 'Dhanuka Agritech',
    logo: 'https://www.google.com/s2/favicons?sz=256&domain=iffcomc.com',
    banner: BANNER,
    description: 'Crop protection and agricultural solutions.',
    descriptionHi: 'फसल सुरक्षा और कृषि समाधान।',
    website: 'https://www.dhanuka.com',
    verified: true,
    productCount: 63,
    contact: {
      email: 'info@dhanuka.com',
      phone: '+91 94567 89012',
      address: 'Gurugram, Haryana'
    }
  }
];


const specs = [
  { label: 'Formulation', value: 'Water dispersible granule' },
  { label: 'Mode of Action', value: 'Systemic' },
  { label: 'Shelf Life', value: '24 months' },
  { label: 'Certification', value: 'ISO 9001, FCO approved' }];


const downloads = { brochure: '#brochure', manual: '#manual', specPdf: '#spec' };

function mkProduct(p: Partial<Product> & Pick<Product, 'id' | 'name' | 'nameHi' | 'brandId' | 'brandName' | 'categoryId' | 'categoryName' | 'images'>): Product {
  return {
    slug: p.slug ?? p.id,
    shortDescription: p.shortDescription ?? 'High-performance agricultural input for improved crop yield and protection.',
    shortDescriptionHi: p.shortDescriptionHi ?? 'बेहतर फसल उपज और सुरक्षा के लिए उच्च-प्रदर्शन कृषि इनपुट।',
    description: p.description ?? 'A trusted, field-proven formulation developed for Indian agro-climatic conditions. Ensures uniform performance, easy application and measurable results across major crops.',
    suitableCrops: p.suitableCrops ?? ['Wheat', 'Rice', 'Cotton', 'Maize'],
    dosage: p.dosage ?? '2–2.5 ml per litre of water',
    usage: p.usage ?? 'Apply as foliar spray during early vegetative and flowering stages for best results.',
    benefits: p.benefits ?? ['Higher yield potential', 'Better disease resistance', 'Improved soil health', 'Cost effective'],
    packagingSizes: p.packagingSizes ?? ['250 g', '500 g', '1 kg', '5 kg'],
    tags: p.tags ?? ['certified', 'popular'],
    createdAt: p.createdAt ?? '2026-06-01',
    specifications: p.specifications ?? specs,
    downloads: p.downloads ?? downloads,
    subCategory: p.subCategory,
    price: p.price,
    trending: p.trending,
    featured: p.featured,
    ...p
  } as Product;
}

export const products: Product[] = [
  mkProduct({ id: 'p1', slug: 'goldenharvest-hybrid-wheat', name: 'GoldenHarvest Hybrid Wheat Seed', nameHi: 'गोल्डनहार्वेस्ट हाइब्रिड गेहूँ बीज', brandId: 'b1', brandName: 'AgriRoots Seed Solutions', categoryId: 'c1', categoryName: 'Seeds', subCategory: 'Hybrid Seeds', images: [SEED_IMG, FERT_IMG, PEST_IMG], featured: true, trending: true, price: 1250, suitableCrops: ['Wheat'], tags: ['hybrid', 'high-yield', 'certified'] }),
  mkProduct({ id: 'p2', slug: 'nutriboost-npk-complex', name: 'NutriBoost NPK 19:19:19', nameHi: 'न्यूट्रीबूस्ट NPK 19:19:19', brandId: 'b2', brandName: 'Verdant Farms', categoryId: 'c2', categoryName: 'Fertilizers', subCategory: 'Nitrogen', images: [FERT_IMG, SEED_IMG], featured: true, price: 890 }),
  mkProduct({ id: 'p3', slug: 'guardax-systemic-insecticide', name: 'GuardAX Systemic Insecticide', nameHi: 'गार्डएक्स सिस्टमिक कीटनाशक', brandId: 'b3', brandName: 'Nexus Ag', categoryId: 'c3', categoryName: 'Pesticides', subCategory: 'Insecticides', images: [PEST_IMG, FERT_IMG], featured: true, trending: true, price: 640 }),
  mkProduct({ id: 'p4', slug: 'bioroot-organic-compost', name: 'BioRoot Organic Compost', nameHi: 'बायोरूट जैविक खाद', brandId: 'b4', brandName: 'Bio Harvest', categoryId: 'c6', categoryName: 'Bio Fertilizers', images: [FERT_IMG, SEED_IMG], featured: true, price: 420 }),
  mkProduct({ id: 'p5', slug: 'purefield-neem-oil', name: 'PureField Neem Oil Concentrate', nameHi: 'प्योरफील्ड नीम तेल सांद्र', brandId: 'b5', brandName: 'PureFields Organic', categoryId: 'c7', categoryName: 'Organic Farming', images: [PEST_IMG], trending: true, price: 380 }),
  // mkProduct({ id: 'p6', slug: 'soilmax-zinc-plus', name: 'SoilMax Zinc Plus Micronutrient', nameHi: 'सॉयलमैक्स ज़िंक प्लस सूक्ष्म पोषक', brandId: 'b6', brandName: 'Soil & Sprout', categoryId: 'c10', categoryName: 'Micronutrients', images: [FERT_IMG], trending: true, price: 560 }),
  // mkProduct({ id: 'p7', slug: 'agriroots-paddy-supreme', name: 'AgriRoots Paddy Supreme Seed', nameHi: 'एग्रीरूट्स पैडी सुप्रीम बीज', brandId: 'b1', brandName: 'AgriRoots Seed Solutions', categoryId: 'c1', categoryName: 'Seeds', subCategory: 'Cereal Seeds', images: [SEED_IMG], createdAt: '2026-07-10', price: 1100 }),
  // mkProduct({ id: 'p8', slug: 'verdant-potash-max', name: 'Verdant Potash Max', nameHi: 'वर्डेंट पोटाश मैक्स', brandId: 'b2', brandName: 'Verdant Farms', categoryId: 'c2', categoryName: 'Fertilizers', subCategory: 'Potash', images: [FERT_IMG], createdAt: '2026-07-12', price: 760 }),
  // mkProduct({ id: 'p9', slug: 'nexus-fungi-shield', name: 'Nexus FungiShield', nameHi: 'नेक्सस फंगीशील्ड', brandId: 'b3', brandName: 'Nexus Ag', categoryId: 'c5', categoryName: 'Fungicides', images: [PEST_IMG], createdAt: '2026-07-14', price: 520 }),
  // mkProduct({ id: 'p10', slug: 'bioharvest-vermicompost', name: 'BioHarvest Vermicompost', nameHi: 'बायोहार्वेस्ट वर्मीकम्पोस्ट', brandId: 'b4', brandName: 'Bio Harvest', categoryId: 'c7', categoryName: 'Organic Farming', images: [FERT_IMG], createdAt: '2026-07-16' }),
  // mkProduct({ id: 'p11', slug: 'soilsprout-weedclear', name: 'Soil & Sprout WeedClear', nameHi: 'सॉयल एंड स्प्राउट वीडक्लियर', brandId: 'b6', brandName: 'Soil & Sprout', categoryId: 'c4', categoryName: 'Herbicides', images: [PEST_IMG], createdAt: '2026-07-18', price: 610 }),
  // mkProduct({ id: 'p12', slug: 'verdant-cattle-feed-pro', name: 'Verdant Cattle Feed Pro', nameHi: 'वर्डेंट कैटल फीड प्रो', brandId: 'b2', brandName: 'Verdant Farms', categoryId: 'c9', categoryName: 'Animal Feed', images: [SEED_IMG], createdAt: '2026-07-19', price: 940 })
];


export const dealers: Dealer[] = [
  { id: 'd1', name: 'Rajesh Kumar', shopName: 'Kisan Agro Centre', address: 'Shop 12, Mandi Road, Nashik', state: 'Maharashtra', district: 'Nashik', distanceKm: 1.2, phone: '+919876543210', whatsapp: '919876543210', mapsUrl: 'https://maps.google.com', openTiming: '9:00 AM – 8:00 PM', available: true, verified: true, lat: 19.99, lng: 73.78 },
  { id: 'd2', name: 'Suresh Patel', shopName: 'Green Field Krishi Kendra', address: 'Plot 7, Market Yard, Nashik', state: 'Maharashtra', district: 'Nashik', distanceKm: 3.4, phone: '+919812345678', whatsapp: '919812345678', mapsUrl: 'https://maps.google.com', openTiming: '8:30 AM – 7:30 PM', available: true, verified: true, lat: 20.01, lng: 73.79 },
  { id: 'd3', name: 'Anita Deshmukh', shopName: 'Annadata Agro Store', address: 'Near Bus Stand, Sinnar', state: 'Maharashtra', district: 'Nashik', distanceKm: 6.8, phone: '+919900112233', whatsapp: '919900112233', mapsUrl: 'https://maps.google.com', openTiming: '9:00 AM – 6:00 PM', available: false, verified: false, lat: 19.85, lng: 74.0 },
  { id: 'd4', name: 'Mahesh Jadhav', shopName: 'Shivaji Farm Supplies', address: 'Gangapur Road, Nashik', state: 'Maharashtra', district: 'Nashik', distanceKm: 8.1, phone: '+919765432109', whatsapp: '919765432109', mapsUrl: 'https://maps.google.com', openTiming: '9:30 AM – 8:00 PM', available: true, verified: true, lat: 20.02, lng: 73.74 }];


export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Ramesh Yadav', role: 'Wheat Farmer', roleHi: 'गेहूँ किसान', location: 'Nashik, MH', avatar: '', quote: 'I found the exact seed I needed and located a verified dealer just 2 km away. Saved me a full day of searching.', quoteHi: 'मुझे ठीक वही बीज मिला जिसकी ज़रूरत थी और सिर्फ़ 2 किमी दूर एक सत्यापित डीलर मिल गया। पूरा दिन बच गया।', rating: 5 },
  { id: 't2', name: 'Sunita Devi', role: 'Organic Grower', roleHi: 'जैविक उत्पादक', location: 'Jaipur, RJ', avatar: '', quote: 'The Hindi interface makes it so easy. I compared brands and read benefits in my own language.', quoteHi: 'हिंदी इंटरफ़ेस बहुत आसान है। मैंने अपनी भाषा में ब्रांड की तुलना की और लाभ पढ़े।', rating: 5 },
  { id: 't3', name: 'Harpreet Singh', role: 'Progressive Farmer', roleHi: 'प्रगतिशील किसान', location: 'Ludhiana, PB', avatar: '', quote: 'Verified brands and dealer contact with WhatsApp made buying inputs stress-free this season.', quoteHi: 'सत्यापित ब्रांड और व्हाट्सएप डीलर संपर्क ने इस मौसम में इनपुट खरीदना आसान बना दिया।', rating: 4 }];


export const news: NewsArticle[] = [
  { id: 'n1', slug: 'monsoon-forecast-2026', title: 'Above-normal monsoon forecast boosts kharif outlook', titleHi: 'सामान्य से अधिक मानसून पूर्वानुमान से खरीफ की उम्मीद बढ़ी', excerpt: 'IMD predicts a favourable season for major crops across central and western India.', excerptHi: 'IMD ने मध्य और पश्चिम भारत में प्रमुख फसलों के लिए अनुकूल मौसम का अनुमान लगाया।', image: "/0aa82d6a-615e-4915-8662-618b640bac31.jpg", category: 'Weather', date: '2026-07-15' },
  { id: 'n2', slug: 'new-msp-announced', title: 'Government revises MSP for 14 kharif crops', titleHi: 'सरकार ने 14 खरीफ फसलों के लिए MSP संशोधित किया', excerpt: 'The updated minimum support prices aim to improve farmer incomes this year.', excerptHi: 'संशोधित न्यूनतम समर्थन मूल्य इस वर्ष किसानों की आय बढ़ाने का लक्ष्य रखते हैं।', image: "/96238bb8-2599-45db-9b8c-4606fe4987bc.jpg", category: 'Policy', date: '2026-07-11' },
  { id: 'n3', slug: 'drip-irrigation-subsidy', title: 'New subsidy scheme for micro-irrigation adoption', titleHi: 'सूक्ष्म-सिंचाई अपनाने के लिए नई सब्सिडी योजना', excerpt: 'Up to 55% support for drip and sprinkler systems for smallholder farmers.', excerptHi: 'छोटे किसानों के लिए ड्रिप और स्प्रिंकलर पर 55% तक सहायता।', image: "/52f3112b-0d9c-44c5-88a6-5fc3e6ab1741.jpg", category: 'Schemes', date: '2026-07-08' }];


export const benefits: Benefit[] = [
  { id: 'be1', icon: 'badge-check', title: 'Verified Brands', titleHi: 'सत्यापित ब्रांड', description: 'Every manufacturer is vetted for authenticity.', descriptionHi: 'हर निर्माता की प्रामाणिकता की जाँच की जाती है।' },
  { id: 'be2', icon: 'store', title: 'Verified Dealers', titleHi: 'सत्यापित डीलर', description: 'Buy from trusted local distributors.', descriptionHi: 'विश्वसनीय स्थानीय वितरकों से खरीदें।' },
  { id: 'be3', icon: 'sparkles', title: 'Latest Products', titleHi: 'नवीनतम उत्पाद', description: 'Discover new inputs the moment they launch.', descriptionHi: 'लॉन्च होते ही नए इनपुट खोजें।' },
  { id: 'be4', icon: 'search', title: 'Easy Search', titleHi: 'आसान खोज', description: 'Find products by crop, brand or category.', descriptionHi: 'फसल, ब्रांड या श्रेणी से उत्पाद खोजें।' },
  { id: 'be5', icon: 'languages', title: 'Multilingual', titleHi: 'बहुभाषी', description: 'Use the platform in English or Hindi.', descriptionHi: 'प्लेटफ़ॉर्म अंग्रेज़ी या हिंदी में उपयोग करें।' },
  { id: 'be6', icon: 'map-pin', title: 'Location Based Dealers', titleHi: 'स्थान आधारित डीलर', description: 'See the nearest dealers sorted by distance.', descriptionHi: 'दूरी अनुसार निकटतम डीलर देखें।' }];


export const heroSlides = [
  { key: 'seeds', category: 'seeds', image: "/465f2075-7347-4b5c-9414-8d4b906e586a.jpg" },
  { key: 'fertilizer', category: 'fertilizers', image: "/0feba23c-6ead-4445-9e3f-f20e07dd649f.jpg" },
  { key: 'machinery', category: 'farm-equipment', image: "/287af456-c3e0-49ac-a750-9a17dce40e86.jpg" },
  { key: 'irrigation', category: 'farm-equipment', image: "/52f3112b-0d9c-44c5-88a6-5fc3e6ab1741.jpg" },
  { key: 'organic', category: 'organic-farming', image: "/96238bb8-2599-45db-9b8c-4606fe4987bc.jpg" }] as
  const;

export const indianStates = ['Maharashtra', 'Punjab', 'Rajasthan', 'Madhya Pradesh', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Karnataka'];
export const cropsList = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Soybean', 'Groundnut', 'Vegetables'];