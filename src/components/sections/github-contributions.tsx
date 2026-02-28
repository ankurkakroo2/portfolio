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

interface TooltipData {
  x: number;
  y: number;
  date: string;
  count: number;
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const DAY_LABEL_WIDTH = 30;
const TOTAL_WEEKS = 53;
const MONTH_LABEL_MIN_GAP = CELL_STEP * 3; // skip label if closer than 3 weeks

const LEVEL_COLORS = {
  light: ["#ebedf0", "#c6cdd5", "#93a1b0", "#607080", "#2d3a4a"],
  dark: ["#1a2233", "#2a3a50", "#3d5570", "#5e80a0", "#a0c8e8"],
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
        // Skip if too close to previous label to prevent overlap
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
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

  // Scroll to the far right so the most recent contributions are the default view
  useEffect(() => {
    if (!loading && graphRef.current) {
      graphRef.current.scrollLeft = graphRef.current.scrollWidth;
    }
  }, [loading]);

  const isDark = resolvedTheme === "dark";
  const colors = isDark ? LEVEL_COLORS.dark : LEVEL_COLORS.light;

  const weeks = useMemo(
    () => (data ? organizeIntoWeeks(data.contributions) : []),
    [data]
  );

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const totalContributions = useMemo(() => {
    if (!data?.contributions) return 0;
    return data.contributions.reduce((sum, c) => sum + c.count, 0);
  }, [data]);

  const gridWidth = DAY_LABEL_WIDTH + weeks.length * CELL_STEP;

  const handleCellEnter = useCallback(
    (e: React.MouseEvent, contribution: Contribution) => {
      if (!graphRef.current) return;
      const rect = graphRef.current.getBoundingClientRect();
      const cellRect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltip({
        // Account for scroll position so tooltip aligns to the cell in scrollable content
        x:
          cellRect.left -
          rect.left +
          graphRef.current.scrollLeft +
          CELL_SIZE / 2,
        y: cellRect.top - rect.top - 8,
        date: contribution.date,
        count: contribution.count,
      });
    },
    []
  );

  const handleCellLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  if (!mounted) {
    return (
      <section className="py-12 particle-exclusion">
        <div style={{ height: 220 }} />
      </section>
    );
  }

  return (
    <section className="py-12 particle-exclusion">
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-2">
            Contributions
          </h2>
          {!loading && data && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              {totalContributions.toLocaleString()} contributions in the last
              year
            </motion.p>
          )}
          {loading && (
            <div className="h-5 w-64 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          )}
        </div>

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
                          cursor: day ? "pointer" : "default",
                        }}
                        onMouseEnter={
                          day
                            ? (e) => handleCellEnter(e, day)
                            : undefined
                        }
                        onMouseLeave={day ? handleCellLeave : undefined}
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

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute pointer-events-none z-20"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg px-3 py-2 text-xs whitespace-nowrap">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {tooltip.count} contribution
                  {tooltip.count !== 1 ? "s" : ""}{" "}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {formatDate(tooltip.date)}
                </p>
              </div>
              <div
                className="mx-auto w-2 h-2 bg-white dark:bg-neutral-900 border-b border-r border-neutral-200 dark:border-neutral-800"
                style={{
                  transform: "rotate(45deg) translateX(-50%)",
                  marginTop: -5,
                  marginLeft: "calc(50% - 4px)",
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
