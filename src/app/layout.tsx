import type { Metadata } from 'next';
import './style.scss';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

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
        <Footer />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
