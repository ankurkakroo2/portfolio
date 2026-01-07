"use client";

import { LogEntry } from "@/components/sections/log-entry";
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
  return (
    <div className="container mx-auto px-6 md:px-12 max-w-4xl relative flex-grow">
      <div className="py-20 md:py-28 particle-exclusion">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4">
            Log
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Personal projects and experiments
          </p>
        </motion.div>

        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
