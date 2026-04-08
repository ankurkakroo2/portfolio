const {
  formatRelativeTime,
  sanitizeStory,
  fetchItem,
  fetchTopStoryIds,
  fetchTopStories,
  fetchCommentsWithReplies,
} = require('../hackernews');

// ─── formatRelativeTime ─────────────────────────────────────────────

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const NOW_SECONDS = 1700000000; // fixed reference point

  function setNow() {
    Date.now.mockReturnValue(NOW_SECONDS * 1000);
  }

  test('returns "just now" for a timestamp within the last 59 seconds', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS - 30)).toBe('just now');
    expect(formatRelativeTime(NOW_SECONDS - 59)).toBe('just now');
  });

  test('returns "X minutes ago" for timestamps 1-59 minutes old', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS - 60)).toBe('1 minute ago');
    expect(formatRelativeTime(NOW_SECONDS - 30 * 60)).toBe('30 minutes ago');
  });

  test('returns "X hours ago" for timestamps 1-23 hours old', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS - 3600)).toBe('1 hour ago');
    expect(formatRelativeTime(NOW_SECONDS - 12 * 3600)).toBe('12 hours ago');
  });

  test('returns "X days ago" for timestamps 1-29 days old', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS - 86400)).toBe('1 day ago');
    expect(formatRelativeTime(NOW_SECONDS - 15 * 86400)).toBe('15 days ago');
  });

  test('returns "X months ago" for timestamps 30-364 days old', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS - 60 * 86400)).toBe('2 months ago');
  });

  test('returns "X years ago" for timestamps 365+ days old', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS - 400 * 86400)).toBe('1 year ago');
    expect(formatRelativeTime(NOW_SECONDS - 800 * 86400)).toBe('2 years ago');
  });

  test('returns "just now" for a future timestamp', () => {
    setNow();
    expect(formatRelativeTime(NOW_SECONDS + 1000)).toBe('just now');
  });

  test('returns "unknown" for null input', () => {
    expect(formatRelativeTime(null)).toBe('unknown');
  });

  test('returns "unknown" for undefined input', () => {
    expect(formatRelativeTime(undefined)).toBe('unknown');
  });

  test('returns a valid "years ago" string for 0 input', () => {
    setNow();
    const result = formatRelativeTime(0);
    expect(result).toMatch(/\d+ years ago/);
  });
});

// ─── sanitizeStory ──────────────────────────────────────────────────

describe('sanitizeStory', () => {
  const completeStory = {
    id: 1,
    title: 'Test Story',
    by: 'testuser',
    score: 42,
    descendants: 10,
    url: 'https://example.com',
    kids: [100, 200],
    text: 'Some text',
  };

  test('complete story object passes through unchanged', () => {
    const result = sanitizeStory(completeStory);
    expect(result.title).toBe('Test Story');
    expect(result.by).toBe('testuser');
    expect(result.score).toBe(42);
    expect(result.descendants).toBe(10);
    expect(result.url).toBe('https://example.com');
    expect(result.kids).toEqual([100, 200]);
    expect(result.text).toBe('Some text');
  });

  test('story missing url defaults to null', () => {
    const { url: _, ...story } = completeStory;
    expect(sanitizeStory(story).url).toBeNull();
  });

  test('story missing by defaults to "unknown"', () => {
    const { by: _, ...story } = completeStory;
    expect(sanitizeStory(story).by).toBe('unknown');
  });

  test('story missing title defaults to "[No Title]"', () => {
    const { title: _, ...story } = completeStory;
    expect(sanitizeStory(story).title).toBe('[No Title]');
  });

  test('story missing score defaults to 0', () => {
    const { score: _, ...story } = completeStory;
    expect(sanitizeStory(story).score).toBe(0);
  });

  test('story missing descendants defaults to 0', () => {
    const { descendants: _, ...story } = completeStory;
    expect(sanitizeStory(story).descendants).toBe(0);
  });

  test('story missing kids defaults to []', () => {
    const { kids: _, ...story } = completeStory;
    expect(sanitizeStory(story).kids).toEqual([]);
  });

  test('null input returns full default object', () => {
    const result = sanitizeStory(null);
    expect(result).toEqual({
      title: '[No Title]',
      by: 'unknown',
      score: 0,
      descendants: 0,
      url: null,
      kids: [],
      text: null,
    });
  });

  test('undefined input returns full default object', () => {
    const result = sanitizeStory(undefined);
    expect(result).toEqual({
      title: '[No Title]',
      by: 'unknown',
      score: 0,
      descendants: 0,
      url: null,
      kids: [],
      text: null,
    });
  });

  test('empty object returns defaults for all fields', () => {
    const result = sanitizeStory({});
    expect(result.title).toBe('[No Title]');
    expect(result.by).toBe('unknown');
    expect(result.score).toBe(0);
    expect(result.descendants).toBe(0);
    expect(result.url).toBeNull();
    expect(result.kids).toEqual([]);
    expect(result.text).toBeNull();
  });
});

// ─── fetchItem ──────────────────────────────────────────────────────

describe('fetchItem', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('successful fetch returns parsed JSON object', async () => {
    const item = { id: 1, title: 'Hello' };
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => item,
    });

    const result = await fetchItem(1);
    expect(result).toEqual(item);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://hacker-news.firebaseio.com/v0/item/1.json'
    );
  });

  test('fetch failure (network error) returns null', async () => {
    global.fetch.mockRejectedValue(new Error('network error'));
    const result = await fetchItem(1);
    expect(result).toBeNull();
  });

  test('fetch non-OK response (status 404) returns null', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });
    const result = await fetchItem(999999);
    expect(result).toBeNull();
  });
});

