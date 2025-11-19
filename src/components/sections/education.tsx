"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";

interface EducationProps {
    delay?: number;
}

export function Education({ delay = 0 }: EducationProps) {
    return (
        <motion.section
            className="py-20 space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay }}
        >
            <h2 className="text-4xl font-serif font-light tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-neutral-900 hover:via-neutral-600 hover:to-neutral-900 dark:hover:from-white dark:hover:via-neutral-400 dark:hover:to-white transition-all duration-300 cursor-default w-fit">
                Education
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {RESUME_DATA.education.map((edu, index) => (
                    <div key={index}>
                        <h3 className="text-xl font-serif font-medium mb-1">{edu.school}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                            {edu.degree}
                        </p>
                        <span className="text-sm font-mono text-neutral-500">
                            {edu.period}
                        </span>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
