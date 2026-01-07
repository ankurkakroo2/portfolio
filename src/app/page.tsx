"use client";

import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative">
        <Hero delay={0} />
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
        <Experience delay={0.5} />
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
        <Skills delay={1.0} />
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
        <Education delay={1.5} />

        <footer className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
