# Log Tab Implementation Plan

## Overview
Add a dedicated `/logs` page to the portfolio that displays weekly activity logs in a clean, timeline-style format. Logs will be authored in Markdown files and rendered automatically with consistent styling that matches the existing portfolio aesthetic.

---

## Design Philosophy
- **Maintain existing aesthetic:** Glass morphism cards, elegant typography, particle background
- **Timeline presentation:** Chronological display (newest first) with date headers
- **Minimalist approach:** Clean, readable, no clutter
- **No pagination:** Simple scroll-based timeline
- **Static rendering:** MD files render directly, no database or CMS needed

---

## Wireframes

### Desktop View (1024px+)
```
┌─────────────────────────────────────────────────────────────────┐
│                                    [Home]  [Logs]  [🌙] ←──────│
│                                                      (top-right) │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  ACTIVITY LOG                                            │  │
│   │  ────────────────────────────────────────────────────    │  │
│   │  A running log of what I've been working on             │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  January 3, 2026                              [GlassCard]│  │
│   │  ─────────────────────                                   │  │
│   │                                                           │  │
│   │  This week I focused on improving our deployment         │  │
│   │  pipeline by implementing automated rollback             │  │
│   │  mechanisms. The team noticed a 40% reduction in         │  │
│   │  incident response time.                                 │  │
│   │                                                           │  │
│   │  I also spent time mentoring two junior engineers on     │  │
│   │  distributed systems architecture. We built a toy        │  │
│   │  consensus algorithm implementation to understand        │  │
│   │  Raft better.                                            │  │
│   │                                                           │  │
│   │  Weekend project: Started experimenting with Rust for    │  │
│   │  a CLI tool that helps analyze deployment metrics.       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  December 27, 2025                            [GlassCard]│  │
│   │  ─────────────────────                                   │  │
│   │                                                           │  │
│   │  Wrapped up Q4 planning with the leadership team...      │  │
│   │                                                           │  │
│   │  [Content continues...]                                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  December 20, 2025                            [GlassCard]│  │
│   │  ─────────────────────                                   │  │
│   │                                                           │  │
│   │  [Content continues...]                                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│   [Continue scrolling for more logs...]                         │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  © 2026 Ankur Kakroo. All rights reserved.              │  │
│   └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)
```
┌──────────────────────────┐
│     [Home] [Logs]   [🌙] │
│                           │
│ ┌───────────────────────┐ │
│ │ ACTIVITY LOG          │ │
│ │ ─────────────────     │ │
│ │ A running log of      │ │
│ │ what I've been        │ │
│ │ working on            │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ January 3, 2026       │ │
│ │ ───────────────       │ │
│ │                       │ │
│ │ This week I focused   │ │
│ │ on improving our      │ │
│ │ deployment pipeline   │ │
│ │ by implementing...    │ │
│ │                       │ │
│ │ [Full content]        │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ December 27, 2025     │ │
│ │ ───────────────       │ │
│ │ [Content...]          │ │
│ └───────────────────────┘ │
│                           │
│ [Scroll for more...]      │
└──────────────────────────┘
```

### Navigation Menu (New Component)
```
┌─────────────────────────────────────────────────────┐
│                           Home  Logs  [Theme Toggle] │
└─────────────────────────────────────────────────────┘
       ↑                    ↑     ↑
       │                    │     └─ New nav link to /logs
       │                    └─ Link to / (home)
       └─ Fixed top-right, z-50
          Glass morphism background when on logs page
          Minimal, elegant, matches theme toggle style
```

---

## File Structure

### New Files to Create
```
src/
├── app/
│   └── logs/
│       └── page.tsx              # Logs page component
├── components/
│   ├── navigation.tsx             # New navigation menu component
│   └── sections/
│       └── log-entry.tsx          # Individual log entry component
├── lib/
│   └── logs.ts                    # Utility to read and parse log files
└── content/
    └── logs/                      # Markdown log files directory
        ├── 2026-01-03.md
        ├── 2025-12-27.md
        └── 2025-12-20.md
```

### Files to Modify
```
src/
├── app/
│   ├── layout.tsx                 # Add Navigation component
│   └── page.tsx                   # Add Navigation component
```

---

## Implementation Details

### 1. Navigation Component
**File:** `src/components/navigation.tsx`

**Design:**
- Fixed position: `top-6 right-6 z-50`
- Flex row with theme toggle at the end
- Glass morphism background: `bg-white/80 dark:bg-black/80 backdrop-blur-md`
- Border: `border border-neutral-200/50 dark:border-neutral-800/50`
- Rounded: `rounded-full`
- Padding: `px-4 py-2`
- Gap between items: `gap-4`

**Features:**
- Active link highlighting (underline or color change)
- Smooth transitions on hover
- Integrates existing ThemeToggle component
- Matches glass card aesthetic

**Example Structure:**
```tsx
<nav className="fixed top-6 right-6 z-50 flex items-center gap-4 px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50">
  <Link href="/">Home</Link>
  <Link href="/logs">Logs</Link>
  <ThemeToggle />
