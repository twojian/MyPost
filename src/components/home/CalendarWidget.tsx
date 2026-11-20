"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/** 某天的发布情况：篇数 + 当日唯一文章的 slug（多篇时为 null） */
export interface DayPosts {
  count: number;
  slug: string | null;
}

interface CalendarWidgetProps {
  /** 日期（YYYY-MM-DD）→ 当日发布情况，由首页服务端组件从 getAllPosts() 聚合后传入 */
  counts: Record<string, DayPosts>;
}

/** 行序固定为周一 → 周日，与网格的行方向一致 */
const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];
/** 只给 一 / 三 / 五 / 日 出标签，避免 7 行小格子旁文字糊成一片 */
const SHOWN_WEEKDAY_INDEX = new Set([0, 2, 4, 6]);

const TOTAL_WEEKS = 52;
/** 卡片宽 328px 一屏放不下 52 列，按上下两段各 26 周渲染；两段合并即完整 52 周 */
const BLOCK_WEEKS = 26;
const BLOCKS = [0, BLOCK_WEEKS];

interface DayCell {
  /** YYYY-MM-DD */
  key: string;
  count: number;
  /** 当日唯一文章的 slug，多篇或零篇为 null */
  slug: string | null;
  /** 0 = 无更新，1~4 为色阶 */
  level: number;
  /** 未来日期（本周今天之后），渲染为空格 */
  future: boolean;
  today: boolean;
}

interface WeekColumn {
  monday: Date;
  days: DayCell[];
}

interface MonthLabel {
  label: string;
  span: number;
}

function keyOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 当日篇数 → 色阶：1 / 2 / 3 / 4+ 四档，0 为空格 */
function levelOf(count: number): number {
  if (count <= 0) return 0;
  return count >= 4 ? 4 : count;
}

/** 以今天为终点，回溯 TOTAL_WEEKS 周（周一为一周之首） */
function buildWeeks(counts: Record<string, DayPosts>, today: Date): WeekColumn[] {
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  // getDay(): 周日 0 → 转成周一 0
  const offsetFromMonday = (cursor.getDay() + 6) % 7;
  const thisMonday = new Date(cursor);
  thisMonday.setDate(cursor.getDate() - offsetFromMonday);

  const weeks: WeekColumn[] = [];
  for (let w = TOTAL_WEEKS - 1; w >= 0; w -= 1) {
    const monday = new Date(thisMonday);
    monday.setDate(thisMonday.getDate() - w * 7);
    const days: DayCell[] = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + d);
      const key = keyOf(date);
      const hit = counts[key];
      const count = hit?.count ?? 0;
      const future = date.getTime() > cursor.getTime();
      days.push({
        key,
        count,
        slug: hit?.slug ?? null,
        level: future ? 0 : levelOf(count),
        future,
        today: date.getTime() === cursor.getTime(),
      });
    }
    weeks.push({ monday, days });
  }
  return weeks;
}

/**
 * 把一段周列切成「月份标签 + 覆盖周数」。
 * 跨月首周即打标签；只有 1 周的碎片月份并入上一个月，避免标签互相压字。
 */
function buildMonthLabels(weeks: WeekColumn[]): MonthLabel[] {
  const labels: (MonthLabel & { month: number })[] = [];
  weeks.forEach(({ monday }) => {
    const month = monday.getMonth();
    const last = labels[labels.length - 1];
    if (last && last.month === month) {
      last.span += 1;
      return;
    }
    labels.push({ label: `${month + 1}月`, span: 1, month });
  });

  for (let i = labels.length - 1; i > 0; i -= 1) {
    if (labels[i].span < 2) {
      labels[i - 1].span += labels[i].span;
      labels.splice(i, 1);
    }
  }
  return labels.map(({ label, span }) => ({ label, span }));
}

interface TipState {
  x: number;
  y: number;
  text: string;
}

