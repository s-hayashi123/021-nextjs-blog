import Link from "next/link";
import { getSortedPostsData } from "../../lib/posts";

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
            <li key={slug} className="border p-4 rounded-md hover:bg-gray-100">
              <Link
                href={`/posts/${slug}`}
                className="text-xl text-blue-600 hover:underline"
              >
                {title}
              </Link>
              <br />
              <small className="text-gray-500">{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
