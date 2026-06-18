export interface HNStory {
  id: number;
  title: string;
  by: string;
  score: number;
  time: number;
  url: string | null;
  text: string | null;
  descendants: number;
  kids: number[];
  timeAgo?: string;
}

export interface HNComment {
  id: number;
  by: string;
  text: string;
  time: number;
  kids: number[];
  replies: HNComment[];
  timeAgo?: string;
}

const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";

export function formatRelativeTime(
  unixTimestamp: number | null | undefined
): string {
  if (unixTimestamp == null) return "unknown";

  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTimestamp;

  if (diff < 0) return "just now";
  if (diff < 60) return "just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(diff / 3600);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(diff / 86400);
  if (days < 30) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  const months = Math.floor(diff / (86400 * 30));
  if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  const years = Math.floor(diff / (86400 * 365));
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function sanitizeStory(
  story: Record<string, unknown> | null | undefined
): HNStory {
  if (!story) {
    return {
      id: 0,
      title: "[No Title]",
      by: "unknown",
      score: 0,
      time: 0,
      url: null,
      text: null,
      descendants: 0,
      kids: [],
    };
  }

  return {
    id: (story.id as number) ?? 0,
    title: (story.title as string) ?? "[No Title]",
    by: (story.by as string) ?? "unknown",
    score: (story.score as number) ?? 0,
    time: (story.time as number) ?? 0,
    url: (story.url as string) ?? null,
    text: (story.text as string) ?? null,
    descendants: (story.descendants as number) ?? 0,
    kids: (Array.isArray(story.kids) ? story.kids : []) as number[],
  };
}

export async function fetchItem(
  id: number
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchTopStoryIds(): Promise<number[]> {
  try {
    const res = await fetch(`${HN_API_BASE}/topstories.json`);
    if (!res.ok) return [];
    return (await res.json()) as number[];
  } catch {
    return [];
  }
}

export async function fetchTopStories(count: number = 10): Promise<HNStory[]> {
  const ids = await fetchTopStoryIds();
  const sliced = ids.slice(0, count);

  const items = await Promise.all(sliced.map((id) => fetchItem(id)));

  return items
    .filter((item): item is Record<string, unknown> => item != null)
    .map((item) => {
      const story = sanitizeStory(item);
      story.timeAgo = formatRelativeTime(story.time);
      return story;
    });
}

export async function fetchCommentsWithReplies(
  kidIds: number[],
  maxDepth: number = 1
): Promise<HNComment[]> {
  if (!kidIds || kidIds.length === 0) return [];

  const items = await Promise.all(kidIds.map((id) => fetchItem(id)));

  const comments: HNComment[] = [];

  for (const item of items) {
    if (!item) continue;

    const childKids = Array.isArray(item.kids) ? (item.kids as number[]) : [];

    let replies: HNComment[] = [];
    if (childKids.length > 0 && maxDepth > 0) {
      replies = await fetchCommentsWithReplies(childKids, maxDepth - 1);
    }

    const comment: HNComment = {
      id: (item.id as number) ?? 0,
      by: (item.by as string) ?? "unknown",
      text: (item.text as string) ?? "[deleted]",
      time: (item.time as number) ?? 0,
      kids: childKids,
      replies,
      timeAgo: formatRelativeTime((item.time as number) ?? null),
    };

    comments.push(comment);
  }

  return comments;
}
