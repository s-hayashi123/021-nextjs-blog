import { getAllPostsSlugs, getPostData } from "@/lib/posts";
import type { PostData } from "@/lib/posts";
import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async () => {
  const paths = getAllPostsSlugs();
  return paths.map((path) => path.params);
};

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const postData: PostData = await getPostData(slug);

  return (
    <article className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {postData.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-500">
            <span>{postData.date}</span>
            <span>•</span>
            <span>{postData.author}</span>
          </div>
        </header>

        <div className="prose prose-lg lg:prose-xl mx-auto prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
      </div>
    </article>
  );
}
