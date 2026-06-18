"use client";

import type { HNStory } from "@/lib/hackernews";
import { usePageAnimation } from "@/lib/page-animation";
import { motion } from "framer-motion";
import Link from "next/link";

interface HackernewsClientProps {
  stories: HNStory[];
}

export function HackernewsClient({ stories }: HackernewsClientProps) {
  const shouldAnimate = usePageAnimation("hackernews");

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 flex-grow">
      <div className="py-20 md:py-28">
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4">
            Hacker News
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Top 10 trending stories
          </p>
        </motion.div>

        {stories.length === 0 ? (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-20 text-center"
          >
            <p className="text-lg text-neutral-400 dark:text-neutral-500 mb-4">
              No stories available
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              Could not fetch stories from Hacker News. Please try again later.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 py-3">
                      #
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 py-3">
                      Title
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 py-3 hidden md:table-cell">
                      Author
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 py-3">
                      Score
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 py-3 hidden sm:table-cell">
                      Comments
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 py-3 hidden lg:table-cell">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story, index) => (
                    <tr
                      key={story.id}
                      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-400 dark:text-neutral-500 w-10">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/hackernews/${story.id}`}
                            className="text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          >
                            {story.title}
                          </Link>
                          {story.url && (
                            <a
                              href={story.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 dark:text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex-shrink-0"
                              aria-label="Open external link"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
                        {story.by}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                        {story.score}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">
                        {story.descendants}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden lg:table-cell whitespace-nowrap">
                        {story.timeAgo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