export default function CalendarWidget({ counts }: CalendarWidgetProps) {
  const router = useRouter();
  const [today, setToday] = useState<Date | null>(null);
  const [tip, setTip] = useState<TipState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 「今天」只能客户端确定；effect 内同步 setState 会触发级联渲染（eslint 规则），延后到下一帧落状态
    const id = requestAnimationFrame(() => setToday(new Date()));
    return () => cancelAnimationFrame(id);
  }, []);

  const weeks = useMemo(
    () => (today ? buildWeeks(counts, today) : []),
    [counts, today],
  );

  const summary = useMemo(() => {
    if (!weeks.length) return { total: 0, active: 0, maxDay: 0 };
    let total = 0;
    let active = 0;
    let maxDay = 0;
    weeks.forEach(({ days }) =>
      days.forEach((day) => {
        if (day.future) return;
        if (day.count > 0) {
          active += 1;
          total += day.count;
          maxDay = Math.max(maxDay, day.count);
        }
      }),
    );
    return { total, active, maxDay };
  }, [weeks]);

  // 窄屏 52 列会溢出，挂载后默认滚到最右端，先看到最近几周
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  if (!today) return <div className="h-full w-full" aria-hidden />;

  const blockLabels = BLOCKS.map((offset) =>
    buildMonthLabels(weeks.slice(offset, offset + BLOCK_WEEKS)),
  );

  return (
    <div className="gh-heat">
      <div className="gh-heat-head">
        <span className="gh-heat-title">贡献热力图</span>
        <span className="gh-heat-sum">近 52 周</span>
      </div>

      <div className="gh-heat-body">
      <div className="gh-heat-scroll" ref={scrollRef}>
        <div className="gh-blocks">
          {BLOCKS.map((offset, blockIndex) => (
            <div className="gh-block" key={offset}>
              <span className="gh-block-corner" aria-hidden="true" />
              <div className="gh-months" aria-hidden="true">
                {blockLabels[blockIndex].map((month) => (
                  <span
                    key={month.label}
                    className="gh-month"
                    style={{ gridColumn: `span ${month.span}` }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>
              <div className="gh-weekdays" aria-hidden="true">
                {WEEKDAY_LABELS.map((label, index) => (
                  <span key={label} className="gh-weekday">
                    {SHOWN_WEEKDAY_INDEX.has(index) ? label : ""}
                  </span>
                ))}
              </div>
              <div
                className="gh-grid"
                role="grid"
                aria-label="近 52 周文章发布热力图"
              >
                {weeks
                  .slice(offset, offset + BLOCK_WEEKS)
                  .flatMap((week) =>
                    week.days.map((day) => (
                      <div
                        key={day.key}
                        role="gridcell"
                        className="gh-cell"
                        data-level={day.level}
                        data-future={day.future || undefined}
                        data-today={day.today || undefined}
                        aria-label={`${day.key}，${day.count > 0 ? `${day.count} 篇` : "无更新"}`}
                        data-link={day.count > 0 || undefined}
                        onClick={() => {
                          if (day.count === 0) return;
                          // 当日唯一文章 → 直达文章页；当日多篇无法定位 → 回退归档页
                          router.push(
                            day.slug ? `/posts/${day.slug}` : "/archives",
                          );
                        }}
                        onMouseEnter={(event) => {
                          const rect = event.currentTarget.getBoundingClientRect();
                          setTip({
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                            text:
                              day.count > 0
                                ? `${day.key} · ${day.count} 篇 · 点击查看`
                                : `${day.key} · 无更新`,
                          });
                        }}
                        onMouseLeave={() => setTip(null)}
                      />
                    )),
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="gh-heat-foot">
        <span className="gh-heat-eyebrow">少</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className="gh-swatch" data-level={level} />
        ))}
        <span className="gh-heat-eyebrow">多</span>
        <span className="gh-heat-note">按发布日期统计</span>
      </div>

      <div className="gh-stats">
        <span className="gh-stat">
          <b>{summary.total}</b> 篇
        </span>
        <span className="gh-stat-sep" aria-hidden="true" />
        <span className="gh-stat">
          活跃 <b>{summary.active}</b> 天
        </span>
        <span className="gh-stat-sep" aria-hidden="true" />
        <span className="gh-stat">
          单日最多 <b>{summary.maxDay}</b> 篇
        </span>
      </div>

      {tip && (
        <div
          className="gh-tip"
          role="tooltip"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}
