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

export default function Header() {
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

  const isActive = (path) => pathname.startsWith(path);

  return (
    <header className="bg-card h-[70px] flex justify-between items-center p-4 custom-shadow sticky top-0 z-50">
      <div className="flex gap-[50px]">
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

        <div className="flex justify-between items-center">
          <button
            className={`w-[103px] h-[70px] gap-2 text-[18px] flex items-center ${
              isActive(`/${locale}/patrol`) ? "border-b-4 border-red-500" : "text-gray-400"
            }`}
            onClick={() => router.push(`/${locale}/patrol`)}
          >
            <span className="material-symbols-outlined">list_alt_check</span>{" "}
            Patrol
          </button>
          <button
            className={`w-[103px] h-[70px] gap-2 text-[18px] flex items-center  ${
              isActive(`/${locale}/defect`) ? "border-b-4 border-red-500" : "text-gray-400"
            }`}
            // onClick={() => router.push(`/${locale}/defect`)}
          >
            <span className="material-symbols-outlined">build</span> Defect
          </button>
        </div>
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
