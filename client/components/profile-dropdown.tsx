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
import { useTranslations } from "next-intl";
import { fetchData, logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { Profile, User } from "@/app/type";

export default function ProfileDropdown() {
  const t = useTranslations("General");
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<User>();
  const router = useRouter();

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
      const profilefetch = await fetchData("get", "/profile", true);
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
            className="text-input w-[226px] h-[50px] bg-card flex gap-[10px] justify-start items-center py-[10px] px-[20px]"
            onPointerDown={handleIconClick}
          >
            {profile ? (
              <Avatar>
                <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${profile.profile.image?.path}`}/>
                <AvatarFallback>
                  {getInitials(profile.profile.name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="h-12 w-12 rounded-full" />
            )}
            <div className="w-[97px] h-[27px] font-medium">
              {profile ? (
                profile.profile.name
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </div>
            <span
              className={`material-symbols-outlined inline-block transition-transform duration-300 ${
                isFlipped ? "rotate-180" : "rotate-0"
              }`}
            >
              stat_minus_1
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card p-0">
          <DropdownMenuLabel className="w-[226px] text-lg font-medium">
            {t("MyAccount")}
          </DropdownMenuLabel>
          <DropdownMenuItem className="w-[226px] h-[full]">
            <div className="flex gap-1 w-full items-center">
              <span className="material-symbols-outlined">account_circle</span>
              <div>{t("Profile")}</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="w-[226px] h-[full]"
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
