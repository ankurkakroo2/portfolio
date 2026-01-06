import { getLogs } from "@/lib/logs";
import { LogsClient } from "./logs-client";

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative flex flex-col">
      <LogsClient logs={logs} />
      <footer className="mt-auto py-6 text-center text-sm text-neutral-500 dark:text-neutral-400 relative z-10">
        <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
      </footer>
    </main>
  );
}
