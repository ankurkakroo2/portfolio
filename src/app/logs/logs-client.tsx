"use client";

import { LogEntry } from "@/components/sections/log-entry";
import { usePageAnimation } from "@/lib/page-animation";
import { motion } from "framer-motion";

interface Log {
  date: string;
  filename: string;
  content: string;
  timestamp: Date;
}

interface LogsClientProps {
  logs: Log[];
}

export function LogsClient({ logs }: LogsClientProps) {
  const shouldAnimate = usePageAnimation("logs");

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 flex-grow logs-content [&_a]:text-blue-600/60 [&_a]:dark:text-blue-400/50 [&_a]:no-underline [&_a]:hover:text-blue-600/80 [&_a]:dark:hover:text-blue-400/70">
      <div className="py-20 md:py-28 particle-exclusion">
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4">
            Log
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Thinking out loud while building
          </p>
        </motion.div>

        {logs.length === 0 ? (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-20 text-center"
          >
            <p className="text-lg text-neutral-400 dark:text-neutral-500 mb-4">
              No logs yet
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              This is where weekly progress goes. Use the <code className="text-xs bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">/add-log</code> skill to start documenting.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-16 pb-12">
            {logs.map((log, index) => (
              <LogEntry
                key={log.filename}
                date={log.date}
                content={log.content}
                delay={0.2 + index * 0.1}
                shouldAnimate={shouldAnimate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
