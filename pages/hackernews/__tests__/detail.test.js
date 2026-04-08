jest.mock('../../../lib/hackernews')

const { fetchItem, sanitizeStory, fetchCommentsWithReplies, formatRelativeTime } = require('../../../lib/hackernews')
const { getServerSideProps } = require('../[id]')

describe('StoryDetail getServerSideProps', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    formatRelativeTime.mockReturnValue('3 hours ago')
  })

  test('returns props with story and comments with pre-computed timeAgo', async () => {
    const rawStory = {
      id: 123,
      title: 'Test Story',
      by: 'testuser',
      score: 100,
      descendants: 5,
      url: 'https://example.com',
      kids: [1, 2, 3],
      time: 1700000000,
    }
    const sanitized = {
      ...rawStory,
      text: null,
    }
    const mockComments = [
      { id: 1, text: 'comment 1', by: 'user1', time: 1700000100, replies: [] },
      { id: 2, text: 'comment 2', by: 'user2', time: 1700000200, replies: [] },
    ]

    fetchItem.mockResolvedValue(rawStory)
    sanitizeStory.mockReturnValue(sanitized)
    fetchCommentsWithReplies.mockResolvedValue(mockComments)

    const result = await getServerSideProps({ params: { id: '123' } })

    expect(result.props.story.timeAgo).toBe('3 hours ago')
    expect(result.props.comments[0].timeAgo).toBe('3 hours ago')
    expect(result.props.comments[1].timeAgo).toBe('3 hours ago')
    expect(fetchItem).toHaveBeenCalledWith('123')
    expect(sanitizeStory).toHaveBeenCalledWith(rawStory)
    expect(fetchCommentsWithReplies).toHaveBeenCalledWith([1, 2, 3], 1)
  })

  test('returns notFound when fetchItem returns null', async () => {
    fetchItem.mockResolvedValue(null)

    const result = await getServerSideProps({ params: { id: '999' } })

    expect(result).toEqual({ notFound: true })
    expect(fetchItem).toHaveBeenCalledWith('999')
    expect(sanitizeStory).not.toHaveBeenCalled()
    expect(fetchCommentsWithReplies).not.toHaveBeenCalled()
  })

  test('does not call fetchCommentsWithReplies when story has no kids', async () => {
    const rawStory = {
      id: 456,
      title: 'No Kids Story',
      by: 'author',
      score: 50,
      descendants: 0,
      url: 'https://example.com',
      time: 1700000000,
    }
    const sanitized = {
      ...rawStory,
      kids: [],
      text: null,
    }

    fetchItem.mockResolvedValue(rawStory)
    sanitizeStory.mockReturnValue(sanitized)

    const result = await getServerSideProps({ params: { id: '456' } })

    expect(result.props.story.timeAgo).toBe('3 hours ago')
    expect(result.props.comments).toEqual([])
    expect(fetchCommentsWithReplies).not.toHaveBeenCalled()
  })

  test('calls fetchCommentsWithReplies with kids array when story has kids', async () => {
    const rawStory = {
      id: 789,
      title: 'Story With Kids',
      by: 'author2',
      score: 75,
      descendants: 3,
      url: 'https://example.com',
      kids: [10, 20, 30],
      time: 1700000000,
    }
    const sanitized = {
      ...rawStory,
      text: null,
    }
    const mockComments = [
      { id: 10, text: 'reply a', by: 'u1', time: 1700000100, replies: [] },
    ]

    fetchItem.mockResolvedValue(rawStory)
    sanitizeStory.mockReturnValue(sanitized)
    fetchCommentsWithReplies.mockResolvedValue(mockComments)

    const result = await getServerSideProps({ params: { id: '789' } })

    expect(fetchCommentsWithReplies).toHaveBeenCalledWith([10, 20, 30], 1)
    expect(result.props.comments[0].timeAgo).toBe('3 hours ago')
  })
})
