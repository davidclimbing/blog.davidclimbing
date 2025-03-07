import {getAllPosts} from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <main className="w-full flex justify-center px-5 mt-1" itemScope>
        <div className="max-w-[700px] w-full flex items-center">
          <ul className="w-full align-middle flex gap-5 flex-col">
            {posts.map((post) => (
              <li className="border border-solid border-gray-200 p-5 rounded-xl"
                  key={post.slug}>
                <Link href={`/posts/${post.slug}`}>
                  <p> {post.title} </p>
                  <p> {post.date} </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
