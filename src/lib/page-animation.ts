"use client";

import { useEffect, useState } from "react";

const animatedPages = new Set<string>();

export function usePageAnimation(key: string) {
  const [shouldAnimate] = useState(() => !animatedPages.has(key));

  useEffect(() => {
    animatedPages.add(key);
  }, [key]);

  return shouldAnimate;
}
