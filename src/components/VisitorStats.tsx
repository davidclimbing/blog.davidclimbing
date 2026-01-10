'use client';

import { useEffect, useState } from 'react';

interface VisitorStats {
  dailyVisitors: number;
  totalVisitors: number;
  loading: boolean;
  error: boolean;
}

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitorStats>({
    dailyVisitors: 0,
    totalVisitors: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Analytics fetch failed');
      }

      const data = await response.json();

      setStats({
        dailyVisitors: data.dailyVisitors || 0,
        totalVisitors: data.totalVisitors || 0,
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setStats((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  // 로딩 상태
  if (stats.loading) {
    return (
      <div className='visitor-stats border border-gray-700 rounded-xl p-5 mb-6 animate-pulse'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='w-4 h-4 bg-gray-600 rounded'></div>
          <div className='h-5 bg-gray-600 rounded w-24'></div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center p-4 bg-gray-800/50 rounded-lg'>
            <div className='h-8 bg-gray-600 rounded mb-2'></div>
            <div className='h-4 bg-gray-600 rounded w-20 mx-auto'></div>
          </div>
          <div className='text-center p-4 bg-gray-800/50 rounded-lg'>
            <div className='h-8 bg-gray-600 rounded mb-2'></div>
            <div className='h-4 bg-gray-600 rounded w-20 mx-auto'></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (stats.error) {
    return (
      <div className='visitor-stats border border-red-500/50 rounded-xl p-5 mb-6 bg-red-950/20'>
        <div className='flex items-center gap-2'>
          <span className='text-red-400'>⚠️</span>
          <span className='text-sm text-red-400'>
            통계를 불러오는 중 문제가 발생했습니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='visitor-stats border border-gray-700 rounded-xl p-5 mb-6 bg-gradient-to-r from-blue-950/20 to-purple-950/20'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-lg'>📊</span>
        <h3 className='text-lg font-bold text-white'>방문자 현황</h3>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700'>
          <div className='text-2xl font-bold text-blue-400 mb-1'>
            {stats.dailyVisitors.toLocaleString()}
          </div>
          <div className='text-xs text-gray-400'>오늘 방문자</div>
        </div>

        <div className='text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700'>
          <div className='text-2xl font-bold text-green-400 mb-1'>
            {stats.totalVisitors.toLocaleString()}
          </div>
          <div className='text-xs text-gray-400'>전체 방문자</div>
        </div>
      </div>
    </div>
  );
}
