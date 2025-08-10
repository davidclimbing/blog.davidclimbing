import { getAllPostsMetadata } from '@/lib/posts';
import ClientPageWrapper from '@/components/ClientPageWrapper';
import { PostsProvider } from '@/contexts/PostsContext';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import PostList from '@/components/PostList';
import InitialPostsLoader from '@/components/InitialPostsLoader';

export default function Home() {
  const allPosts = getAllPostsMetadata();
  const initialPosts = allPosts.slice(0, 10);

  return (
    <ClientPageWrapper>
      <PostsProvider>
        <main className='w-full flex justify-center px-5 mt-1' itemScope>
          <div className='w-full max-w-[700px] flex gap-5 flex-col'>
            {/* TODO: 방문자 통계 컴포넌트 고도화 */}
            {/* 방문자 통계 컴포넌트 */}
            {/* <VisitorStats /> */}

            {/* 초기 데이터 로더 */}
            <InitialPostsLoader initialPosts={initialPosts} />

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
