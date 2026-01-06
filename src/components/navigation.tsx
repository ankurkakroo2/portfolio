"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 right-6 z-50 flex items-center gap-4 px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg transition-colors duration-300">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors duration-200 hover:text-black dark:hover:text-white ${pathname === "/"
          ? "text-black dark:text-white"
          : "text-neutral-500 dark:text-neutral-400"
          }`}
      >
        Home
      </Link>
      <Link
        href="/logs"
        className={`text-sm font-medium transition-colors duration-200 hover:text-black dark:hover:text-white ${pathname === "/logs"
          ? "text-black dark:text-white"
          : "text-neutral-500 dark:text-neutral-400"
          }`}
      >
        Log
      </Link>
      <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
      <ThemeToggle />
    </nav>
  );
}
