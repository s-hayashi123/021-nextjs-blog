import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const allPostsData = getSortedPostsData();
  return (
    <main className="p-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">My Tech Blog</h1>
        <p className="text-gray-500 mt-2">Next.js and TypeScript Journey</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
        <ul className="space-y-4">
          {allPostsData.map(({ slug, date, title }) => (
            <li key={slug}>
              <Link href={`/posts/${slug}`}>{title}</Link>
              <br />
              <small>{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
