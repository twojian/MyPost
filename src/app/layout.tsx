import type { Metadata } from "next";
import { Inter, Averia_Gruesa_Libre } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoBg from "@/components/home/VideoBg";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SiteShell from "@/components/layout/SiteShell";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const averia = Averia_Gruesa_Libre({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Twojian Blog", template: "%s | Twojian Blog" },
  description: "记录个人计算机考研笔记、数学基础与技术思考",
  icons: { icon: "/images/avatar.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${inter.variable} ${averia.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/dseg@0.46.0/css/dseg.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <VideoBg />
        <Navbar />
        <main className="relative z-10 flex-1">
          <SiteShell
            postsCount={posts.length}
            tags={tags}
            categories={categories}
          >
            {children}
          </SiteShell>
        </main>
        <Footer />
        <ScrollReveal />
        <ScrollToTop />
      </body>
    </html>
  );
}
