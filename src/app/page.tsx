import {getAllPosts} from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <h2>DavidClimbing Tech Blog</h2>

      <div className="flex align-middle justify-center pt-20">
        <ul className="align-middle flex gap-5 flex-col">
          {posts.map((post) => (
            <li className="border border-solid border-gray-200 p-5 rounded-xl" key={post.slug}>
              <Link href={`/posts/${post.slug}`}> {post.title} </Link>
              <p> {post.date} </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
