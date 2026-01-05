'use client';

import { useState, useEffect, useRef } from 'react';
import type { TocItem } from '@/schemas/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          setActiveId(intersecting.target.id);
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.pushState(null, '', `#${id}`);
  };

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
                block py-1.5 transition-all duration-200 border-l-2 pl-3
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
