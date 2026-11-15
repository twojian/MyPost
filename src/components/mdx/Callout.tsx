import type { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const variants = {
  info: {
    icon: Info,
    bg: "color-mix(in srgb, var(--color-brand) 10%, transparent)",
    border: "var(--color-brand)",
  },
  warning: { icon: AlertTriangle, bg: "var(--color-callout-warning-bg)", border: "var(--color-callout-warning-border)" },
  success: { icon: CheckCircle, bg: "var(--color-callout-success-bg)", border: "var(--color-callout-success-border)" },
  error: { icon: XCircle, bg: "var(--color-callout-error-bg)", border: "var(--color-callout-error-border)" },
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
