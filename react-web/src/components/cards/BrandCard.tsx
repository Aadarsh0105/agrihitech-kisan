import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

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
  brand: BrandLike;
  index?: number;
}

export function BrandCard({ brand, index = 0 }: Props) {
  const { t } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.05 }}>
      <Link to={`/brands/${brand.slug ?? brand._id ?? brand.id ?? ""}`} className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all
        duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
        <div className="mx-auto flex h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center rounded-3xl border border-gray-100 bg-gradient-to-br
          from-emerald-50 via-white to-lime-50 ring-1 ring-primary/10 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
          <img src={brand.logo ?? brand.image ?? ""} alt={brand.name} className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="mt-2">
          <div className="relative">
            <h3 className="h-12 sm:h-16 flex items-center justify-center px-2 text-center text-[16px] sm:text-[20px] leading-snug font-bold text-gray-900 line-clamp-2">
              {brand.name}
            </h3>
          </div>
          <p className="mt-auto pt-3 text-xs sm:text-sm font-medium text-gray-500 text-center">
            {(brand.productCount ?? brand.totalProducts ?? 0)} {t("brand.products")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
