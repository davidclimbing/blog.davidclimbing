import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";
import "./style.scss";

import {getAllPosts, getPost} from "@/lib/posts";
import {notFound} from "next/navigation";
import {Utterances} from "./utterances";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({params}: {params: {slug: string}}) {
  const slug = params?.slug;
  if (!slug) notFound();
  
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="w-full flex justify-center px-5 mt-1">
      <main className="max-w-[700px] w-full flex-col justify-center">
        <h1 className="text-3xl font-bold mb-1">{post.title}</h1>
        <p>{post.date}</p>
        
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
