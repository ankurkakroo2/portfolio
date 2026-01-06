"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";
import { Linkedin, Mail, MapPin } from "lucide-react";

interface HeroProps {
    delay?: number;
}

export function Hero({ delay = 0 }: HeroProps) {
    return (
        <section className="pt-28 pb-12 md:py-28">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            delay: delay,
                            staggerChildren: 0.1,
                            delayChildren: delay + 0.1,
                        },
                    },
                }}
                className="space-y-8"
            >
                <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
                    }}
                    className="mb-6 md:mb-8"
                >
                    <div className="w-32 h-32 md:w-44 md:h-44 mx-auto rounded-full overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                        <img
                            src="/profile.jpg"
                            alt="Ankur Kakroo"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <motion.h1
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="text-4xl md:text-7xl font-serif font-bold tracking-tight relative w-fit mx-auto"
                    >
                        <span className="relative z-10">
                            {RESUME_DATA.name}
                        </span>
                    </motion.h1>
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="text-sm md:text-lg text-neutral-600 dark:text-neutral-400 font-serif font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase text-center mt-4"
                    >
                        {RESUME_DATA.title}
                    </motion.h2>
                </div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                    }}
                    className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 justify-center items-center"
                >
                    <a
                        href={`mailto:${RESUME_DATA.contact.email}`}
                        className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors break-all"
                    >
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="break-all">{RESUME_DATA.contact.email}</span>
                    </a>
                    <a
                        href={RESUME_DATA.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <Linkedin className="h-4 w-4 flex-shrink-0" />
                        LinkedIn
                    </a>
                    <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        {RESUME_DATA.contact.location}
                    </span>
                </motion.div>

                <div className="pt-4 text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4 particle-exclusion">
                    {RESUME_DATA.profile.map((paragraph, index) => (
                        <motion.p
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                            }}
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
