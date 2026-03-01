"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionData {
  total: Record<string, number>;
  contributions: Contribution[];
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const DAY_LABEL_WIDTH = 30;
const TOTAL_WEEKS = 53;
const MONTH_LABEL_MIN_GAP = CELL_STEP * 3;

const LEVEL_COLORS = {
  light: ["#ebedf0", "#aec8da", "#7ba0b8", "#4a7290", "#1e3a52"],
  dark: ["#2a303c", "#1e4d72", "#2d6d9a", "#4a92c2", "#7cc4ee"],
};

const SKELETON_COLORS = {
  light: "#f0f0f0",
  dark: "#1a1f27",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function organizeIntoWeeks(
  contributions: Contribution[]
): (Contribution | null)[][] {
  if (contributions.length === 0) return [];

  const weeks: (Contribution | null)[][] = [];
  let currentWeek: (Contribution | null)[] = [];

  const firstDate = new Date(contributions[0].date + "T00:00:00");
  const firstDay = firstDate.getDay();

  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (const contribution of contributions) {
    currentWeek.push(contribution);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function getMonthLabels(
  weeks: (Contribution | null)[][]
): { label: string; x: number }[] {
  const labels: { label: string; x: number }[] = [];
  let lastMonth = -1;
  let lastX = -Infinity;

  for (let col = 0; col < weeks.length; col++) {
    const firstDay = weeks[col].find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        const x = col * CELL_STEP;
        if (x - lastX >= MONTH_LABEL_MIN_GAP) {
          labels.push({ label: MONTHS[month], x });
          lastX = x;
        }
        lastMonth = month;
      }
    }
  }

  return labels;
}

function SkeletonGraph({ isDark }: { isDark: boolean }) {
  const skeletonColor = isDark ? SKELETON_COLORS.dark : SKELETON_COLORS.light;
  const days = 7;
  const gridWidth = DAY_LABEL_WIDTH + TOTAL_WEEKS * CELL_STEP;

  return (
    <div className="animate-pulse">
      <div style={{ width: gridWidth, minWidth: gridWidth }}>
        <div style={{ height: 18 }} />
        <div className="flex">
          <div style={{ width: DAY_LABEL_WIDTH, flexShrink: 0 }} />
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${days}, ${CELL_SIZE}px)`,
              gridAutoFlow: "column",
              gap: CELL_GAP,
            }}
          >
            {Array.from({ length: TOTAL_WEEKS * days }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 2,
                  backgroundColor: skeletonColor,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GitHubContributionsProps {
  delay?: number;
  shouldAnimate?: boolean;
}

export function GitHubContributions({
  delay = 0,
  shouldAnimate = true,
}: GitHubContributionsProps) {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const mounted = useSyncExternalStore(
    (cb) => {
      cb();
      return () => {};
    },
    () => true,
    () => false
  );
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/github-contributions")
      .then((res) => res.json())
      .then((result) => {
        if (result.contributions && result.contributions.length > 0) {
          setData(result);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Update edge fade visibility based on scroll position
  const updateFades = useCallback(() => {
    const el = graphRef.current;
    if (!el) return;
    const scrollLeft = Math.round(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    // No overflow at all — hide both fades
    if (maxScroll <= 0) {
      setShowLeftFade(false);
      setShowRightFade(false);
      return;
    }
    // Generous threshold so momentum scroll settling near the edge still hides the fade
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(maxScroll - scrollLeft > 10);
  }, []);

  // Scroll to the far right so the most recent contributions are the default view.
  // Double-rAF ensures the browser has laid out the full-width content before we
  // read scrollWidth and set scrollLeft.
  useEffect(() => {
    if (!loading && data && graphRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (graphRef.current) {
            graphRef.current.scrollLeft = graphRef.current.scrollWidth;
            updateFades();
          }
        });
      });
    }
  }, [loading, data, updateFades]);

  // Listen for scroll to update fades
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateFades, { passive: true });
    return () => el.removeEventListener("scroll", updateFades);
  }, [updateFades]);

  const isDark = resolvedTheme === "dark";
  const colors = isDark ? LEVEL_COLORS.dark : LEVEL_COLORS.light;

  const weeks = useMemo(
    () => (data ? organizeIntoWeeks(data.contributions) : []),
    [data]
  );

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const gridWidth = DAY_LABEL_WIDTH + weeks.length * CELL_STEP;

  if (!mounted) {
    return (
      <div className="particle-exclusion">
        <div style={{ height: 120 }} />
      </div>
    );
  }

  const fadeBg = isDark
    ? "from-[#0a0a0a]"
    : "from-white";

  return (
    <div className="particle-exclusion pb-12">
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        <div className="relative">
          {/* Left fade */}
          {showLeftFade && (
            <div
              className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r ${fadeBg} to-transparent z-10 pointer-events-none`}
            />
          )}
          {/* Right fade */}
          {showRightFade && (
            <div
              className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${fadeBg} to-transparent z-10 pointer-events-none`}
            />
          )}

          <div
            ref={graphRef}
            className="relative overflow-x-auto overflow-y-hidden pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading ? (
              <SkeletonGraph isDark={isDark} />
            ) : data && weeks.length > 0 ? (
              <div style={{ width: gridWidth, minWidth: gridWidth }}>
                {/* Month labels */}
                <div
                  className="relative text-xs text-neutral-400 dark:text-neutral-500"
                  style={{
                    height: 18,
                    marginLeft: DAY_LABEL_WIDTH,
                    fontFamily: "var(--font-geist), sans-serif",
                  }}
                >
                  {monthLabels.map((m, i) => (
                    <span
                      key={i}
                      className="absolute"
                      style={{ left: m.x, top: 0 }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                {/* Graph grid */}
                <div className="flex">
                  {/* Day labels */}
                  <div
                    className="flex flex-col text-xs text-neutral-400 dark:text-neutral-500"
                    style={{
                      width: DAY_LABEL_WIDTH,
                      flexShrink: 0,
                      fontFamily: "var(--font-geist), sans-serif",
                    }}
                  >
                    {DAY_LABELS.map((label, i) => (
                      <div
                        key={i}
                        style={{
                          height: CELL_SIZE,
                          marginBottom: i < 6 ? CELL_GAP : 0,
                          lineHeight: `${CELL_SIZE}px`,
                          fontSize: 11,
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Cells */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
                      gridAutoFlow: "column",
                      gap: CELL_GAP,
                    }}
                  >
                    {weeks.flatMap((week, weekIdx) =>
                      week.map((day, dayIdx) => (
                        <div
                          key={`${weekIdx}-${dayIdx}`}
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: 2,
                            backgroundColor: day
                              ? colors[day.level]
                              : "transparent",
                            transition: "background-color 0.15s ease",
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">
                Unable to load contribution data
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
