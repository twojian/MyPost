"use client";

export default function CanvasBg() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background: [
          "radial-gradient(at 0% 0%, rgba(253,224,166,0.95) 0%, transparent 55%)",
          "radial-gradient(at 100% 0%, rgba(255,182,158,0.9) 0%, transparent 55%)",
          "radial-gradient(at 100% 100%, rgba(238,180,210,0.85) 0%, transparent 55%)",
          "radial-gradient(at 0% 100%, rgba(168,210,224,0.9) 0%, transparent 60%)",
          "linear-gradient(135deg, #fdeed1 0%, #f6d9d0 50%, #e9d8e8 100%)",
        ].join(","),
      }}
    />
  );
}
