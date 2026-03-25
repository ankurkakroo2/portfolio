"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6"
      >
        <h1 className="text-8xl md:text-9xl font-serif font-light tracking-tight text-neutral-200 dark:text-neutral-800">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight mt-4 mb-3">
          Page not found
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 border-b border-neutral-300 dark:border-neutral-700 pb-0.5"
        >
          Go home
        </Link>
      </motion.div>
    </main>
  );
}
