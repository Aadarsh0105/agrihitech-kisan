import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";

import type { Product } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({
  product,
  index = 0,
}: Props) {
  const { t, tv } = useLanguage();

  return (
    <motion.article initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200/70 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_24px_60px_rgba(16,185,129,0.18)]">
      {/* Bottom Gradient Line */}
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary via-green-400 to-primary transition-transform duration-500 group-hover:scale-x-100" />
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="
    relative
    block
    h-[180px]
    overflow-hidden
    bg-gradient-to-br
    from-slate-50
    via-white
    to-emerald-50
  "
      >
        {/* Background Glow */}
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-primary/20" />
        {/* Trending */}
        {product.trending && (
          <div className="absolute left-4 top-4 z-20 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <span>
              In Stock
            </span>
          </div>
        )}
        <button type="button" aria-label="Wishlist" onClick={(e) => e.preventDefault()} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white
          bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white">
          <Heart className="h-5 w-5" />
        </button>
        {/* Product Image */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="absolute inset-3 rounded-[22px] bg-white shadow-[inset_0_2px_12px_rgba(0,0,0,0.04)]" />
          <img src={product.images[0]} alt={tv(product.name, product.nameHi)} loading="lazy" className="
relative
z-10
h-full
w-full
object-contain
p-3
transition-all
duration-500
ease-out
group-hover:scale-[1.08]
group-hover:-translate-y-1
"/>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-xl">
            Quick View
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link to={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-lg md:text-lg font-bold leading-tight text-gray-900 transition-colors duration-300">
            {tv(product.name, product.nameHi)}
          </h3>
        </Link>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            {product.brandName}
          </p>
        </div>

        <div className="my-2 border-t border-gray-100" />
        <div className="flex justify-between items-center">
          <div className="flex">
            <span className="text-xl font-black text-gray-900">
              {product.price ? `₹${product.price.toLocaleString("en-IN")}` : t("product.priceOnRequest")}
            </span>
          </div>

          <Link to={`/products/${product.slug}`} className="flex h-9 px-3 w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-sm font-semibold text-white
            shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]">
            View
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}