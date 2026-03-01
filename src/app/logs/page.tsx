import { getLogs } from "@/lib/logs";
import { LogsClient } from "./logs-client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const logs = await getLogs();
  const latestLog = logs[0];
  
  const title = latestLog 
    ? `Activity Logs — ${latestLog.heading || latestLog.date}` 
    : "Activity Logs — Building in Public";
  
  const description = latestLog
    ? `Latest update from ${latestLog.date}: ${latestLog.content.slice(0, 150).replace(/#.*\n/g, '').trim()}...`
    : "Follow my journey building products, shipping features, and learning in public. A public log of progress, experiments, and learnings.";

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://ankurkakroo.in/logs",
      title,
      description,
      siteName: "Ankur Kakroo",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <main className="min-h-screen transition-colors duration-300 relative flex flex-col">
      <LogsClient logs={logs} />
      <footer className="mt-auto py-6 text-center text-sm text-neutral-500 dark:text-neutral-400 relative z-10">
        <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
      </footer>
    </main>
  );
}
