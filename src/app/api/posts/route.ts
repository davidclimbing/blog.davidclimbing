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
    
    // 보안: 입력 검증 및 범위 제한
    const pageParam = searchParams.get('page') || '0';
    const limitParam = searchParams.get('limit') || '5';
    
    // 숫자 검증 및 범위 제한
    let page = parseInt(pageParam, 10);
    let limit = parseInt(limitParam, 10);
    
    // NaN, 음수, 또는 범위를 벗어난 값 처리
    if (isNaN(page) || page < 0) {
      page = 0;
    }
    
    if (isNaN(limit) || limit < 1) {
      limit = 5;
    } else if (limit > 50) {
      // DoS 방지: 최대 50개로 제한
      limit = 50;
    }

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
