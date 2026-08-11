import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandCard } from "../cards/BrandCard";

type BrandLike = {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  logo?: string;
  image?: string;
  productCount?: number;
  totalProducts?: number;
};

interface Props {
  brands: BrandLike[];
}

export function BrandSlider({ brands }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [pause, setPause] = useState(false);
  const CARD_WIDTH = window.innerWidth < 640 ? 170 : 260;
  const scroll = (direction: 1 | -1) => {
    sliderRef.current?.scrollBy({
      left: direction * CARD_WIDTH,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (pause) return;
    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;
      const max = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= max - 10) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: CARD_WIDTH,
          behavior: "smooth",
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [pause]);

  return (
    <div className="relative" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} style={{ WebkitOverflowScrolling: "touch" }}>
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:flex h-12 w-12 
      items-center justify-center rounded-full bg-white shadow-xl border border-gray-200 transition hover:bg-primary hover:text-white">
        <ChevronLeft size={22} />
      </button>
      <div ref={sliderRef} className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-3 no-scrollbar">
        {brands.map((brand, index) => (
          <div key={brand.slug ?? brand._id ?? brand.id ?? index} className="w-[155px] sm:w-[185px] md:w-[220px] lg:w-[240px] shrink-0 snap-start">
            <BrandCard brand={brand} index={index} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 md:flex h-12 w-12
          items-center justify-center rounded-full bg-white shadow-xl border border-gray-200 transition hover:bg-primary hover:text-white">
        <ChevronRight size={22} />
      </button>
      <div className="mt-4 flex justify-center gap-2 sm:hidden">
        {brands.map((_, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-primary/20" />
        ))}
      </div>
    </div>
  );
}
