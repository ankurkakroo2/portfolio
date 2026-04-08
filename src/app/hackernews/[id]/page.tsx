import {
  fetchItem,
  sanitizeStory,
  fetchCommentsWithReplies,
} from "@/lib/hackernews";
import { StoryDetailClient } from "./story-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const raw = await fetchItem(Number(id));

  if (!raw) {
    return { title: "Story Not Found" };
  }

  const story = sanitizeStory(raw);

  return {
    title: story.title,
    description: `${story.title} — ${story.score} points by ${story.by} on Hacker News`,
    openGraph: {
      type: "article",
      title: story.title,
      description: `${story.score} points by ${story.by} on Hacker News`,
      siteName: "Ankur Kakroo",
    },
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await fetchItem(Number(id));

  if (!raw) {
    notFound();
  }

  const story = sanitizeStory(raw);
  story.timeAgo =
    story.time > 0
      ? (await import("@/lib/hackernews")).formatRelativeTime(story.time)
      : "unknown";

  const comments =
    story.kids.length > 0
      ? await fetchCommentsWithReplies(story.kids)
      : [];

  return (
    <main className="min-h-screen transition-colors duration-300 relative flex flex-col">
      <StoryDetailClient story={story} comments={comments} />
      <footer className="mt-auto py-6 text-center text-sm text-neutral-500 dark:text-neutral-400 relative z-10">
        <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
      </footer>
    </main>
  );
}
