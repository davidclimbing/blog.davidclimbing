'use client';

import { useEffect, useRef } from 'react';

export function useVisitorTracking() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // 한 번만 실행되도록 체크
    if (hasTracked.current) return;

    const trackVisitor = async () => {
      try {
        // 로컬 스토리지에서 오늘 이미 추적했는지 확인
        const today = new Date().toISOString().split('T')[0];
        const lastTracked = localStorage.getItem('visitor-tracked');

        // 오늘 이미 추적했다면 건너뛰기
        if (lastTracked === today) {
          return;
        }

        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // 추적 성공시 로컬 스토리지에 오늘 날짜 저장
          localStorage.setItem('visitor-tracked', today);
          hasTracked.current = true;
        }
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    // 페이지 로드 후 1초 뒤에 추적 (UX 최적화)
    const timer = setTimeout(trackVisitor, 1000);

    return () => clearTimeout(timer);
  }, []);
}
