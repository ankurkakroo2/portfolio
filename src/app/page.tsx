import { getLogs } from "@/lib/logs";
import { HomeClient } from "./home-client";

export default async function Home() {
  const logs = await getLogs();

  return <HomeClient logs={logs} />;
}
