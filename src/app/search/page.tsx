import { getAllPosts } from "@/lib/posts";
import SearchClient from "./SearchClient";

export const metadata = { title: "搜索" };

export default function SearchPage() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    tags: p.tags,
    date: p.date,
  }));

  return <SearchClient posts={posts} />;
}
