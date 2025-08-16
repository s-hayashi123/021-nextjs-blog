import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export const getAllPosts = () => {
  const files = fs.readdirSync(postsDirectory);

  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const posts = markdownFiles.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      ...data,
    };
  });

  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return sortedPosts;
};
