import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { LanguageProvider } from "../components/LanguageContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MY SUHOGOD | 나만의 맞춤 수호천사",
  description: "사주, 수비학, 별자리로 분석하는 나만의 귀여운 수호천사와 위로의 메시지",
  openGraph: {
    title: "MY SUHOGOD | 나만의 맞춤 수호천사",
    description: "사주와 별자리로 나를 지켜줄 수호천사를 만나보세요.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={outfit.variable} suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
