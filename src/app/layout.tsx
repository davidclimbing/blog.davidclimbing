import type { Metadata } from "next";
import "./style.scss";

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
      <body>
        {children}
      </body>
    </html>
  );
}
