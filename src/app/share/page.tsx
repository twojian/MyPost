import type { Metadata } from "next";
import ShareClient from "./ShareClient";

export const metadata: Metadata = {
  title: "分享",
  description: "按知识大类整理的优质技术文章与专栏，来自杜子源、二丫讲梵、阮一峰及博客圈的朋友们。",
};

export default function SharePage() {
  return <ShareClient />;
}
