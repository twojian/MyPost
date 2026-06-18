import type { Metadata } from "next";
import { Inter, Averia_Gruesa_Libre } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CanvasBg from "@/components/home/CanvasBg";
import ScrollToTop from "@/components/ui/ScrollToTop";
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
        <CanvasBg />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
