import "./style.scss";

import { getAllPostsMetadata, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Utterances } from "./utterances";

export async function generateStaticParams() {
  const posts = getAllPostsMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();

  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="w-full flex justify-center px-5 mt-1">
      <main className="max-w-[700px] w-full flex-col justify-center">
        <h1 className="text-3xl font-bold mb-1">{post.title}</h1>
        <p>{post.date instanceof Date ? post.date.toLocaleDateString() : post.date}</p>

        <div
          className="markdown-body !my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="comments-section">
          <Utterances />
        </div>
      </main>
    </article>
  );
}
