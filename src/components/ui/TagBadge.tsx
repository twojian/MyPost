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
      className={`tag-badge inline-block rounded-full px-3 py-1 text-xs font-medium ${
        variant === "category" ? "tag-badge-category" : "tag-badge-tag"
      }`}
    >
      {variant === "tag" ? `# ${name}` : name}
    </span>
  );

  if (!showLink) return badge;

  return <Link href={href}>{badge}</Link>;
}
