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
    <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
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
          <div className="text-center text-neutral-500 dark:text-neutral-400">
            No logs yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-16">
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

        <footer className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
