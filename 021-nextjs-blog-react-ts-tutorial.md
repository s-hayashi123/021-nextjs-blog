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

## 💻【超詳細】ステップバイステップ開発手順

ここからは、一つ一つのステップを丁寧に解説していきます。完成コードをコピー＆ペーストして、まずは動かしてみましょう。その後、解説を読んで「なぜこうなるのか？」を理解する流れで進めてください。

### Step 1: プロジェクトの準備と記事ファイルの作成

**やりたいこと:**
Next.jsプロジェクトを作成し、ブログ記事の元となるMarkdownファイルをいくつか用意します。

**The How (手順):**

1.  **Next.jsプロジェクトの作成:**
    ターミナルを開き、以下のコマンドを実行して、`my-blog` という名前のプロジェクトを作成します。途中でいくつか質問されますが、基本的にはデフォルトのままでOKです。（`Tailwind CSS` は `Yes` を選択してください）
    ```bash
    npx create-next-app@latest my-blog --typescript --tailwind --eslint
    ```

2.  **記事用ディレクトリの作成:**
    プロジェクトのルート（`my-blog`ディレクトリの直下）に `posts` という名前のフォルダを作成します。ここにMarkdownファイルの記事を保存していきます。

3.  **Markdown記事の作成:**
    作成した `posts` フォルダの中に、2つほど記事ファイルを作成してみましょう。

    *   `posts/my-first-post.md`

        ```markdown
        ---
        title: 'はじめての投稿'
        date: '2025-08-01'
        author: 'Satoshi'
        ---

        Next.jsの学習を始めました。
        これは最初の投稿です。
        ```

    *   `posts/ssg-is-awesome.md`

        ```markdown
        ---
        title: 'SSGは最高！'
        date: '2025-08-05'
        author: 'Satoshi'
        ---

        静的サイト生成（SSG）について学んでいます。
        表示がとても速くて驚きました。
        ```

**The Why (解説):**

*   **`posts` ディレクトリ:** なぜルートに置くのか？ Next.jsでは、サーバーサイドの処理（ビルド時）でNode.jsの機能を使ってファイルを直接読み込めます。この `posts` ディレクトリが、私たちのブログの簡易的なデータベースの役割を果たします。
*   **Frontmatter:** Markdownファイルの先頭にある `---` で囲まれた部分は「frontmatter」と呼ばれます。これは、記事のタイトルや日付といった「メタデータ（付加情報）」を記述するための標準的な方法です。後でこの情報をプログラムで読み込み、ページに表示します。

### Step 2: Markdown解析ライブラリの導入

**やりたいこと:**
Markdownファイルの中身（frontmatterと本文）をプログラムで扱えるように、便利なライブラリをインストールします。

**The How (手順):**

プロジェクトのルートディレクトリで、以下のコマンドを実行します。

```bash
npm install gray-matter remark remark-html
```

**The Why (解説):**

*   `gray-matter`: frontmatter部分と、記事の本文（Markdown）部分を分離してくれるライブラリです。これにより、「タイトルはここで、本文はここ」というように、データを簡単に取り扱えるようになります。
*   `remark` と `remark-html`: `remark`はMarkdownを解析するためのエンジンで、`remark-html`はそのプラグインです。この2つを組み合わせることで、Markdown記法（例: `# 見出し`）をHTMLタグ（例: `<h1>見出し</h1>`）に変換できます。

### Step 3: 記事取得ロジックの実装 (`lib/posts.ts`)

**やりたいこと:**
`posts` ディレクトリから記事データを読み込むための共通処理を、`lib/posts.ts`というファイルにまとめて実装します。

**The How (手順):**

