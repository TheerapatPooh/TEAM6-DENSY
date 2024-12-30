/**
 * คำอธิบาย:
 *   คอมโพเนนต์ Header ใช้สำหรับแสดงส่วนหัวของหน้าเว็บ โดยสามารถปรับการแสดงผลของเมนูด้านบนได้ตามประเภทผู้ใช้งาน
 *   (variant) ที่ส่งเข้ามา เช่น ถ้าเป็น "inspector" จะแสดงเมนู Patrol และ Defect ถ้าไม่ใช่จะไม่แสดงเมนูดังกล่าว
 *
 * Input:
 *   - variant: HeaderVariant ('inspector' | 'supervisor' | 'admin')
 *     - 'inspector': แสดงปุ่ม Patrol และ Defect
 *     - 'supervisor' และ 'admin': ไม่แสดงปุ่มดังกล่าว
 *
 * Output:
 *   - JSX ของ Header ที่มีโลโก้, ปุ่มเปลี่ยนโหมดธีม (ModeToggle), ปุ่มเปลี่ยนภาษา (LanguageSelect),
 *     การแจ้งเตือน (Notification) และเมนูโปรไฟล์ (ProfileDropdown)
 *   - การนำทางจะเกิดขึ้นเมื่อกดปุ่มต่าง ๆ โดยใช้ Next.js router
**/

"use client";
import React, { useEffect, useState } from "react";
import lightLogo from "@/public/assets/img/system_logo_light.png";
import darkLogo from "@/public/assets/img/system_logo_dark.png";
import Image from "next/image";
import ProfileDropdown from "@/components/profile-dropdown";
import LanguageSelect from "@/components/language-select";
import ModeToggle from "@/components/mode-toggle";
import Notification from "@/components/notification";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

type HeaderVariant = 'inspector' | 'supervisor' | 'admin';
interface IHeader {
  variant: HeaderVariant;
}


export default function Header({ variant }: IHeader) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const isActive = (path: string): boolean => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className={`px-6 py-0 bg-card h-[70px] flex items-center sticky top-0 z-50 ${variant === 'admin' ? "justify-end" : "justify-between custom-shadow"}`}>
      <div className="flex gap-4">
        {variant !== 'admin' && (
          <div className="flex justify-between items-center">
            <Image
              className="flex items-center cursor-pointer"
              src={resolvedTheme === "dark" ? darkLogo : lightLogo}
              alt="Logo"
              width={130}
              height={112}
              priority
              onClick={() => router.push(`/${locale}`)}
            />
          </div>
        )}

        {variant === 'inspector' && (
          <div className="flex justify-between items-center ms-2 gap-4">
            <button
              className={`w-fit h-[70px] px-2 gap-2 text-lg flex items-center ${isActive(`/${locale}/patrol`) ? "border-b-4 border-destructive" : "text-input"
                }`}
              onClick={() => router.push(`/${locale}/patrol`)}
            >
              <span className="material-symbols-outlined">list_alt_check</span> Patrol
            </button>
            <button
              className={`w-fit h-[70px] px-2 gap-2 text-lg flex items-center ${isActive(`/${locale}/patrol-defect`) ? "border-b-4 border-destructive" : "text-input"
                }`}
              onClick={() => router.push(`/${locale}/patrol-defect`)}
            >
              <span className="material-symbols-outlined">build</span> Defect
            </button>
          </div>
        )}

        {variant === 'supervisor' && (
          <div className="flex justify-between items-center ms-2 gap-4">
            <button
              className={`w-fit h-[70px] px-2 gap-2 text-lg flex items-center ${isActive(`/${locale}/defect`) ? "border-b-4 border-destructive" : "text-input"
                }`}
              onClick={() => router.push(`/${locale}/defect`)}
            >
              <span className="material-symbols-outlined">gpp_maybe</span> Defect
            </button>
            <button
              className={`w-fit h-[70px] px-2 gap-2 text-lg flex items-center ${isActive(`/${locale}/comment`) ? "border-b-4 border-destructive" : "text-input"
                }`}
              onClick={() => router.push(`/${locale}/comment`)}
            >
              <span className="material-symbols-outlined">chat</span> Comment
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <LanguageSelect />
        <Notification />
        <ProfileDropdown />
      </div>
    </header>
  );
}
