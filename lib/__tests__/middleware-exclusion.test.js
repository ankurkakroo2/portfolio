describe('Middleware hackernews exclusion regex', () => {
  const hackernewsRegex = /^\/hackernews/

  it('should match /hackernews', () => {
    expect(hackernewsRegex.test('/hackernews')).toBe(true)
  })

  it('should match /hackernews/', () => {
    expect(hackernewsRegex.test('/hackernews/')).toBe(true)
  })

  it('should match /hackernews/12345', () => {
    expect(hackernewsRegex.test('/hackernews/12345')).toBe(true)
  })

  it('should match /hackernews/some-id', () => {
    expect(hackernewsRegex.test('/hackernews/some-id')).toBe(true)
  })

  it('should NOT match /', () => {
    expect(hackernewsRegex.test('/')).toBe(false)
  })

  it('should NOT match /post1', () => {
    expect(hackernewsRegex.test('/post1')).toBe(false)
  })

  it('should NOT match /docs/v19/globals', () => {
    expect(hackernewsRegex.test('/docs/v19/globals')).toBe(false)
  })
})
