"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";

interface SkillsProps {
    delay?: number;
}

export function Skills({ delay = 0 }: SkillsProps) {
    return (
        <motion.section
            className="py-20 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay }}
        >
            <div className="space-y-12">
                <h2 className="text-4xl font-serif font-light tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-neutral-900 hover:via-neutral-600 hover:to-neutral-900 dark:hover:from-white dark:hover:via-neutral-400 dark:hover:to-white transition-all duration-300 cursor-default w-fit">
                    Core Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {RESUME_DATA.coreSkills.map((skill, index) => (
                        <div key={index}>
                            <h3 className="text-xl font-serif font-medium mb-3">{skill.title}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {skill.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                <h2 className="text-4xl font-serif font-light tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-neutral-900 hover:via-neutral-600 hover:to-neutral-900 dark:hover:from-white dark:hover:via-neutral-400 dark:hover:to-white transition-all duration-300 cursor-default w-fit">
                    Technical Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {Object.entries(RESUME_DATA.technicalSkills).map(([category, skills], index) => (
                        <div key={index}>
                            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                                {category}
                            </h3>
                            <p className="text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed">
                                {skills}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
