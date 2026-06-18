"use client";

import type { HNStory, HNComment } from "@/lib/hackernews";
import { usePageAnimation } from "@/lib/page-animation";
import { motion } from "framer-motion";
import Link from "next/link";

interface StoryDetailClientProps {
  story: HNStory;
  comments: HNComment[];
}

function Comment({
  comment,
  depth = 0,
}: {
  comment: HNComment;
  depth?: number;
}) {
  const isDeleted = comment.text === "[deleted]" || !comment.by;

  if (isDeleted) {
    return (
      <div
        className={`${
          depth > 0
            ? "border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 ml-4"
            : ""
        } py-3`}
      >
        <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
          [deleted]
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${
        depth > 0
          ? "border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 ml-4"
          : ""
      } py-3`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {comment.by}
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {comment.timeAgo}
        </span>
      </div>
      <div
        className="text-sm text-neutral-600 dark:text-neutral-400 prose-sm max-w-none [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:text-blue-700 [&_a]:dark:hover:text-blue-300 [&_a]:underline [&_p]:my-2 [&_pre]:bg-neutral-100 [&_pre]:dark:bg-neutral-900 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_code]:text-xs"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StoryDetailClient({
  story,
  comments,
}: StoryDetailClientProps) {
  const shouldAnimate = usePageAnimation(`hackernews-${story.id}`);

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
            href="/hackernews"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
          >
            ← Back to Hacker News
          </Link>
        </motion.div>

        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-4">
            {story.url ? (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                {story.title}
                <svg
                  className="w-5 h-5 inline-block ml-2 opacity-50"
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
            ) : (
              story.title
            )}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {story.score} points by {story.by} · {story.timeAgo} ·{" "}
            {story.descendants} comments
          </p>
        </motion.div>

        {story.text && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-md p-6"
          >
            <div
              className="text-sm text-neutral-700 dark:text-neutral-300 prose-sm max-w-none [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:text-blue-700 [&_a]:dark:hover:text-blue-300 [&_a]:underline [&_p]:my-2 [&_pre]:bg-neutral-100 [&_pre]:dark:bg-neutral-900 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_code]:text-xs"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          </motion.div>
        )}

        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-serif font-light tracking-tight mb-6">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 py-8 text-center">
              No comments yet.
            </p>
          ) : (
            <div className="rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 divide-y divide-neutral-100 dark:divide-neutral-800">
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
