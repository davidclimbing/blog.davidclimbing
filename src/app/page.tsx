import {getAllPosts} from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <main className="w-full flex justify-center px-5 mt-1">
        <div className="max-w-[700px] w-full flex items-center">
          <ul className="w-full align-middle flex gap-5 flex-col">
            {posts.map((post) => (
              <li className="border border-solid border-gray-200 p-5 rounded-xl" key={post.slug}>
                <Link href={`/posts/${post.slug}`}> {post.title} </Link>
                <p> {post.date} </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
