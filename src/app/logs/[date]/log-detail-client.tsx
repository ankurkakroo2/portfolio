"use client";

import { LogEntry } from "@/components/sections/log-entry";
import { usePageAnimation } from "@/lib/page-animation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Log {
  date: string;
  heading: string;
  filename: string;
  content: string;
  timestamp: Date;
}

interface LogDetailClientProps {
  log: Log;
}

export function LogDetailClient({ log }: LogDetailClientProps) {
  const shouldAnimate = usePageAnimation(`log-${log.filename}`);

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 flex-grow [&_a]:text-blue-600/60 [&_a]:dark:text-blue-400/50 [&_a]:no-underline [&_a]:hover:text-blue-600/80 [&_a]:dark:hover:text-blue-400/70">
      <div className="py-20 md:py-28 particle-exclusion">
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/logs"
            className="inline-flex items-center gap-1.5 text-sm !text-neutral-500 dark:!text-neutral-400 hover:!text-black dark:hover:!text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Log
          </Link>
        </motion.div>

        <LogEntry
          date={log.date}
          heading={log.heading}
          content={log.content}
          delay={0.2}
          shouldAnimate={shouldAnimate}
          variant="standalone"
        />
      </div>
    </div>
  );
}
