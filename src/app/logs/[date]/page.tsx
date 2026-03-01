import { getLogByDate, getAllLogDates } from "@/lib/logs";
import { notFound } from "next/navigation";
import { LogDetailClient } from "./log-detail-client";
import type { Metadata } from "next";

interface LogDetailPageProps {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  const dates = await getAllLogDates();
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: LogDetailPageProps): Promise<Metadata> {
  const { date } = await params;
  const log = await getLogByDate(date);

  if (!log) {
    return { title: "Log Not Found" };
  }

  const title = log.heading || `Log Entry — ${log.date}`;
  const description = log.content
    .slice(0, 160)
    .replace(/\n/g, " ")
    .replace(/[#*_`\[\]]/g, "")
    .trim();

  return {
    title: `${title} - Ankur Kakroo`,
    description,
    keywords: ["Ankur Kakroo", "Log", "Building in Public", log.heading].filter(
      Boolean
    ),
    authors: [{ name: "Ankur Kakroo" }],
    creator: "Ankur Kakroo",
    metadataBase: new URL("https://ankurkakroo.in"),
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `https://ankurkakroo.in/logs/${date}`,
      title,
      description,
      siteName: "Ankur Kakroo",
      publishedTime: date,
      authors: ["Ankur Kakroo"],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const { date } = await params;
  const log = await getLogByDate(date);

  if (!log) {
    notFound();
  }

  return (
    <main className="min-h-screen transition-colors duration-300 relative flex flex-col">
      <LogDetailClient log={log} />
      <footer className="mt-auto py-6 text-center text-sm text-neutral-500 dark:text-neutral-400 relative z-10">
        <p>
          &copy; {new Date().getFullYear()} Ankur Kakroo. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
