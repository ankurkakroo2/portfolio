"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4">
          Something went wrong
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-8">
          An unexpected error occurred. You can try again or head back home.
        </p>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={reset}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 border-b border-neutral-300 dark:border-neutral-700 pb-0.5"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 border-b border-neutral-300 dark:border-neutral-700 pb-0.5"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