1.  プロジェクトのルートに `lib` ディレクトリを作成します。
2.  `lib` ディレクトリの中に `posts.ts` というファイルを作成し、以下のコードを貼り付けます。

    ```typescript
    // lib/posts.ts
    import fs from 'fs';
    import path from 'path';
    import matter from 'gray-matter';
    import { remark } from 'remark';
    import html from 'remark-html';

    // process.cwd() はプロジェクトのルートディレクトリを指す
    const postsDirectory = path.join(process.cwd(), 'posts');

    // 型定義
    export type PostData = {
      slug: string;
      title: string;
      date: string;
      contentHtml: string;
      [key: string]: any; // frontmatterの他のキーも許容
    };

    // 全記事のデータを日付順に取得する
    export function getSortedPostsData() {
      // /posts ディレクトリ内のファイル名を取得
      const fileNames = fs.readdirSync(postsDirectory);
      const allPostsData = fileNames.map((fileName) => {
        // .md 拡張子を取り除いて、URLのslugとして使う
        const slug = fileName.replace(/\.md$/, '');

        // ファイルのフルパスを作成
        const fullPath = path.join(postsDirectory, fileName);
        // ファイルの中身を文字列として読み込む
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // gray-matterでメタデータ(frontmatter)をパース
        const matterResult = matter(fileContents);

        // slugとメタデータを結合して返す
        return {
          slug,
          ...(matterResult.data as { title: string; date: string }),
        };
      });

      // 日付で降順（新しい順）にソート
      return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    // 動的ルーティングのための全てのslugを取得する
    export function getAllPostSlugs() {
      const fileNames = fs.readdirSync(postsDirectory);
      // 各ファイル名からslugを抽出し、Next.jsが要求する形式の配列に変換
      return fileNames.map((fileName) => {
        return {
          params: {
            slug: fileName.replace(/\.md$/, ''),
          },
        };
      });
    }

    // 特定のslugに対応する単一の記事データを取得する
    export async function getPostData(slug: string): Promise<PostData> {
      const fullPath = path.join(postsDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // メタデータをパース
      const matterResult = matter(fileContents);

      // remarkを使ってMarkdownをHTMLに変換
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      const contentHtml = processedContent.toString();

      // データとHTMLを結合して返す
      return {
        slug,
        contentHtml,
        ...(matterResult.data as { title: string; date: string }),
      };
    }
    ```

**The Why (解説):**

*   **`lib` ディレクトリ:** プロジェクト全体で使われる共通の関数やロジックを保存するための、慣習的な場所です。ここに置くことで「これは特定のページに依存しない便利機能なんだな」と分かりやすくなります。
*   **`fs` (File System):** Node.jsに標準で組み込まれているモジュールで、サーバー上でファイルの読み書きを可能にします。`fs.readdirSync`でディレクトリ内のファイル一覧を、`fs.readFileSync`でファイルの内容を読み込んでいます。
*   **`path`:** これもNode.jsの標準モジュールです。OS（Windows, Mac, Linux）ごとのパスの区切り文字（`/` or `
`)の違いを吸収し、安全にファイルパスを結合してくれます。
*   **`async / await`:** `getPostData`関数が `async` になっているのは、`remark`によるMarkdownからHTMLへの変換処理が非同期（時間がかかる可能性のある処理）だからです。`await` をつけることで、その処理が終わるまで待ってから次のコードに進むことができます。
*   **3つの関数:** 
    *   `getSortedPostsData`: トップページの記事一覧表示用。
    *   `getAllPostSlugs`: Next.jsがビルド時に「どの記事ページを作ればいいか」を知るために使う。
    *   `getPostData`: 個別の記事ページで、その記事の詳細データを表示するために使う。

### Step 4: 記事一覧ページの作成 (`app/page.tsx`)

**やりたいこと:**
サイトのトップページ (`/`) に、`lib/posts.ts` で作成した関数を使って、全記事のタイトルと日付を一覧表示します。

**The How (手順):**

`app/page.tsx` ファイルを以下の内容に書き換えます。

