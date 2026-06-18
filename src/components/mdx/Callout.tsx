import type { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const variants = {
  info: { icon: Info, bg: "rgba(53, 191, 171, 0.1)", border: "var(--color-brand)" },
  warning: { icon: AlertTriangle, bg: "rgba(251, 191, 36, 0.1)", border: "#fbbf24" },
  success: { icon: CheckCircle, bg: "rgba(34, 197, 94, 0.1)", border: "#22c55e" },
  error: { icon: XCircle, bg: "rgba(239, 68, 68, 0.1)", border: "#ef4444" },
};

interface Props {
  type?: keyof typeof variants;
  children: ReactNode;
}

export default function Callout({ type = "info", children }: Props) {
  const { icon: Icon, bg, border } = variants[type];

  return (
    <div
      className="my-4 flex gap-3 rounded-xl p-4"
      style={{ background: bg, borderLeft: `3px solid ${border}` }}
    >
      <Icon size={20} style={{ color: border, flexShrink: 0, marginTop: 2 }} />
      <div className="text-sm">{children}</div>
    </div>
  );
}
