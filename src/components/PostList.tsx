'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { usePosts, type PostSummary } from '@/contexts/PostsContext';

// 날짜 포맷터를 컴포넌트 외부에서 한 번만 생성
const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// 메모이제이션된 포스트 아이템 컴포넌트
const PostItem = React.memo(
  ({ post, index }: { post: PostSummary; index: number }) => {
    // 날짜 문자열 메모이제이션
    const formattedDate = useMemo(() => {
      const date = post.date instanceof Date ? post.date : new Date(post.date);
      return dateFormatter.format(date);
    }, [post.date]);

    const isoDateTime = useMemo(() => {
      return post.date instanceof Date
        ? post.date.toISOString()
        : new Date(post.date).toISOString();
    }, [post.date]);

    return (
      <li
        key={`${post.slug}-${index}`}
        className='border border-solid border-gray-200 p-5 rounded-xl
                 transform transition-transform duration-200 will-change-transform'
        role='listitem'
        style={{ containIntrinsicSize: '700px 120px' }}
      >
        <Link
          href={`/posts/${post.slug}`}
          className='block focus:outline-none group'
          aria-label={`${post.title} 포스트 읽기`}
        >
          <article className='flex flex-col gap-3'>
            <h2
              className='text-lg font-bold text-white group-hover:text-blue-600
                         transition-colors duration-200 line-clamp-2'
            >
              {post.title}
            </h2>
            <time className='text-sm text-gray-500' dateTime={isoDateTime}>
              {formattedDate}
            </time>
          </article>
        </Link>
      </li>
    );
  }
);

PostItem.displayName = 'PostItem';

export default function PostList() {
  const { state } = usePosts();

  const postItems = useMemo(() => {
    return state.posts.map((post, index) => (
      <PostItem key={`${post.slug}-${index}`} post={post} index={index} />
    ));
  }, [state.posts]);

  if (state.posts.length === 0 && state.loading && !state.initialLoaded) {
    return (
      <div
        className='flex items-center justify-center p-8'
        role='status'
        aria-label='포스트 로딩 중'
      >
        <div className='flex items-center gap-3'>
          <div
            className='animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600'
            aria-hidden='true'
          ></div>
          <span className='text-gray-600 font-medium'>
            포스트를 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  if (state.posts.length === 0 && !state.loading) {
    return (
      <div className='text-center p-8 text-gray-500'>
        <div className='text-lg mb-2'>📝</div>
        <p>아직 작성된 포스트가 없습니다.</p>
      </div>
    );
  }

  // 포스트 목록 렌더링
  return (
    <ul className='w-full flex gap-5 flex-col post-list-container' role='list'>
      {postItems}
    </ul>
  );
}
