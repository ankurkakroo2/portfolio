export interface ChatMessage {
    role: string;
    content: string;
}

export function validateMessages(messages: unknown): messages is ChatMessage[] {
    if (!Array.isArray(messages)) return false;
    if (messages.length === 0 || messages.length > 50) return false;

    return messages.every(
        (msg) =>
            typeof msg === 'object' &&
            msg !== null &&
            typeof (msg as ChatMessage).role === 'string' &&
            typeof (msg as ChatMessage).content === 'string' &&
            ['user', 'assistant', 'system'].includes((msg as ChatMessage).role) &&
            (msg as ChatMessage).content.length <= 4000
    );
}

// Simple in-memory rate limiter (per-key, resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const RATE_LIMIT_MAX = 20; // requests per window
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export function isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT_MAX;
}

export function resetRateLimits(): void {
    rateLimitMap.clear();
}
