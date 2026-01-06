"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";

interface ExperienceProps {
    delay?: number;
}

export function Experience({ delay = 0 }: ExperienceProps) {
    return (
        <motion.section
            className="py-12 md:py-20 space-y-8 md:space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay }}
        >
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight w-fit">
                Experience
            </h2>

            <div className="space-y-12 md:space-y-16">
                {RESUME_DATA.experience.map((role, index) => (
                    <div
                        key={index}
                        className="group relative pl-6 md:pl-8 border-l border-neutral-200 dark:border-neutral-800 particle-exclusion"
                    >
                        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300" />

                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 mb-3 md:mb-4">
                            <h3 className="text-xl md:text-2xl font-serif font-medium">
                                {role.company}
                            </h3>
                            <span className="text-xs md:text-sm font-mono text-neutral-500 dark:text-neutral-400">
                                {role.period}
                            </span>
                        </div>

                        <p className="text-base md:text-lg font-medium mb-3 md:mb-4 text-neutral-800 dark:text-neutral-200">
                            {role.role}
                        </p>

                        <p className="mb-4 md:mb-6 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                            {role.description}
                        </p>

                        {role.highlights && (
                            <div className="space-y-3 md:space-y-4">
                                {role.highlights.map((highlight, idx) => {
                                    const [title, ...rest] = highlight.split(":");
                                    const content = rest.join(":");
                                    return (
                                        <p key={idx} className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs md:text-sm">
                                            <strong className="font-medium text-neutral-900 dark:text-neutral-100">
                                                {title}:
                                            </strong>
                                            {content}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
