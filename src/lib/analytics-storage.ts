import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface AnalyticsData {
  daily: { [date: string]: string[] }; // date -> visitorIds
  total: string[]; // 전체 방문자 ID
  visits: number; // 총 방문 횟수
  sessions: { [sessionId: string]: { timestamp: number; ip: string } }; // 현재 활성 세션
  lastCleanup: number; // 마지막 정리 시간
}

const DATA_FILE = join(process.cwd(), '.analytics-data.json');
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30분 세션 타임아웃

// 초기 데이터 구조
const initData = (): AnalyticsData => ({
  daily: {},
  total: [],
  visits: 0,
  sessions: {},
  lastCleanup: Date.now(),
});

// 데이터 로드
export function loadAnalyticsData(): AnalyticsData {
  try {
    if (!existsSync(DATA_FILE)) {
      const data = initData();
      saveAnalyticsData(data);
      return data;
    }

    const rawData = readFileSync(DATA_FILE, 'utf-8');
    const data: AnalyticsData = JSON.parse(rawData);

    // 데이터 구조 검증 및 마이그레이션
    if (!data.sessions) data.sessions = {};
    if (!data.lastCleanup) data.lastCleanup = Date.now();
    if (!Array.isArray(data.total)) data.total = [];
    if (typeof data.visits !== 'number') data.visits = 0;

    return data;
  } catch (error) {
    console.error('Analytics data load error:', error);
    return initData();
  }
}

// 데이터 저장
export function saveAnalyticsData(data: AnalyticsData): void {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Analytics data save error:', error);
  }
}

// 방문자 ID 생성 (IP + User-Agent 기반)
export function generateVisitorId(ip: string, userAgent: string): string {
  const hash = Buffer.from(`${ip}-${userAgent.slice(0, 100)}`).toString(
    'base64'
  );
  return hash.slice(0, 16);
}

// 세션 ID 생성
export function generateSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// 오늘 날짜 문자열
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 활성 세션 정리
export function cleanupSessions(data: AnalyticsData): void {
  const now = Date.now();
  const sessionIds = Object.keys(data.sessions);

  for (const sessionId of sessionIds) {
    const session = data.sessions[sessionId];
    if (now - session.timestamp > SESSION_TIMEOUT) {
      delete data.sessions[sessionId];
    }
  }

  data.lastCleanup = now;
}

// 오래된 일일 데이터 정리 (30일 보관)
export function cleanupDailyData(data: AnalyticsData): void {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

  const dates = Object.keys(data.daily);
  for (const date of dates) {
    if (date < cutoffDate) {
      delete data.daily[date];
    }
  }
}

// 봇 감지 (고도화된 버전)
export function isBot(userAgent: string, ip: string): boolean {
  // 일반적인 봇 패턴
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
    /yahoo/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /http/i,
    /request/i,
    /libwww/i,
  ];

  // User-Agent 기반 봇 감지
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }

  // 의심스러운 IP 패턴 (AWS, GCP, 데이터센터 등)
  const suspiciousIpPatterns = [
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./, // 사설 IP
    /^127\./,
    /^169\.254\./,
    /^::1/,
    /^fc/,
    /^fe80/, // 로컬/링크로컬
  ];

  if (suspiciousIpPatterns.some(pattern => pattern.test(ip))) {
    return true;
  }

  // 너무 짧거나 일반적이지 않은 User-Agent
  if (userAgent.length < 20 || !userAgent.includes('Mozilla')) {
    return true;
  }

  return false;
}

// 통계 데이터 가져오기
export function getVisitorStats(): {
  dailyVisitors: number;
  totalVisitors: number;
  totalVisits: number;
  activeUsers: number;
} {
  const data = loadAnalyticsData();
  const today = getTodayString();

  // 세션 정리
  cleanupSessions(data);

  const dailyVisitors = data.daily[today]?.length || 0;
  const totalVisitors = data.total.length;
  const activeUsers = Object.keys(data.sessions).length;

  return {
    dailyVisitors,
    totalVisitors,
    totalVisits: data.visits,
    activeUsers,
  };
}

// 방문자 추가
export function addVisitor(
  ip: string,
  userAgent: string
): {
  success: boolean;
  isNewDailyVisitor: boolean;
  isNewTotalVisitor: boolean;
  sessionId: string;
  stats: ReturnType<typeof getVisitorStats>;
} {
  const data = loadAnalyticsData();
  const today = getTodayString();
  const visitorId = generateVisitorId(ip, userAgent);
  const sessionId = generateSessionId();

  // 세션 정리
  cleanupSessions(data);
  cleanupDailyData(data);

  // 오늘 방문자 데이터 초기화
  if (!data.daily[today]) {
    data.daily[today] = [];
  }

  const isNewDailyVisitor = !data.daily[today].includes(visitorId);
  const isNewTotalVisitor = !data.total.includes(visitorId);

  // 새로운 일일 방문자 추가
  if (isNewDailyVisitor) {
    data.daily[today].push(visitorId);
  }

  // 새로운 전체 방문자 추가
  if (isNewTotalVisitor) {
    data.total.push(visitorId);
  }

  // 방문 횟수 증가
  data.visits++;

  // 활성 세션 추가
  data.sessions[sessionId] = {
    timestamp: Date.now(),
    ip: ip,
  };

  // 데이터 저장
  saveAnalyticsData(data);

  return {
    success: true,
    isNewDailyVisitor,
    isNewTotalVisitor,
    sessionId,
    stats: getVisitorStats(),
  };
}
