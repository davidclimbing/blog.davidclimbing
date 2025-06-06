import type { Metadata } from "next";
import "./style.scss";
import Link from "next/link";
import {Analytics} from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Davidclimbing Blog",
  description: "오승재 테크 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="w-full sticky top-0 left-0 right-0 z-[200] px-5 py-4 flex justify-center backdrop-blur-md">
          <div className="max-w-[700px] w-full flex items-center">
            <Link className="mr-auto" href="/">
              <h1 className="text-xl font-bold">DavidClimbing</h1>
            </Link>
            <div className="flex flex-row items-center gap-2">
              <a className="text-base" href="https://playground.davidclimbing.com">
                Playground
              </a>
              <a className="text-base" href="https://github.com/davidclimbing">
                github
              </a>
            </div>
          </div>
        </header>
        {children}
        <footer className="w-full flex justify-center px-4 py-16">
          <a className="font-bold" href="https://github.com/davidclimbing">
            ©Davidclimbing
          </a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
