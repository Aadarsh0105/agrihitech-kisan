import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { platformFeatures } from '../data/mockData';
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
import { PartnerRegistration } from '../components/home/PartnerRegistration';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchHomeData } from "../redux/home/homeSlice";
import type {
  Category,
  Brand,
  Banner,
} from "../redux/home/homeTypes";
import { getHomepageProducts } from '../services/product.service';
import { getPublicNews } from '../services/news.service';
export function Home() {
  const trending = useAsync(getHomepageProducts, []);
  const testimonials = useAsync(() => api.getTestimonials(), []);
  const news = useAsync(() => getPublicNews(1, 3).then((result) => result.news), []);
  const benefits = useAsync(() => api.getBenefits(), []);
  const dispatch = useAppDispatch();

  const { data } = useAppSelector(
    (state) => state.home
  );

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);
const banners: Banner[] = data?.banners ?? [];

const categories: Category[] =
  data?.categories ?? [];

  const brands: Brand[] =
  data?.brands ?? [];
  return (
    <>
      <Seo
        title="Discover Agri Products & Nearest Dealers"
        description="AgriMandi is India's agricultural product discovery platform — browse verified brands, seeds, fertilizers, pesticides and find your nearest dealers instantly." />

      <HeroCarousel banners={banners} />
      {/* <GlobalSearch /> */}

      <PartnerRegistration />
      <PlatformFeatures features={platformFeatures} />

      <Section
        icon="🌾"
        title="Popular Categories"
        subtitle="Explore seeds, fertilizers, pesticides, machinery and irrigation products."
      >
        <div className="container">
          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:gap-8">
            {categories.map((    category: Category, index: number) => (
              <CategoryCard key={category._id} category={category} index={index} />
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
        <ProductGrid products={trending.data} loading={trending.loading} />
      </Section>

      <MobileAppShowcase />

      <BenefitsSection benefits={benefits.data ?? []} />

      {testimonials.data && <Testimonials testimonials={testimonials.data} />}

      {news.data && <NewsSection news={news.data} />}
    </>);

}
