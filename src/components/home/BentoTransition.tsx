"use client";

import { useEffect } from "react";

const WIDE = "(min-width: 1080px)";
const REDUCED = "(prefers-reduced-motion: reduce)";
/** 动画总时长：360ms + 最大延迟 192ms，留点余量后移除类 */
const DURATION = 700;

/**
 * 跨 1080px 断点时给 .home-bento 加一次性 .bento-switch，触发 9 张卡的错峰淡入。
 * - matchMedia 的 change 只在状态真正翻转时触发，区间内 resize 不会重放；
 * - 首次加载没有 change 事件，因此宽屏 / 窄屏都不会多播一次；
 * - 连续拖动时 DURATION 内再次跨越直接丢弃，避免堆积重放；
 * - 开启 prefers-reduced-motion 时完全不加类。
 */
export default function BentoTransition() {
  useEffect(() => {
    const bento = document.querySelector<HTMLElement>(".home-bento");
    if (!bento) return;

    const wide = window.matchMedia(WIDE);
    const reduced = window.matchMedia(REDUCED);
    let last = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onSwitch = () => {
      if (reduced.matches) return;
      const now = performance.now();
      if (now - last < DURATION) return;
      last = now;
      bento.classList.add("bento-switch");
      clearTimeout(timer);
      timer = setTimeout(() => bento.classList.remove("bento-switch"), DURATION);
    };

    wide.addEventListener("change", onSwitch);
    return () => {
      wide.removeEventListener("change", onSwitch);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
