"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface LogEntryProps {
  date: string; // "January 3, 2026"
  content: string; // Raw markdown content
  delay: number; // Animation delay
}

export function LogEntry({ date, content, delay }: LogEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative pl-8 border-l border-neutral-200 dark:border-neutral-800 particle-exclusion"
    >
      <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300" />

      <h2 className="text-2xl font-serif font-light tracking-tight mb-4">
        {date}
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-relaxed text-neutral-600 dark:text-neutral-400">
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600/80 dark:text-blue-400/70 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 underline decoration-blue-600/30 dark:decoration-blue-400/30 underline-offset-2"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
