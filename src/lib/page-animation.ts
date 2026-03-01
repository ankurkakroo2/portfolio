"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "animated-pages";

function hasAnimated(key: string): boolean {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(key);
  } catch {
    return false;
  }
}

function markAnimated(key: string) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(key)) {
      list.push(key);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // sessionStorage unavailable (SSR, private mode edge cases)
  }
}

export function usePageAnimation(key: string) {
  const [shouldAnimate] = useState(() => !hasAnimated(key));

  useEffect(() => {
    markAnimated(key);
  }, [key]);

  return shouldAnimate;
}
