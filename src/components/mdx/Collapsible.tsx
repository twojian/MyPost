"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsibleProps {
  summary?: string;
  children: React.ReactNode;
}

export default function Collapsible({
  summary = "展开查看",
  children
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-white/20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/20"
      >
        <ChevronRight
          size={18}
          style={{
            color: "var(--color-brand)",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
        <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          {summary}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-white/15 px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}
