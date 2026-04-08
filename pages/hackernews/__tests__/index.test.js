jest.mock('../../../lib/hackernews');

const { fetchTopStories, formatRelativeTime } = require('../../../lib/hackernews');
const { getServerSideProps } = require('../index');

describe('getServerSideProps', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns stories in props with pre-computed timeAgo', async () => {
    const mockStories = [
      {
        id: 1,
        title: 'Test Story',
        by: 'testuser',
        score: 100,
        descendants: 25,
        url: 'https://example.com',
        kids: [],
        text: null,
        time: 1700000000,
      },
      {
        id: 2,
        title: 'Another Story',
        by: 'anotheruser',
        score: 50,
        descendants: 10,
        url: 'https://example.org',
        kids: [],
        text: null,
        time: 1699999000,
      },
    ];

    fetchTopStories.mockResolvedValue(mockStories);
    formatRelativeTime.mockReturnValue('5 hours ago');

    const result = await getServerSideProps();

    expect(fetchTopStories).toHaveBeenCalledWith(10);
    expect(result.props.stories).toHaveLength(2);
    expect(result.props.stories[0].timeAgo).toBe('5 hours ago');
    expect(result.props.stories[1].timeAgo).toBe('5 hours ago');
    expect(formatRelativeTime).toHaveBeenCalledWith(1700000000);
    expect(formatRelativeTime).toHaveBeenCalledWith(1699999000);
  });

  test('returns empty stories array when fetchTopStories returns []', async () => {
    fetchTopStories.mockResolvedValue([]);

    const result = await getServerSideProps();

    expect(fetchTopStories).toHaveBeenCalledWith(10);
    expect(result).toEqual({ props: { stories: [] } });
  });
});
