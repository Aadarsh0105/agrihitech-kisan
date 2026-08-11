import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';
import type { TranslationKey } from '../../i18n/translations';
import type { Banner } from '../../redux/home/homeTypes';

const AUTOPLAY_MS = 5500;
interface Props {
    banners: Banner[];
}

export function HeroCarousel({
    banners,
}: Props) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const safeBanners = banners.length > 0 ? banners : [];

  const go = useCallback((next: number) => {
    if (safeBanners.length === 0) return;
    setDir(next > index ? 1 : -1);
    setIndex((next + safeBanners.length) % safeBanners.length);
  }, [index, safeBanners.length]);

  useEffect(() => {
    if (safeBanners.length === 0) return;
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % safeBanners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [safeBanners.length]);

  const slide = safeBanners[index];

  if (!slide) {
    return (
      <section className="pt-1 lg:pt-2 pb-4 lg:pb-6">
        <div className="container">
          <div className="relative overflow-hidden rounded-[24px] lg:rounded-[32px] bg-gradient-to-r from-primary-950 via-primary-900 to-emerald-950 shadow-2xl h-[215px] sm:h-[320px] md:h-[360px] lg:h-[400px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-1 lg:pt-2 pb-4 lg:pb-6">
      <div className="container">
        <div className="relative overflow-hidden rounded-[24px] lg:rounded-[32px] bg-primary-950 shadow-2xl h-[215px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={slide._id ?? index}
              custom={dir}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0">

              <img src={slide.image ?? ""} alt="" className="h-full w-full object-cover" />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" /> */}
            </motion.div>
          </AnimatePresence>

          {/* <div className="relative flex h-full items-center px-7 py-5 sm:px-10 lg:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide._id ?? index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl">

                <span className="inline-flex rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[9px] sm:text-[10px] lg:text-xs font-semibold uppercase tracking-wide text-white">
                  Agri HiTech Kisan
                </span>
                  <h1 className="mt-3 max-w-[360px] font-display font-black leading-tight text-white text-[18px] sm:text-[30px] md:text-[46px] lg:text-[42px]">
                  {slide._id ? t(`hero.slide.${slide._id}.title` as TranslationKey) : t('hero.cta.explore')}
                </h1>
                <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-white/90 sm:mt-3 sm:text-sm sm:leading-6 lg:mt-5 lg:max-w-lg lg:text-lg lg:leading-8">
                  {slide._id ? t(`hero.slide.${slide._id}.subtitle` as TranslationKey) : ''}
                </p>
                <div className="mt-3 sm:mt-5 lg:mt-7 flex gap-3">
                  <Button size="md" variant="accent" className="mt-1 h-9 rounded-full px-5 text-xs sm:h-10 sm:px-6 sm:text-sm lg:h-11 lg:px-7 lg:text-base">
                    {t('hero.cta.explore')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div> */}

          {/* arrows */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35 md:grid">

            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35 md:grid">

            <ChevronRight className="h-5 w-5" />
          </button>

          {/* dots */}
          <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((s, i) =>
              <button
                key={s._id ?? i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-accent' : 'w-2 bg-white/50 hover:bg-white/80'}`
                } />

            )}
          </div>
        </div>


        <div className="mt-6 relative z-10">
          <div className="mb-3 grid grid-cols-2 gap-4 rounded-3xl border border-primary/10 bg-white/80 p-5 md:p-6 shadow-md backdrop-blur md:grid-cols-4">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black text-primary">
                500+
              </h3>
              <p className="mt-1 md:mt-2 text-sm text-gray-600">
                Verified Brands
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black text-primary">
                25K+
              </h3>
              <p className="mt-1 md:mt-2 text-sm text-gray-600">
                Products
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black text-primary">
                10K+
              </h3>
              <p className="mt-1 md:mt-2 text-sm text-gray-600">
                Dealers
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black text-primary">
                28
              </h3>
              <p className="mt-1 md:mt-2 text-sm text-gray-600">
                States Covered
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}
