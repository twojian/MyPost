"use client";

import { useEffect, useRef } from "react";

/**
 * 全屏视频背景：固定铺满视口，静音循环播放本地视频。
 * 顶部叠一层随主题变化的半透明遮罩，保证前景文字可读。
 *
 * 性能要点：
 * - preload="metadata"：只拉取元数据，避免一进站就下载整段视频占满带宽；
 * - poster：首帧静图兜底，元数据到达前不出现黑屏；
 * - useEffect 兜底 play()：部分浏览器（如 Edge）会拦下 autoplay，这里静默重试一次。
 */
export default function VideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => {
      void video.play().catch(() => {
        /* 自动播放被策略拦截时保持 poster 静帧，不影响可读性 */
      });
    };
    tryPlay();
    video.addEventListener("canplay", tryPlay, { once: true });
    return () => video.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        src="/videos/switzerland-alps-bg.mp4"
        poster="/images/video-bg-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <div className="video-bg-overlay absolute inset-0" />
    </div>
  );
}
