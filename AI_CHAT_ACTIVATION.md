# AI Chat Activation Guide

## ✅ What's Ready

I've implemented a **free, text-based AI chat** for your portfolio! Here's what's done:

- ✅ Chat API route (`src/app/api/chat/route.ts`)
- ✅ Chat widget component (`src/components/chat-widget.tsx`)
- ✅ Integration in layout (commented out)
- ✅ Knowledge base from your resume
- ✅ Custom personality and communication style

## 🚀 Quick Activation (5 minutes)

### Step 1: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up (you'll get **$5 free credits**)
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-`)

### Step 2: Add API Key to Environment

Create `.env.local` in your project root:

```bash
OPENAI_API_KEY=sk-your-key-here
```

**Important**: This file is already in `.gitignore` - your key will never be committed!

### Step 3: Activate the Widget

Edit `src/app/layout.tsx`:

**Uncomment these two lines:**

```tsx
// Line 2: Uncomment this
import { ChatWidget } from "@/components/chat-widget";

// Line 42-43: Uncomment this
<ChatWidget />
```

### Step 4: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 5: Test!

1. Go to `http://localhost:3000`
2. Click the chat button (bottom-right)
3. Ask: "What's your experience with platform engineering?"

## 💰 Cost

- **Free credits**: $5 (lasts 3-6 months for portfolio traffic)
- **After credits**: ~$0.002 per conversation
- **Typical monthly cost**: $2-5 for light usage

## 🎨 What It Looks Like

The chat widget:
- Floats in bottom-right corner
- Matches your black/white theme
- Smooth animations
- Mobile-responsive
- Knows all your resume content

## 🧠 What It Knows

The AI has access to:
- Your full resume (from `data.ts`)
- Your communication style
- Your philosophy and approach
- All your experience and skills

It will:
- Answer questions about your background
- Share your philosophy on engineering
- Be honest when it doesn't know something
- Maintain your professional tone

## 🔧 Customization

### Change the greeting

Edit `src/components/chat-widget.tsx` line 46-54

### Adjust personality

Edit `src/app/api/chat/route.ts` line 44-70

### Add more knowledge

Add content to the `knowledgeBase` variable in `route.ts`

## ❓ Troubleshooting

**Chat button doesn't appear?**
- Check that you uncommented both lines in `layout.tsx`
- Restart dev server

**"API key not found" error?**
- Check `.env.local` exists in project root
- Verify the key starts with `sk-`
- Restart dev server after adding `.env.local`

**Responses are slow?**
- Normal! Streaming responses take 2-5 seconds
- Using `gpt-3.5-turbo` for speed and cost

**Want to add rate limiting?**
- Let me know and I'll help implement it

## 📝 Next Steps

After activation:
1. Test with various questions
2. Refine the system prompt if needed
3. Add more knowledge to make it smarter
4. Consider adding voice later (Fish Audio for $8/mo)

---

**Ready to activate?** Just follow steps 1-4 above!