```tsx
// app/page.tsx
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts'; // @ is a path alias to the root

export default function Home() {
  // サーバーサイドで記事データを取得する
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
              <Link href={`/posts/${slug}`} className="text-xl text-blue-600 hover:underline">
                {title}
              </Link>
              <br />
              <small className="text-gray-500">
                {date}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

**The Why (解説):**

*   **サーバーコンポーネント:** Next.jsのApp Routerでは、デフォルトで全てのコンポーネントが「サーバーコンポーネント」になります。これは、サーバーサイド（ビルド時やリクエスト時）でレンダリングされるコンポーネントです。そのため、`getSortedPostsData()` のようなNode.jsの`fs`モジュールを使う関数を直接呼び出すことができます。
*   **`<Link>` コンポーネント:** Next.jsでページ間を移動するための専用コンポーネントです。`<a>` タグの代わりにこれを使うと、ページ全体をリロードすることなく、必要な部分だけを高速に切り替えるSPA（Single Page Application）のような挙動を実現してくれます。
*   **`map`関数:** `allPostsData`という記事データの配列を、一つ一つの`<li>`要素（リストアイテム）に変換しています。これはReactでリスト表示を行う際の基本的なテクニックです。
*   **`key={slug}`:** `map`でリストを生成する際には、Reactが各要素を効率的に管理できるように、一意の`key`を渡す必要があります。今回は記事ごとにユニークな`slug`を`key`として使っています。

### Step 5: 記事詳細ページの作成 (`app/posts/[slug]/page.tsx`)

**やりたいこと:**
`/posts/my-first-post` のようなURLにアクセスした際に、対応するMarkdownの内容を表示するページを作成します。

**The How (手順):**

1.  `app` ディレクトリの中に `posts` ディレクトリを作成します。
2.  `app/posts` ディレクトリの中に `[slug]` という名前のディレクトリを作成します。（角括弧を含むのがポイントです）
3.  `app/posts/[slug]` ディレクトリの中に `page.tsx` ファイルを作成し、以下のコードを貼り付けます。

    ```tsx
    // app/posts/[slug]/page.tsx
    import { getPostData, getAllPostSlugs } from '@/lib/posts';
    import type { PostData } from '@/lib/posts';

    type Props = {
      params: {
        slug: string;
      };
    };

    // 1. ビルド時に静的に生成するパスのリストを作成する
    export async function generateStaticParams() {
      const paths = getAllPostSlugs();
      // pathsは [{ params: { slug: '...' } }, ...] という形式
      return paths.map(path => path.params);
    }

    // 2. 記事データを取得してページをレンダリングする
    export default async function Post({ params }: Props) {
      // URLのslugを使って記事データを取得
      const postData: PostData = await getPostData(params.slug);

      return (
        <article className="prose lg:prose-xl mx-auto p-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{postData.title}</h1>
          <div className="text-gray-500 mb-8">{postData.date}</div>
          
          {/* Markdownから変換したHTMLを表示 */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      );
    }
    ```
4. **(Tailwind CSS用設定)** `remark`が生成したHTML(`h1`, `p`など)にスタイルを適用するために、`@tailwindcss/typography` プラグインを導入します。
    ```bash
    npm install -D @tailwindcss/typography
    ```
    `tailwind.config.js` を修正します。
    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      // ...
      plugins: [
        require('@tailwindcss/typography'), // この行を追加
      ],
    }
    ```

**The Why (解説):**

*   **`[slug]` (動的セグメント):** ディレクトリ名を `[slug]` のように角括弧で囲むと、Next.jsはその部分が動的な値（可変）であることを認識します。これにより、`posts/a`, `posts/b` のような無限のURLを、この一つのファイルで処理できるようになります。
*   **`generateStaticParams` (SSGの核心):** この関数は、Next.jsに「ビルド時に、どのページを事前にHTMLとして生成しておくべきか」を教えるためのものです。`getAllPostSlugs`で全記事の`slug`リストを取得し、それを返すことで、Next.jsは全ての記事ページをビルド時に静的生成します。これがSSG（Static Site Generation）の仕組みです。
*   **`params` prop:** `generateStaticParams`で指定した動的な値（今回は`slug`）は、ページのコンポーネントで `params` というpropsを通して受け取ることができます。`params.slug` でURLの`slug`が取得できます。
*   **`dangerouslySetInnerHTML`:** Reactでは通常、セキュリティ上の理由からHTML文字列を直接埋め込むことはできません（XSS攻撃を防ぐため）。しかし、今回は自分たちで管理しているMarkdownから生成した信頼できるHTMLなので、この`prop`を使って意図的にHTMLの埋め込みを許可しています。
*   **`@tailwindcss/typography`:** このプラグインは、`prose`というクラスをつけるだけで、Markdownから生成されたようなプレーンなHTML要素群を、美しく整形してくれる非常に便利なプラグインです。

### Step 6: 動作確認

お疲れ様でした！これでブログの基本的な仕組みは完成です。

1.  ターミナルで開発サーバーを起動します。
    ```bash
    npm run dev
    ```
2.  ブラウザで `http://localhost:3000` にアクセスします。
3.  作成した2つの記事が一覧表示されているはずです。
4.  記事のタイトルをクリックして、記事詳細ページが正しく表示されることを確認してください。

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
  - `lib/posts.ts` の `getSortedPostsData` 関数にある日付のソートロジックは、`'2023-12-01'` と `'2023-01-10'` を正しく比較できません。`new Date()` を使って正しく日付順にソートできるように修正してください。

## 📝 メモ (Memo)

このセクションは自由に活用してください。

- なぜこの技術（例: Next.jsのSSG）を使うのか？
- なぜこのライブラリ（例: `gray-matter`）を選んだのか？
- 開発で詰まった点をどう解決したのか？

（ここにあなたの学びを書き留めよう）

## 🎉 結論

お疲れ様でした！このチュートリアルを通して、Next.js (App Router) を使った静的サイト生成の基本をマスターしました。ファイルベースのルーティング、サーバーコンポーネントでのデータ取得、`generateStaticParams`によるSSGの仕組みなど、モダンなWeb開発に不可欠な知識を実践的に学ぶことができたはずです。

ここからさらに、Vercelへのデプロイ、CMS（Contentfulなど）との連携、より高度な機能の実装など、可能性は無限に広がっています。今回の学びを土台に、あなただけのオリジナルプロジェクトを育てていってください！