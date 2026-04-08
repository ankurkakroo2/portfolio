import {
  formatRelativeTime,
  sanitizeStory,
  fetchItem,
  fetchTopStoryIds,
  fetchTopStories,
  fetchCommentsWithReplies,
  HNStory,
  HNComment,
} from '@/lib/hackernews';

// ─── Helpers ────────────────────────────────────────────────────────────────

const nowSec = () => Math.floor(Date.now() / 1000);

function mockFetchOk(data: unknown): jest.Mock {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

function mockFetchNotOk(status = 404): jest.Mock {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => null,
  });
}

function mockFetchReject(err = new Error('network error')): jest.Mock {
  return jest.fn().mockRejectedValue(err);
}

// ─── Setup / Teardown ───────────────────────────────────────────────────────

const originalFetch = global.fetch;

beforeEach(() => {
  // reset to a no-op so tests that don't set their own mock don't hit the
  // real network
  global.fetch = jest.fn().mockRejectedValue(new Error('unmocked fetch'));
});

afterEach(() => {
  global.fetch = originalFetch;
});

// ─── formatRelativeTime ─────────────────────────────────────────────────────

describe('formatRelativeTime', () => {
  it('returns "just now" for a timestamp within the last 59 seconds', () => {
    const ts = nowSec() - 30;
    expect(formatRelativeTime(ts)).toBe('just now');
  });

  it('returns "1 minute ago" for 1 minute old timestamp', () => {
    const ts = nowSec() - 60;
    expect(formatRelativeTime(ts)).toBe('1 minute ago');
  });

  it('returns "30 minutes ago" for 30 minute old timestamp', () => {
    const ts = nowSec() - 30 * 60;
    expect(formatRelativeTime(ts)).toBe('30 minutes ago');
  });

  it('returns "1 hour ago" for 1 hour old timestamp', () => {
    const ts = nowSec() - 3600;
    expect(formatRelativeTime(ts)).toBe('1 hour ago');
  });

  it('returns "12 hours ago" for 12 hour old timestamp', () => {
    const ts = nowSec() - 12 * 3600;
    expect(formatRelativeTime(ts)).toBe('12 hours ago');
  });

  it('returns "X days ago" for timestamps 1-29 days old', () => {
    const ts = nowSec() - 5 * 86400;
    expect(formatRelativeTime(ts)).toBe('5 days ago');
  });

  it('returns "X months ago" for timestamps 30-364 days old', () => {
    const ts = nowSec() - 90 * 86400;
    expect(formatRelativeTime(ts)).toBe('3 months ago');
  });

  it('returns "X years ago" for timestamps 365+ days old', () => {
    const ts = nowSec() - 2 * 365 * 86400;
    expect(formatRelativeTime(ts)).toBe('2 years ago');
  });

  it('returns "just now" for a future timestamp', () => {
    const ts = nowSec() + 600;
    expect(formatRelativeTime(ts)).toBe('just now');
  });

  it('returns "unknown" for null input', () => {
    expect(formatRelativeTime(null)).toBe('unknown');
  });

  it('returns "unknown" for undefined input', () => {
    expect(formatRelativeTime(undefined)).toBe('unknown');
  });

  it('returns a valid "years ago" string for 0 input', () => {
    const result = formatRelativeTime(0);
    expect(result).toMatch(/\d+ years ago/);
  });
});

// ─── sanitizeStory ──────────────────────────────────────────────────────────

