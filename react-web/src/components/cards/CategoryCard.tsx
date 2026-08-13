import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

type CategoryLike = {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  nameHi?: string;
  image?: string;
  bannerImage?: string;
  productCount?: number;
  totalProducts?: number;
};

interface Props {
  category: CategoryLike;
  index?: number;
}

export function CategoryCard({
  category,
  index = 0,
}: Props) {
  const { tv } = useLanguage();
  const categoryPath = `/categories/${category._id ?? category.id ?? category.slug ?? ""}`;
  const destination = localStorage.getItem("token")
    ? categoryPath
    : `/login?role=B2C&returnTo=${encodeURIComponent(categoryPath)}`;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}>
      <Link to={destination} className="group block overflow-hidden rounded-3xl border border-gray-100
          bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20">
        <div className="relative overflow-hidden">
          <img src={category.bannerImage ?? category.image ?? ""} alt={category.name} className="h-28 sm:h-auto sm:aspect-[16/10] w-full object-cover
            transition-transform duration-500 group-hover:scale-110"/>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {(category.productCount ?? category.totalProducts ?? 0) > 0 && <div className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white/95 px-2 sm:px-3
              py-0.5 text-[11px] sm:text-xs font-semibold text-primary shadow-md">
            {category.productCount ?? category.totalProducts} +
          </div>}
        </div>
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-tight text-gray-900 pr-2">
                {tv(category.name, category.nameHi ?? category.name)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              <ChevronRight size={18} className=" transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
