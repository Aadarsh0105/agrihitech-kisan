// import { motion } from "framer-motion";
// import {
//   TrendingUp,
//   MapPin,
//   CalendarDays,
//   Wheat,
// } from "lucide-react";

// interface MandiHeroProps {
//   total: number;
// }

// export default function MandiHero({
//   total,
// }: MandiHeroProps) {
//   return (
//     <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 text-white">

//       {/* Background */}

//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white blur-3xl" />
//         <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-white blur-3xl" />
//       </div>

//       <div className="relative z-10 grid gap-12 px-8 py-14 lg:grid-cols-2 lg:px-14">

//         {/* Left */}

//         <motion.div
//           initial={{ opacity: 0, x: -40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: .6 }}
//         >
//           <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">

//             <TrendingUp size={18} />

//             Live Government Market Prices

//           </div>

//           <h1 className="mt-6 text-4xl font-black leading-tight lg:text-6xl">

//             Today's

//             <br />

//             Mandi Bhav

//           </h1>

//           <p className="mt-6 max-w-xl text-lg text-green-50">

//             Get real-time wholesale market prices directly
//             from AGMARKNET across India.

//             Compare prices across states,
//             districts and markets instantly.

//           </p>

//           <div className="mt-10 flex flex-wrap gap-4">

//             <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">

//               <div className="flex items-center gap-2">

//                 <MapPin size={18} />

//                 <span className="text-sm">

//                   Coverage

//                 </span>

//               </div>

//               <h3 className="mt-2 font-bold">

//                 All India

//               </h3>

//             </div>

//             <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">

//               <div className="flex items-center gap-2">

//                 <CalendarDays size={18} />

//                 <span className="text-sm">

//                   Updated

//                 </span>

//               </div>

//               <h3 className="mt-2 font-bold">

//                 Daily

//               </h3>

//             </div>

//           </div>

//         </motion.div>

//         {/* Right */}

//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: .7 }}
//           className="flex items-center justify-center"
//         >

//           <div className="relative">

//             <motion.div
//               animate={{
//                 y: [-10, 10, -10],
//               }}
//               transition={{
//                 duration: 5,
//                 repeat: Infinity,
//               }}
//               className="
//                 flex
//                 h-72
//                 w-72
//                 items-center
//                 justify-center
//                 rounded-full
//                 border
//                 border-white/20
//                 bg-white/15
//                 backdrop-blur-xl
//               "
//             >

//               <Wheat size={90} />

//             </motion.div>

//             <motion.div
//               animate={{
//                 y: [-6, 6, -6],
//               }}
//               transition={{
//                 repeat: Infinity,
//                 duration: 4,
//               }}
//               className="
//                 absolute
//                 -left-10
//                 top-8
//                 rounded-2xl
//                 bg-white
//                 p-5
//                 text-gray-900
//                 shadow-xl
//               "
//             >

//               <p className="text-xs text-gray-500">

//                 Today's Records

//               </p>

//               <h2 className="mt-2 text-3xl font-black text-green-700">

//                 {total.toLocaleString("en-IN")}

//               </h2>

//             </motion.div>

//           </div>

//         </motion.div>

//       </div>

//     </section>
//   );
// }

import { motion } from "framer-motion";
import {
    TrendingUp,
    MapPin,
    Wheat,
    Landmark,
    Clock3,
} from "lucide-react";

interface MandiHeroProps {
    total: number;
}

export default function MandiHero({}: MandiHeroProps) {
    return (
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-700 via-green-600 to-lime-500">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-green-300/10 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, white 1px, transparent 1px),linear-gradient(to bottom, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

            </div>

            <div className="relative z-10 grid gap-10 px-6 py-8 lg:grid-cols-[1.2fr_.8fr] lg:px-8">

                {/* LEFT */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: .6,
                    }}
                >

                    {/* Badge */}

                    <div
                        className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-white/15
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              backdrop-blur-xl
            "
                    >

                        <TrendingUp size={16} />

                        Live AGMARKNET Market Prices

                    </div>

                    {/* Heading */}

                    <h1 className="mt-6 max-w-xl text-3xl font-black leading-tight text-white lg:text-5xl">

                        Today's

                            Mandi Bhav


                    </h1>

                    {/* Description */}

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-green-50">

                        Access real-time wholesale agricultural market prices directly
                        from the Government of India's AGMARKNET platform.

                        Compare commodity prices across states, districts and markets
                        with verified daily updates.

                    </p>

                    <div className="mt-6">

                        <p className="mb-3 text-sm text-green-100">

                            Popular Commodities

                        </p>

                        <div className="flex flex-wrap gap-2">

                            {[
                                "Wheat",
                                "Rice",
                                "Soybean",
                                "Onion",
                                "Garlic",
                                "Maize",
                            ].map(item => (

                                <span
                                    key={item}
                                    className="
                        rounded-full
                        bg-white/15
                        px-3
                        py-2
                        text-sm
                        text-white
                        backdrop-blur
                      "
                                >

                                    {item}

                                </span>

                            ))}

                        </div>

                    </div>

                </motion.div>

                {/* RIGHT SECTION (Part 2) */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 40,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: .7,
                        delay: .15,
                    }}
                    className="flex items-center justify-center"
                >

                    <div className="relative w-full max-w-md">

                        {/* Glow */}

                        <div className="absolute inset-0 rounded-[32px] bg-white/10 blur-3xl" />

                        {/* Main Glass Card */}

                        <motion.div
                            animate={{
                                y: [-6, 6, -6],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 6,
                                ease: "easeInOut",
                            }}
                            className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/20
                bg-white/15
                p-6
                shadow-2xl
                backdrop-blur-2xl
              "
                        >

                            {/* Header */}

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-green-100">

                                        Today's Market Summary

                                    </p>

                                    <h3 className="mt-1 text-2xl font-black text-white">

                                        Live Dashboard

                                    </h3>

                                </div>

                                <div className="rounded-2xl bg-white/15 p-4">

                                    <Wheat
                                        size={34}
                                        className="text-white"
                                    />

                                </div>

                            </div>

                            {/* Records */}


                            <div className="mt-5 grid grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-white/70 p-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Landmark size={18} />
                                        Markets
                                    </div>
                                    <h4 className="mt-3 text-2xl font-bold text-green-700">
                                        7000+
                                    </h4>
                                </div>

                                <div className="rounded-2xl bg-white/70 p-4">

                                    <div className="flex items-center gap-2 text-green-600">

                                        <MapPin size={18} />

                                        Coverage

                                    </div>

                                    <h4 className="mt-3 text-2xl font-bold text-green-700">

                                        India

                                    </h4>

                                </div>

                                <div className="rounded-2xl bg-white/70 p-4">

                                    <div className="flex items-center gap-2 text-green-600">

                                        <Clock3 size={18} />

                                        Updated

                                    </div>

                                    <h4 className="mt-3 text-xl font-bold text-green-700">

                                        Daily

                                    </h4>

                                </div>

                                <div className="rounded-2xl bg-white/70 p-4">

                                    <div className="flex items-center gap-2 text-green-600">

                                        <TrendingUp size={18} />

                                        Status

                                    </div>

                                    <h4 className="mt-3 flex items-center gap-2 text-xl font-bold text-lime-800">

                                        <span className="h-2.5 w-2.5 rounded-full bg-lime-700 animate-pulse" />

                                        Live

                                    </h4>

                                </div>

                            </div>

                        </motion.div>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}