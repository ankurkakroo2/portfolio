"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface LogEntryProps {
  date: string; // "January 3, 2026"
  content: string; // Raw markdown content
  delay: number; // Animation delay
  shouldAnimate?: boolean;
}

export function LogEntry({ date, content, delay, shouldAnimate = true }: LogEntryProps) {
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="group relative pl-8 border-l border-neutral-200 dark:border-neutral-800 particle-exclusion transition-theme">
        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300" />

        <h2 className="text-2xl font-serif font-light tracking-tight mb-4">
          {date}
        </h2>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 leading-relaxed text-neutral-700 dark:text-neutral-300 transition-theme">
                  {children}
                </p>
              ),
              pre: ({ children }) => (
                <pre className="overflow-x-auto rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4 mb-4 text-sm">
                  {children}
                </pre>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
