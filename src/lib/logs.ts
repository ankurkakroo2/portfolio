import fs from "fs";
import path from "path";

export interface LogEntry {
  date: string; // Display date: "January 3, 2026"
  heading: string; // Short heading from frontmatter
  filename: string; // "2026-01-03.md"
  content: string; // Raw markdown content
  timestamp: Date; // For sorting
}

export async function getLogs(): Promise<LogEntry[]> {
  const logsDirectory = path.join(process.cwd(), "src/content/logs");

  // Check if directory exists
  if (!fs.existsSync(logsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(logsDirectory);

  const logs: LogEntry[] = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(logsDirectory, filename);
      const raw = fs.readFileSync(filePath, "utf8");

      // Extract frontmatter heading and strip it from content
      const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      const heading = frontmatterMatch
        ? (frontmatterMatch[1].match(/^heading:\s*(.+)$/m)?.[1] ?? "")
        : "";
      const content = frontmatterMatch ? frontmatterMatch[2] : raw;

      // Extract date from filename (format: YYYY-MM-DD.md)
      const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})\.md$/);

      if (!dateMatch) {
        return null;
      }

      const [, year, month, day] = dateMatch;
      const timestamp = new Date(`${year}-${month}-${day}`);

      // Format date as "Month Day, Year"
      const date = timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        date,
        heading,
        filename,
        content,
        timestamp,
      };
    })
    .filter((log): log is LogEntry => log !== null)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Newest first

  return logs;
}
