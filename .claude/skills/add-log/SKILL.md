---
name: add-log
description: Creates weekly progress logs documenting what you shipped, why you built it, and what stuck with you. Triggers on "add log", "log entry", "weekly log", "activity log", or just whenever you feel like documenting the chaos.
---

# Weekly Progress Logger

So you built stuff this week. Or debugged it. Maybe both. This skill helps you capture that in a way that actually feels like you wrote it, not like you're filling out a performance review form at gunpoint.

When you're ready to log it, just ask me to add a log entry for the week. I'll ask you three things: what actually happened (dump URLs, links, whatever context you've got—I'll make it flow naturally), why you were doing it (the real reason, not the ticket summary), and what stuck with you (what you learned, what surprised you, what made you go "oh *that's* how that works").

The log gets dropped into `src/content/logs/` with today's date as the filename in YYYY-MM-DD.md format. It's paragraph-based, casual as hell, and should read like you wrote it over coffee while explaining your week to someone who actually cares.

Here's roughly how it'll look:

```markdown
# Week of [Date]

[Continuous prose about what happened, why it mattered, and what you learned. Links woven in naturally. No forced structure, just... you explaining your week.]
```

The vibe is: sharp, dry humor welcome. Real thoughts. Nothing that smells like it was optimized for LinkedIn. Keep it to about a page, but don't force it—if you've got more to say, say it.

A good log reads like this: "Refactored the particle background to use Canvas because the DOM was getting demolished on lower-end devices. Took way longer than expected because we also standardized naming conventions across the project. Funny how much faster you move when everyone's pulling from the same playbook. Learned that the real performance win isn't always code—sometimes it's just everyone knowing what variables are supposed to be called."

A bad log reads like this: "Performed performance optimization and established coding standards resulting in enhanced team efficiency metrics." (Please don't do that.)

---

Trigger: `/add-log` or just say "add a log entry for this week" and I'll know what's up.
