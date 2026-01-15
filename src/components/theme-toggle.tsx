"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = resolvedTheme === "dark";

    const handleThemeChange = () => {
        // Use View Transitions API if supported for ultra-smooth theme change
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            (document as any).startViewTransition(() => {
                setTheme(isDark ? "light" : "dark");
            });
        } else {
            setTheme(isDark ? "light" : "dark");
        }
    };

    return (
        <button
            onClick={handleThemeChange}
            className="relative rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 0 : 1,
                    rotate: isDark ? 90 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Sun className="h-5 w-5" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 1 : 0,
                    rotate: isDark ? 0 : -90,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-center"
            >
                <Moon className="h-5 w-5" />
            </motion.div>
        </button>
    );
}