describe('sanitizeStory', () => {
  it('passes through a complete story object unchanged', () => {
    const full = {
      id: 42,
      title: 'Test Title',
      by: 'testuser',
      score: 100,
      time: 1700000000,
      url: 'https://example.com',
      text: 'hello',
      descendants: 5,
      kids: [1, 2, 3],
    };
    const result = sanitizeStory(full);
    expect(result).toEqual(full);
  });

  it('defaults url to null when missing', () => {
    const story = { id: 1, title: 'T', by: 'u', score: 1, time: 1, descendants: 0, kids: [] };
    expect(sanitizeStory(story)).toHaveProperty('url', null);
  });

  it('defaults by to "unknown" when missing', () => {
    const story = { id: 1, title: 'T' };
    expect(sanitizeStory(story)).toHaveProperty('by', 'unknown');
  });

  it('defaults title to "[No Title]" when missing', () => {
    const story = { id: 1, by: 'u' };
    expect(sanitizeStory(story)).toHaveProperty('title', '[No Title]');
  });

  it('defaults score to 0 when missing', () => {
    const story = { id: 1 };
    expect(sanitizeStory(story)).toHaveProperty('score', 0);
  });

  it('defaults descendants to 0 when missing', () => {
    const story = { id: 1 };
    expect(sanitizeStory(story)).toHaveProperty('descendants', 0);
  });

  it('defaults kids to [] when missing', () => {
    const story = { id: 1 };
    expect(sanitizeStory(story)).toHaveProperty('kids', []);
  });

  it('returns full default object for null input', () => {
    const result = sanitizeStory(null);
    expect(result).toEqual({
      id: 0,
      title: '[No Title]',
      by: 'unknown',
      score: 0,
      time: 0,
      url: null,
      text: null,
      descendants: 0,
      kids: [],
    });
  });

  it('returns full default object for undefined input', () => {
    const result = sanitizeStory(undefined);
    expect(result).toEqual({
      id: 0,
      title: '[No Title]',
      by: 'unknown',
      score: 0,
      time: 0,
      url: null,
      text: null,
      descendants: 0,
      kids: [],
    });
  });

  it('returns defaults for all fields when given empty object', () => {
    const result = sanitizeStory({});
    expect(result).toEqual({
      id: 0,
      title: '[No Title]',
      by: 'unknown',
      score: 0,
      time: 0,
      url: null,
      text: null,
      descendants: 0,
      kids: [],
    });
  });
});

// ─── fetchItem ──────────────────────────────────────────────────────────────

describe('fetchItem', () => {
  it('returns parsed JSON on successful fetch', async () => {
    const payload = { id: 1, title: 'Hi' };
    global.fetch = mockFetchOk(payload);
    const result = await fetchItem(1);
    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://hacker-news.firebaseio.com/v0/item/1.json'
    );
  });

  it('returns null on network error', async () => {
    global.fetch = mockFetchReject();
    const result = await fetchItem(1);
    expect(result).toBeNull();
  });

  it('returns null on non-OK response (404)', async () => {
    global.fetch = mockFetchNotOk(404);
    const result = await fetchItem(1);
    expect(result).toBeNull();
  });
});

// ─── fetchTopStoryIds ───────────────────────────────────────────────────────

describe('fetchTopStoryIds', () => {
  it('returns array of IDs on success', async () => {
    const ids = [100, 200, 300];
    global.fetch = mockFetchOk(ids);
    const result = await fetchTopStoryIds();
    expect(result).toEqual(ids);
  });

  it('returns empty array on fetch failure', async () => {
    global.fetch = mockFetchReject();
    const result = await fetchTopStoryIds();
    expect(result).toEqual([]);
  });

  it('calls the correct URL', async () => {
    global.fetch = mockFetchOk([]);
    await fetchTopStoryIds();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
  });
});

// ─── fetchTopStories ────────────────────────────────────────────────────────

describe('fetchTopStories', () => {
  it('fetches count=10 stories, returns sanitized array with timeAgo', async () => {
    const ids = Array.from({ length: 20 }, (_, i) => i + 1);

    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('topstories.json')) {
        return Promise.resolve({ ok: true, json: async () => ids });
      }
      // item endpoint
      const match = url.match(/item\/(\d+)\.json/);
      const id = match ? Number(match[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id,
          title: `Story ${id}`,
          by: 'user',
          score: id * 10,
          time: nowSec() - 3600,
          url: `https://example.com/${id}`,
          descendants: 0,
          kids: [],
        }),
      });
    });

    const stories = await fetchTopStories(10);
    expect(stories).toHaveLength(10);
    stories.forEach((s: HNStory) => {
      expect(s.timeAgo).toBeDefined();
      expect(typeof s.timeAgo).toBe('string');
    });
    // topstories + 10 items = 11 calls
    expect(global.fetch).toHaveBeenCalledTimes(11);
  });

  it('returns only available stories when API returns fewer than requested', async () => {
    const ids = [1, 2, 3]; // only 3

    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('topstories.json')) {
        return Promise.resolve({ ok: true, json: async () => ids });
      }
      const match = url.match(/item\/(\d+)\.json/);
      const id = match ? Number(match[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: async () => ({ id, title: `S${id}`, by: 'u', score: 1, time: nowSec(), kids: [] }),
      });
    });

    const stories = await fetchTopStories(10);
    expect(stories).toHaveLength(3);
  });

  it('filters out a story whose fetch fails', async () => {
    const ids = [1, 2, 3];

    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('topstories.json')) {
        return Promise.resolve({ ok: true, json: async () => ids });
      }
      if (url.includes('item/2.json')) {
        return Promise.reject(new Error('fail'));
      }
      const match = url.match(/item\/(\d+)\.json/);
      const id = match ? Number(match[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: async () => ({ id, title: `S${id}`, by: 'u', score: 1, time: nowSec(), kids: [] }),
      });
    });

    const stories = await fetchTopStories(10);
    expect(stories).toHaveLength(2);
    expect(stories.find((s: HNStory) => s.id === 2)).toBeUndefined();
  });

  it('returns empty array when all fetches fail', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('topstories.json')) {
        return Promise.resolve({ ok: true, json: async () => [1, 2] });
      }
      return Promise.reject(new Error('fail'));
    });

    const stories = await fetchTopStories(10);
    expect(stories).toEqual([]);
  });
});

