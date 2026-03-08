'use client';

import { Link } from 'next-view-transitions';
import React, { useMemo } from 'react';
import { usePosts, type PostSummary } from '@/contexts/PostsContext';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

// 메모이제이션된 포스트 아이템 컴포넌트
const PostItem = React.memo(
  ({ post, index }: { post: PostSummary; index: number }) => {
    const formattedDate = useMemo(() => {
      return dayjs(post.date).format('YYYY년 M월 D일');
    }, [post.date]);

    const isoDateTime = useMemo(() => {
      // Ensure date is string for dateTime attribute
      return typeof post.date === 'string' ? post.date : post.date.toISOString();
    }, [post.date]);

    return (
      <li
        className='post-item group'
        role='listitem'
        style={{
          containIntrinsicSize: '700px 100px',
          animationDelay: `${index * 40}ms`,
          animationFillMode: 'backwards'
        }}
      >
        <Link
          href={`/posts/${post.slug}`}
          className='block focus:outline-none'
          aria-label={`${post.title} 포스트 읽기`}
        >
          <article className='flex gap-8 items-baseline py-6 border-b border-[var(--color-border)]'>
            {/* Date column - fixed width for alignment */}
            <time
              className='text-sm font-medium text-[var(--color-text-tertiary)] tracking-tight flex-shrink-0 w-[140px]'
              dateTime={isoDateTime}
            >
              {formattedDate}
            </time>

            {/* Title and metadata */}
            <div className='flex-1 min-w-0 flex flex-col gap-3'>
              <div className='w-fit'>
                <h2
                  className='text-2xl font-bold leading-tight text-[var(--color-text-primary)]
                           transition-all duration-300 relative
                           group-hover:text-[var(--color-accent-primary)]'
                >
                  <span 
                    className="inline-block" 
                    style={{ viewTransitionName: `title-${post.slug}` }}
                  >
                    {post.title}
                  </span>
                  <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] transition-all duration-300 group-hover:w-full'></span>
                </h2>
              </div>

              <div className='flex items-center gap-3 flex-wrap'>
                {/* Tags */}
                {post.tag && post.tag.length > 0 && (
                  <div className='flex items-center gap-2 flex-wrap'>
                    {post.tag.map((tag, idx) => (
                      <span
                        key={idx}
                        className='px-2.5 py-1 text-xs font-medium rounded-md
                                 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]
                                 border border-[var(--color-border)]
                                 transition-colors duration-200
                                 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
    // slug가 고유하므로 slug만 key로 사용 (중복 제거 로직으로 보장됨)
    return state.posts.map((post, index) => (
      <PostItem key={post.slug} post={post} index={index} />
    ));
  }, [state.posts]);

  if (state.posts.length === 0 && state.loading && !state.initialLoaded) {
    return (
      <div
        className='flex items-center justify-center p-12'
        role='status'
        aria-label='포스트 로딩 중'
      >
        <div className='flex items-center gap-4'>
          <div
            className='animate-spin rounded-full h-10 w-10 border-2 border-[var(--color-border)] border-t-[var(--color-accent-primary)]'
            aria-hidden='true'
            style={{ borderWidth: '2px' }}
          ></div>
          <span className='text-[var(--color-text-secondary)] font-medium tracking-wide'>
            포스트를 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  if (state.posts.length === 0 && !state.loading) {
    return (
      <div className='text-center p-16 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-elevated)]'>
        <div className='text-4xl mb-4 opacity-30'>📝</div>
        <p className='text-[var(--color-text-secondary)] font-medium'>아직 작성된 포스트가 없습니다.</p>
      </div>
    );
  }

  // 포스트 목록 렌더링
  return (
    <ul className='w-full flex flex-col post-list-container' role='list'>
      {postItems}
    </ul>
  );
}
