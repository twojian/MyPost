import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DetailsProps {
  title: string;
  children: ReactNode;
}

export default function Details({ title, children }: DetailsProps) {
  return (
    <details
      className="group my-4 overflow-hidden rounded-xl border"
      style={{
        background: "var(--color-card)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderColor: "var(--color-border)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      <summary
        className="flex cursor-pointer select-none list-none items-center justify-between gap-2 px-4 py-3 font-medium transition-colors duration-200 [&::-webkit-details-marker]:hidden"
        style={{ color: "var(--color-primary)" }}
      >
        {title}
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform duration-200 group-open:rotate-180"
          style={{ color: "var(--color-secondary)" }}
        />
      </summary>
      <div
        className="border-t px-4 pb-4 pt-3 text-[0.95em]"
        style={{ borderColor: "var(--color-border)" }}
      >
        {children}
      </div>
    </details>
  );
}
