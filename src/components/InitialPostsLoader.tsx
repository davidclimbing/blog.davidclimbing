'use client';

import { useEffect } from 'react';
import { usePosts, type PostSummary } from '@/contexts/PostsContext';

interface InitialPostsLoaderProps {
  initialPosts: PostSummary[];
}

export default function InitialPostsLoader({
  initialPosts,
}: InitialPostsLoaderProps) {
  const { state, setInitialPosts } = usePosts();

  useEffect(() => {
    if (!state.initialLoaded && initialPosts.length > 0) {
      setInitialPosts(initialPosts);
    }
  }, [state.initialLoaded, initialPosts, setInitialPosts]);

  return null;
}
