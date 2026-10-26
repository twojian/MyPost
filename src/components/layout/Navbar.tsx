"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/share", label: "分享" },
  { href: "/bloggers", label: "博客圈" },
  { href: "/archives", label: "归档" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar-glass sticky top-4 z-50 mx-auto mt-4 max-w-5xl px-6 py-3">
      <nav className="flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="press font-display text-xl"
          style={{ color: "var(--color-brand)" }}
        >
          Twojian
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={link.href === "/" ? ["nav-back"] : undefined}
              className="press text-sm text-[var(--color-secondary)] transition-colors hover:text-[var(--color-brand)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="press text-[var(--color-secondary)] transition-colors hover:text-[var(--color-brand)]"
          >
            <Search size={18} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="press ml-auto md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: "var(--color-secondary)" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mt-4 flex flex-col gap-3 border-t border-white/30 pt-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={link.href === "/" ? ["nav-back"] : undefined}
              className="press text-sm text-[var(--color-secondary)] transition-colors hover:text-[var(--color-brand)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="press text-[var(--color-secondary)] transition-colors hover:text-[var(--color-brand)]"
          >
            <Search size={18} />
          </Link>
        </div>
      )}
    </header>
  );
}
