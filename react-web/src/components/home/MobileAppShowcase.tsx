import { motion } from "framer-motion";
import { Play, Apple, CheckCircle2, MapPin, Search, Bell, ShieldCheck } from "lucide-react";

import { Section } from "../ui/Section";

const FEATURES = [
    {
        icon: Search,
        title: "25K+ Products"
    },
    {
        icon: MapPin,
        title: "Nearby Dealers"
    },
    {
        icon: Bell,
        title: "Daily Updates"
    },
    {
        icon: ShieldCheck,
        title: "Trusted Brands"
    },
];

export function MobileAppShowcase() {
    return (
        <Section id="mobile-app" icon="📱" title="Our Mobile App"
            subtitle="Everything farmers need—from products to nearby dealers—in one beautiful mobile experience."
            className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white">

            <div className="md:-mt-8 relative z-10 grid items-center gap-16 lg:grid-cols-[1fr_0.95fr]">
                {/* LEFT */}
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
                    {/* Heading */}
                    <h2 className="md:-mt-8 max-w-2xl text-3xl font-black leading-tight tracking-tight text-gray-900 md:text-4xl">
                        Manage Your Farm &nbsp;
                        <span className="text-primary">
                            Anytime. Anywhere.
                        </span>
                    </h2>
                    {/* Description */}
                    <p className="mt-4 max-w-xl text-lg leading-8 text-gray-600">
                        Discover products, compare brands, locate nearby dealers,
                        receive farming updates and manage everything from one
                        modern agriculture app.
                    </p>

                    {/* Feature Cards */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -5 }}
                                    className="flex items-center gap-3 group rounded-[24px] border border-primary/10 bg-white/90
                                    p-3 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10
                                        transition-colors group-hover:bg-primary">
                                        <Icon size={22} className="text-primary transition-colors group-hover:text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">
                                        {feature.title}
                                    </h3>
                                </motion.div>
                            );
                        })}
                    </div>
                    {/* Trust */}
                    <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-primary" />
                            Free Download
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-primary" />
                            Secure Login
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-primary" />
                            Regular Updates
                        </div>
                    </div>
                    {/* Download Buttons */}

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a href="#" className="group flex items-center gap-3 rounded-xl bg-primary px-4 py-2 text-white
                            shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                            <Play size={24} className="transition-transform group-hover:scale-110" />
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-white/70">
                                    Get it on
                                </p>
                                <h4 className="text-lg font-bold">
                                    Google Play
                                </h4>
                            </div>
                        </a>
                        <a href="#" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-white
                            px-4 py-2 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                            <Apple size={24} className="transition-transform group-hover:scale-110" />
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-gray-500">
                                    Download on
                                </p>
                                <h4 className="text-lg font-bold text-gray-900">
                                    App Store
                                </h4>
                            </div>
                        </a>
                    </div>
                </motion.div>
                {/* RIGHT */}
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
                    className="relative mt-12 flex h-[620px] items-center justify-center lg:mt-0">
                    {/* Glass Background */}
                    <div className="absolute h-[420px] w-[420px] rounded-[42px] border border-white
                        bg-white/70 shadow-[0_30px_80px_rgba(0,0,0,.08)] backdrop-blur-xl"/>
                    {/* Glow */}
                    <div className="absolute h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    {/* Left Phone */}
                    <motion.img whileHover={{ y: -10, rotate: -8 }} transition={{ duration: .3 }} src="/splash-screen.jpeg"
                        className="absolute left-2 z-10 hidden w-56 rounded-[36px] border-[5px] border-neutral-900
                        shadow-[0_30px_70px_rgba(0,0,0,.18)] lg:block"/>
                    {/* Center Phone */}
                    <motion.img animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 5 }} src="/home-screen.jpeg"
                        className="relative z-20 w-64 rounded-[42px] border-[6px] border-neutral-900 shadow-[0_45px_90px_rgba(0,0,0,.22)]" />
                    {/* Right Phone */}
                    <motion.img whileHover={{ y: -10, rotate: 8 }} transition={{ duration: .3 }} src="/profile-screen.jpeg"
                        className="absolute right-2 z-10 hidden w-56 rounded-[36px] border-[5px] border-neutral-900
                        shadow-[0_30px_70px_rgba(0,0,0,.18)] lg:block"/>
                    {/* Decorative Ring */}
                    <div className="absolute h-[500px] w-[500px] rounded-full border border-primary/10" />
                </motion.div>
            </div>
        </Section>
    );
}