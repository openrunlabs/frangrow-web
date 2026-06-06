import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "프차그로우 FRANGROW — 프랜차이즈 본사 성장 파트너",
  description: "가맹점 확장, AI 검색 노출, 정책자금, 본부 시스템 구축까지. 프랜차이즈 본사의 실전 성장 구조를 함께 설계합니다.",
  openGraph: {
    title: "프차그로우 FRANGROW — 프랜차이즈 본사 성장 파트너",
    description: "가맹점 확장, AI 검색 노출, 정책자금, 본부 시스템 구축까지. 프랜차이즈 본사의 실전 성장 구조를 함께 설계합니다.",
    url: "https://www.frangrow.kr",
    siteName: "프차그로우 FRANGROW",
    images: [
      {
        url: "https://www.frangrow.kr/og-image.png",
        width: 1200,
        height: 630,
        alt: "프차그로우 FRANGROW",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "프차그로우 FRANGROW",
    description: "프랜차이즈 본사의 실전 성장 구조를 함께 설계합니다.",
    images: ["https://www.frangrow.kr/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body style={{ fontFamily: "Pretendard, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}