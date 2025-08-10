import { NextRequest } from 'next/server';
import { getAllPosts } from '@/lib/posts';

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

    // 모든 포스트를 가져와서 페이지네이션
    const allPosts = getAllPosts();
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    // 메타데이터만 반환 (content는 제외하여 응답 크기 최적화)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const postsMetadata = paginatedPosts.map(({ content, ...rest }) => rest);

    return Response.json(
      {
        posts: postsMetadata,
        pagination: {
          currentPage: page,
          totalPosts: allPosts.length,
          hasMore: endIndex < allPosts.length,
          postsPerPage: limit,
          loadedCount: startIndex + postsMetadata.length,
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
