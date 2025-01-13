/**
 * คำอธิบาย:
 *   คอมโพเนนต์ ProfileDropdown ใช้สำหรับแสดงเมนูโปรไฟล์ของผู้ใช้งาน 
 *   โดยจะแสดงข้อมูลผู้ใช้เช่นรูปประจำตัวและชื่อผู้ใช้ พร้อมปุ่มเมนูย่อยเพื่อทำการจัดการโปรไฟล์หรือออกจากระบบ
 *
 * Input:
 *   - ไม่มี props ที่รับเข้ามาโดยตรง
 *   - ตัวคอมโพเนนต์จะทำการดึงข้อมูล profile ของผู้ใช้งานผ่านฟังก์ชัน fetchData
 *   - เมื่อข้อมูลพร้อมแล้วจะแสดงรูปประจำตัว (Avatar) และชื่อผู้ใช้งาน
 *
 * Output:
 *   - Dropdown ที่เมื่อกดที่โปรไฟล์ จะแสดงเมนูย่อย:
 *       - Profile: สำหรับไปยังหน้าจัดการโปรไฟล์ของผู้ใช้งาน
 *       - Logout: สำหรับออกจากระบบ
 *
**/

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLocale, useTranslations } from "next-intl";
import { fetchData, logout } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { IUser } from "@/app/type";

export default function ProfileDropdown() {
  const t = useTranslations("General");
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<IUser>();
  const router = useRouter();
  const locale = useLocale();


  const hadleLogout = async () => {
    await logout();
    router.refresh();
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.length === 1
      ? nameParts[0].charAt(0).toUpperCase()
      : nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleIconClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const getData = async () => {
    try {
      const profilefetch = await fetchData("get", "/user?profile=true&image=true", true);
      setProfile(profilefetch);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  useEffect(() => {
    getData();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsFlipped(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    setMounted(true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);




  if (!mounted) {
    return null;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            ref={buttonRef}
            variant="ghost"
            className="text-input w-56 h-[45px] bg-card flex gap-2 justify-between items-center py-2 px-2"
            onPointerDown={handleIconClick}
          >
            <div className="flex items-center gap-2">
              {profile ? (
                <Avatar>
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${profile.profile.image?.path}`} />
                  <AvatarFallback id={profile.id.toString()}>
                    {getInitials(profile.profile.name)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="h-12 w-12 rounded-full" />
              )}
              <div className="w-[97px] h-[27px] font-normal text-lg truncate">
                {profile ? (
                  profile.profile.name
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
            </div>
            <span
              className={`material-symbols-outlined inline-block transition-transform duration-300 ${isFlipped ? "rotate-180" : "rotate-0"
                }`}
            >
              stat_minus_1
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card p-1">
          <DropdownMenuLabel className="w-[226px] text-lg font-semibold">
            {t("MyAccount")}
          </DropdownMenuLabel>
          <DropdownMenuItem className="rounded-md" onClick={() => router.push(`/${locale}/profile`)}
          >
            <div className="flex gap-1 w-full items-center">
              <span className="material-symbols-outlined">account_circle</span>
              <div>{t("Profile")}</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-md"
            onClick={hadleLogout}
          >
            <div className="flex gap-1 w-full h-full items-center hover:text-destructive">
              <span className="material-symbols-outlined">logout</span>
              <div>{t("Logout")}</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
