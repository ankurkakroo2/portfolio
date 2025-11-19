# Portfolio Website

A modern, elegant portfolio website built with Next.js 16, featuring interactive particle effects, dark/light mode, and optional AI chat.

## ✨ Features

- **Interactive Particle Background** - Subtle shimmer effect that responds to mouse movement and hides during scroll
- **Dark/Light Mode** - Smooth theme switching with system preference detection
- **Responsive Design** - Mobile-first approach with elegant typography
- **Cascading Animations** - Smooth section entrance animations
- **AI Chat (Optional)** - Text-based AI assistant powered by OpenAI (currently inactive)

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.3 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Theme**: next-themes
- **AI**: Vercel AI SDK + OpenAI (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # AI chat API (inactive)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── sections/          # Page sections
│   ├── particle-background.tsx
│   ├── theme-toggle.tsx
│   └── chat-widget.tsx    # AI chat (inactive)
└── lib/
    ├── data.ts            # Resume content
    └── utils.ts           # Utilities
```

## 🎨 Customization

### Update Content

Edit `src/lib/data.ts` to update your:
- Name, title, contact info
- Profile/bio
- Work experience
- Skills
- Education

### Change Colors

Edit `src/app/globals.css` to customize the color scheme.

### Activate AI Chat

See `AI_CHAT_ACTIVATION.md` for instructions on enabling the optional AI chat feature.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Deploy!

## 📝 Environment Variables

If you activate the AI chat feature, create a `.env.local` file:

```bash
OPENAI_API_KEY=sk-your-key-here
```

**Note**: This file is gitignored and won't be committed.

## 🎯 Performance

- Static Site Generation (SSG)
- Optimized images
- Minimal JavaScript bundle
- Efficient particle rendering
- Passive scroll listeners

## 📄 License

MIT

## 👤 Author

Ankur Kakroo
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

---

Built with ❤️ using Next.js
