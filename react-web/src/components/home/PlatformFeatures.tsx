import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Landmark } from "lucide-react";
import { Section } from "../ui/Section";

interface Feature {
    id: string;
    slug: string;
    title: string;
    description: string;
}

interface Props {
    features: Feature[];
}

const ICONS: Record<string, any> = {
    "mandi-bhav": TrendingUp,
    "anudan-yojna": Landmark,
};

const COLORS: Record<string, string> = {
    "mandi-bhav": "from-emerald-500 to-green-600",
    "anudan-yojna": "from-amber-500 to-orange-500",
};

const PATTERNS: Record<string, string> = {
    "mandi-bhav": "bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.15),transparent_55%)]",
    "anudan-yojna": "bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.18),transparent_55%)]",
};

export function PlatformFeatures({ features }: Props) {
    return (
        <Section icon="🚀" title="Features" subtitle="Powerful services designed to help every farmer make smarter decisions.">
            <div className="grid gap-8 lg:grid-cols-2">

                {features.map((feature, index) => {
                    const Icon = ICONS[feature.slug] ?? TrendingUp;
                    return (
                        <motion.div key={feature.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ duration: .45, delay: index * .08 }} whileHover={{ y: -8 }} className={` group relative overflow-hidden
                            rounded-[30px] border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:border-primary/20
                            hover:shadow-[0_30px_70px_rgba(16,185,129,.12)] ${PATTERNS[feature.slug]}`}>
                            {/* Decorative Glow */}
                            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:scale-125" />
                            <div className="relative p-5">
                                {/* Mobile Layout */}
                                <div className="sm:hidden flex items-center gap-3">
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${COLORS[feature.slug]} text-white shadow-xl`}>
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">
                                        {feature.title}
                                    </h3>
                                </div>
                                {/* Desktop Layout */}
                                <div className="hidden sm:block">
                                    {/* Icon */}
                                    <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${COLORS[feature.slug]} text-white shadow-xl`}>
                                        <Icon size={30} />
                                    </div>
                                    <h3 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
                                        {feature.title}
                                    </h3>
                                </div>
                                {/* Description */}
                                <p className="mt-3 max-w-lg text-base leading-6 text-gray-600">
                                    {feature.description}
                                </p>
                                {/* Highlights */}
                                <div className="mt-5 flex flex-wrap gap-2 md:gap-3">
                                    {feature.slug === "mandi-bhav" && (
                                        <>
                                            <span className="rounded-full bg-emerald-50 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-emerald-700">
                                                Live Prices
                                            </span>
                                            <span className="rounded-full bg-emerald-50 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-emerald-700">
                                                Government Mandis
                                            </span>
                                            <span className="rounded-full bg-emerald-50 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-emerald-700">
                                                Real-time Updates
                                            </span>
                                        </>
                                    )}

                                    {feature.slug === "anudan-yojna" && (
                                        <>
                                            <span className="rounded-full bg-amber-50 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-amber-700">
                                                PM-Kisan
                                            </span>
                                            <span className="rounded-full bg-amber-50 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-amber-700">
                                                State Schemes
                                            </span>
                                            <span className="rounded-full bg-amber-50 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-amber-700">
                                                Subsidies
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* CTA */}
                                <Link to={`/${feature.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5
                                    font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    Explore Feature
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
}