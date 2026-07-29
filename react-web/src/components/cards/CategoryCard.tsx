import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import type { Category } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props {
  category: Category;
  index?: number;
}

export function CategoryCard({
  category,
  index = 0,
}: Props) {
  const { tv } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{duration: 0.45, delay: index * 0.05}}>
      <Link to={`/categories/${category.slug}`} className="group block overflow-hidden rounded-3xl border border-gray-100
          bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img src={category.bannerImage} alt={category.name} className="aspect-[16/10] w-full object-cover transition-transform
              duration-500 group-hover:scale-110"/>
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Product Count */}
          {category.productCount > 0 && <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-md">
            {category.productCount}+
          </div>}
        </div>
        {/* Bottom */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold leading-snug text-gray-900">
                {tv(category.name, category.nameHi)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              <ChevronRight size={18} className=" transition-transform duration-300 group-hover:translate-x-1"/>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}