import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../i18n/LanguageContext";

interface SectionProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
  icon?: React.ReactNode;
}

export function Section({
  title,
  subtitle,
  viewAllHref,
  className,
  children,
  id,
  icon,
}: SectionProps) {
  const { t } = useLanguage();

  return (
    <section id={id} className={cn("relative overflow-hidden py-5 lg:py-8", className)}>
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-28 bottom-8 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }} className="max-w-3xl">
            {/* Accent */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-1.5 w-12 rounded-full bg-primary" />
              <span className="h-1.5 w-6 rounded-full bg-green-400" />
            </div>
            {/* Title */}
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl md:text-2xl">
                  {icon}
                </div>
              )}
              <h2 className="text-xl font-black tracking-tight text-gray-900 md:text-3xl">
                {title}
              </h2>

            </div>
            {/* {subtitle && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">
                {subtitle}
              </p>
            )} */}
          </motion.div>
          {/* View All */}
          {viewAllHref && (
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }} className="shrink-0">
              <Link to={viewAllHref} className="group inline-flex items-center gap-2 rounded-full border border-primary/15
                  bg-white/90 px-7 py-3.5 text-sm font-semibold text-primary shadow-md backdrop-blur transition-all
                  duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                {t("section.viewAll")}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}

        </div>

        {/* Divider */}
        <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }} className="mb-8 h-px origin-left bg-gradient-to-r from-primary/30
            via-gray-200 to-transparent"/>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}>
          {children}
        </motion.div>

      </div>
    </section>
  );
}