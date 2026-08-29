import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "집행나침반",
    template: "%s | 집행나침반",
  },
  description:
    "민사 승소 이후, 집행 실익의 근거와 다음 절차를 이해하도록 돕는 의사결정 지원 서비스",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">
          본문 바로가기
        </a>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
