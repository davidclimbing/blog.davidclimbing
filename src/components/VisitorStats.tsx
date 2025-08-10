'use client';

import { useEffect, useState } from 'react';

interface VisitorStats {
  dailyVisitors: number;
  totalVisitors: number;
  totalVisits: number;
  activeUsers: number;
  loading: boolean;
  error: boolean;
}

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitorStats>({
    dailyVisitors: 0,
    totalVisitors: 0,
    totalVisits: 0,
    activeUsers: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // 캐시된 데이터 확인 (5분 캐시)
      const cacheKey = 'visitor-stats';
      const cacheExpiry = 5 * 60 * 1000; // 5분
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > cacheExpiry;

        if (!isExpired) {
          setStats({
            dailyVisitors: data.dailyVisitors || 0,
            totalVisitors: data.totalVisitors || 0,
            totalVisits: data.totalVisits || 0,
            activeUsers: data.activeUsers || 0,
            loading: false,
            error: false,
          });
          return;
        }
      }

      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 브라우저 캐시도 활용 (1분)
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error('Analytics fetch failed');
      }

      const data = await response.json();

      // 로컬 스토리지에 캐시
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      setStats({
        dailyVisitors: data.dailyVisitors || 0,
        totalVisitors: data.totalVisitors || 0,
        totalVisits: data.totalVisits || 0,
        activeUsers: data.activeUsers || 0,
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setStats(prev => ({ ...prev, loading: false, error: true }));
    }
  };

  // 로딩 상태
  if (stats.loading) {
    return (
      <div className='visitor-stats border border-gray-200 rounded-xl p-5 mb-6 animate-pulse'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='w-4 h-4 bg-gray-600 rounded animate-pulse'></div>
          <div className='h-5 bg-gray-600 rounded w-24 animate-pulse'></div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center'>
            <div className='h-8 bg-gray-600 rounded mb-2 animate-pulse'></div>
            <div className='h-4 bg-gray-600 rounded w-20 mx-auto animate-pulse'></div>
          </div>
          <div className='text-center'>
            <div className='h-8 bg-gray-600 rounded mb-2 animate-pulse'></div>
            <div className='h-4 bg-gray-600 rounded w-20 mx-auto animate-pulse'></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (stats.error) {
    return (
      <div className='visitor-stats border border-red-500 rounded-xl p-5 mb-6 bg-red-950/20'>
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-red-400'>⚠️</span>
          <h3 className='text-lg font-bold text-red-300'>통계 로드 실패</h3>
        </div>
        <p className='text-sm text-red-400'>
          방문자 통계를 불러오는 중 문제가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='visitor-stats border border-gray-200 rounded-xl p-5 mb-6 bg-gradient-to-r from-blue-950/20 to-green-950/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-lg'>📊</span>
        <h3 className='text-lg font-bold text-white'>방문자 현황</h3>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        <div className='text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors duration-200'>
          <div className='text-xl font-bold text-blue-400 mb-1'>
            {stats.dailyVisitors.toLocaleString()}
          </div>
          <div className='text-xs text-gray-300'>오늘 방문자</div>
        </div>

        <div className='text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors duration-200'>
          <div className='text-xl font-bold text-green-400 mb-1'>
            {stats.totalVisitors.toLocaleString()}
          </div>
          <div className='text-xs text-gray-300'>전체 방문자</div>
        </div>

        <div className='text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors duration-200'>
          <div className='text-xl font-bold text-purple-400 mb-1'>
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className='text-xs text-gray-300'>현재 사용자</div>
        </div>

        <div className='text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors duration-200'>
          <div className='text-xl font-bold text-orange-400 mb-1'>
            {stats.totalVisits.toLocaleString()}
          </div>
          <div className='text-xs text-gray-300'>총 방문 횟수</div>
        </div>
      </div>

      <div className='mt-4 text-xs text-gray-400 text-center'>
        마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
      </div>
    </div>
  );
}
