"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";

interface ExperienceProps {
    delay?: number;
}

export function Experience({ delay = 0 }: ExperienceProps) {
    return (
        <motion.section
            className="py-20 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay }}
        >
            <h2 className="text-4xl font-serif font-light tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-neutral-900 hover:via-neutral-600 hover:to-neutral-900 dark:hover:from-white dark:hover:via-neutral-400 dark:hover:to-white transition-all duration-300 cursor-default w-fit">
                Experience
            </h2>

            <div className="space-y-16">
                {RESUME_DATA.experience.map((role, index) => (
                    <div
                        key={index}
                        id={role.company.toLowerCase().includes('hacker') ? 'hacker-section' : role.company.toLowerCase().includes('zeta') ? 'zeta-section' : undefined}
                        className="group relative pl-8 border-l border-neutral-200 dark:border-neutral-800"
                    >
                        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300" />

                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
                            <h3 className="text-2xl font-serif font-medium">
                                {role.company}
                            </h3>
                            <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
                                {role.period}
                            </span>
                        </div>

                        <p className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200">
                            {role.role}
                        </p>

                        <p className="mb-6 text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                            {role.description}
                        </p>

                        {role.highlights && (
                            <div className="space-y-4">
                                {role.highlights.map((highlight, idx) => {
                                    const [title, ...rest] = highlight.split(":");
                                    const content = rest.join(":");
                                    return (
                                        <p key={idx} className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
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
