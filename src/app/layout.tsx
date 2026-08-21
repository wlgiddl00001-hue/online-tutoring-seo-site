import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://online-tutoring-seo-site.vercel.app"),
  title: "호빈샘 온라인 과외 | 초등·중등·고등 실시간 1대1 수업",
  description:
    "초등 기초부터 중등 내신, 고등 심화와 입시까지 학생 수준에 맞춰 진행하는 실시간 1대1 온라인 과외입니다.",
  applicationName: "호빈샘 온라인 과외",
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
