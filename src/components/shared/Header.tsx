'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        w-full sticky top-0 left-0 right-0 z-[200] px-5 py-6 flex justify-center
        transition-all duration-500 ease-out
        ${scrolled ? 'backdrop-blur-xl' : 'backdrop-blur-none'}
      `}
    >
      <div className='max-w-[700px] w-full flex items-center relative'>
        <div
          className={`
            absolute -bottom-6 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent
            transition-opacity duration-500
            ${scrolled ? 'opacity-100' : 'opacity-0'}
          `}
        />
        <Link
          className='mr-auto group'
          href='/'
        >
          <h1 className='text-2xl font-black tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors duration-300'>
            DavidClimbing
          </h1>
        </Link>
        <nav className='flex flex-row items-center gap-6'>
          <a
            className='text-sm font-medium tracking-wide text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors duration-300 relative group'
            href='https://playground.davidclimbing.com'
          >
            Playground
            <span className='absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#ff6b35] to-[#f7931e] group-hover:w-full transition-all duration-300'></span>
          </a>
          <a
            className='text-sm font-medium tracking-wide text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors duration-300 relative group'
            href='https://github.com/davidclimbing'
          >
            GitHub
            <span className='absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#ff6b35] to-[#f7931e] group-hover:w-full transition-all duration-300'></span>
          </a>
        </nav>
      </div>
    </header>
  );
};
