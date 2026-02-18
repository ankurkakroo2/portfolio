"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-end pt-6 pr-6 relative z-50">
      <nav className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg transition-all duration-500 ease-in-out">
        <Link
          href="/"
          prefetch={true}
          className={`text-sm font-medium transition-colors duration-500 ease-in-out hover:text-black dark:hover:text-white ${pathname === "/"
            ? "text-black dark:text-white"
            : "text-neutral-500 dark:text-neutral-400"
            }`}
        >
          Home
        </Link>
        <Link
          href="/logs"
          prefetch={true}
          className={`text-sm font-medium transition-colors duration-500 ease-in-out hover:text-black dark:hover:text-white ${pathname === "/logs"
            ? "text-black dark:text-white"
            : "text-neutral-500 dark:text-neutral-400"
            }`}
        >
          Log
        </Link>
        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 transition-colors duration-500 ease-in-out" />
        <ThemeToggle />
      </nav>
    </div>
  );
}