// ─── fetchCommentsWithReplies ───────────────────────────────────────────────

describe('fetchCommentsWithReplies', () => {
  it('returns [] for empty kidIds array', async () => {
    const result = await fetchCommentsWithReplies([]);
    expect(result).toEqual([]);
  });

  it('returns [] for null kidIds', async () => {
    const result = await fetchCommentsWithReplies(null as unknown as number[]);
    expect(result).toEqual([]);
  });

  it('does not recurse when maxDepth=0', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      const match = url.match(/item\/(\d+)\.json/);
      const id = match ? Number(match[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id,
          by: 'author',
          text: 'comment text',
          time: nowSec() - 120,
          kids: [10, 11], // has kids, but depth=0 means no recursion
        }),
      });
    });

    const comments = await fetchCommentsWithReplies([1], 0);
    expect(comments).toHaveLength(1);
    expect(comments[0].replies).toEqual([]);
    // Only 1 fetch for the top-level comment; no recursive fetches
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('populates replies with timeAgo at maxDepth=1', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('item/1.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: 1,
            by: 'parent',
            text: 'parent comment',
            time: nowSec() - 7200,
            kids: [10, 11],
          }),
        });
      }
      // child comments
      const match = url.match(/item\/(\d+)\.json/);
      const id = match ? Number(match[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id,
          by: 'child',
          text: `reply ${id}`,
          time: nowSec() - 600,
          kids: [100], // has kids, but depth will be 0 → no further recursion
        }),
      });
    });

    const comments = await fetchCommentsWithReplies([1], 1);
    expect(comments).toHaveLength(1);
    expect(comments[0].by).toBe('parent');
    expect(comments[0].timeAgo).toBeDefined();

    // Replies should be populated
    expect(comments[0].replies).toHaveLength(2);
    comments[0].replies.forEach((r: HNComment) => {
      expect(r.timeAgo).toBeDefined();
      expect(r.replies).toEqual([]); // depth exhausted
    });
  });

  it('sets text to "[deleted]" for a deleted comment (no text field)', async () => {
    global.fetch = mockFetchOk({
      id: 5,
      by: 'someone',
      time: nowSec() - 300,
      kids: [],
      // no `text` field → deleted
    });

    const comments = await fetchCommentsWithReplies([5], 0);
    expect(comments).toHaveLength(1);
    expect(comments[0].text).toBe('[deleted]');
  });

  it('returns empty replies for a comment with no kids', async () => {
    global.fetch = mockFetchOk({
      id: 7,
      by: 'user',
      text: 'leaf comment',
      time: nowSec() - 60,
      // no kids field
    });

    const comments = await fetchCommentsWithReplies([7], 2);
    expect(comments).toHaveLength(1);
    expect(comments[0].replies).toEqual([]);
  });

  it('filters out a comment whose fetch fails', async () => {
    let callCount = 0;
    global.fetch = jest.fn().mockImplementation((url: string) => {
      callCount++;
      if (url.includes('item/2.json')) {
        return Promise.reject(new Error('fail'));
      }
      const match = url.match(/item\/(\d+)\.json/);
      const id = match ? Number(match[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id,
          by: 'u',
          text: 'ok',
          time: nowSec(),
          kids: [],
        }),
      });
    });

    const comments = await fetchCommentsWithReplies([1, 2, 3], 0);
    expect(comments).toHaveLength(2);
    expect(comments.find((c: HNComment) => c.id === 2)).toBeUndefined();
  });
});
