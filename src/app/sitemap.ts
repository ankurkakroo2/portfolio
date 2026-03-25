import { getAllLogDates } from "@/lib/logs";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ankurkakroo.in";
  const logDates = await getAllLogDates();

  const logEntries: MetadataRoute.Sitemap = logDates.map((date) => ({
    url: `${baseUrl}/logs/${date}`,
    lastModified: new Date(date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/logs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...logEntries,
  ];
}