</nav>
```

### 2. Logs Page
**File:** `src/app/logs/page.tsx`

**Layout:**
- Container: `max-w-4xl mx-auto px-6 md:px-12`
- Section padding: `py-20 md:py-28`
- Particle background: Same as home page
- Add `particle-exclusion` class to content areas

**Header Section:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4">
    Activity Log
  </h1>
  <p className="text-neutral-500 dark:text-neutral-400">
    A running log of what I've been working on
  </p>
</motion.div>
```

**Timeline Structure:**
- Vertical spacing: `space-y-8` or `space-y-12` between log entries
- Each entry wrapped in GlassCard component
- Staggered entrance animations (delay increases per entry)

### 3. Log Entry Component
**File:** `src/components/sections/log-entry.tsx`

**Props:**
```typescript
interface LogEntryProps {
  date: string;      // "January 3, 2026"
  content: string;   // Parsed HTML from markdown
  delay: number;     // Animation delay
}
```

**Structure:**
```tsx
<GlassCard delay={delay}>
  <h2 className="text-2xl font-serif font-light tracking-tight mb-4">
    {date}
  </h2>
  <div className="h-px w-20 bg-neutral-300 dark:bg-neutral-700 mb-6" />
  <div
    className="prose prose-neutral dark:prose-invert prose-p:leading-relaxed"
    dangerouslySetInnerHTML={{ __html: content }}
  />
</GlassCard>
```

**Typography:**
- Date header: `text-2xl font-serif font-light tracking-tight`
- Separator line: `h-px w-20 bg-neutral-300 dark:bg-neutral-700`
- Content: Use Tailwind Typography plugin or custom prose styles
- Paragraph spacing: `space-y-4`
- Line height: `leading-relaxed` (1.625)

### 4. Markdown Processing
**File:** `src/lib/logs.ts`

**Functionality:**
- Read all `.md` files from `src/content/logs/`
- Parse frontmatter or extract date from filename
- Convert markdown to HTML using a library (suggestions: `marked`, `remark`, or `next-mdx-remote`)
- Sort by date (newest first)
- Return array of log entries

**Example:**
```typescript
export interface LogEntry {
  date: string;        // Display date: "January 3, 2026"
  filename: string;    // "2026-01-03.md"
  content: string;     // Parsed HTML
  timestamp: Date;     // For sorting
}

export async function getLogs(): Promise<LogEntry[]> {
  // Read files from content/logs/
  // Parse markdown
  // Sort by date descending
  // Return entries
}
```

**Package to Add:**
- `marked` (lightweight) or `react-markdown` (already in dependencies!)

### 5. Sample Log Files

**File:** `src/content/logs/2026-01-03.md`
```markdown
This week I focused on improving our deployment pipeline by implementing automated rollback mechanisms. The team noticed a 40% reduction in incident response time, which has been a huge win for our on-call engineers.

I also spent time mentoring two junior engineers on distributed systems architecture. We built a toy consensus algorithm implementation to understand Raft better. There's something deeply satisfying about watching concepts click for someone else.

Weekend project: Started experimenting with Rust for a CLI tool that helps analyze deployment metrics. The borrow checker is both frustrating and enlightening. Coming from TypeScript, it's making me rethink how I approach state management.
```

**File:** `src/content/logs/2025-12-27.md`
```markdown
Wrapped up Q4 planning with the leadership team this week. We're doubling down on platform reliability in Q1, which means more investment in observability tooling and chaos engineering practices. Excited to see where this takes us.

Spent some time reviewing our interview process. We've been growing fast, and I want to make sure we're still hiring for the right traits: curiosity, ownership, and the ability to learn quickly. Updated our technical assessment to focus less on algorithm trivia and more on real-world problem solving.

Also shipped a small but impactful feature: automatic tagging of deployments with Jira tickets. This has made our post-mortems so much easier to trace back to the original context.
```

