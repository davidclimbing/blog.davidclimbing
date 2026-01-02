'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';

export interface PostSummary {
  slug: string;
  title: string;
  date: string | Date;
  tag?: string[];
}

interface PostsState {
  posts: PostSummary[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  postsPerPage: number;
  initialLoaded: boolean;
  totalPosts?: number; // 전체 포스트 수 추가
  retryCount: number; // 재시도 횟수 추가
  maxPostsInMemory: number; // 메모리 최적화
}

type PostsAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS';
      payload: { posts: PostSummary[]; hasMore: boolean; totalPosts?: number };
    }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SET_INITIAL'; payload: { posts: PostSummary[]; totalPosts: number } }
  | { type: 'RESET' };

const initialState: PostsState = {
  posts: [],
  currentPage: 0,
  hasMore: true,
  loading: false,
  error: null,
  postsPerPage: 5,
  initialLoaded: false,
  retryCount: 0,
  maxPostsInMemory: 50, // 메모리에 최대 50개 포스트만 유지
};

const PostsContext = createContext<{
  state: PostsState;
  loadNextPage: () => void;
  setInitialPosts: (posts: PostSummary[], totalPosts: number) => void;
  reset: () => void;
} | null>(null);

function postsReducer(state: PostsState, action: PostsAction): PostsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS': {
      // 중복 제거: slug를 기준으로 중복된 포스트 필터링
      const existingSlugs = new Set(state.posts.map(post => post.slug));
      const uniqueNewPosts = action.payload.posts.filter(
        post => !existingSlugs.has(post.slug)
      );

      // 중복이 발견된 경우 경고 로그
      if (action.payload.posts.length !== uniqueNewPosts.length) {
        console.warn(
          `중복된 포스트 감지: ${action.payload.posts.length - uniqueNewPosts.length}개 제거됨`
        );
      }

      const newPosts = [...state.posts, ...uniqueNewPosts];

      // 메모리 최적화: 최대 개수 초과 시 오래된 포스트 제거
      const optimizedPosts =
        newPosts.length > state.maxPostsInMemory
          ? newPosts.slice(-state.maxPostsInMemory) // 최근 N개만 유지
          : newPosts;

      return {
        ...state,
        loading: false,
        posts: optimizedPosts,
        currentPage: state.currentPage + 1,
        hasMore: action.payload.hasMore,
        totalPosts: action.payload.totalPosts ?? state.totalPosts,
        retryCount: 0,
        error: null,
      };
    }

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        retryCount: state.retryCount + 1,
      };

    case 'SET_INITIAL':
      // 초기 포스트 개수를 기반으로 올바른 currentPage 계산
      // 예: 초기 포스트가 10개이고 postsPerPage가 5라면, 다음은 page=2 (인덱스 10-14)
      const initialPageCount = Math.ceil(action.payload.posts.length / state.postsPerPage);
      const hasMorePosts = action.payload.posts.length < action.payload.totalPosts;
      
      return {
        ...state,
        posts: action.payload.posts,
        currentPage: initialPageCount, // 다음 요청 시 올바른 페이지부터 시작
        initialLoaded: true,
        hasMore: hasMorePosts, // 전체 포스트 개수와 비교하여 hasMore 계산
        totalPosts: action.payload.totalPosts,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  const loadNextPage = useCallback(
    async (forceRetry = false) => {
      if (state.loading || (!state.hasMore && !forceRetry)) return;

      // 최대 재시도 횟수 제한 (3회)
      if (!forceRetry && state.retryCount >= 3) {
        console.warn('최대 재시도 횟수에 도달했습니다.');
        return;
      }

      dispatch({ type: 'LOAD_START' });

      try {
        // 재시도 시 지수 백오프 적용
        if (state.retryCount > 0 && !forceRetry) {
          const delay = Math.min(1000 * Math.pow(2, state.retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // AbortController for request cancellation
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

        const response = await fetch(
          `/api/posts?page=${state.currentPage}&limit=${state.postsPerPage}`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
              'Accept-Encoding': 'gzip, deflate, br',
              'Cache-Control': 'max-age=300', // 5분 캐시
            },
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: 포스트 로딩에 실패했습니다`
          );
        }

        const data = await response.json();

        if (!data.posts || !Array.isArray(data.posts)) {
          throw new Error('잘못된 API 응답 형식입니다');
        }

        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            posts: data.posts,
            hasMore: data.pagination?.hasMore ?? false,
            totalPosts: data.pagination?.totalPosts,
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다';
        console.error('포스트 로딩 오류:', error);

        dispatch({
          type: 'LOAD_ERROR',
          payload: errorMessage,
        });

        // 자동 재시도 (네트워크 오류인 경우)
        if (state.retryCount < 2 && !forceRetry && error instanceof TypeError) {
          setTimeout(() => loadNextPage(false), 2000);
        }
      }
    },
    [
      state.currentPage,
      state.postsPerPage,
      state.loading,
      state.hasMore,
      state.retryCount,
    ]
  );

  const setInitialPosts = useCallback((posts: PostSummary[], totalPosts: number) => {
    dispatch({ type: 'SET_INITIAL', payload: { posts, totalPosts } });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <PostsContext.Provider
      value={{ state, loadNextPage, setInitialPosts, reset }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts는 PostsProvider 내부에서 사용되어야 합니다');
  }
  return context;
}
