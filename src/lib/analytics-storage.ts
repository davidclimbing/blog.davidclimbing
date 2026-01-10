import { supabase } from './supabase';

// 방문자 ID 생성 (IP + User-Agent 기반 해시)
export function generateVisitorId(ip: string, userAgent: string): string {
  const hash = Buffer.from(`${ip}-${userAgent.slice(0, 100)}`).toString(
    'base64'
  );
  return hash.slice(0, 16);
}

// 오늘 날짜 문자열 (YYYY-MM-DD)
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 봇 감지
export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /scrape/i,
    /facebook/i,
    /twitter/i,
    /linkedin/i,
    /whatsapp/i,
    /telegram/i,
    /slack/i,
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /baidu/i,
    /duckduck/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java\/|java /i,
    /libwww/i,
  ];

  // User-Agent 기반 봇 감지
  if (botPatterns.some((pattern) => pattern.test(userAgent))) {
    return true;
  }

  // 너무 짧거나 일반적이지 않은 User-Agent
  if (userAgent.length < 20 || !userAgent.includes('Mozilla')) {
    return true;
  }

  return false;
}

// 방문자 통계 가져오기
export async function getVisitorStats(): Promise<{
  dailyVisitors: number;
  totalVisitors: number;
}> {
  const today = getTodayString();

  // 오늘 방문자 수 (중복 제외)
  const { count: dailyVisitors } = await supabase
    .from('visitors')
    .select('visitor_id', { count: 'exact', head: true })
    .eq('date', today);

  // 전체 방문자 수 (중복 제외) - distinct 쿼리
  const { data: totalData } = await supabase
    .from('visitors')
    .select('visitor_id');

  // 중복 제거하여 고유 방문자 수 계산
  const uniqueVisitors = new Set(totalData?.map((v) => v.visitor_id) || []);
  const totalVisitors = uniqueVisitors.size;

  return {
    dailyVisitors: dailyVisitors || 0,
    totalVisitors,
  };
}

// 방문자 추가
export async function addVisitor(
  ip: string,
  userAgent: string
): Promise<{
  success: boolean;
  isNewDailyVisitor: boolean;
  isNewTotalVisitor: boolean;
}> {
  const today = getTodayString();
  const visitorId = generateVisitorId(ip, userAgent);

  // 오늘 이미 방문한 기록이 있는지 확인
  const { data: existingToday } = await supabase
    .from('visitors')
    .select('id')
    .eq('visitor_id', visitorId)
    .eq('date', today)
    .limit(1);

  const isNewDailyVisitor = !existingToday || existingToday.length === 0;

  // 전체 기간에서 처음 방문인지 확인
  const { data: existingTotal } = await supabase
    .from('visitors')
    .select('id')
    .eq('visitor_id', visitorId)
    .limit(1);

  const isNewTotalVisitor = !existingTotal || existingTotal.length === 0;

  // 새로운 일일 방문자인 경우에만 기록 추가
  if (isNewDailyVisitor) {
    const { error } = await supabase.from('visitors').insert({
      visitor_id: visitorId,
      date: today,
    });

    if (error) {
      console.error('Failed to add visitor:', error);
      return { success: false, isNewDailyVisitor: false, isNewTotalVisitor: false };
    }
  }

  return {
    success: true,
    isNewDailyVisitor,
    isNewTotalVisitor,
  };
}
