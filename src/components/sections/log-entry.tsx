"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface LogEntryProps {
  date: string; // "January 3, 2026"
  heading: string; // Short heading from frontmatter
  content: string; // Raw markdown content
  delay: number; // Animation delay
  shouldAnimate?: boolean;
}

export function LogEntry({ date, heading, content, delay, shouldAnimate = true }: LogEntryProps) {
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative pl-8 border-l border-neutral-200 dark:border-neutral-800 particle-exclusion"
    >
      <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300" />

      <p className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
        {date}
      </p>
      <h2 className="text-2xl font-serif font-light tracking-tight mb-4">
        {heading}
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-relaxed text-neutral-600 dark:text-neutral-400">
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
    </motion.div>
  );
}
