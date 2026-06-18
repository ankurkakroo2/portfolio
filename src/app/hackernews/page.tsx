import { fetchTopStories } from "@/lib/hackernews";
import { HackernewsClient } from "./hackernews-client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Hacker News - Trending Topics";
  const description =
    "Top 10 trending stories from Hacker News, curated and displayed in real time.";

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://ankurkakroo.in/hackernews",
      title,
      description,
      siteName: "Ankur Kakroo",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HackernewsPage() {
  const stories = await fetchTopStories(10);

  return (
    <main className="min-h-screen transition-colors duration-300 relative flex flex-col">
      <HackernewsClient stories={stories} />
      <footer className="mt-auto py-6 text-center text-sm text-neutral-500 dark:text-neutral-400 relative z-10">
        <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
      </footer>
    </main>
  );
}
