const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

function formatRelativeTime(unixTimestamp) {
  if (unixTimestamp === null || unixTimestamp === undefined) {
    return 'unknown';
  }

  const now = Date.now() / 1000;
  const diff = now - unixTimestamp;

  if (diff < 0) {
    return 'just now';
  }

  const seconds = Math.floor(diff);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
  if (months >= 1) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  if (days >= 1) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (hours >= 1) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (minutes >= 1) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  return 'just now';
}

function sanitizeStory(story) {
  if (!story) {
    return {
      title: '[No Title]',
      by: 'unknown',
      score: 0,
      descendants: 0,
      url: null,
      kids: [],
      text: null,
    };
  }

  return {
    ...story,
    title: story.title || '[No Title]',
    by: story.by || 'unknown',
    score: story.score || 0,
    descendants: story.descendants || 0,
    url: story.url || null,
    kids: story.kids || [],
    text: story.text || null,
  };
}

async function fetchItem(id) {
  try {
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function fetchTopStoryIds() {
  try {
    const response = await fetch(`${HN_API_BASE}/topstories.json`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

async function fetchTopStories(count = 10) {
  const ids = await fetchTopStoryIds();
  const sliced = ids.slice(0, count);
  const stories = await Promise.all(sliced.map((id) => fetchItem(id)));
  return stories.filter((s) => s !== null).map((s) => sanitizeStory(s));
}

async function fetchCommentsWithReplies(kidIds, maxDepth = 1) {
  if (!kidIds || kidIds.length === 0) {
    return [];
  }

  const comments = await Promise.all(
    kidIds.map(async (id) => {
      const item = await fetchItem(id);
      if (!item) {
        return null;
      }

      const comment = {
        ...item,
        text: item.text || '[deleted]',
        replies: [],
      };

      if (item.kids && item.kids.length > 0 && maxDepth > 0) {
        comment.replies = await fetchCommentsWithReplies(item.kids, maxDepth - 1);
      }

      return comment;
    })
  );

  return comments.filter((c) => c !== null);
}

module.exports = {
  formatRelativeTime,
  sanitizeStory,
  fetchItem,
  fetchTopStoryIds,
  fetchTopStories,
  fetchCommentsWithReplies,
};
