import { ParticleBackground } from "@/components/particle-background";
import { Navigation } from "@/components/navigation";
import { getLogs } from "@/lib/logs";
import { LogsClient } from "./logs-client";

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative">
      <ParticleBackground />
      <Navigation />
      <LogsClient logs={logs} />
    </main>
  );
}
