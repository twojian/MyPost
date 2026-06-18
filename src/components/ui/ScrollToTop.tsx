"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="glass-card-static fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80"
      aria-label="Scroll to top"
      style={{ color: "var(--color-brand)" }}
    >
      <ArrowUp size={20} />
    </button>
  );
}
