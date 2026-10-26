"use client";

/**
 * 全屏视频背景：固定铺满视口，静音循环播放本地视频。
 * 顶部叠一层随主题变化的半透明遮罩，保证前景文字可读。
 */
export default function VideoBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        src="/videos/switzerland_alps_mountains_night_beautiful_landscape_windy_1920x1080.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
      <div className="video-bg-overlay absolute inset-0" />
    </div>
  );
}
