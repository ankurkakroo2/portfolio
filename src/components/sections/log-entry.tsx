"use client";

import { GlassCard } from "@/components/ui/glass-card";
import ReactMarkdown from "react-markdown";

interface LogEntryProps {
  date: string; // "January 3, 2026"
  content: string; // Raw markdown content
  delay: number; // Animation delay
}

export function LogEntry({ date, content, delay }: LogEntryProps) {
  return (
    <GlassCard delay={delay}>
      <h2 className="text-2xl font-serif font-light tracking-tight mb-4">
        {date}
      </h2>
      <div className="h-px w-20 bg-neutral-300 dark:bg-neutral-700 mb-6" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-relaxed text-neutral-700 dark:text-neutral-300">
                {children}
              </p>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </GlassCard>
  );
}
