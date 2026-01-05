import "./style.scss";

import { getAllPostsMetadata, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Giscus } from "@/components/Giscus";
import { TableOfContents } from "@/components/TableOfContents";
import dayjs from "dayjs";
import "dayjs/locale/ko";

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

  dayjs.locale('ko');
  const formattedDate = dayjs(post.date).format('YYYY년 M월 D일');

  return (
    <>
      {post.toc && post.toc.length > 0 && (
        <TableOfContents items={post.toc} />
      )}

      <article className="w-full flex justify-center px-5 mt-1">
        <main className="max-w-[700px] w-full flex-col justify-center">
          <h1 className="text-3xl font-bold mb-1">{post.title}</h1>
          <time dateTime={post.date} className="text-gray-500">
            {formattedDate}
          </time>

          <div
            className="markdown-body !my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="comments-section">
            <Giscus />
          </div>
        </main>
      </article>
    </>
  );
}
