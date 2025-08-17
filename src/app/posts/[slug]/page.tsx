import { getAllPostsSlugs, getPostData } from "@/lib/posts";
import type { PostData } from "@/lib/posts";

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
    <article className="prose lg:prose-xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        {postData.title}
      </h1>
      <div className="text-gray-500 mb-8">{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
