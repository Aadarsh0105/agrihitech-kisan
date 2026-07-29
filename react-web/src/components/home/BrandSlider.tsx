// import { useRef } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import type { Brand } from '../../types';
// import { BrandCard } from '../cards/BrandCard';

// export function BrandSlider({ brands }: {brands: Brand[];}) {
//   const ref = useRef<HTMLDivElement>(null);

//   const scroll = (dir: 1 | -1) => {
//     ref.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
//   };

//   return (
//     <div className="relative">
//       <div
//         ref={ref}
//         className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">

//         {brands.map((b, i) =>
//         <div key={b.id} className="w-40 shrink-0 snap-start sm:w-48">
//             <BrandCard brand={b} index={i} />
//           </div>
//         )}
//       </div>
//       <button
//         type="button"
//         onClick={() => scroll(-1)}
//         aria-label="Scroll left"
//         className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card shadow-soft transition hover:bg-secondary md:grid">

//         <ChevronLeft className="h-5 w-5" />
//       </button>
//       <button
//         type="button"
//         onClick={() => scroll(1)}
//         aria-label="Scroll right"
//         className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card shadow-soft transition hover:bg-secondary md:grid">

//         <ChevronRight className="h-5 w-5" />
//       </button>
//     </div>);

// }

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Brand } from "../../types";
import { BrandCard } from "../cards/BrandCard";

interface Props {
  brands: Brand[];
}

export function BrandSlider({ brands }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [pause, setPause] = useState(false);

  const CARD_WIDTH = 340;

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

      const max =
        slider.scrollWidth -
        slider.clientWidth;

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
    <div
      className="relative"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      {/* Left */}

      <button
        onClick={() => scroll(-1)}
        className="
          absolute
          left-0
          top-1/2
          z-20
          hidden
          -translate-x-1/2
          -translate-y-1/2
          md:flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-xl
          border
          border-gray-200
          transition
          hover:bg-primary
          hover:text-white
        "
      >
        <ChevronLeft size={22} />
      </button>

      {/* Slider */}

      <div
        ref={sliderRef}
        className="
          flex
          gap-4
sm:gap-5
          overflow-x-auto
          snap-x
          snap-mandatory
          scroll-smooth
          pb-3
          no-scrollbar
        "
      >
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            className="
              w-[170px]
sm:w-[190px]
md:w-[220px]
lg:w-[240px]
              shrink-0
              snap-start
            "
          >
            <BrandCard
              brand={brand}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Right */}

      <button
        onClick={() => scroll(1)}
        className="
          absolute
          right-0
          top-1/2
          z-20
          hidden
          translate-x-1/2
          -translate-y-1/2
          md:flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-xl
          border
          border-gray-200
          transition
          hover:bg-primary
          hover:text-white
        "
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}