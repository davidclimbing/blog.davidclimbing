'use client';

import { useEffect } from 'react';
import { usePosts, type PostSummary } from '@/contexts/PostsContext';

interface InitialPostsLoaderProps {
  initialPosts: PostSummary[];
  totalPosts: number;
}

export default function InitialPostsLoader({
  initialPosts,
  totalPosts,
}: InitialPostsLoaderProps) {
  const { state, setInitialPosts } = usePosts();

  useEffect(() => {
    if (!state.initialLoaded && initialPosts.length > 0) {
      setInitialPosts(initialPosts, totalPosts);
    }
  }, [state.initialLoaded, initialPosts, totalPosts, setInitialPosts]);

  return null;
}
