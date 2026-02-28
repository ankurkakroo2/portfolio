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

const LEVEL_COLORS = {
  light: ["#ebedf0", "#c6cdd5", "#93a1b0", "#607080", "#2d3a4a"],
  dark: ["#161b22", "#1e2730", "#2e3a48", "#4a5e73", "#8bacc7"],
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

  for (let col = 0; col < weeks.length; col++) {
    const firstDay = weeks[col].find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: MONTHS[month],
          x: col * CELL_STEP,
        });
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

function SkeletonGraph({
  isDark,
  weekCount,
}: {
  isDark: boolean;
  weekCount: number;
}) {
  const skeletonColor = isDark ? SKELETON_COLORS.dark : SKELETON_COLORS.light;
  const days = 7;

  return (
    <div className="animate-pulse">
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
          {Array.from({ length: weekCount * days }).map((_, i) => (
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
  const [maxWeeks, setMaxWeeks] = useState(TOTAL_WEEKS);
  const mounted = useSyncExternalStore(
    (cb) => {
      cb();
      return () => {};
    },
    () => true,
    () => false
  );
  const graphRef = useRef<HTMLDivElement>(null);

  // Measure container width and calculate how many weeks fit
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const fits = Math.floor((width - DAY_LABEL_WIDTH) / CELL_STEP);
      setMaxWeeks(Math.max(Math.min(fits, TOTAL_WEEKS), 1));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const isDark = resolvedTheme === "dark";
  const colors = isDark ? LEVEL_COLORS.dark : LEVEL_COLORS.light;

  const allWeeks = useMemo(
    () => (data ? organizeIntoWeeks(data.contributions) : []),
    [data]
  );

  // Slice from the right so the most recent contributions are always visible
  const displayWeeks = useMemo(
    () => allWeeks.slice(-maxWeeks),
    [allWeeks, maxWeeks]
  );

  const monthLabels = useMemo(
    () => getMonthLabels(displayWeeks),
    [displayWeeks]
  );

  const totalContributions = useMemo(() => {
    if (!data?.contributions) return 0;
    return data.contributions.reduce((sum, c) => sum + c.count, 0);
  }, [data]);

  const handleCellEnter = useCallback(
    (e: React.MouseEvent, contribution: Contribution) => {
      if (!graphRef.current) return;
      const rect = graphRef.current.getBoundingClientRect();
      const cellRect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltip({
        x: cellRect.left - rect.left + CELL_SIZE / 2,
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

        <div ref={graphRef} className="relative overflow-hidden pb-4">
          {loading ? (
            <SkeletonGraph isDark={isDark} weekCount={maxWeeks} />
          ) : data && displayWeeks.length > 0 ? (
            <div>
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
                  {displayWeeks.flatMap((week, weekIdx) =>
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

              {/* Legend */}
              <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-neutral-400 dark:text-neutral-500">
                <span style={{ fontSize: 11 }}>Less</span>
                {colors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      borderRadius: 2,
                      backgroundColor: color,
                    }}
                  />
                ))}
                <span style={{ fontSize: 11 }}>More</span>
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
