// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'
import { validateMessages, isRateLimited, resetRateLimits, RATE_LIMIT_MAX } from '../chat-validation'

describe('validateMessages', () => {
  it('accepts valid messages', () => {
    expect(validateMessages([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
    ])).toBe(true)
  })

  it('accepts system messages', () => {
    expect(validateMessages([
      { role: 'system', content: 'You are helpful' },
      { role: 'user', content: 'Hello' },
    ])).toBe(true)
  })

  it('rejects non-array input', () => {
    expect(validateMessages('not an array')).toBe(false)
    expect(validateMessages(null)).toBe(false)
    expect(validateMessages(undefined)).toBe(false)
    expect(validateMessages(42)).toBe(false)
    expect(validateMessages({})).toBe(false)
  })

  it('rejects empty array', () => {
    expect(validateMessages([])).toBe(false)
  })

  it('rejects more than 50 messages', () => {
    const messages = Array.from({ length: 51 }, (_, i) => ({
      role: 'user',
      content: `Message ${i}`,
    }))
    expect(validateMessages(messages)).toBe(false)
  })

  it('accepts exactly 50 messages', () => {
    const messages = Array.from({ length: 50 }, (_, i) => ({
      role: 'user',
      content: `Message ${i}`,
    }))
    expect(validateMessages(messages)).toBe(true)
  })

  it('rejects invalid role', () => {
    expect(validateMessages([
      { role: 'admin', content: 'Hello' },
    ])).toBe(false)
  })

  it('rejects missing content', () => {
    expect(validateMessages([
      { role: 'user' },
    ])).toBe(false)
  })

  it('rejects missing role', () => {
    expect(validateMessages([
      { content: 'Hello' },
    ])).toBe(false)
  })

  it('rejects content longer than 4000 chars', () => {
    expect(validateMessages([
      { role: 'user', content: 'a'.repeat(4001) },
    ])).toBe(false)
  })

  it('accepts content exactly 4000 chars', () => {
    expect(validateMessages([
      { role: 'user', content: 'a'.repeat(4000) },
    ])).toBe(true)
  })

  it('rejects null messages in array', () => {
    expect(validateMessages([null])).toBe(false)
  })

  it('rejects non-string content', () => {
    expect(validateMessages([
      { role: 'user', content: 123 },
    ])).toBe(false)
  })
})

describe('isRateLimited', () => {
  beforeEach(() => {
    resetRateLimits()
  })

  it('allows first request', () => {
    expect(isRateLimited('test-ip')).toBe(false)
  })

  it('allows requests up to the limit', () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(isRateLimited('test-ip')).toBe(false)
    }
  })

  it('blocks requests over the limit', () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      isRateLimited('test-ip')
    }
    expect(isRateLimited('test-ip')).toBe(true)
  })

  it('tracks different IPs independently', () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      isRateLimited('ip-1')
    }
    expect(isRateLimited('ip-1')).toBe(true)
    expect(isRateLimited('ip-2')).toBe(false)
  })

  it('resets after clearing', () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      isRateLimited('test-ip')
    }
    expect(isRateLimited('test-ip')).toBe(true)
    resetRateLimits()
    expect(isRateLimited('test-ip')).toBe(false)
  })
})
