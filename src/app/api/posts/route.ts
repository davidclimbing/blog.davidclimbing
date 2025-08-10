import { NextRequest } from 'next/server';
import { getAllPostsMetadata } from '@/lib/posts';

export async function GET(request: NextRequest) {
  try {
    // 캐시 헤더 추가
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // 5분 캐시
      'X-Content-Type-Options': 'nosniff',
    });
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '5');

    // 메타데이터만 가져와서 페이지네이션 (content 제외로 훨씬 빠름)
    const allPosts = getAllPostsMetadata();
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return Response.json(
      {
        posts: paginatedPosts,
        pagination: {
          currentPage: page,
          totalPosts: allPosts.length,
          hasMore: endIndex < allPosts.length,
          postsPerPage: limit,
          loadedCount: startIndex + paginatedPosts.length,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error('Posts API 오류:', error);
    return Response.json(
      { error: '포스트 로딩 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
