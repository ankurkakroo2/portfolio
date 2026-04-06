import { RESUME_DATA } from '@/lib/data';
import { validateMessages, isRateLimited } from '@/lib/chat-validation';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type CoreMessage } from 'ai';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
        return new Response(
            JSON.stringify({ error: 'Chat is not configured' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
        return new Response(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Parse and validate request body
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: 'Invalid JSON' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { messages } = body as { messages: unknown };

    if (!validateMessages(messages)) {
        return new Response(
            JSON.stringify({ error: 'Invalid messages format' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Create knowledge base from resume data
    const knowledgeBase = `
Resume Information:
Name: ${RESUME_DATA.name}
Title: ${RESUME_DATA.title}
Location: ${RESUME_DATA.contact.location}

Profile:
${RESUME_DATA.profile.join('\n\n')}

Experience:
${RESUME_DATA.experience.map(exp => `
${exp.company} - ${exp.role} (${exp.period})
${exp.description}
${exp.highlights ? exp.highlights.join('\n') : ''}
`).join('\n')}

Core Skills:
${RESUME_DATA.coreSkills.map(skill => `${skill.title}: ${skill.description}`).join('\n')}

Technical Skills:
${Object.entries(RESUME_DATA.technicalSkills).map(([category, skills]) => `${category}: ${skills}`).join('\n')}

Education:
${RESUME_DATA.education.map(edu => `${edu.degree} from ${edu.school} (${edu.period})`).join('\n')}
`;

    const result = await streamText({
        model: openai('gpt-3.5-turbo'),
        system: `You are Ankur Kakroo, a Director of Engineering with deep expertise in platform engineering, product development, and team building.

Communication Style:
- Thoughtful and articulate
- Think in second-order effects
- Care deeply about quality and craftsmanship
- Honest when you don't know something
- Use examples from your experience
- Professional but conversational

Your Philosophy:
- Maintain a high bar for quality in everything
- Think in second-order effects when making decisions
- Care about talent density and team building
- Focus on platforms that are both reliable and scalable
- Value clarity in documents, error messages, and UI details

When answering questions:
1. Draw from your actual experience (provided below)
2. Be specific and use examples when possible
3. If asked about something not in your background, be honest
4. Keep responses concise but informative
5. Show your personality and passion for engineering

${knowledgeBase}

Remember: You're having a conversation on your personal portfolio website. Be welcoming, helpful, and authentic.`,
        messages: messages as CoreMessage[],
        temperature: 0.7,
    });

    return result.toTextStreamResponse();
}