**File:** `src/content/logs/2025-12-20.md`
```markdown
Big milestone this week: our new API gateway went live in production. Six months of planning, building, and testing all came together. The cutover was surprisingly smooth, thanks to extensive feature flagging and gradual rollout. Only a handful of minor issues that were quickly patched.

Led a retrospective on the project with the team. Key learnings: investing in good local development environments pays dividends, and writing migration guides for internal teams is just as important as external documentation.

On the personal front, I've been reading "Staff Engineer: Leadership Beyond the Management Track" by Will Larson. Lots of resonant ideas about technical leadership and organizational impact. Thinking about how to apply some of these concepts to our team structure.
```

---

## Design Tokens & Styling Guide

### Colors (Matching Current Palette)
- **Background (Light):** `bg-white`
- **Background (Dark):** `bg-black`
- **Text Primary (Light):** `text-black`
- **Text Primary (Dark):** `text-white`
- **Text Secondary (Light):** `text-neutral-500`
- **Text Secondary (Dark):** `text-neutral-400`
- **Separator Line:** `bg-neutral-200 dark:bg-neutral-800`
- **Accent Line (shorter):** `bg-neutral-300 dark:bg-neutral-700`

### Typography
- **Page Title:** `text-4xl md:text-5xl font-serif font-light tracking-tight`
- **Date Header:** `text-2xl font-serif font-light tracking-tight`
- **Body Text:** `text-base leading-relaxed`
- **Description:** `text-neutral-500 dark:text-neutral-400`

### Spacing
- **Section Padding:** `py-20 md:py-28`
- **Container Horizontal:** `px-6 md:px-12`
- **Entry Spacing:** `space-y-12`
- **Paragraph Spacing:** `space-y-4`
- **Header Bottom Margin:** `mb-6`

### Animation
- **Initial State:** `opacity: 0, y: 20`
- **Animated State:** `opacity: 1, y: 0`
- **Duration:** `0.6s`
- **Stagger Delay:** `+0.1s` per entry (first: 0.2s, second: 0.3s, etc.)

---

## Technical Implementation Steps

### Phase 0: Git Branch Setup
1. Create new branch: `git checkout -b claude/portfolio-log`
2. All changes will be committed to this branch
3. Ready for PR/merge when complete

### Phase 1: Setup & Structure
1. Create `src/content/logs/` directory
2. Add 3 sample markdown files (2026-01-03.md, 2025-12-27.md, 2025-12-20.md)
3. Create `src/lib/logs.ts` utility file
4. Install/configure markdown parsing (react-markdown is already available)

### Phase 2: Navigation
1. Create `src/components/navigation.tsx`
2. Update `src/app/layout.tsx` to include Navigation
3. Update `src/app/page.tsx` to include Navigation
4. Style navigation to match glass morphism aesthetic

### Phase 3: Logs Page
1. Create `src/app/logs/page.tsx`
2. Implement page layout with ParticleBackground
3. Add page header section with title and description
4. Fetch and render log entries

### Phase 4: Log Entry Component
1. Create `src/components/sections/log-entry.tsx`
2. Implement GlassCard-wrapped entry with date header
3. Parse and render markdown content
4. Add staggered animations

### Phase 5: Polish & Testing
1. Test responsive design (mobile, tablet, desktop)
2. Verify dark/light theme consistency
3. Check animation smoothness
4. Test particle background exclusion
5. Verify navigation active states

---

## Expected User Experience

### Navigation Flow
1. User lands on homepage (unchanged experience)
2. User notices new "Logs" link in top-right navigation
3. Clicking "Logs" navigates to `/logs`
4. Smooth page transition with particle background continuity

### Logs Page Experience
1. Page loads with familiar particle background
2. Title and description fade in first
3. Log entries appear one by one with staggered animation
4. User scrolls to read older entries
5. Each entry is clearly separated, easy to scan
6. Date headers provide temporal context
7. Content is readable with good line height and spacing

### Visual Consistency
- Same particle background as homepage
- Same glass morphism cards
- Same typography and color palette
- Same theme toggle behavior
- Seamless aesthetic experience

---

## Future Enhancements (Not in Scope)
- Search/filter functionality
- Tag-based filtering
- RSS feed generation
- Automatic date formatting based on filename
- Archive page by year/month
- Pagination for very large log counts

---

## Success Criteria
✅ Logs page matches existing portfolio aesthetic perfectly
✅ Navigation is minimal and elegant
✅ Markdown files render correctly with proper formatting
✅ Timeline presentation is clean and scannable
✅ Mobile responsive design works smoothly
✅ Dark/light theme works consistently
✅ Animations are smooth and purposeful
✅ Three sample log entries demonstrate the format clearly

---

## Notes
- No database needed - static markdown files are perfect for this use case
- Easy to add new logs: just create a new `.md` file with date-based filename
- Content is version controlled alongside code
- Fast page loads with static generation
- SEO-friendly with proper meta tags
