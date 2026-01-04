import { getAllPostsMetadata } from '@/lib/posts';
import ClientPageWrapper from '@/components/ClientPageWrapper';
import { PostsProvider } from '@/contexts/PostsContext';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import PostList from '@/components/PostList';
import InitialPostsLoader from '@/components/InitialPostsLoader';

export default function Home() {
  const allPosts = getAllPostsMetadata();
  const initialPosts = allPosts.slice(0, 10);
  const totalPosts = allPosts.length;

  return (
    <ClientPageWrapper>
      <PostsProvider>
        <main className='w-full flex justify-center px-5 mt-8' itemScope>
          <div className='w-full max-w-[700px] flex gap-6 flex-col'>
            {/* 초기 데이터 로더 */}
            <InitialPostsLoader initialPosts={initialPosts} totalPosts={totalPosts} />

            {/* 무한 스크롤 포스트 목록 */}
            <InfiniteScrollContainer>
              <PostList />
            </InfiniteScrollContainer>
          </div>
        </main>
      </PostsProvider>
    </ClientPageWrapper>
  );
}
