// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { BadgeCheck } from 'lucide-react';
// import type { Brand } from '../../types';
// import { useLanguage } from '../../i18n/LanguageContext';

// export function BrandCard({ brand, index = 0 }: {brand: Brand;index?: number;}) {
//   const { t } = useLanguage();
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}>

//       <Link
//         to={`/brands/${brand.slug}`}
//         className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">

//         <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-border bg-white">
//           <img src={brand.logo} alt={brand.name} className="h-14 w-14 object-cover" loading="lazy" />
//         </div>
//         <div className="min-w-0">
//           <div className="flex items-center justify-center gap-1">
//             <h3 className="truncate font-display text-sm font-bold text-foreground">{brand.name}</h3>
//             {brand.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label={t('brand.verified')} />}
//           </div>
//           <p className="mt-0.5 text-xs text-muted-foreground">
//             {brand.productCount} {t('brand.products')}
//           </p>
//         </div>
//       </Link>
//     </motion.div>);

// }


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

import type { Brand } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props {
  brand: Brand;
  index?: number;
}

export function BrandCard({
  brand,
  index = 0,
}: Props) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
      }}
    >
      <Link
        to={`/brands/${brand.slug}`}
        className="
group
flex
h-[250px]
sm:h-[270px]
md:h-[285px]
flex-col
rounded-3xl
border
border-gray-100
bg-white
p-5
shadow-sm
transition-all
duration-300
hover:-translate-y-1
hover:border-primary/20
hover:shadow-xl
"
      >
        {/* Logo */}

        <div
          className="
            mx-auto
            flex
            h-20 w-20
sm:h-24 sm:w-24
md:h-28 md:w-28
            items-center
            justify-center
            rounded-3xl
            border
            border-gray-100
            bg-gradient-to-br
from-emerald-50
via-white
to-lime-50
ring-1
ring-primary/10
            shadow-md
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:shadow-xl
          "
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="
              h-14 w-14
sm:h-16 sm:w-16
md:h-20 md:w-20
              object-contain
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />
        </div>

        {/* Brand */}

        <div className="mt-2">

          <div className="relative">

            <h3
              className="
    h-14
    sm:h-16
    flex
    items-center
    justify-center
    px-2
    text-center
    text-[18px]
    sm:text-[20px]
    font-bold
    leading-tight
    text-gray-900
    line-clamp-2
  "
            >
              {brand.name}
            </h3>

            {brand.verified && (
              <BadgeCheck
                size={18}
                className="
      absolute
      -right-1
      top-6
      text-primary
    "
              />
            )}

          </div>

          <p
            className="
    mt-auto
    pt-3
    text-sm
    font-medium
    text-gray-500
    text-center
  "
          >
            {brand.productCount} {t("brand.products")}
          </p>

        </div>

        {/* Spacer */}

        <div className="flex-1" />

        {/* CTA */}

        {/* <div
          className="
            mt-8
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-primary/10
            bg-primary/5
            px-5
            py-3
            transition-all
            duration-300
            group-hover:bg-primary
          "
        >
          <span
            className="
              text-sm
              font-semibold
              text-primary
              transition-colors
              group-hover:text-white
            "
          >
            Explore Brand
          </span>

          <ArrowRight
            size={18}
            className="
              text-primary
              transition-all
              duration-300
              group-hover:text-white
              group-hover:translate-x-1
            "
          />

        </div> */}

      </Link>
    </motion.div>
  );
}
