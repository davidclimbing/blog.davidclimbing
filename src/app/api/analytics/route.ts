import { NextRequest, NextResponse } from 'next/server';
import { getVisitorStats, addVisitor, isBot } from '@/lib/analytics-storage';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const stats = getVisitorStats();

    const response = NextResponse.json({
      ...stats,
      timestamp: new Date().toISOString(),
    });

    // 캐시 헤더 설정 (1분 캐시)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=60');

    return response;
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vercel 환경에서 실제 IP 주소 정확히 획득
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');

    // Vercel에서는 x-forwarded-for가 여러 IP를 포함할 수 있음 (첫 번째가 실제 클라이언트 IP)
    let ip = 'unknown';
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    } else if (vercelForwardedFor) {
      ip = vercelForwardedFor.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp;
    }

    // IPv6을 IPv4로 변환 (필요한 경우)
    if (ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    // User-Agent 획득
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 봇 체크 (고도화된 버전)
    if (isBot(userAgent, ip)) {
      return NextResponse.json({
        message: 'Bot detected, not tracked',
        type: 'bot_filtered',
      });
    }

    // 방문자 추가 및 통계 업데이트
    const result = addVisitor(ip, userAgent);

    return NextResponse.json({
      ...result,
      ip: ip.slice(0, 8) + '***', // IP 일부 마스킹 (프라이버시)
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
