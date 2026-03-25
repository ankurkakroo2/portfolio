"use client";

import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { usePageAnimation } from "@/lib/page-animation";

export default function AboutPage() {
  const shouldAnimate = usePageAnimation("about");

  return (
    <>
      <main id="main-content" className="min-h-screen transition-colors duration-300 relative">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
          <Experience delay={0} shouldAnimate={shouldAnimate} />
          <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
          <Skills delay={0.5} shouldAnimate={shouldAnimate} />
          <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
          <Education delay={1.0} shouldAnimate={shouldAnimate} />
        </div>
      </main>
      <footer className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <p>© {new Date().getFullYear()} Ankur Kakroo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
