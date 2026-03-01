import { getLogs } from "@/lib/logs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date: dateParam } = await params;
  const logs = await getLogs();
  const log = logs.find((l) => l.filename === `${dateParam}.md`);

  if (!log) {
    return {
      title: "Log Entry Not Found",
      description: "The requested log entry could not be found.",
    };
  }

  const title = log.heading || `Log Entry — ${log.date}`;
  const description = log.content
    .slice(0, 160)
    .replace(/[#*_`\[\]]/g, "")
    .trim();

  return {
    title,
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
      url: `https://ankurkakroo.in/logs/${dateParam}`,
      title,
      description,
      siteName: "Ankur Kakroo",
      publishedTime: dateParam,
      authors: ["Ankur Kakroo"],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LogEntryPage({ params }: Props) {
  const { date: dateParam } = await params;
  const logs = await getLogs();
  const log = logs.find((l) => l.filename === `${dateParam}.md`);

  if (!log) {
    notFound();
  }

  return (
    <main className="min-h-screen transition-colors duration-300 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10 py-20 md:py-28">
        <Link
          href="/logs"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to logs
        </Link>

        <article className="particle-exclusion">
          <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-4 leading-tight">
              {log.heading || "Untitled Entry"}
            </h1>
            <time className="text-sm text-neutral-500 dark:text-neutral-400">
              {log.date}
            </time>
          </header>

          <div className="prose dark:prose-invert max-w-none [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-neutral-900 dark:[&_p]:text-neutral-100">
            {log.content.split("\n\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("*") || trimmed.startsWith("_")) {
                return (
                  <p
                    key={index}
                    className="italic text-neutral-800 dark:text-neutral-200"
                  >
                    {trimmed.replace(/^[*_]+|[*_]+$/g, "")}
                  </p>
                );
              }

              return (
                <p key={index} className="whitespace-pre-wrap">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </main>
  );
}
