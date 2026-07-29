import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { categories, brands, platformFeatures, products } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { Section } from '../components/ui/Section';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryCard } from '../components/cards/CategoryCard';
import { BrandSlider } from '../components/home/BrandSlider';
import { ProductGrid } from '../components/products/ProductGrid';
import { BenefitsSection } from '../components/home/BenefitsSection';
import { Testimonials } from '../components/home/Testimonials';
import { NewsSection } from '../components/home/NewsSection';
import { Link } from 'react-router-dom';
import { MobileAppShowcase } from '../components/home/MobileAppShowcase';
import { PlatformFeatures } from '../components/home/PlatformFeatures';

export function Home() {
  const { t } = useLanguage();
  const trending = useAsync(() => api.getTrendingProducts(), []);
  const recent = useAsync(() => api.getRecentProducts(), []);
  const testimonials = useAsync(() => api.getTestimonials(), []);
  const news = useAsync(() => api.getNews(), []);
  const benefits = useAsync(() => api.getBenefits(), []);

  return (
    <>
      <Seo
        title="Discover Agri Products & Nearest Dealers"
        description="AgriMandi is India's agricultural product discovery platform — browse verified brands, seeds, fertilizers, pesticides and find your nearest dealers instantly." />

      <HeroCarousel />
      {/* <GlobalSearch /> */}
      <div className="container relative z-10">
        <div className="mb-3 grid grid-cols-2 gap-4 rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-lg backdrop-blur md:grid-cols-4">
          <div className="text-center">
            <h3 className="text-3xl font-black text-primary">
              500+
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Verified Brands
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black text-primary">
              25K+
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Products
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black text-primary">
              10K+
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Dealers
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black text-primary">
              28
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              States Covered
            </p>
          </div>
        </div>
      </div>

      <PlatformFeatures features={platformFeatures} />

      <Section
        icon="🌾"
        title="Popular Categories"
        subtitle="Explore seeds, fertilizers, pesticides, machinery and irrigation products."
      >
        <div className="container">
          {/* Grid */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </Section>

      <Section
        icon="🌾"
        title="Trusted Brands"
        subtitle="Partnering with India's leading agricultural brands offering premium seeds, crop protection, farm machinery and irrigation solutions."
      >
        <div className="container relative z-10">
          <BrandSlider brands={brands} />
          <div className="mt-12 flex justify-center">
            <Link to="/brands" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Explore All Brands
            </Link>
          </div>
        </div>
      </Section>

      <Section icon="🌱" title="Featured Products"
        subtitle="Discover India's most trusted agricultural products from leading brands."
        viewAllHref="/products"
      >
        <ProductGrid products={products} loading={trending.loading}/>
      </Section>

      <MobileAppShowcase />

      <BenefitsSection benefits={benefits.data ?? []} />

      {testimonials.data && <Testimonials testimonials={testimonials.data} />}

      {news.data && <NewsSection news={news.data} />}
    </>);

}