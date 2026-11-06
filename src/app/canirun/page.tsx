"use client";

import { useState } from "react";
import { Cpu, LayoutGrid, Scale, Trophy } from "lucide-react";

type TabKey = "models" | "devices" | "compare" | "tier";

const TABS: { key: TabKey; label: string; url: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { key: "models", label: "模型", url: "http://localhost:4321/models", icon: LayoutGrid },
  { key: "devices", label: "设备", url: "http://localhost:4321/devices", icon: Cpu },
  { key: "compare", label: "对比", url: "http://localhost:4321/compare", icon: Scale },
  { key: "tier", label: "等级排行", url: "http://localhost:4321/tier", icon: Trophy },
];

export default function CanIRunPage() {
  const [active, setActive] = useState<TabKey>("models");
  const current = TABS.find((t) => t.key === active)!;

  return (
    <>
      <h1
        className="mb-2 text-2xl font-bold"
        style={{ color: "var(--color-primary)" }}
      >
        AI 模型本地运行检测
      </h1>
      <p
        className="mb-6 text-sm"
        style={{ color: "var(--color-secondary)" }}
      >
        在浏览器端检测你的 CPU / GPU / 内存，推荐可以本地运行的开放模型，无需云端 API。
      </p>

      <div className="glass-card-static mb-4 flex flex-wrap items-center gap-2 p-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: isActive
                  ? "rgba(53, 191, 171, 0.18)"
                  : "transparent",
                color: isActive
                  ? "var(--color-brand)"
                  : "var(--color-secondary)",
                boxShadow: isActive ? "inset 0 0 0 1px rgba(53, 191, 171, 0.35)" : undefined,
              }}
              aria-pressed={isActive}
            >
              <Icon size={15} strokeWidth={2.2} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-2xl border bg-white/70"
        style={{ borderColor: "var(--color-border)" }}
      >
        <iframe
          key={current.key}
          src={current.url}
          title={`CanIRun - ${current.label}`}
          className="h-[85vh] w-full"
          style={{ border: "none" }}
          allow="microphone; clipboard-write"
        />
      </div>
    </>
  );
}
