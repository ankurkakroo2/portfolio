"use client";

import { Hero } from "@/components/sections/hero";
import { LogEntry } from "@/components/sections/log-entry";
import { usePageAnimation } from "@/lib/page-animation";
import { motion } from "framer-motion";

interface Log {
  date: string;
  filename: string;
  content: string;
  timestamp: Date;
}

interface HomeClientProps {
  logs: Log[];
}

export function HomeClient({ logs }: HomeClientProps) {
  const shouldAnimate = usePageAnimation("home");

  return (
    <main className="min-h-screen transition-colors duration-300 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
        <Hero delay={0} shouldAnimate={shouldAnimate} />
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />

        <div className="py-16 particle-exclusion [&_a]:text-blue-600/60 [&_a]:dark:text-blue-400/50 [&_a]:no-underline [&_a]:hover:text-blue-600/80 [&_a]:dark:hover:text-blue-400/70">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4">
              Log
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Personal projects and experiments
            </p>
          </motion.div>

          {logs.length === 0 ? (
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
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
                  delay={1.0 + index * 0.1}
                  shouldAnimate={shouldAnimate}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
