import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostData = {
  slug: string;
  title: string;
  date: string;
  author: string;
  contentHtml: string;
  [key: string]: any;
};

export const getSortedPostsData = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsDate = fileNames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as { title: string; date: string; author: string }),
    };
  });

  return allPostsDate.sort((a, b) => {
    // 日付をDateオブジェクトに変換して比較
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // 新しい日付順（降順）でソート
    return dateB.getTime() - dateA.getTime();
  });
};

export const getAllPostsSlugs = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPostData = async (slug: string): Promise<PostData> => {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { title: string; date: string; author: string }),
  };
};
