/**
 * คำอธิบาย:
 *   คอมโพเนนต์ RootLayout เป็น Layout หลักของแอปพลิเคชัน กำหนดโครงสร้างพื้นฐานของ HTML และรวม Provider หลักต่างๆ 
 *   เช่น การจัดการธีม, การแปลภาษา, WebSocket และการแจ้งเตือน
 *
 * Input:
 * - children: ReactNode (เนื้อหาภายใน Layout)
 * - params: { locale: string } (กำหนดภาษาของแอปพลิเคชัน)
 *
 * Output:
 * - โครงสร้างพื้นฐานของแอปพลิเคชัน รวมถึง:
 *   - `ThemeProvider` สำหรับจัดการโหมดธีม (แสง/มืด)
 *   - `NextIntlClientProvider` สำหรับรองรับการแปลภาษา
 *   - `SocketProvider` สำหรับเชื่อมต่อ WebSocket
 *   - `Toaster` สำหรับแสดงการแจ้งเตือน
 *   - การโหลดฟอนต์ทั้งแบบ Local (`GeistSans`, `GeistMono`) และจาก Google Fonts (`Roboto`, `Manrope`)
 *   - Metadata ของเว็บไซต์ เช่น `title` และ `description`
**/
import type { Metadata } from "next";
import { ThemeProvider } from '@/components/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from "next/font/local";
import "./globals.css";
import "./globalicons.css";
import { Roboto, Manrope } from 'next/font/google';
import { SocketProvider } from "@/components/socket-provider";
import { Toaster } from "@/components/ui/toaster"

export const dynamic = "force-dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const manRope = Manrope({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "DENSY",
  description: "ระบบตรวจตราความปลอดภัยภายในองค์กร",
};

export default async function RootLayout({
  children,
  params: { locale }

}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${manRope.className} antialiased bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            <SocketProvider>
              {children}
              <Toaster />
              </SocketProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}