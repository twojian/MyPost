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
      <div className="clock-lcd relative flex items-center justify-center px-4 py-6">
        <span aria-hidden className="clock-lcd-ghost absolute select-none text-5xl">
          88:88
        </span>
        <span className="clock-lcd-digits relative text-5xl">
          {time || "00:00"}
        </span>
      </div>
    </div>
  );
}
