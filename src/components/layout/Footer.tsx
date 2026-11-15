import { GitBranch } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-5xl px-4 py-8">
      <div className="glass-card-static flex flex-col items-center gap-3 px-6 py-6 text-sm text-muted">
        <div className="flex items-center gap-4">
          <Link
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={siteConfig.githubLabel}
            className="transition-colors hover:text-brand"
          >
            <GitBranch size={20} />
          </Link>
        </div>
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
