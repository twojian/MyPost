import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="glass-card-static mb-8 flex flex-col items-center gap-6 px-8 py-12 text-center md:flex-row md:text-left">
      <Image
        src="/images/avatar.png"
        alt="Twojian"
        width={120}
        height={120}
        className="rounded-full border-4 border-white/60 shadow-sm"
      />
      <div>
        <h1
          className="font-display mb-2 text-3xl"
          style={{ color: "var(--color-primary)" }}
        >
          Hi 这里是 Twojian 的博客 👋
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-secondary)" }}
        >
          关于个人计算机考研笔记、数学基础与技术思考
          <br />
          记录可复用、可验证、可长期维护的知识点内容
        </p>
      </div>
    </section>
  );
}
