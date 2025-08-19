import { getAllPostsSlugs, getPostData } from "../../../../lib/posts";
import type { PostData } from "../../../../lib/posts";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const paths = getAllPostsSlugs();
  return paths.map((path) => path.params);
}

export default async function Post({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const postData: PostData = await getPostData(slug);

  return (
    <article className="prose lg:prose-xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        {postData.title}
      </h1>
      <div className="text-gray-500 mb-8">{postData.date}</div>

      {/* Markdownから変換したHTMLを表示 */}
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
