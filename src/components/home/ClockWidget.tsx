"use client";

import { useState, useEffect } from "react";

export default function ClockWidget() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      aria-label="当前时间"
    >
      <div
        className="relative flex items-center justify-center px-4 py-6"
        style={{
          borderRadius: "16px",
          background: "#dde1d8",
          boxShadow:
            "inset 0 2px 6px rgba(0,0,0,0.12), inset 0 -2px 4px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <span
          aria-hidden
          className="absolute select-none text-3xl sm:text-5xl"
          style={{
            fontFamily: '"DSEG7 Classic", "DSEG7-Classic", monospace',
            color: "rgba(60,72,60,0.10)",
            letterSpacing: "0.04em",
            fontWeight: 400,
          }}
        >
          88:88
        </span>
        <span
          className="relative text-3xl sm:text-5xl"
          style={{
            fontFamily: '"DSEG7 Classic", "DSEG7-Classic", monospace',
            color: "#3b4a3d",
            letterSpacing: "0.04em",
            fontWeight: 400,
          }}
        >
          {time || "00:00"}
        </span>
      </div>
    </div>
  );
}
