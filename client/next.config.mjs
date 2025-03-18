/**
 * คำอธิบาย:
 *   ไฟล์นี้เป็นการตั้งค่าคอนฟิกของ Next.js สำหรับการใช้งาน `next-intl` เพื่อรองรับการแปลภาษาในแอปพลิเคชัน
 *   นอกจากนี้ยังทำการตั้งค่าการใช้งาน Webpack และการตั้งค่าภาพรวมบางประการในแอป เช่น การกำหนดโดเมนของภาพและการลบ `console` ใน production
 *
 * Input:
 *   - nextConfig: ค่าคอนฟิกหลักของแอปที่ใช้สำหรับการกำหนดค่าการทำงานของ Next.js เช่น Webpack, Images, และอื่นๆ
 * Output:
 *   - ค่าคอนฟิกที่ถูกส่งออกจาก `withNextIntl` ซึ่งใช้สำหรับรองรับการแปลภาษาในแอป
**/
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
  images: {
    domains: ["https://dekdee2.informatics.buu.ac.th/"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // ลบ console logs ใน production
  },
};

export default withNextIntl(nextConfig);
