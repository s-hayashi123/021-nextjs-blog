import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const allPostsData = getSortedPostsData();
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Tech Blog
          </h1>
          <p className="text-xl text-gray-600">
            Next.js and TypeScript Journey
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            All Posts
          </h2>
          <div className="space-y-6">
            {allPostsData.map(({ slug, date, title, author }) => (
              <article
                key={slug}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">
                  <Link
                    href={`/posts/${slug}`}
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {title}
                  </Link>
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{date}</span>
                  <span>{author}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
