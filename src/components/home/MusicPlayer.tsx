"use client";

import { useState, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";

interface Props {
  title?: string;
  artist?: string;
  src?: string;
}

export default function MusicPlayer({
  title = "Close To You",
  artist = "The Carpenters",
  src,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!src || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying((p) => !p);
  };

  return (
    <div className="flex h-full w-full items-center gap-3 px-5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: "rgba(53,191,171,0.15)" }}
      >
        <Music size={16} style={{ color: "var(--color-brand)" }} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          {title}
        </p>
        {artist && (
          <p className="truncate text-xs" style={{ color: "var(--color-secondary)" }}>
            {artist}
          </p>
        )}
      </div>

      <button
        onClick={toggle}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110"
        style={{ background: "var(--color-brand)", color: "white" }}
        aria-label={playing ? "暂停" : "播放"}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>

      {src && (
        <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      )}
    </div>
  );
}
