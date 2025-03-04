import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";
import "./style.scss";

import {getAllPosts} from "@/lib/posts";
import {notFound} from "next/navigation";
import hljs from "highlight.js";
import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";

async function fetchPosts(slug) {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export default async function Post({params}) {
  const post = await fetchPosts(params.slug);

  if (!post) notFound();

  return (
    <article className="w-full flex justify-center px-5 mt-1" itemScope itemType="http://schema.org/Article">
      <main className="max-w-[700px] w-full flex-col justify-center">
        <h1> {post.title} </h1>
        <p> {post.date} </p>
        <Markdown
          className="markdown-body"
          rehypePlugins={[rehypeRaw]}
          components={{
            code: (props) => {
              return (
                <code
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight(props.children?.toString() ?? "", {
                      language: props.className?.match(/language-(\w+)/)?.[1] ?? "text",
                    }).value,
                  }}
                />
              );
            },
          }}
        >
          {post.content}
        </Markdown>
      </main>
    </article>
  )
}