// ─── fetchTopStoryIds ───────────────────────────────────────────────

describe('fetchTopStoryIds', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('successful fetch returns array of IDs', async () => {
    const ids = [1, 2, 3, 4, 5];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ids,
    });

    const result = await fetchTopStoryIds();
    expect(result).toEqual(ids);
  });

  test('fetch failure returns empty array', async () => {
    global.fetch.mockRejectedValue(new Error('network error'));
    const result = await fetchTopStoryIds();
    expect(result).toEqual([]);
  });

  test('calls the correct URL', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await fetchTopStoryIds();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
  });
});

// ─── fetchTopStories ────────────────────────────────────────────────

describe('fetchTopStories', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  function mockFetch(topIds, storyMap) {
    global.fetch.mockImplementation(async (url) => {
      if (url.includes('topstories.json')) {
        return { ok: true, json: async () => topIds };
      }
      const match = url.match(/item\/(\d+)\.json/);
      if (match) {
        const id = Number(match[1]);
        if (storyMap[id] === null) {
          return { ok: true, json: async () => null };
        }
        if (storyMap[id] === undefined) {
          return { ok: false, status: 404 };
        }
        return { ok: true, json: async () => storyMap[id] };
      }
      return { ok: false, status: 404 };
    });
  }

  test('with count=10, fetches 10 stories and returns sanitized array', async () => {
    const ids = Array.from({ length: 20 }, (_, i) => i + 1);
    const storyMap = {};
    ids.forEach((id) => {
      storyMap[id] = { id, title: `Story ${id}`, by: 'author', score: id * 10 };
    });

    mockFetch(ids, storyMap);
    const result = await fetchTopStories(10);

    expect(result).toHaveLength(10);
    expect(result[0].title).toBe('Story 1');
    // Check sanitized defaults applied
    expect(result[0].kids).toEqual([]);
    expect(result[0].url).toBeNull();
  });

  test('API returns fewer than requested count', async () => {
    const ids = [1, 2, 3];
    const storyMap = {
      1: { id: 1, title: 'A' },
      2: { id: 2, title: 'B' },
      3: { id: 3, title: 'C' },
    };

    mockFetch(ids, storyMap);
    const result = await fetchTopStories(10);

    expect(result).toHaveLength(3);
  });

  test('one story fetch failing is filtered out', async () => {
    const ids = [1, 2, 3];
    const storyMap = {
      1: { id: 1, title: 'A' },
      2: undefined, // will cause 404
      3: { id: 3, title: 'C' },
    };

    mockFetch(ids, storyMap);
    const result = await fetchTopStories(10);

    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual([1, 3]);
  });

  test('all fetches failing returns empty array', async () => {
    const ids = [1, 2, 3];
    mockFetch(ids, {}); // all undefined → 404

    const result = await fetchTopStories(10);
    expect(result).toEqual([]);
  });
});

// ─── fetchCommentsWithReplies ───────────────────────────────────────

describe('fetchCommentsWithReplies', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  function mockFetchItems(itemMap) {
    global.fetch.mockImplementation(async (url) => {
      const match = url.match(/item\/(\d+)\.json/);
      if (match) {
        const id = Number(match[1]);
        if (itemMap[id]) {
          return { ok: true, json: async () => itemMap[id] };
        }
        return { ok: false, status: 404 };
      }
      return { ok: false, status: 404 };
    });
  }

  test('empty kidIds array returns []', async () => {
    const result = await fetchCommentsWithReplies([]);
    expect(result).toEqual([]);
  });

  test('null kidIds returns []', async () => {
    const result = await fetchCommentsWithReplies(null);
    expect(result).toEqual([]);
  });

  test('maxDepth=0 does not recursively fetch kids', async () => {
    mockFetchItems({
      10: { id: 10, text: 'Top comment', kids: [20] },
    });

    const result = await fetchCommentsWithReplies([10], 0);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Top comment');
    expect(result[0].replies).toEqual([]);
    // Only one fetch call (for comment 10), not for child 20
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('maxDepth=1 fetches one level of replies', async () => {
    mockFetchItems({
      10: { id: 10, text: 'Top comment', kids: [20, 30] },
      20: { id: 20, text: 'Reply 1' },
      30: { id: 30, text: 'Reply 2' },
    });

    const result = await fetchCommentsWithReplies([10], 1);
    expect(result).toHaveLength(1);
    expect(result[0].replies).toHaveLength(2);
    expect(result[0].replies[0].text).toBe('Reply 1');
    expect(result[0].replies[1].text).toBe('Reply 2');
  });

  test('deleted comment (no text field) has text set to "[deleted]"', async () => {
    mockFetchItems({
      10: { id: 10, deleted: true }, // no text field
    });

    const result = await fetchCommentsWithReplies([10]);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('[deleted]');
  });

  test('comment with no kids has empty replies array', async () => {
    mockFetchItems({
      10: { id: 10, text: 'A comment' },
    });

    const result = await fetchCommentsWithReplies([10]);
    expect(result).toHaveLength(1);
    expect(result[0].replies).toEqual([]);
  });

  test('comment fetch failure filters out that comment', async () => {
    mockFetchItems({
      10: { id: 10, text: 'Good comment' },
      // 20 not in map → 404
    });

    const result = await fetchCommentsWithReplies([10, 20]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(10);
  });
});
