import type { Metadata } from 'next';
import './style.scss';
import { Analytics } from '@vercel/analytics/next';
import { Header } from '@/components/shared/Header';

export const metadata: Metadata = {
  title: 'Davidclimbing Blog',
  description: '오승재 테크 블로그',
  keywords: ['개발', '블로그', 'React', 'Next.js', 'JavaScript'],
  authors: [{ name: '오승재', url: 'https://github.com/davidclimbing' }],
  openGraph: {
    title: 'Davidclimbing Blog',
    description: '오승재 테크 블로그',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className='antialiased'>
        <Header />
        {children}
        <footer className='w-full flex justify-center px-4 py-16'>
          <a className='font-bold' href='https://github.com/davidclimbing'>
            ©Davidclimbing
          </a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
