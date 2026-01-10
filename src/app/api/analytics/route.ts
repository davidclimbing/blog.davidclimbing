import { NextRequest, NextResponse } from 'next/server';
import { getVisitorStats, addVisitor, isBot } from '@/lib/analytics-storage';

// GET: 통계 조회
export async function GET() {
  try {
    const stats = await getVisitorStats();

    const response = NextResponse.json({
      ...stats,
      timestamp: new Date().toISOString(),
    });

    // 캐시 헤더 설정 (1분 캐시)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );

    return response;
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 방문 기록
export async function POST(request: NextRequest) {
  try {
    // IP 주소 획득
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    let ip = 'unknown';
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp;
    }

    // User-Agent 획득
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 봇 체크
    if (isBot(userAgent)) {
      return NextResponse.json({
        message: 'Bot detected, not tracked',
        type: 'bot_filtered',
      });
    }

    // 방문자 추가
    const result = await addVisitor(ip, userAgent);

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
