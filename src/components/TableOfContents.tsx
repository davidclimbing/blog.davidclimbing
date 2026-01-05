'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TocItem } from '@/schemas/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const headingElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    headingElementsRef.current = items
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElementsRef.current.length === 0) return;

    // 초기 활성 헤딩 설정
    setActiveId(items[0]?.id || '');

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const headerOffset = 100; // sticky 헤더 높이 고려

      // 현재 스크롤 위치보다 위에 있는 헤딩 중 가장 아래에 있는 것을 찾음
      let currentHeading = headingElementsRef.current[0];

      for (const heading of headingElementsRef.current) {
        const headingTop = heading.getBoundingClientRect().top + scrollTop;
        if (headingTop <= scrollTop + headerOffset) {
          currentHeading = heading;
        } else {
          break;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    // 초기 실행
    handleScroll();

    // 스크롤 이벤트에 throttle 적용
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      className="hidden xl:block fixed top-25 w-56"
      style={{ left: 'calc(50% + 380px)' }}
      aria-label="Table of Contents"
    >
      <h2 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide">
        목차
      </h2>
      <ul className="space-y-1 text-sm max-h-[calc(100vh-200px)] overflow-y-auto">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`
                block py-1.5 transition-all duration-200 border-l-2
                ${item.level === 2 ? 'pl-3' : 'pl-6'}
                ${activeId === item.id
                  ? 'text-[#f97583] border-[#f97583] font-medium'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
                }
              `}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
