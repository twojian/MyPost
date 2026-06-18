import { GitBranch } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-5xl px-4 py-8">
      <div className="glass-card-static flex flex-col items-center gap-3 px-6 py-6 text-sm text-[var(--color-secondary)]">
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/twojian"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-brand)]"
          >
            <GitBranch size={20} />
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Twojian</p>
      </div>
    </footer>
  );
}
