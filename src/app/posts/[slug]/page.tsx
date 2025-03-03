import {getAllPosts} from "@/lib/posts";
import {notFound} from "next/navigation";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const md = new MarkdownIt()

async function fetchPosts(slug) {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export default async function Post({params}) {
  const post = await fetchPosts(params.slug);

  if (!post) notFound();

  const htmlConverter = md.render(post.content);

  return (
    <article>
      {" "}
      <h1> {post.title} </h1>
      <p> {post.date} </p>
      <code dangerouslySetInnerHTML={{
        __html: hljs.highlight(htmlConverter.toString(), {
          language: htmlConverter.className?.match(/language-(\w+)/)?.[1] ?? "text",
        }).value
      }}></code>
    </article>
  )
}