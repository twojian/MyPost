"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MAIN_NAV } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar-glass sticky top-4 z-50 mx-auto mt-4 max-w-5xl px-6 py-3">
      <nav className="flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="press font-display text-xl text-brand"
          aria-label={siteConfig.name}
        >
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {MAIN_NAV.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={link.href === "/" ? ["nav-back"] : undefined}
                aria-label={link.iconOnly ? link.label : undefined}
                className="press text-sm text-muted transition-colors hover:text-brand"
              >
                {link.iconOnly ? <Icon size={18} /> : link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="press ml-auto text-muted md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="切换导航菜单"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mt-4 flex flex-col gap-3 border-t border-[var(--color-hairline)] pt-4 md:hidden">
          {MAIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={link.href === "/" ? ["nav-back"] : undefined}
              className="press text-sm text-muted transition-colors hover:text-brand"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
