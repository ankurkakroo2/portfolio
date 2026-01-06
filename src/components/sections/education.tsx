"use client";

import { RESUME_DATA } from "@/lib/data";
import { motion } from "framer-motion";

interface EducationProps {
    delay?: number;
}

export function Education({ delay = 0 }: EducationProps) {
    return (
        <motion.section
            className="py-12 md:py-20 space-y-8 md:space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay }}
        >
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight w-fit">
                Education
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {RESUME_DATA.education.map((edu, index) => (
                    <div key={index}>
                        <h3 className="text-lg md:text-xl font-serif font-medium mb-1">{edu.school}</h3>
                        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-2">
                            {edu.degree}
                        </p>
                        <span className="text-xs md:text-sm font-mono text-neutral-500">
                            {edu.period}
                        </span>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
