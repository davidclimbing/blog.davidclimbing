'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePosts } from '@/contexts/PostsContext';

interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export default function InfiniteScrollContainer({
  children,
  threshold = 0.1,
  rootMargin = '100px',
}: InfiniteScrollContainerProps) {
  const { state, loadNextPage } = usePosts();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (
        entry.isIntersecting &&
        state.hasMore &&
        !state.loading &&
        state.initialLoaded
      ) {
        loadNextPage();
      }
    },
    [state.hasMore, state.loading, state.initialLoaded, loadNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return (
    <div className='w-full'>
      {children}

      {/* 로딩 센티널 */}
      <div
        ref={sentinelRef}
        className='h-20 flex items-center justify-center'
        aria-live='polite'
        aria-label='추가 컨텐츠 로딩 영역'
      >
        {state.loading && (
          <div className='flex items-center gap-3 text-gray-600'>
            <div
              className='animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600'
              aria-hidden='true'
            ></div>
            <span className='text-sm font-medium'>
              더 많은 포스트를 불러오는 중...
            </span>
          </div>
        )}

        {state.error && (
          <div className='text-center p-4'>
            <div className='text-red-500 text-sm mb-3'>⚠️ {state.error}</div>
            <div className='text-xs text-gray-400 mb-3'>
              재시도 횟수: {state.retryCount}/3
            </div>
            <button
              onClick={() => loadNextPage()}
              disabled={state.loading}
              className='px-4 py-2 bg-blue-500 text-white text-sm rounded-lg 
                         hover:bg-blue-600 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='포스트 로딩 재시도'
            >
              {state.loading ? '재시도 중...' : '다시 시도'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
