# 【Next.js & TypeScript】Markdownブログ (SSG)で作る！Next.js製ブログ開発チュートリアル (021)

## 🚀 はじめに (The "Why")

こんにちは！このチュートリアルでは、モダンなWeb開発で非常に人気の高いフレームワーク **Next.js (App Router)** を使って、自分だけのブログを構築します。

**完成形のイメージ:**

1.  **トップページ:** 作成した記事が一覧で表示される。
2.  **記事ページ:** Markdownで書いた記事がキレイに表示される。

![Blog Demo](https://example.com/blog-demo.gif) <!--- ダミー画像 -->

ただブログを作るだけではありません。このチュートリアルを通して、「なぜNext.jsが選ばれるのか？」「静的サイト生成（SSG）とは何か、どんなメリットがあるのか？」といった、技術の裏側にある「**なぜ？**」を深く理解し、現場で通用するスキルを身につけることを目指します。

Reactの基本を学んだあなたが、次のステップとしてフルスタック開発の世界に足を踏み入れるための、最高にエキサイティングな挑戦です！

## 🛠 環境構築

このセクションでは、具体的な手順は記載しません。

開発を始める前に、以下の技術の公式サイトを参照し、最新の手順に従って環境をセットアップしてください。これが自走するエンジニアへの第一歩です！

- **[Next.js (Create Next App)](https://nextjs.org/docs/getting-started/installation)**
  - `TypeScript` と `Tailwind CSS` を含めてセットアップするのがおすすめです。
- **[Tailwind CSS](https://tailwindcss.com/docs/installation)**
- **[shadcn/ui](https://ui.shadcn.com/docs/installation)** (任意ですが、美しいUIを素早く組むのに役立ちます)

## 💻 思考を促す開発ステップ

完全なコードをコピー＆ペーストするのではなく、ヒントを元に「どうすれば実装できるか？」を考えながら進めていきましょう。

### Step 1: プロジェクトのセットアップと記事の準備

1.  `create-next-app` を使って、Next.jsプロジェクトを作成します。
2.  プロジェクトのルートに `posts` というディレクトリを作成します。
3.  `posts` ディレクトリの中に、いくつかMarkdownファイル (`.md`) を作成してみましょう。ファイル名がURLの一部になります（例: `my-first-post.md`）。
4.  各Markdownファイルの先頭に、`frontmatter` と呼ばれるメタデータを記述します。

    ```markdown
    ---
    title: 'はじめての投稿'
    date: '2025-08-01'
    author: 'Satoshi'
    ---

    ここから本文が始まります。
    こんにちは、世界！
    ```

### Step 2: Markdown処理ライブラリの導入

記事のメタデータ（frontmatter）と本文を読み込むためのライブラリをインストールします。

```bash
npm install gray-matter remark remark-html
```

- `gray-matter`: frontmatterを解析します。
- `remark`, `remark-html`: MarkdownをHTMLに変換します。

### Step 3: 記事取得ロジックの設計と実装 (`lib/posts.ts`)

複数のページで記事データを使い回せるように、処理を一つのファイルにまとめましょう。

`lib` ディレクトリを作成し、その中に `posts.ts` を作成します。

**思考のヒント 🤔:**

- Node.jsの `fs` モジュールを使って、`posts` ディレクトリ内のファイルをどうやって一覧取得できるでしょうか？
- `path` モジュールを使って、ファイルへのフルパスをどうやって組み立てますか？
- `gray-matter` を使って、ファイルの内容から `data` (メタデータ) と `content` (本文) をどうやって分離しますか？
- `remark` を使って、`content` をHTML文字列に変換する処理を書いてみましょう。

```typescript
// lib/posts.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// TODO: postsディレクトリ内の全記事のメタデータを日付順にソートして取得する関数 `getAllPosts()` を実装してみましょう。
// ヒント: fs.readdirSync, map, sort を使います。
export function getAllPosts() {
  // ...
}

// TODO: 指定されたslugに対応する単一の記事データ（メタデータとHTML本文）を取得する関数 `getPostBySlug(slug)` を実装してみましょう。
// ヒント: ファイル名をslugとして扱います。
export async function getPostBySlug(slug: string) {
  // ...
  // remarkを使ってMarkdownをHTMLに変換する処理は非同期なので `async/await` を使います。
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();
  // ...
}

// TODO: 全ての記事のslugを取得する関数 `getAllPostSlugs()` を実装してみましょう。
// これは後の動的ルーティング（generateStaticParams）で使います。
export function getAllPostSlugs() {
  // ...
}
```

### Step 4: 記事一覧ページの作成 (`app/page.tsx`)

トップページで、全記事のタイトルと日付を一覧表示します。

**思考のヒント 🤔:**

- これはサーバーコンポーネントなので、`async` 関数として定義できます。
- Step 3で作成した `getAllPosts()` をここで呼び出します。
- 取得した記事データを `map` 関数でループ処理し、Next.jsの `<Link>` コンポーネントを使って各記事へのリンクを生成します。

```tsx
// app/page.tsx

import Link from 'next/link';
import { getAllPosts } from '@/lib/posts'; // エイリアス設定をしている場合

export default function Home() {
  // TODO: getAllPosts() を使って全記事のデータを取得する
  const allPosts = getAllPosts();

  return (
    <section>
      <h1>Blog</h1>
      <ul>
        {/* TODO: allPostsをmapで展開し、記事タイトルと日付をLinkと共に表示する */}
      </ul>
    </section>
  );
}
```

### Step 5: 記事詳細ページの作成 (`app/posts/[slug]/page.tsx`)

動的ルーティングを使って、個別の記事ページを生成します。

**思考のヒント 🤔:**

- **SSGの核心！** `generateStaticParams` を使って、ビルド時に生成すべきページのパス（`slug` のリスト）をNext.jsに教えます。Step 3で作成した `getAllPostSlugs()` がここで役立ちます。
- ページのコンポーネントは `params` prop を受け取ります。`params.slug` の中に動的セグメントの値が入っています。
- `getPostBySlug(params.slug)` を呼び出して、特定の記事データを取得します。
- Markdownから変換したHTMLを表示するには `dangerouslySetInnerHTML` を使います。

```tsx
// app/posts/[slug]/page.tsx

import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';

// TODO: ビルド時に静的生成するパスのリストを作成する
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// TODO: 記事データを取得してページをレンダリングする
export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.date}</div>
      {/* TODO: remarkで変換したHTMLをここで表示する */}
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
```

## 📚 深掘りコラム (Deep Dive)

### なぜ `generateStaticParams` が必要なの？

Next.jsは、ビルド時にどの動的ページ（例: `/posts/post-1`, `/posts/post-2`）を事前に生成すればよいかを知りません。`generateStaticParams` は、「ここにリストアップされた`slug`を持つページをすべてHTMLとして作っておいてね！」とNext.jsに教えるための重要な関数です。これにより、ユーザーがアクセスしたときには既に完成したHTMLが返され、超高速な表示が実現できるのです（これがSSGの強みです！）。

### `dangerouslySetInnerHTML` は本当に危険？

名前の通り、このpropは注意して使う必要があります。外部のユーザーが入力したHTMLをそのまま表示すると、XSS（クロスサイトスクリプティング）攻撃のリスクがあります。しかし、**今回は自分自身で管理しているMarkdownファイルをソースとしてHTMLを生成しているため、信頼できるコンテンツ**です。このようなケースでは安全に使うことができます。

## 🔥 挑戦課題 (Challenges)

チュートリアルが完成したら、さらにスキルを磨くための課題に挑戦してみましょう！

- **Easy 難易度:**
  - 記事のfrontmatterに `author`（著者）を追加し、記事ページに表示してみましょう。
  - 簡単なCSSやTailwind CSSでブログの見た目を整えてみましょう。
- **Medium 難易度:**
  - frontmatterに `tags: ['React', 'Next.js']` のようなタグを追加し、タグごとの記事一覧ページを作成してみましょう。
- **Hard 難易度:**
  - トップページにシンプルな検索機能を追加し、タイトルで記事を絞り込めるようにしてみましょう。
- **エラー修正課題:**
  - `lib/posts.ts` の `getAllPosts` 関数にある日付のソートロジックは、`'2023-12-01'` と `'2023-01-10'` を正しく比較できません。`new Date()` を使って正しく日付順にソートできるように修正してください。

## 📝 メモ (Memo)

このセクションは自由に活用してください。

- なぜこの技術（例: Next.jsのSSG）を使うのか？
- なぜこのライブラリ（例: `gray-matter`）を選んだのか？
- 開発で詰まった点をどう解決したのか？

（ここにあなたの学びを書き留めよう）

## 🎉 結論

お疲れ様でした！このチュートリアルを通して、Next.js (App Router) を使った静的サイト生成の基本をマスターしました。ファイルベースのルーティング、サーバーコンポーネントでのデータ取得、`generateStaticParams`によるSSGの仕組みなど、モダンなWeb開発に不可欠な知識を実践的に学ぶことができたはずです。

ここからさらに、Vercelへのデプロイ、CMS（Contentfulなど）との連携、より高度な機能の実装など、可能性は無限に広がっています。今回の学びを土台に、あなただけのオリジナルプロジェクトを育てていってください！
