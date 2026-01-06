# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

A modern portfolio website built with Next.js 16 featuring an interactive particle background, dark/light mode, and an optional AI chat assistant. The site displays professional resume information and includes an activity log feature that reads markdown files from the filesystem.

**Key Tech**: Next.js 16 (Turbopack), TypeScript, Tailwind CSS v4, Framer Motion, React 19

---

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server (auto-reloads, Turbopack)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint with ESLint
npm run lint

# Full dev workflow: build then start
npm run build && npm start
```

Development server runs on `http://localhost:3000` by default.

### Adding Logs with `/add-log` Skill

Use the `/add-log` skill to create weekly progress logs. It guides you through documenting what you shipped, why you built it, and what you learned. Create a log anytime by asking Claude Code:

```
/add-log
```

Or just mention "add a log entry for this week" and Claude will automatically use the skill. Paste URLs, folder links, or any context directly—the skill weaves it naturally into a casual, witty markdown entry in `src/content/logs/` with today's date as the filename.

---

## High-Level Architecture

### Pages & Routing
- **`/`** - Main portfolio page: Hero, Experience, Skills, Education sections (server-rendered with client components)
- **`/logs`** - Activity log page: displays markdown entries as a vertical timeline (server-rendered data, client-rendered UI)
- **`/api/chat`** - Optional AI chat endpoint (currently inactive, requires `OPENAI_API_KEY` in `.env.local`)

### Key Data Flow

**Resume Content**: `src/lib/data.ts` exports `RESUME_DATA` object containing name, contact, profile, skills, experience, and education. This is the single source of truth for portfolio content. All section components import and render from this data.

**Activity Logs**: Markdown files in `src/content/logs/` are read at server-render time:
1. Server calls `getLogs()` in `src/lib/logs.ts` which scans the logs directory
2. Files must follow naming convention: `YYYY-MM-DD.md`
3. Each file is parsed into a `LogEntry` object with date, filename, content, and timestamp
4. Server passes logs to `<LogsClient>` component (client-side) for rendering with theme support

### Component Architecture

**Layout Components**:
- `src/app/layout.tsx` - Root layout wrapping all pages with theme provider and fonts (Outfit, Geist)
- `src/components/theme-provider.tsx` - next-themes wrapper for dark/light mode with localStorage persistence
- `src/components/navigation.tsx` - Navigation bar with logo, links to pages, and theme toggle

**Page Sections** (imported and used in `src/app/page.tsx`):
- `src/components/sections/hero.tsx` - Introduction with cascading animations (uses `delay` prop)
- `src/components/sections/experience.tsx` - Work experience timeline
- `src/components/sections/skills.tsx` - Core and technical skills
- `src/components/sections/education.tsx` - Education history
- `src/components/sections/log-entry.tsx` - Single log entry renderer (used by logs page)

**Visual Effects**:
- `src/components/particle-background.tsx` - Canvas-based animated particle system with mouse following and scroll hiding. Uses theme to determine particle color.
- `src/components/ui/glass-card.tsx` - Reusable glass-morphism card component

**Animations**: Sections use Framer Motion with `delay` prop to cascade entrance animations. All delays are passed from parent and configured in seconds.

---

## Important Patterns & Conventions

### Data Updates
To update portfolio content, edit `src/lib/data.ts` - this is the only place to change resume data. All sections automatically pick up changes.

### Activity Logs
Add new log entries by creating markdown files in `src/content/logs/` with naming pattern `YYYY-MM-DD.md`. The log page auto-discovers and sorts them newest-first.

### Styling
- Tailwind CSS v4 with PostCSS
- Dark mode via `dark:` classes and next-themes
- Color scheme defined in `src/app/globals.css` (CSS custom properties)
- Glass-morphism effects use transparency and backdrop blur
- Responsive breakpoints: mobile-first, uses `md:` breakpoint

### Client vs Server
- Pages use `"use client"` where needed (sections with animations, interactive components)
- Data fetching (`getLogs()`) happens server-side in page components
- Pass serializable data to client components

### TypeScript
- Strict mode enabled
- Path alias `@/*` maps to `src/*`
- Interfaces defined in files that use them (e.g., `LogEntry` in `logs.ts`)

---

## Environment & Optional Features

### AI Chat (Inactive by Default)
The optional AI chat requires:
1. `OPENAI_API_KEY` in `.env.local` (gitignored)
2. Uncomment lines in `src/app/layout.tsx` and `src/components/chat-widget.tsx`
3. Uses Vercel AI SDK + OpenAI (dependencies already installed)
4. Chat route: `/api/chat`

See `AI_CHAT_ACTIVATION.md` for detailed setup.

### Build & Deployment
- Next.js automatic static generation for pages with no dynamic content
- Vercel (recommended) or Netlify deployment supported
- Images optimized with Next.js Image component
- CSS processed by Tailwind CSS v4

---

## Testing & Linting

Currently no test framework configured. ESLint uses Next.js recommended rules (core-web-vitals + TypeScript). Run `npm run lint` to check code.

---

## File Structure Quick Reference

```
src/
├── app/
│   ├── api/chat/route.ts        # AI chat endpoint (optional)
│   ├── logs/
│   │   ├── page.tsx             # Logs page (server)
│   │   └── logs-client.tsx       # Logs renderer (client)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles & colors
├── components/
│   ├── sections/                # Page sections (hero, experience, skills, education)
│   ├── ui/                      # Reusable UI components
│   ├── particle-background.tsx  # Canvas particle effect
│   ├── theme-provider.tsx       # Theme setup
│   ├── theme-toggle.tsx         # Dark/light toggle button
│   ├── navigation.tsx           # Nav bar
│   └── chat-widget.tsx          # AI chat (optional)
├── content/
│   └── logs/                    # Markdown activity log files (YYYY-MM-DD.md)
└── lib/
    ├── data.ts                  # Resume data (RESUME_DATA export)
    ├── logs.ts                  # Log file reading & parsing
    └── utils.ts                 # Utility functions (clsx, cn helpers)
```
