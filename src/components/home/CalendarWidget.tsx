"use client";

import { useState, useEffect } from "react";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
const WEEKDAY_CN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default function CalendarWidget() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!today) return <div className="glass-card-static squircle h-48" />;

  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-4">
      <p className="mb-3 text-xs" style={{ color: "var(--color-secondary)" }}>
        {year}/{String(month + 1).padStart(2, "0")}/{String(date).padStart(2, "0")}{" "}
        {WEEKDAY_CN[today.getDay()]}
      </p>
      <div className="grid grid-cols-7 text-center text-xs">
        {WEEKDAYS.map((d, i) => (
          <span
            key={d}
            className="py-1 font-medium"
            style={{
              color: i === 3 ? "var(--color-brand)" : "var(--color-secondary)",
            }}
          >
            {d}
          </span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className="mx-auto my-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors"
            style={
              d === date
                ? { background: "var(--color-brand)", color: "#fff", fontWeight: 600 }
                : { color: d ? "var(--color-primary)" : "transparent" }
            }
          >
            {d ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
