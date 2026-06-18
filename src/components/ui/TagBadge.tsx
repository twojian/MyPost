import Link from "next/link";

interface Props {
  name: string;
  variant?: "tag" | "category";
  showLink?: boolean;
}

export default function TagBadge({ name, variant = "tag", showLink = true }: Props) {
  const href = variant === "category" ? `/categories/${name}` : `/tags/${name}`;

  const badge = (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors"
      style={{
        background:
          variant === "category"
            ? "rgba(31, 201, 231, 0.15)"
            : "rgba(53, 191, 171, 0.15)",
        color:
          variant === "category"
            ? "var(--color-brand-secondary)"
            : "var(--color-brand)",
      }}
    >
      {variant === "tag" ? `# ${name}` : name}
    </span>
  );

  if (!showLink) return badge;

  return <Link href={href}>{badge}</Link>;
}
