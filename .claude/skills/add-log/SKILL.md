---
name: add-log
description: Creates weekly progress logs that read like thinking out loud. Chaotic but readable. Mix of short punchy sentences and longer thoughts. Triggers on "add log", "log entry", "weekly log", "activity log", or whenever you need to document the week.
---

# Weekly Progress Logger

So you built stuff this week. Or debugged it. Maybe both. This skill captures it in a way that actually sounds like you thinking, not like HR wrote it.

## How to Use

Ask me: `/add-log` or "add a log entry for this week"

I'll ask for three things:
1. What actually happened (dump URLs, code references, folder links, raw context welcome)
2. Why you were doing it (the real reason, not corporate-speak)
3. What stuck with you (what you learned, what surprised you, what made you go "oh *that's* how that works")

## Writing Style (This is Important)

The logs follow a specific voice. Think: **thinking out loud while typing.**

### Sentence Structure
Mix short punchy sentences with longer ones. This creates rhythm and feels natural.

**Short sentences for impact:**
- "Went deep into LLMs. Proper deep."
- "Why?"
- "In practice? Garbage."
- "Chunk size selection? Feels like art. Pure vibes."

**Longer sentences for context:**
- "Like, sat down with Andrej Karpathy's video and didn't surface for hours."
- "Once you understand *why* embeddings work (semantic compression of meaning), debugging gets way faster."

### Tone Elements
- **Conversational asides**: "(mistake? feature? still unclear)", "if you want to follow the rabbit holes"
- **Self-questioning**: Ask rhetorical questions. "Why?" "Then what?" "In practice?"
- **Sharp dry humor**: "Building on sand sucks." "Pure vibes." "Good problems to have."
- **Thinking markers**: "But here's the thing.", "Like,", "Then", "So"
- **Real frustration/joy**: Don't sanitize. "Garbage." "Elegant." "Weird."

### What NOT to Do
- **No em dashes (—).** Use periods, commas, colons, or parentheses instead. Em dashes read as AI slop.
- No corporate jargon ("enhanced metrics", "synergy", "stakeholders")
- No "I focused on..." (use "focused on" or just describe it)
- No forced structure or bullet lists
- No polish that sounds like LinkedIn
- No "learnings" or "takeaways" labels, just say what you learned

### Avoiding Redundancy
**Before writing a new log, scan previous logs for overused phrases and patterns.**

Common phrases to watch for (vary or avoid if used recently):
- "Proper deep" / "Proper good"
- "Good problems to have"
- "Building on sand sucks"
- "Pure vibes"
- "Wild times"
- Starting sentences with "Like," too frequently
- Excessive use of "Garbage" / "Elegant"
- "The real takeaway" / "Here's the thing"

**Strategy**: If you spot a phrase used in the last 2-3 logs, find fresh language that conveys the same energy. Keep the voice consistent but the vocabulary rotating.

### Structure (Loose, Not Rigid)
Just start writing. No heading. Straight into the prose.

Paragraph 1: What happened (the work, the exploration, the building)
Paragraph 2: Why it mattered (the real reason, the intent)
Paragraph 3: What stuck (the chaos, the contradictions, the real insight)

But honestly? Let it flow. If it needs 4 paragraphs, do 4. If 2 works, do 2.

## Example (Reference)

Went deep into LLMs. Proper deep. Like, sat down with Andrej Karpathy's 'Intro to LLMs' and didn't surface for hours. The whole pretraining flow: tokenization, embeddings in high-dimensional space, transformers doing attention, softmax sampling. Then post-training, where the magic happens. RLHF, hallucinations, fine-tuning. The entire spectrum.

Why? Building on sand sucks. If you're going to touch LLMs, the mental model comes first. Not the 'throw a prompt at the API and pray' version. The actual version. Layer by layer.

Then I built stuff. Started with embeddings (OpenAI's text-embedding-3-small), realized I needed vector similarity so I implemented cosine vs Euclidean, set up ChromaDB, tested chunking strategies because I was curious (mistake? feature? unclear). Glued it into an end-to-end RAG pipeline.

Real takeaway: theory and code don't hold hands. Chunking strategies brilliant on a whiteboard? Garbage in practice. But once you understand *why* embeddings work, debugging gets fast. You know what lever to pull. Also made me want to understand RL and DPO. There's a lot here. Good problems to have."

---

**Length**: ~1 page. Don't force it shorter or longer. Natural length.

**Links**: Weave URLs naturally into sentences, don't list them separately.

**Vibe**: You explaining your week to someone who actually cares. Sharp. Honest. Sometimes chaotic. Always readable.

---

Ready? `/add-log`
